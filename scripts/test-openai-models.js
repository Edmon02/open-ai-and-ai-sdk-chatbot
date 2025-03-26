import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import dotenv from "dotenv"
import chalk from "chalk"

// Load environment variables from .env file
dotenv.config()

// Define available models to test
const OPENAI_MODELS = [
  // GPT-4 family
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4-turbo",
  "gpt-4",
  // GPT-3.5 family
  "gpt-3.5-turbo",
  // Add other models as needed
]

async function testModel(model, prompt = "Say hello in exactly 5 words.") {
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
  } catch (error) {
    return {
      model,
      success: false,
      error: error.message || "Unknown error",
    }
  }
}

async function main() {
  console.log(chalk.blue.bold("OpenAI Model Tester"))
  console.log(chalk.blue("Testing all available models with your API key\n"))

  // Check if API key is set
  if (!process.env.OPENAI_API_KEY) {
    console.log(chalk.red("❌ Error: OPENAI_API_KEY environment variable is not set"))
    process.exit(1)
  }

  console.log(
    chalk.gray(
      `API Key detected: ${process.env.OPENAI_API_KEY.substring(0, 3)}...${process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 4)}\n`,
    ),
  )

  const results = []
  let successCount = 0
  let failCount = 0

  // Test each model
  for (const model of OPENAI_MODELS) {
    process.stdout.write(chalk.yellow(`Testing ${model}... `))

    try {
      const result = await testModel(model)
      results.push(result)

      if (result.success) {
        successCount++
        console.log(chalk.green(`✓ Success (${result.latency}ms)`))
        console.log(chalk.gray(`  Response: "${result.response}"\n`))
      } else {
        failCount++
        console.log(chalk.red(`✗ Failed`))
        console.log(chalk.gray(`  Error: ${result.error}\n`))
      }

      // Add a small delay between requests to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 500))
    } catch (error) {
      failCount++
      console.log(chalk.red(`✗ Error: ${error.message}`))
    }
  }

  // Print summary
  console.log(chalk.blue.bold("\nTest Summary:"))
  console.log(chalk.blue(`Total models tested: ${OPENAI_MODELS.length}`))
  console.log(chalk.green(`Working models: ${successCount}`))
  console.log(chalk.red(`Failed models: ${failCount}`))

  // Check if API key is valid
  const apiKeyValid = !(
    failCount === OPENAI_MODELS.length &&
    results.every(
      (r) =>
        !r.success && (r.error?.includes("authentication") || r.error?.includes("API key") || r.error?.includes("401")),
    )
  )

  if (!apiKeyValid) {
    console.log(chalk.yellow.bold("\n⚠️ Warning: Your API key appears to be invalid or has insufficient permissions."))
  } else if (successCount === 0) {
    console.log(chalk.yellow.bold("\n⚠️ Warning: None of the models worked. You might have subscription limitations."))
  } else {
    console.log(chalk.green.bold("\n✅ Your API key is working with some models."))
  }

  // List working models
  if (successCount > 0) {
    console.log(chalk.blue.bold("\nWorking Models:"))
    results
      .filter((r) => r.success)
      .forEach((r) => {
        console.log(chalk.green(`- ${r.model} (${r.latency}ms)`))
      })
  }
}

main().catch((error) => {
  console.error(chalk.red(`Error running tests: ${error.message}`))
  process.exit(1)
})

