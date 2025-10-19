/**
 * МойDate - ConversationView Component
 * Full conversation chat screen
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { Conversation } from '../types';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { cn } from '@/lib/utils';

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left - Back & Profile */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800">
                    <img
                      src={conversation.matchAvatar}
                      alt={conversation.matchName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                  )}
                </div>

                {/* Name & Status */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white font-display truncate">
                    {conversation.matchName}
                  </h2>
                  <p className={cn(
                    "text-xs",
                    conversation.isOnline ? "text-green-500 font-medium" :
                    conversation.isTyping ? "text-primary font-medium animate-pulse" :
                    "text-gray-500 dark:text-gray-400"
                  )}>
                    {conversation.isTyping ? 'en train d\'écrire...' :
                     conversation.isOnline ? 'En ligne' :
                     'Hors ligne'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
                <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        <div className="space-y-2">
          {conversation.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onReact={(emoji) => onReact(message.id, emoji)}
              onTranslate={() => {
                // TODO: Implement translation

              }}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <MessageInput
        onSend={(content, type) => onSendMessage(content, type)}
      />
    </div>
  );
};
