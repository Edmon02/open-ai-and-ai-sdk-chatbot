import { ModelTester } from "@/components/model-tester"

export const metadata = {
  title: "OpenAI Model Tester",
  description: "Test your OpenAI API key across all available models",
}

export default function TestModelsPage() {
  return <ModelTester />
}

