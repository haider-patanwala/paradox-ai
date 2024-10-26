import { create } from 'zustand'
import { GoogleGenerativeAI } from '@google/generative-ai'

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
    onClose: () => set({ isOpen: false }),
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

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [{ role: "assistant", content: "Hello! How can I assist you today?" }],
  suggestions: ['@pdf', '@yt', '@img', '@url', '@all'],
  isLoading: false,
  pdfContent: null,
  urlContent: null,
  setPdfContent: (content) => set({ pdfContent: content }),
  setUrlContent: (content) => set({ urlContent: content }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message]
  })),
  sendMessage: async (content: string) => {
    set({ isLoading: true })
    try {
      const pdfContent = get().pdfContent
      const urlContent = get().urlContent
      let promptContent = content

      // Handle @all command
      if (content.includes('@all')) {
        let allContent = ''
        if (pdfContent) allContent += `PDF Content: ${pdfContent}\n`
        if (urlContent) allContent += `URL Content: ${urlContent}\n`
        
        promptContent = `User Query: ${content}\n${allContent}Please analyze all this content and respond accordingly.`
      } else {
        // Handle individual commands
        if (content.includes('@pdf') && pdfContent) {
          promptContent += `\nPDF Content: ${pdfContent}`
        }
        if (content.includes('@url') && urlContent) {
          promptContent += `\nURL Content: ${urlContent}`
        }
      }

      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        set((state) => ({
          messages: [...state.messages, { 
            role: 'assistant', 
            content: "I apologize, but I can't process your request at the moment as the API key is not configured. Please contact the administrator." 
          }]
        }))
        return
      }
      
      // Send the enhanced prompt to Gemini
      const result = await model.generateContent(promptContent)
      const response = await result.response
      const text = response.text()
      
      set((state) => ({
        messages: [...state.messages, { role: 'assistant', content: text }]
      }))
    } catch (error) {
      set((state) => ({
        messages: [...state.messages, { 
          role: 'assistant', 
          content: "I apologize, but I encountered an error processing your request. Please try again later." 
        }]
      }))
    } finally {
      set({ isLoading: false })
    }
  }
}))
