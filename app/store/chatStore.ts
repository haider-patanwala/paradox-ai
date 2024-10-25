import { create } from 'zustand'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatStore {
  messages: Message[]
  suggestions: string[]
  isLoading: boolean
  addMessage: (message: Message) => void
  sendMessage: (content: string) => Promise<void>
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [{ role: "assistant", content: "Hello! How can I assist you today?" }],
  suggestions: ['@doc', '@yt', '@img', '@url'],
  isLoading: false,
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  sendMessage: async (content: string) => {
    set({ isLoading: true })
    try {
      const result = await model.generateContent(content)
      const response = await result.response
      const text = response.text()
      set((state) => ({
        messages: [...state.messages, { role: 'assistant', content: text }]
      }))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      set({ isLoading: false })
    }
  }
}))
