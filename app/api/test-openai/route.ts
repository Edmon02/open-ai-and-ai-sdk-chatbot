import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function GET() {
  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key is missing" }, { status: 500 })
    }

    // Test a simple completion
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: "Hello, world!",
    })

    return NextResponse.json({ success: true, text })
  } catch (error: any) {
    console.error("OpenAI API test error:", error)

    return NextResponse.json(
      {
        error: "OpenAI API test failed",
        message: error.message,
        status: error.status || "unknown",
      },
      { status: 500 },
    )
  }
}

