"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import type { TestResult } from "@/lib/openai-tester"

export function ModelTester() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [summary, setSummary] = useState<{
    total: number
    working: number
    failed: number
    apiKeyValid: boolean
  } | null>(null)
  const [prompt, setPrompt] = useState("Say hello in exactly 5 words.")
  const [error, setError] = useState<string | null>(null)

  const runTests = async () => {
    setLoading(true)
    setError(null)
    setResults(null)
    setSummary(null)

    try {
      const response = await fetch(`/api/test-models?prompt=${encodeURIComponent(prompt)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to run tests")
      }

      setResults(data.results)
      setSummary(data.summary)
    } catch (err: any) {
      setError(err.message || "An error occurred while testing models")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>OpenAI Model Tester</CardTitle>
          <CardDescription>Test your OpenAI API key across all available models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium">
                Test Prompt
              </label>
              <div className="flex gap-2">
                <Input
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter a test prompt"
                  disabled={loading}
                />
                <Button onClick={runTests} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    "Run Tests"
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>
            )}

            {summary && (
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Summary</h3>
                <div className="flex gap-3">
                  <Badge variant="outline" className="bg-gray-100">
                    Total: {summary.total}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Working: {summary.working}
                  </Badge>
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    Failed: {summary.failed}
                  </Badge>
                </div>

                {!summary.apiKeyValid && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    Your API key appears to be invalid or has insufficient permissions.
                  </div>
                )}
              </div>
            )}

            {results && results.length > 0 && (
              <div className="space-y-3 mt-4">
                <h3 className="font-medium">Model Results</h3>
                {results.map((result) => (
                  <div
                    key={result.model}
                    className={`p-3 rounded-md border ${
                      result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-medium">{result.model}</span>
                      </div>
                      {result.latency && (
                        <Badge variant="outline" className="text-xs">
                          {result.latency}ms
                        </Badge>
                      )}
                    </div>
                    {result.success ? (
                      <div className="mt-2 text-sm bg-white p-2 rounded border border-green-100">{result.response}</div>
                    ) : (
                      <div className="mt-2 text-sm text-red-600">Error: {result.error}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-gray-500">
          Note: Some models may not be available with your current API key or subscription.
        </CardFooter>
      </Card>
    </div>
  )
}

