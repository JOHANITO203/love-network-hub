/**
 * МойDate - MessageBubble Component
 * Message bubble with glassmorphism and reactions
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCheck, Volume2, Play, Pause, Languages } from 'lucide-react';
import { Message, PlaybackSpeed } from '../types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MessageBubbleProps {
  message: Message;
  onReact: (emoji: string) => void;
  onTranslate?: () => void;
}

const QUICK_REACTIONS = ['❤️', '😂', '👍', '😮', '😢', '🔥'];

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onReact,
  onTranslate,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [showTranslation, setShowTranslation] = useState(false);

  const isMe = message.sender === 'me';

  const handleReaction = (emoji: string) => {
    onReact(emoji);
    setShowReactions(false);
  };

  const toggleTranslation = () => {
    if (!message.translated && onTranslate) {
      onTranslate();
    }
    setShowTranslation(!showTranslation);
  };

  const cyclePlaybackSpeed = () => {
    const speeds: PlaybackSpeed[] = [1, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-end gap-2 mb-4",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("max-w-[70%]", isMe && "order-2")}>
        {/* Message Bubble */}
        <motion.div
          onLongPress={() => setShowReactions(true)}
          onHoverStart={() => setShowReactions(true)}
          onHoverEnd={() => setShowReactions(false)}
          className="relative group"
        >
          {/* Quick Reactions Popup */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className={cn(
                  "absolute bottom-full mb-2 px-3 py-2 rounded-full",
                  "bg-white/90 dark:bg-gray-800/90 backdrop-blur-md",
                  "shadow-lg border border-gray-200/50 dark:border-gray-700/50",
                  "flex gap-2 z-10",
                  isMe ? "right-0" : "left-0"
                )}
              >
                {QUICK_REACTIONS.map((emoji) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReaction(emoji)}
                    className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bubble Content */}
          <div
            className={cn(
              "rounded-3xl px-4 py-3 backdrop-blur-md transition-all duration-200",
              isMe
                ? "bg-gradient-to-br from-pink-500/90 to-red-500/90 text-white ml-auto"
                : "bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-700/50"
            )}
          >
            {/* Text Message */}
            {message.type === 'text' && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}

            {/* Image Message */}
            {message.type === 'image' && (
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={message.mediaUrl || message.content}
                  alt="Shared image"
                  className="max-w-full max-h-80 object-contain"
                />
              </div>
            )}

            {/* Video Message */}
            {message.type === 'video' && (
              <div className="rounded-2xl overflow-hidden">
                <video
                  src={message.mediaUrl || message.content}
                  controls
                  className="max-w-full max-h-80"
                />
              </div>
            )}

            {/* Audio Message */}
            {message.type === 'audio' && message.duration && (
              <div className="flex items-center gap-3 min-w-[200px]">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isMe
                      ? "bg-white/20 hover:bg-white/30"
                      : "bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50"
                  )}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                {/* Waveform Placeholder */}
                <div className="flex-1 flex items-center gap-1 h-8">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 rounded-full transition-all",
                        isMe ? "bg-white/40" : "bg-pink-300 dark:bg-pink-700"
                      )}
                      style={{
                        height: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </div>

                {/* Duration & Speed */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs opacity-80">
                    {Math.floor(message.duration / 60)}:{(message.duration % 60).toString().padStart(2, '0')}
                  </span>
                  <button
                    onClick={cyclePlaybackSpeed}
                    className="text-xs opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {playbackSpeed}x
                  </button>
                </div>
              </div>
            )}

            {/* Translation */}
            {(message.translated || onTranslate) && (
              <button
                onClick={toggleTranslation}
                className="flex items-center gap-1 mt-2 text-xs opacity-70 hover:opacity-100 transition-opacity"
              >
                <Languages className="w-3 h-3" />
                <span>{showTranslation ? 'Original' : 'Traduire'}</span>
              </button>
            )}

            {showTranslation && message.translated && (
              <p className="text-sm mt-2 pt-2 border-t border-white/20 leading-relaxed">
                {message.translated.text}
              </p>
            )}

            {/* Timestamp & Status */}
            <div className={cn(
              "flex items-center gap-1 mt-1",
              isMe ? "justify-end" : "justify-start"
            )}>
              <span className="text-xs opacity-60">
                {format(message.timestamp, 'HH:mm', { locale: fr })}
              </span>
              {isMe && message.status && (
                <CheckCheck
                  className={cn(
                    "w-4 h-4",
                    message.status === 'seen' ? "text-blue-300" : "opacity-60"
                  )}
                />
              )}
            </div>
          </div>

          {/* Reactions Display */}
          {message.reactions && message.reactions.length > 0 && (
            <div className={cn(
              "flex gap-1 mt-1",
              isMe ? "justify-end" : "justify-start"
            )}>
              {message.reactions.map((reaction, i) => (
                <div
                  key={i}
                  className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full text-xs shadow-md border border-gray-200/50 dark:border-gray-700/50"
                >
                  {reaction.emoji}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
