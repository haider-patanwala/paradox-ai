"use client"

import React, { useState } from "react"
import { useStore } from "zustand"
import { createStore } from "zustand/vanilla"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileUp, Send } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatStore {
  messages: Message[]
  addMessage: (message: Message) => void
}

const createChatStore = () => createStore<ChatStore>((set) => ({
  messages: [{ role: "assistant", content: "Hello! How can I assist you today?" }],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}))

const chatStore = createChatStore()

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState("")
  const { messages, addMessage } = useStore(chatStore)

  const handleSend = () => {
    if (input.trim()) {
      addMessage({ role: "user", content: input })
      setInput("")
      // Here you would typically send the message to your AI backend
      // and then add the AI's response to the messages
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
              <Button className="w-full">
                <FileUp className="mr-2 h-4 w-4" /> Upload PDF
              </Button>
              <Input placeholder="YouTube Link" />
              <Input placeholder="Document Link" />
              <Button className="w-full">
                <FileUp className="mr-2 h-4 w-4" /> Upload Image
              </Button>
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
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default AIAssistant
