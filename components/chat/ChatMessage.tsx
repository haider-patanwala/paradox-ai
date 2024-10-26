import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => (
  <div className={`flex ${role === "user" ? "justify-end" : "justify-start"} mb-4`}>
    <div className={`flex items-start ${role === "user" ? "flex-row-reverse" : ""}`}>
      <Avatar className="w-8 h-8">
        <AvatarFallback>{role === "user" ? "U" : "AI"}</AvatarFallback>
      </Avatar>
      <div
        className={`mx-2 p-2 rounded-lg ${
          role === "user" 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        }`}
      >
        {content}
      </div>
    </div>
  </div>
)
