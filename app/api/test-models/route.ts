import { NextResponse } from "next/server"
import { testAllModels, analyzeResults } from "@/lib/openai-tester"

export const maxDuration = 60 // Allow up to 60 seconds for testing all models

export async function GET(req: Request) {
  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    // Get custom prompt from query params if provided
    const url = new URL(req.url)
    const prompt = url.searchParams.get("prompt") || "Say hello in exactly 5 words."

    // Run tests on all models
    const results = await testAllModels(prompt)
    const analysis = analyzeResults(results)

    return NextResponse.json({
      results,
      summary: {
        total: results.length,
        working: analysis.working.length,
        failed: analysis.failed.length,
        apiKeyValid: analysis.apiKeyValid,
      },
      apiKeyValid: analysis.apiKeyValid,
    })
  } catch (error: any) {
    console.error("Model testing error:", error)
    return NextResponse.json({ error: error.message || "Failed to test models" }, { status: 500 })
  }
}

