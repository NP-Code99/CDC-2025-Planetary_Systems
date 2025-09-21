"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"

export default function TestPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API...')
        setLoading(true)
        
        // Test health endpoint
        const health = await api.health()
        console.log('Health:', health)
        
        // Test exoplanets endpoint
        const planets = await api.getRandomExoplanets(5)
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

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

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
