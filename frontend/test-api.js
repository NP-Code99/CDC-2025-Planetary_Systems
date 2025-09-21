// Test script to check API calls
const API_BASE = 'http://localhost:8000'

async function testAPI() {
  try {
    console.log('Testing API calls...')
    
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE}/health`)
    console.log('Health check:', healthResponse.status, await healthResponse.json())
    
    // Test planets endpoint
    const planetsResponse = await fetch(`${API_BASE}/exoplanets/random?limit=5`)
    console.log('Planets response:', planetsResponse.status)
    const planetsData = await planetsResponse.json()
    console.log('Planets data:', planetsData.length, 'planets')
    
    // Test stats endpoint
    const statsResponse = await fetch(`${API_BASE}/exoplanets/stats`)
    console.log('Stats response:', statsResponse.status)
    const statsData = await statsResponse.json()
    console.log('Stats data:', statsData)
    
  } catch (error) {
    console.error('API test failed:', error)
  }
}

testAPI()
