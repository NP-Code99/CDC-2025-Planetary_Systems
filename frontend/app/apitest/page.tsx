"use client"

import { useState, useEffect } from "react"

export default function ApiTestPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API...')
        setLoading(true)
        
        // Test health endpoint
        const healthResponse = await fetch('http://localhost:8000/health')
        const health = await healthResponse.json()
        console.log('Health:', health)
        
        // Test exoplanets endpoint
        const planetsResponse = await fetch('http://localhost:8000/exoplanets/random?limit=5')
        const planets = await planetsResponse.json()
        console.log('Planets:', planets)
        
        setData({ health, planets })
      } catch (err) {
        console.error('API Error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    testApi()
  }, [])

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8">Error: {error}</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Health:</h2>
          <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(data?.health, null, 2)}</pre>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Planets ({data?.planets?.length || 0}):</h2>
          <pre className="bg-gray-100 p-2 rounded max-h-96 overflow-auto">
            {JSON.stringify(data?.planets, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
