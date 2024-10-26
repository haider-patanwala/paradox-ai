import { create } from "zustand"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}))

interface ChatStore {
  messages: Message[]
  suggestions: string[]
  isLoading: boolean
  pdfContent: string | null
  urlContent: string | null
  setPdfContent: (content: string) => void
  setUrlContent: (content: string) => void
  addMessage: (message: Message) => void
  sendMessage: (content: string) => Promise<void>
}

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
)
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [
    { role: "assistant", content: "Hello! How can I assist you today?" }
  ],
  suggestions: ["@doc", "@yt", "@img", "@url"],
  isLoading: false,
  pdfContent: null,
  urlContent: null,
  setPdfContent: (content) => set({ pdfContent: content }),
  setUrlContent: (content) => set({ urlContent: content }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message]
    })),
  sendMessage: async (content: string) => {
    set({ isLoading: true })
    try {
      if (content.includes("@url")) {
        const urlContent = get().urlContent
        if (urlContent) {
          set((state) => ({
            messages: [
              ...state.messages,
              {
                role: "assistant",
                content:
                  "Your URL content has been successfully sent to the conversation. You can continue chatting!"
              }
            ]
          }))
        } else {
          set((state) => ({
            messages: [
              ...state.messages,
              {
                role: "assistant",
                content:
                  "No URL content found. Please add a URL first using the input box."
              }
            ]
          }))
        }
        set({ isLoading: false })
        return
      }

      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        set((state) => ({
          messages: [
            ...state.messages,
            {
              role: "assistant",
              content:
                "I apologize, but I can't process your request at the moment as the API key is not configured. Please contact the administrator."
            }
          ]
        }))
        return
      }

      const result = await model.generateContent(content)
      const response = await result.response
      const text = response.text()
      set((state) => ({
        messages: [...state.messages, { role: "assistant", content: text }]
      }))
    } catch (error) {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            role: "assistant",
            content:
              "I apologize, but I encountered an error processing your request. Please try again later."
          }
        ]
      }))
    } finally {
      set({ isLoading: false })
    }
  }
}))
