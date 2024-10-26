"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileUp, Send, Check, Loader2 } from "lucide-react"
import { useUploadStore } from "../../lib/uploadStore"
import { useChatStore, useModal } from "../../lib/chatStore"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { FileUploadItem } from "@/components/upload/FileUploadItem"
import { isValidUrl } from "../utils/validation"
import { toast } from "react-hot-toast"
import Player from "@/components/vid-layouts/player"
import { Video } from "@/lib/store"

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [urlLoading, setUrlLoading] = useState<{ [key: string]: boolean }>({
    youtube: false,
    document: false
  })
  const [urlAdded, setUrlAdded] = useState<{ [key: string]: boolean }>({
    youtube: false,
    document: false
  })
  const { setUrlContent } = useChatStore()
  const { setSource, source } = Video()

  const {
    messages,
    suggestions,
    isLoading,
    addMessage,
    sendMessage,
    setPdfContent
  } = useChatStore()
  const { uploadedFiles, addFile, addUrl, removeFile, removeUrl } =
    useUploadStore()

  const [urlInputs, setUrlInputs] = useState<{ [key: string]: string }>({
    youtube: "",
    document: ""
  })

  const extractYoutubeId = (url: string): string | null => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleFileUpload = async (
    type: "pdf" | "image",
    inputRef: React.RefObject<HTMLInputElement>
  ) => {
    const file = inputRef.current?.files?.[0]
    if (!file) return

    if (type === "pdf") {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch("/api/uploadPdf", {
          method: "POST",
          body: formData
        })

        const result = await response.json()

        if (result.success) {
          setPdfContent(result.data)
          toast.success(result.message)
          addFile({
            name: file.name,
            type: "pdf",
            content: file
          })
        } else {
          toast.error(result.message || "Failed to upload PDF")
        }
      } catch (error) {
        console.error("Failed to upload file:", error)
        toast.error("Error uploading PDF")
      }
    } else if (type === "image") {
      const formData = new FormData()
      formData.append("file", file!)

      try {
        const response = await fetch("/api/uploadPdf", {
          method: "POST",
          body: formData
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("the data is 3", data)
      } catch (error) {
        console.error("Failed to upload file:", error)
      }
    }
  }

  const handleUrlInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "youtube" | "document"
  ) => {
    setUrlInputs((prev) => ({
      ...prev,
      [type]: e.target.value
    }))
  }

  const handleUrlSubmit = async (type: "youtube" | "document") => {
    const url = urlInputs[type]
    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL")
      return
    }
    setSource(url)

    setUrlLoading((prev) => ({ ...prev, [type]: true }))

    try {
      if (type === "youtube") {
        const videoId = extractYoutubeId(url)
        if (!videoId) {
          toast.error("Invalid YouTube URL")
          return
        }

        const response = await fetch("/api/youtube", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ videoId })
        })

        const result = await response.json()

        if (result.success) {
          setUrlContent(result.data)
          toast.success("YouTube transcript extracted successfully!")
          setUrlAdded((prev) => ({ ...prev, [type]: true }))
          addUrl({
            url,
            type: "youtube",
            content: result.data
          })
        } else {
          toast.error(result.message || "Failed to extract YouTube transcript")
        }
      } else if (type === "document") {
        const response = await fetch("/api/linkExtract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ query: url })
        })

        const result = await response.json()

        if (result.data) {
          setUrlContent(JSON.stringify(result.data))
          toast.success("URL content extracted successfully!")
          setUrlAdded((prev) => ({ ...prev, [type]: true }))
          addUrl({
            url,
            type: "document",
            content: result.data
          })
        }
      }
    } catch (error) {
      console.error(`Error processing ${type} URL:`, error)
      toast.error(`Error processing ${type} content`)
    } finally {
      setUrlLoading((prev) => ({ ...prev, [type]: false }))
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput((prev) => {
      const lastAtIndex = prev.lastIndexOf("@")
      return prev.substring(0, lastAtIndex) + suggestion + " "
    })
    setShowSuggestions(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    const lastAtIndex = e.target.value.lastIndexOf("@")
    setShowSuggestions(
      lastAtIndex !== -1 && lastAtIndex === e.target.value.length - 1
    )
  }

  const handleSend = async () => {
    if (input.trim()) {
      addMessage({ role: "user", content: input })
      setInput("")
      try {
        await sendMessage(input)
      } catch (error) {
        addMessage({
          role: "assistant",
          content:
            "Error: No API key provided. Please check your configuration."
        })
      }
    }
  }

  const { onOpen } = useModal()

  return (
    <div className="container relative mx-auto flex min-h-svh min-w-[80rem] flex-col items-center justify-center p-4 ">
      <div className="my-auto grid w-full grid-cols-1 gap-4 hue-rotate-180 invert md:grid-cols-2">
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
                  onChange={() => handleFileUpload("pdf", fileInputRef)}
                />
                <Button
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileUp className="mr-2 h-4 w-4" /> Upload PDF
                </Button>
                <AnimatePresence>
                  {uploadedFiles.map(
                    (file) =>
                      file.type === "pdf" && (
                        <motion.div
                          key={file.name}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <FileUploadItem
                            fileName={file.name}
                            onDelete={() => removeFile(file.name)}
                          />
                        </motion.div>
                      )
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                {["youtube", "document"].map((type) => (
                  <div
                    key={type}
                    className="relative flex items-center space-x-2"
                  >
                    <Input
                      placeholder={
                        type === "youtube"
                          ? "Enter YouTube URL (https://youtube.com/watch?v=...)"
                          : "Enter webpage URL (https://example.com)"
                      }
                      value={urlInputs[type as "youtube" | "document"]}
                      onChange={(e) =>
                        handleUrlInput(e, type as "youtube" | "document")
                      }
                    />
                    <Button
                      size="sm"
                      onClick={() =>
                        handleUrlSubmit(type as "youtube" | "document")
                      }
                      disabled={urlLoading[type]}
                    >
                      {urlLoading[type] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : urlAdded[type] ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={() => handleFileUpload("image", imageInputRef)}
                />
                {/* <Button
                  className="w-full"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <FileUp className="mr-2 h-4 w-4" /> Upload Image
                </Button> */}
                <AnimatePresence>
                  {uploadedFiles.map(
                    (file) =>
                      file.type === "image" && (
                        <motion.div
                          key={file.name}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <FileUploadItem
                            fileName={file.name}
                            onDelete={() => removeFile(file.name)}
                          />
                        </motion.div>
                      )
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
          {source && (
            <Card>
              <CardContent className="-hue-rotate-180 relative flex items-center justify-center p-5 invert">
                <Player video_src={source} />
              </CardContent>
            </Card>
          )}
        </motion.div>

        <Card className="flex h-[600px] flex-col">
          <CardHeader>
            <CardTitle>AI Chatbot</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}
              <div ref={chatEndRef} />
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="relative flex w-full items-center space-x-2">
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
                    className="absolute bottom-full left-0 rounded-lg bg-white p-2 shadow-lg"
                  >
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="cursor-pointer p-1 hover:bg-gray-100"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <Button onClick={handleSend} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardFooter>
          {/* <Button onClick={() => onOpen()}>Open Modal</Button> */}
        </Card>
      </div>
      {/* <ModalVid /> */}
    </div>
  )
}

export default AIAssistant
