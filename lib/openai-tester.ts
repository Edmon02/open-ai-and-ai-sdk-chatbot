import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// Define available models to test
export const OPENAI_MODELS = [
  // GPT-4 family
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4-turbo",
  "gpt-4",
  // GPT-3.5 family
  "gpt-3.5-turbo",
  // Add other models as needed
]

export type TestResult = {
  model: string
  success: boolean
  response?: string
  error?: string
  latency?: number
}

export async function testOpenAIModel(model: string, prompt = "Say hello in exactly 5 words."): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const { text } = await generateText({
      model: openai(model),
      prompt,
      maxTokens: 50, // Limit response size
    })

    const latency = Date.now() - startTime

    return {
      model,
      success: true,
      response: text.trim(),
      latency,
    }
  } catch (error: any) {
    return {
      model,
      success: false,
      error: error.message || "Unknown error",
    }
  }
}

export async function testAllModels(prompt = "Say hello in exactly 5 words."): Promise<TestResult[]> {
  const results: TestResult[] = []

  // Test models sequentially to avoid rate limits
  for (const model of OPENAI_MODELS) {
    try {
      console.log(`Testing model: ${model}...`)
      const result = await testOpenAIModel(model, prompt)
      results.push(result)

      // Add a small delay between requests to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error: any) {
      results.push({
        model,
        success: false,
        error: error.message || "Unknown error during test execution",
      })
    }
  }

  return results
}

export function analyzeResults(results: TestResult[]): {
  working: TestResult[]
  failed: TestResult[]
  apiKeyValid: boolean
} {
  const working = results.filter((r) => r.success)
  const failed = results.filter((r) => !r.success)

  // If all models failed with authentication errors, the API key is likely invalid
  const apiKeyValid = !(
    failed.length === results.length &&
    failed.every((r) => r.error?.includes("authentication") || r.error?.includes("API key") || r.error?.includes("401"))
  )

  return {
    working,
    failed,
    apiKeyValid,
  }
}

