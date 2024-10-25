// "use client"

// import React, { useState, useRef, useEffect } from "react"
// import { useStore } from "zustand"
// import { createStore } from "zustand/vanilla"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { FileUp, Send } from "lucide-react"
// import { useUploadStore } from '../store/uploadStore'
// import { useChatStore } from '../store/chatStore'
// import { Check, Loader2 } from 'lucide-react'
// import { isValidUrl } from "../utils/validation"

// interface Message {
//   role: "user" | "assistant"
//   content: string
// }

// interface ChatStore {
//   messages: Message[]
//   suggestions: string[]
//   isLoading: boolean
//   addMessage: (message: Message) => void
//   sendMessage: (content: string) => Promise<void>
// }

// const createChatStore = () => createStore<ChatStore>((set) => ({
//   messages: [{ role: "assistant", content: "Hello! How can I assist you today?" }],
//   suggestions: ['@doc', '@yt', '@img', '@url'],
//   isLoading: false,
//   addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
//   sendMessage: async (content: string) => {
//     set({ isLoading: true })
//     try {
//       // Here you would typically send the message to your AI backend
//       // and then add the AI's response to the messages
//     } catch (error) {
//       console.error('Error:', error)
//     } finally {
//       set({ isLoading: false })
//     }
//   }
// }))

// const chatStore = createChatStore()

"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileUp, Send, X, Check, Loader2 } from "lucide-react"
import { useUploadStore } from '../store/uploadStore'
import { useChatStore } from '../store/chatStore'
import { ChatMessage } from "@/components/chat/ChatMessage"
import { FileUploadItem } from "@/components/upload/FileUploadItem"
import { isValidUrl } from "../utils/validation"

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const { messages, suggestions, isLoading, addMessage, sendMessage } = useChatStore()
  const { uploadedFiles, validUrls, addFile, addUrl, removeFile, removeUrl } = useUploadStore()

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFileUpload = async (type: 'pdf' | 'image', inputRef: React.RefObject<HTMLInputElement>) => {
    const file = inputRef.current?.files?.[0]
    if (file) {
      addFile({ type, name: file.name, content: file })
    }
  }

  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'youtube' | 'document') => {
    const url = e.target.value
    if (isValidUrl(url)) {
      addUrl({ type, url })
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(prev => {
      const lastAtIndex = prev.lastIndexOf('@')
      return prev.substring(0, lastAtIndex) + suggestion + ' '
    })
    setShowSuggestions(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    const lastAtIndex = e.target.value.lastIndexOf('@')
    setShowSuggestions(lastAtIndex !== -1 && lastAtIndex === e.target.value.length - 1)
  }

  const handleSend = async () => {
    if (input.trim()) {
      addMessage({ role: "user", content: input })
      setInput("")
      try {
        await sendMessage(input)
      } catch (error) {
        addMessage({ role: "assistant", content: "Error: No API key provided. Please check your configuration." })
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Upload Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf"
                  className="hidden"
                  onChange={() => handleFileUpload('pdf', fileInputRef)}
                />
                <Button className="w-full" onClick={() => fileInputRef.current?.click()}>
                  <FileUp className="mr-2 h-4 w-4" /> Upload PDF
                </Button>
                <AnimatePresence>
                  {uploadedFiles.map(file => file.type === 'pdf' && (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <FileUploadItem 
                        fileName={file.name} 
                        onDelete={() => removeFile(file.name)} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                {['youtube', 'document'].map((type) => (
                  <div key={type} className="relative">
                    <Input 
                      placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} Link`}
                      onChange={(e) => handleUrlInput(e, type as 'youtube' | 'document')}
                    />
                    <AnimatePresence>
                      {validUrls.some(url => url.type === type) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-2 top-2"
                        >
                          <Check className="text-green-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={() => handleFileUpload('image', imageInputRef)}
                />
                <Button className="w-full" onClick={() => imageInputRef.current?.click()}>
                  <FileUp className="mr-2 h-4 w-4" /> Upload Image
                </Button>
                <AnimatePresence>
                  {uploadedFiles.map(file => file.type === 'image' && (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <FileUploadItem 
                        fileName={file.name} 
                        onDelete={() => removeFile(file.name)} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>AI Chatbot</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full">
              {messages.map((message, index) => (
                <ChatMessage key={index} role={message.role} content={message.content} />
              ))}
              <div ref={chatEndRef} />
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center space-x-2 relative">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 bg-white shadow-lg rounded-lg p-2"
                  >
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="cursor-pointer hover:bg-gray-100 p-1"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <Button onClick={handleSend} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default AIAssistant
