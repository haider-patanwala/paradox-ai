"use client"

import React, { useState, useRef, useEffect } from "react"
import { useStore } from "zustand"
import { createStore } from "zustand/vanilla"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileUp, Send } from "lucide-react"
import { useUploadStore } from '../store/uploadStore'
import { useChatStore } from '../store/chatStore'
import { Check, Loader2 } from 'lucide-react'
import { isValidUrl } from "../utils/validation"

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

const createChatStore = () => createStore<ChatStore>((set) => ({
  messages: [{ role: "assistant", content: "Hello! How can I assist you today?" }],
  suggestions: ['@doc', '@yt', '@img', '@url'],
  isLoading: false,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  sendMessage: async (content: string) => {
    set({ isLoading: true })
    try {
      // Here you would typically send the message to your AI backend
      // and then add the AI's response to the messages
    } catch (error) {
      console.error('Error:', error)
    } finally {
      set({ isLoading: false })
    }
  }
}))

const chatStore = createChatStore()

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const { messages, suggestions, isLoading, addMessage, sendMessage } = useChatStore()
  const { uploadedFiles, validUrls, addFile, addUrl } = useUploadStore()

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

  const handleSend = async () => {
    if (input.trim()) {
      addMessage({ role: "user", content: input })
      await sendMessage(input)
      setInput("")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              {uploadedFiles.map(file => file.type === 'pdf' && (
                <p key={file.name} className="text-green-500">✓ {file.name}</p>
              ))}
              
              <div className="relative">
                <Input 
                  placeholder="YouTube Link" 
                  onChange={(e) => handleUrlInput(e, 'youtube')}
                />
                {validUrls.some(url => url.type === 'youtube') && (
                  <Check className="absolute right-2 top-2 text-green-500" />
                )}
              </div>
              
              {/* Similar for Document Link */}
              
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
              {uploadedFiles.map(file => file.type === 'image' && (
                <p key={file.name} className="text-green-500">✓ {file.name}</p>
              ))}
            </CardContent>
          </Card>
        </div>
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>AI Chatbot</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
                  <div className={`flex items-start ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{message.role === "user" ? "U" : "AI"}</AvatarFallback>
                    </Avatar>
                    <div className={`mx-2 p-2 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center space-x-2 relative">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setShowSuggestions(e.target.value.includes('@'))
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              {showSuggestions && (
                <div className="absolute bottom-full left-0 bg-white shadow-lg rounded-lg p-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="cursor-pointer hover:bg-gray-100 p-1"
                      onClick={() => {
                        setInput(input + suggestion)
                        setShowSuggestions(false)
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
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
