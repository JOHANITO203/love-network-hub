import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, MicOff, Send, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AudioRecorder, encodeAudioForAPI, playAudioData } from "@/utils/audioUtils";

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isAudio?: boolean;
}

interface ChatInterfaceProps {
  matchName: string;
  matchAvatar: string;
  onBack: () => void;
}

export const ChatInterface = ({ matchName, matchAvatar, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    try {
      // Use the full URL to the Supabase edge function
      const wsUrl = `wss://juzpcvhmiaxswiibicol.functions.supabase.co/realtime-chat`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {

        setIsConnected(true);
        toast({
          title: "Connected",
          description: "Voice chat is ready!",
        });
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);


          if (data.type === 'response.audio.delta') {
            // Handle audio response
            setIsAISpeaking(true);
            if (audioContextRef.current) {
              const binaryString = atob(data.delta);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              await playAudioData(audioContextRef.current, bytes);
            }
          } else if (data.type === 'response.audio_transcript.delta') {
            // Handle transcript updates
            setCurrentTranscript(data.transcript || data.delta);
          } else if (data.type === 'response.audio.done') {
            // Audio response completed
            setIsAISpeaking(false);
            if (currentTranscript || data.transcript) {
              const aiMessage: Message = {
                id: Date.now().toString(),
                sender: 'ai',
                content: data.transcript || currentTranscript,
                timestamp: new Date(),
                isAudio: true
              };
              setMessages(prev => [...prev, aiMessage]);
              setCurrentTranscript("");
            }
          } else if (data.type === 'error') {
            console.error('WebSocket error:', data.error);
            toast({
              title: "Error",
              description: data.error,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to chat service",
          variant: "destructive",
        });
      };

      wsRef.current.onclose = () => {

        setIsConnected(false);
        setIsRecording(false);
        setIsAISpeaking(false);
      };

    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      toast({
        title: "Connection Error",
        description: "Failed to initialize chat",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }

      audioRecorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      });

      await audioRecorderRef.current.start();
      setIsRecording(true);

      toast({
        title: "Recording",
        description: "Speak now...",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Failed to access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
    }
    setIsRecording(false);
  };

  const sendTextMessage = () => {
    if (!inputValue.trim() || !wsRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Send text message to AI
    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: inputValue
          }
        ]
      }
    };

    wsRef.current.send(JSON.stringify(event));
    wsRef.current.send(JSON.stringify({ type: 'response.create' }));

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendTextMessage();
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (audioRecorderRef.current) {
        audioRecorderRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [connectWebSocket]);

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
                {isConnected && (
                  <Badge variant="secondary" className="text-xs">
                    🎙️ Voice Ready
                  </Badge>
                )}
                {isAISpeaking && (
                  <Badge className="text-xs bg-gradient-moydate shadow-love">
                    Speaking...
                  </Badge>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={isConnected ? () => {} : connectWebSocket}
              disabled={!isConnected}
              className={!isConnected ? "bg-gradient-moydate text-white border-0 shadow-love hover:shadow-glow transition-smooth" : ""}
            >
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>Start a conversation with {matchName}!</p>
            <p className="text-sm mt-1">Try voice messages for a more natural chat.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-moydate text-white ml-4 shadow-love'
                  : 'bg-muted mr-4 border border-brand-red/10'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {message.isAudio && (
                  <Badge variant="secondary" className="text-xs">
                    Voice
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}

        {currentTranscript && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted mr-4 opacity-70">
              <p className="text-sm">{currentTranscript}</p>
              <span className="text-xs opacity-70">Typing...</span>
            </div>
          </div>
        )}

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
              placeholder="Écrivez un message... ✨"
              className="flex-1 border-brand-red/20 focus:border-brand-red transition-smooth"
              disabled={!isConnected}
            />

            <Button
              onClick={sendTextMessage}
              disabled={!inputValue.trim() || !isConnected}
              size="sm"
              className="bg-gradient-moydate shadow-love hover:shadow-glow transition-smooth disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>

            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!isConnected}
              variant={isRecording ? "destructive" : "secondary"}
              size="sm"
              className={isRecording ? "animate-pulse" : "hover:border-brand-orange hover:text-brand-orange transition-smooth"}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};