"""
Planetary gravity calculations based on the Planetary Systems.ipynb logic.
Extracts the core calculations for g_fraction and intensity_index.
"""

def calculate_g_fraction(pl_bmasse: float, pl_rade: float) -> float:
    """
    Calculate gravity fraction: g_fraction = pl_bmasse / (pl_rade**2)
    in Earth units, clamped to [0,1].
    
    Args:
        pl_bmasse: Planet mass in Earth masses
        pl_rade: Planet radius in Earth radii
        
    Returns:
        Gravity fraction clamped to [0,1]
    """
    if pl_rade <= 0:
        raise ValueError("Planet radius must be positive")
    
    g_fraction = pl_bmasse / (pl_rade ** 2)
    return max(0.0, min(1.0, g_fraction))

def calculate_intensity_index(g_fraction: float, alpha: float = 1.0, mapping: str = "linear") -> int:
    """
    Calculate intensity index using the formula from the notebook.
    
    Args:
        g_fraction: Gravity fraction (0-1)
        alpha: Alpha parameter for non-linear mapping (default 1.0)
        mapping: "linear" or "nonlinear"
        
    Returns:
        Intensity index (1-10)
    """
    if mapping == "linear":
        # Linear mapping: I = round(1 + 9 * (1 - g_fraction))
        intensity_index = round(1 + 9 * (1 - g_fraction))
    else:
        # Non-linear mapping: I = round(1 + 9 * (1 - g_fraction^alpha))
        intensity_index = round(1 + 9 * (1 - (g_fraction ** alpha)))
    
    # Clamp to [1, 10]
    return max(1, min(10, intensity_index))
