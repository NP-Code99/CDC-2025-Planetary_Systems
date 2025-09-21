"use client"

import { useState, useEffect } from "react"

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const debug = {
      apiBase: process.env.NEXT_PUBLIC_API_BASE,
      nodeEnv: process.env.NODE_ENV,
      windowLocation: typeof window !== 'undefined' ? window.location.href : 'SSR',
    }
    
    console.log('Debug info:', debug)
    setDebugInfo(debug)
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}
