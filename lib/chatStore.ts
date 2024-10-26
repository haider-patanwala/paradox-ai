import { create } from "zustand"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyA9D602g84K7muJue4n62nAQq-3fZ2QhUY")
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

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
interface ChatState {
  setYoutubeContent: (content: string) => void // Ensure proper type for `content`
  messages: Message[]
  isLoading: boolean
  suggestions: string[]
  context: {
    pdf: string
    youtube: string
    url: string
  }
  pdfContent: string | null
  urlContent: string | null
  setPdfContent: (content: string) => void
  setUrlContent: (content: string) => void
  addMessage: (message: Message) => void
  sendMessage: (content: string) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  suggestions: ['@all', '@youtube', '@pdf', '@url'],
  context: {
    pdf: '',
    youtube: '',
    url: '',
  },
  pdfContent: null,
  urlContent: null,
  setPdfContent: (content) =>
    set((state) => ({
      context: { ...state.context, pdf: content }
    })),
  setUrlContent: (content) =>
    set((state) => ({
      context: { ...state.context, url: content }
    })),
  setYoutubeContent: (content) =>
    set((state) => ({
      context: { ...state.context, youtube: content }
    })),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message]
    })),
  sendMessage: async (message: string) => {
    set({ isLoading: true });
    const state = get();
    
    let contextToUse = '';
    if (message.includes('@all')) {
      contextToUse = Object.values(state.context).filter(Boolean).join('\n\n');
    } else if (message.includes('@youtube')) {
      contextToUse = state.context.youtube;
    } else if (message.includes('@pdf')) {
      contextToUse = state.context.pdf;
    } else if (message.includes('@url')) {
      contextToUse = state.context.url;
    }
    console.log("the contextToUse is ====------>>>>>>>>>>>>>>>>>.", contextToUse)
    try {
      const prompt = contextToUse
        ? `Context: ${contextToUse}\n\nUser: ${message}`
        : message;

      const result = await model.generateContent(prompt);
      const aiMessage = result.response?.text();

      if (aiMessage) {
        set((state) => ({
          messages: [...state.messages, { role: 'assistant', content: aiMessage }],
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Error generating response:', error);
      set((state) => ({
        messages: [...state.messages, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error while processing your request.' 
        }],
        isLoading: false,
      }));
    }
  }
}))
