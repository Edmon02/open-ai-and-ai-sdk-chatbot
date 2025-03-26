import { type CoreMessage, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const {
      messages,
      model = "gpt-4o-mini",
    }: {
      messages: CoreMessage[]
      model?: string
    } = await req.json()

    // Validate that we have an API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    const result = streamText({
      model: openai(model),
      system: "You are a helpful assistant that provides clear, concise answers.",
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error: any) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to process chat request" },
      { status: error.status || 500 },
    )
  }
}

