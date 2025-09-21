"use client"

export default function BasicPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Basic Test</h1>
      <p>This page should work without any useEffect.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  )
}
