/**
 * МойDate - MessageInput Component
 * Rich message input with emojis, media, voice, etc.
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Smile,
  Image,
  Video,
  Mic,
  Paperclip,
  X,
  Pause,
  Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend: (content: string, type?: 'text' | 'image' | 'video' | 'audio') => void;
  disabled?: boolean;
}

const EMOJI_SHORTCUTS = ['😊', '❤️', '😂', '👍', '🔥', '😍', '🎉', '💯'];

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout>();

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

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojis(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Handle file upload
      const type = file.type.startsWith('image/') ? 'image' :
                   file.type.startsWith('video/') ? 'video' : 'text';
      onSend(URL.createObjectURL(file), type as any);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 600) { // 10 minutes max
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    // TODO: Start actual audio recording

  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }

    if (recordingTime > 1) {
      // TODO: Send audio message
      onSend(`Audio message (${recordingTime}s)`, 'audio');

    }

    setRecordingTime(0);
  };

  const cancelRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    setRecordingTime(0);

  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Recording Mode */}
        {isRecording ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={cancelRecording}
              className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-900/20">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                Recording... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </span>
              <div className="flex-1 flex items-center gap-1 h-6">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['20%', '100%', '20%'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      delay: i * 0.05,
                    }}
                    className="w-1 bg-red-500 rounded-full"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={stopRecording}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white flex items-center justify-center shadow-lg transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          // Normal Input Mode
          <div className="space-y-3">
            {/* Emoji Quick Shortcuts */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {EMOJI_SHORTCUTS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className="flex-shrink-0 text-xl hover:scale-110 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex items-end gap-2">
              {/* Attachments Button */}
              <div className="relative">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Text Input */}
              <div className="flex-1 relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Écrivez votre message..."
                  disabled={disabled}
                  rows={1}
                  className={cn(
                    "w-full px-4 py-3 pr-12 rounded-2xl resize-none",
                    "bg-gray-100 dark:bg-gray-800",
                    "border border-transparent",
                    "text-gray-900 dark:text-white placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                    "transition-all duration-200 max-h-32",
                    "disabled:opacity-50"
                  )}
                  style={{
                    minHeight: '48px',
                    height: Math.min(message.split('\n').length * 24 + 24, 128) + 'px',
                  }}
                />

                {/* Emoji Button */}
                <button
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>
              </div>

              {/* Send/Voice Button */}
              {message.trim() ? (
                <button
                  onClick={handleSend}
                  disabled={disabled}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white flex items-center justify-center shadow-lg transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                  disabled={disabled}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center shadow-lg transition-all disabled:opacity-50"
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
