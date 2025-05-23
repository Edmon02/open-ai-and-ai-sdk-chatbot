"use client"

import type React from "react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { saveMessages, loadMessages, clearMessages } from "@/lib/chat-storage"

import { useChat } from "ai/react"

import { ArrowUpIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"
import { ModelSelector } from "@/components/model-selector"

export function ChatForm({ className, ...props }: React.ComponentProps<"form">) {
  // Add model state
  const [model, setModel] = useState("gpt-4o-mini")

  // Update the useChat hook to include isLoading
  const { messages, input, setInput, append, isLoading, error, reload, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: loadMessages(),
    body: { model },
  })

  // Add this effect to save messages when they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages)
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void append({ content: input, role: "user" })
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  // Add a clear chat function
  const clearChat = () => {
    setMessages([])
    clearMessages()
  }

  const header = (
    <div className="m-auto flex max-w-96 flex-col gap-5 text-center">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">Basic AI Chatbot Template</h1>
      <p className="text-muted-foreground text-sm">
        This is an AI chatbot app template built with <span className="text-foreground">Next.js</span>, the{" "}
        <span className="text-foreground">Vercel AI SDK</span>, and <span className="text-foreground">Vercel KV</span>.
      </p>
      <p className="text-muted-foreground text-sm">
        Connect an API Key from your provider and send a message to get started.
      </p>
    </div>
  )

  // Add a loading indicator in the message list
  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      {messages.map((message, index) => (
        <div
          key={index}
          data-role={message.role}
          className="max-w-[80%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
        >
          {message.content}
        </div>
      ))}
      {isLoading && (
        <div className="self-start max-w-[80%] rounded-xl px-3 py-2 text-sm bg-gray-100">
          <div className="flex gap-1">
            <div className="size-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="size-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
            <div className="size-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      )}
    </div>
  )

  const errorMessage = error && (
    <div className="p-2 my-2 text-sm text-white bg-red-500 rounded">
      Error: {error.message || "Failed to load response"}
    </div>
  )

  return (
    <TooltipProvider>
      <main
        className={cn(
          "ring-none mx-auto flex h-svh max-h-svh w-full max-w-[35rem] flex-col items-stretch border-none",
          className,
        )}
        {...props}
      >
        <div className="flex-1 content-center overflow-y-auto px-6">
          {messages.length ? (
            <>
              <div className="sticky top-0 z-10 flex justify-between items-center pt-4 pb-2 bg-white">
                <ModelSelector value={model} onChange={setModel} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-xs text-gray-500 flex items-center gap-1"
                >
                  <Trash2Icon size={14} />
                  Clear chat
                </Button>
              </div>
              {messageList}
            </>
          ) : (
            header
          )}
          {errorMessage}
        </div>
        <form
          onSubmit={handleSubmit}
          className="border-input bg-background focus-within:ring-ring/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
        >
          <AutoResizeTextarea
            onKeyDown={handleKeyDown}
            onChange={(v) => setInput(v)}
            value={input}
            placeholder="Enter a message"
            className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
            disabled={isLoading}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-1 right-1 size-6 rounded-full"
                disabled={isLoading}
              >
                <ArrowUpIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={12}>Submit</TooltipContent>
          </Tooltip>
        </form>
      </main>
    </TooltipProvider>
  )
}

