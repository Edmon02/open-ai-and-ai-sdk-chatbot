import type { Message } from "ai"

const STORAGE_KEY = "chat-history"

export function saveMessages(messages: Message[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

export function loadMessages(): Message[] {
  if (typeof window === "undefined") return []
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return []
  try {
    return JSON.parse(saved)
  } catch (e) {
    console.error("Failed to parse saved messages", e)
    return []
  }
}

export function clearMessages() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

