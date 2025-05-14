# OpenAI and AI SDK Chatbot

A modern, responsive AI chatbot built with Next.js, the Vercel AI SDK, and OpenAI's powerful language models. This application provides a clean, intuitive interface for conversing with AI models and includes a comprehensive testing mechanism to evaluate OpenAI API models.

<!-- ![OpenAI and AI SDK Chatbot Screenshot](/placeholder.svg?height=400&width=800) -->

## Project Description

This project is a full-featured AI chatbot that leverages the Vercel AI SDK to interact with OpenAI's language models. It provides a seamless chat experience with features like real-time streaming responses, chat history persistence, and model selection. The application also includes a robust testing mechanism to evaluate the OpenAI API across all available models.

## Features

- **Streaming AI Responses**: Real-time streaming of AI responses for a natural conversation flow
- **Multiple Model Support**: Switch between different OpenAI models (GPT-4o, GPT-3.5-turbo, etc.)
- **Chat History Persistence**: Local storage of chat history for continuous conversations
- **Responsive Design**: Mobile-friendly interface that works across devices
- **Loading States**: Visual feedback during AI response generation
- **Error Handling**: Comprehensive error handling for API issues
- **Model Testing Tool**: Built-in tool to test all OpenAI models with your API key
- **Command Line Testing**: Node.js script for testing models via the command line

## Technologies Used

- **Next.js 14+**: React framework with App Router
- **Vercel AI SDK**: For integrating with AI models
- **OpenAI API**: For accessing GPT models
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling
- **shadcn/ui**: For UI components
- **Lucide React**: For icons
- **LocalStorage API**: For chat persistence

## Installation

### Prerequisites

- Node.js 18.0.0 or later
- npm, yarn, or pnpm
- OpenAI API key

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Edmon02/openai-ai-sdk-chatbot.git
cd openai-ai-sdk-chatbot
```

2. Install dependencies:


```shellscript
npm install
# or
yarn
# or
pnpm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:


```plaintext
OPENAI_API_KEY=your_api_key_here
```

You can obtain an OpenAI API key by signing up at [OpenAI's platform](https://platform.openai.com/).

4. Start the development server:


```shellscript
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## Usage

### Chat Interface

1. Visit the homepage to access the chat interface
2. Type your message in the input field and press Enter or click the send button
3. The AI will respond in real-time with streaming text
4. Use the model selector to switch between different OpenAI models
5. Your chat history is automatically saved in your browser


### Model Testing Tool

1. Navigate to `/test-models` in your browser
2. Enter a test prompt or use the default one
3. Click "Run Tests" to evaluate all available OpenAI models
4. View the results showing which models work with your API key


### Command Line Testing

Run the test script from your terminal:

```shellscript
npm run test-models
```

This will test all configured OpenAI models with your API key and display the results in the terminal.

## API Reference

### `/api/chat`

**Method**: POST

**Request Body**:

```json
{
  "messages": [
    { "role": "user", "content": "Hello, how are you?" }
  ],
  "model": "gpt-4o-mini" // Optional, defaults to gpt-4o-mini
}
```

**Response**: A stream of data containing the AI's response.

### `/api/test-models`

**Method**: GET

**Query Parameters**:

- `prompt` (optional): The test prompt to send to the models


**Response**:

```json
{
  "results": [
    {
      "model": "gpt-4o",
      "success": true,
      "response": "Hello, nice to meet you!",
      "latency": 1234
    },
    {
      "model": "gpt-3.5-turbo",
      "success": false,
      "error": "Error message here"
    }
  ],
  "summary": {
    "total": 5,
    "working": 3,
    "failed": 2,
    "apiKeyValid": true
  },
  "apiKeyValid": true
}
```

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `NEXT_PUBLIC_DEFAULT_MODEL`: Default model to use (optional, defaults to "gpt-4o-mini")


### Customizing Models

To add or remove models from the testing mechanism, edit the `OPENAI_MODELS` array in:

- `lib/openai-tester.ts`
- `scripts/test-openai-models.js`


### Customizing the Chat Interface

The chat interface components are located in the `components` directory. You can modify these files to customize the appearance and behavior of the chat interface.

## Testing

### Running the Model Tester

The project includes a comprehensive testing mechanism for OpenAI models:

1. **Web Interface**: Navigate to `/test-models` in your browser
2. **Command Line**: Run `npm run test-models`


### What the Tester Evaluates

- Validates your OpenAI API key
- Tests all configured models with a simple prompt
- Measures response time for each model
- Identifies which models are available with your API key
- Provides detailed error information for failed tests


### Adding Custom Tests

You can extend the testing mechanism by:

1. Adding new models to the `OPENAI_MODELS` array
2. Modifying the test prompt
3. Adding additional test criteria in the `testOpenAIModel` function


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


### Coding Standards

- Use TypeScript for type safety
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Edmon - [@EdmonSahakayan](https://twitter.com/EdmonSahakayan) - [edmon.sahakyan@gmail.com](mailto:edmon.sahakyan@gmail.com)

Project Link: [https://github.com/Edmon02/openai-ai-sdk-chatbot](https://github.com/Edmon02/openai-ai-sdk-chatbot)

---

Built with [Next.js](https://nextjs.org/) and [Vercel AI SDK](https://sdk.vercel.ai/)
