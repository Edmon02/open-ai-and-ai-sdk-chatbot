"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function DebugPanel() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testApiKey = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/test-openai")
      const data = await response.json()
      setResult(data)
      if (!response.ok) {
        setError(`Error: ${data.error || response.statusText}`)
      }
    } catch (err: any) {
      setError(`Request failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-0 right-0 p-4 bg-white border rounded-tl shadow-lg max-w-md">
      <h3 className="font-bold mb-2">Debug Panel</h3>
      <Button onClick={testApiKey} disabled={loading} variant="outline" size="sm">
        {loading ? "Testing..." : "Test OpenAI API Key"}
      </Button>

      {error && <div className="mt-2 p-2 bg-red-100 text-red-800 rounded text-xs">{error}</div>}

      {result && (
        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}

