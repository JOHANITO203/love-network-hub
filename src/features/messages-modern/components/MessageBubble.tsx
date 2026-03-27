/**
 * МойDate - MessageBubble Component
 * Message bubble with glassmorphism and reactions
 */

import { motion } from 'framer-motion';
import { CheckCheck } from 'lucide-react';
import { Message } from '../types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MessageBubbleProps {
  message: Message;
  onReact: (emoji: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isMe = message.sender === 'me';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}
    >
      <div
        className={cn(
          'max-w-[78%] rounded-3xl px-4 py-3 backdrop-blur-md border',
          isMe
            ? 'bg-gradient-to-br from-[#ff4d6d]/90 to-[#ff8b5a]/90 text-white border-white/10 shadow-[0_16px_40px_rgba(255,77,109,0.35)]'
            : 'glass-panel text-white/90 border-white/10'
        )}
      >
        {message.type === 'text' && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}

        {message.type === 'image' && message.mediaUrls && message.mediaUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {message.mediaUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="media"
                className="h-20 w-20 rounded-xl object-cover"
              />
            ))}
          </div>
        )}

        {message.type === 'image' && !message.mediaUrls && message.mediaUrl && (
          <img src={message.mediaUrl} alt="media" className="rounded-2xl max-h-64 object-cover" />
        )}

        {message.translated?.text && (
          <p className={cn('text-xs mt-2', isMe ? 'text-white/80' : 'text-white/60')}>
            {message.translated.text}
          </p>
        )}
      </div>

      <div className={cn('mt-1 text-[10px] text-white/40', isMe ? 'text-right' : 'text-left')}>
        {format(message.timestamp, 'HH:mm', { locale: fr })}
        {isMe && message.status && (
          <CheckCheck className="inline-block w-3 h-3 ml-1 text-sky-300" />
        )}
      </div>
    </motion.div>
  );
};
