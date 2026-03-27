/**
 * MoyDate - MessageInput Component
 * Rich message input with emojis and media.
 */

import { useState, useRef } from 'react';
import { Smile, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend: (content: string, type?: 'text' | 'image' | 'video' | 'audio') => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim(), 'text');
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={disabled}
            className={cn(
              'w-full h-12 pl-4 pr-20 rounded-full',
              'bg-white/5 text-white placeholder-white/40',
              'border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/40',
              'transition-all duration-200'
            )}
          />
          <button
            onClick={() => null}
            className="absolute right-14 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            <Smile className="w-4 h-4 text-white/70" />
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-white/10 text-[10px] text-white/70"
          >
            EN ↔ RU
          </button>
        </div>

        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff4d6d] to-[#ff8b5a] text-white flex items-center justify-center shadow-[0_14px_30px_rgba(255,77,109,0.35)] transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
        />
      </div>
    </div>
  );
};
