import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function generateWithRetry(prompt: string, maxRetries = 3) {
  let retries = 0

  while (retries < maxRetries) {
    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt,
      })
      return { text }
    } catch (error: any) {
      if (error.status === 429 && retries < maxRetries - 1) {
        // Rate limited, wait and retry
        const delay = Math.pow(2, retries) * 1000
        await new Promise((resolve) => setTimeout(resolve, delay))
        retries++
      } else {
        throw error
      }
    }
  }
}

