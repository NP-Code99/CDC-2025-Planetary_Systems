"use client"

import { useState, useEffect } from "react"

export default function WorkingPage() {
  const [planets, setPlanets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        console.log('Fetching planets...')
        const response = await fetch('http://localhost:8000/exoplanets/random?limit=10')
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Received data:', data)
        
        setPlanets(data)
        setLoading(false)
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setLoading(false)
      }
    }

    fetchPlanets()
  }, [])

  if (loading) return <div className="p-8">Loading planets...</div>
  if (error) return <div className="p-8">Error: {error}</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Working Test - {planets.length} planets loaded</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {planets.map((planet, index) => (
          <div key={index} className="border p-4 rounded">
            <h3 className="font-bold">{planet.pl_name}</h3>
            <p>Host: {planet.hostname}</p>
            <p>Gravity: {planet.g_fraction?.toFixed(2)}x Earth</p>
            <p>Intensity: {planet.intensity_index}/10</p>
          </div>
        ))}
      </div>
    </div>
  )
}
