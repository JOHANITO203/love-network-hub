/**
 * МойDate - ConversationView Component
 * Full conversation chat screen
 */

import { useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { Conversation } from '../types';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

interface ConversationViewProps {
  conversation: Conversation;
  onBack: () => void;
  onSendMessage: (content: string, type?: 'text' | 'image' | 'video' | 'audio') => void;
  onReact: (messageId: string, emoji: string) => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  onBack,
  onSendMessage,
  onReact,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(90,169,255,0.14),transparent_50%)]" />

      <header className="sticky top-0 z-30 glass-surface border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </button>

            <div className="text-center">
              <h2 className="text-sm font-semibold text-white">{conversation.matchName}</h2>
              <p className="text-xs text-emerald-400">{conversation.isOnline ? 'Online' : 'Offline'}</p>
            </div>

            <div className="flex items-center gap-2">
              <img src={conversation.matchAvatar} alt={conversation.matchName} className="w-9 h-9 rounded-full object-cover" />
              <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <MoreVertical className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        <div className="space-y-3">
          {conversation.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onReact={(emoji) => onReact(message.id, emoji)}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="glass-surface border-t border-white/10">
        <MessageInput onSend={(content, type) => onSendMessage(content, type)} />
      </div>
    </div>
  );
};
