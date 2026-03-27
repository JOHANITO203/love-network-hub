import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "match";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  matchName: string;
  matchAvatar: string;
  onBack: () => void;
}

export const ChatInterface = ({ matchName, matchAvatar, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendTextMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendTextMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-subtle">
      {/* Header */}
      <Card className="rounded-none border-0 border-b border-brand-red/10 shadow-soft">
        <CardHeader className="p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 hover:bg-brand-red/10 hover:text-brand-red transition-smooth rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <Avatar className="w-10 h-10 ring-2 ring-brand-red/20">
              <AvatarImage src={matchAvatar} alt={matchName} />
              <AvatarFallback className="bg-gradient-moydate text-white">{matchName[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <CardTitle className="text-lg">{matchName}</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-soft" />
                <span className="text-sm text-muted-foreground">En ligne</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>Start a conversation with {matchName}!</p>
            <p className="text-sm mt-1">Envoyez un message pour lancer la discussion.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-gradient-moydate text-white ml-4 shadow-love"
                  : "bg-muted mr-4 border border-brand-red/10"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <Card className="rounded-none border-0 border-t border-brand-red/10 shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écrivez un message... ?"
              className="flex-1 border-brand-red/20 focus:border-brand-red transition-smooth"
            />

            <Button
              onClick={sendTextMessage}
              disabled={!inputValue.trim()}
              size="sm"
              className="bg-gradient-moydate shadow-love hover:shadow-glow transition-smooth disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
