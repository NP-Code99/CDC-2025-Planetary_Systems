"""
Data loader service for CDC_CH2.csv exoplanet data.
Loads and processes the NASA exoplanet dataset.
"""

import pandas as pd
import numpy as np
import os
from typing import List, Dict, Optional
from pathlib import Path

class ExoplanetDataLoader:
    def __init__(self, csv_path: str = None):
        if csv_path is None:
            # Look for the CSV file in common locations
            possible_paths = [
                "/Users/nandanpullakandam/Downloads/CDC_CH2.csv",
                "CDC_CH2.csv",
                "../CDC_CH2.csv",
                "../../CDC_CH2.csv"
            ]
            
            for path in possible_paths:
                if os.path.exists(path):
                    csv_path = path
                    break
            
            if csv_path is None:
                raise FileNotFoundError("CDC_CH2.csv not found in expected locations")
        
        self.csv_path = csv_path
        self.df = None
        self.load_data()
    
    def load_data(self):
        """Load and clean the exoplanet data."""
        try:
            self.df = pd.read_csv(self.csv_path)
            
            # Clean the data - remove rows with missing essential data
            self.df = self.df.dropna(subset=['pl_rade', 'pl_bmasse', 'g_fraction', 'intensity_index'])
            
            # Remove rows with zero or invalid values
            self.df = self.df[
                (self.df['pl_rade'] > 0) & 
                (self.df['pl_bmasse'] > 0) &
                (self.df['g_fraction'] > 0) &
                (self.df['intensity_index'] >= 1) &
                (self.df['intensity_index'] <= 10)
            ]
            
            # Replace NaN values with None for JSON serialization
            self.df = self.df.replace({np.nan: None})
            
            # Also handle any remaining NaN values in specific columns
            for col in self.df.columns:
                if self.df[col].dtype == 'float64':
                    self.df[col] = self.df[col].fillna(None)
            
            # Reset index after filtering
            self.df = self.df.reset_index(drop=True)
            
            print(f"Loaded {len(self.df)} exoplanets from {self.csv_path}")
            
        except Exception as e:
            raise Exception(f"Failed to load exoplanet data: {str(e)}")
    
    def get_exoplanet_by_name(self, name: str) -> Optional[Dict]:
        """Get exoplanet data by name."""
        planet_data = self.df[self.df['pl_name'].str.contains(name, case=False, na=False)]
        
        if planet_data.empty:
            return None
        
        # Return the first match (or the one with default_flag=1 if available)
        if (planet_data['default_flag'] == 1).any():
            planet_data = planet_data[planet_data['default_flag'] == 1]
        
        result = planet_data.iloc[0].to_dict()
        # Convert NaN values to None for JSON serialization
        for key, value in result.items():
            if pd.isna(value) or (isinstance(value, float) and np.isnan(value)):
                result[key] = None
        return result
    
    def search_exoplanets(self, query: str, limit: int = 20) -> List[Dict]:
        """Search exoplanets by name or host star."""
        if not query.strip():
            # Return random sample if no query
            results = self.df.sample(n=min(limit, len(self.df)))
        else:
            search_term = query.lower()
            results = self.df[
                (self.df['pl_name'].str.contains(search_term, case=False, na=False)) |
                (self.df['hostname'].str.contains(search_term, case=False, na=False))
            ]
            
            # Prioritize default entries
            default_results = results[results['default_flag'] == 1]
            other_results = results[results['default_flag'] != 1]
            
            # Combine and limit results
            results = pd.concat([default_results, other_results]).head(limit)
        
        # Convert to dict and handle NaN values
        records = results.to_dict('records')
        for record in records:
            for key, value in record.items():
                if pd.isna(value) or (isinstance(value, float) and np.isnan(value)):
                    record[key] = None
        return records
    
    def get_all_exoplanets(self, limit: int = 200) -> List[Dict]:
        """Get all exoplanets with optional limit."""
        results = self.df.head(limit)
        records = results.to_dict('records')
        for record in records:
            for key, value in record.items():
                if pd.isna(value) or (isinstance(value, float) and np.isnan(value)):
                    record[key] = None
        return records
    
    def get_exoplanet_stats(self) -> Dict:
        """Get statistics about the loaded dataset."""
        return {
            "total_planets": len(self.df),
            "g_fraction_range": {
                "min": float(self.df['g_fraction'].min()),
                "max": float(self.df['g_fraction'].max()),
                "mean": float(self.df['g_fraction'].mean())
            },
            "intensity_index_distribution": self.df['intensity_index'].value_counts().to_dict(),
            "mass_range": {
                "min": float(self.df['pl_bmasse'].min()),
                "max": float(self.df['pl_bmasse'].max()),
                "mean": float(self.df['pl_bmasse'].mean())
            },
            "radius_range": {
                "min": float(self.df['pl_rade'].min()),
                "max": float(self.df['pl_rade'].max()),
                "mean": float(self.df['pl_rade'].mean())
            }
        }

# Global data loader instance
data_loader = None

def get_data_loader() -> ExoplanetDataLoader:
    """Get the global data loader instance."""
    global data_loader
    if data_loader is None:
        data_loader = ExoplanetDataLoader()
    return data_loader
