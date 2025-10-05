/**
 * МойDate - ConversationListItem Component
 * Swipeable conversation item with actions
 */

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MessageCircle, Pin, Star, Trash2, CheckCheck, MoreHorizontal } from 'lucide-react';
import { Conversation } from '../types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ConversationListItemProps {
  conversation: Conversation;
  onClick: () => void;
  onPin: () => void;
  onFavorite: () => void;
  onDelete: () => void;
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  onClick,
  onPin,
  onFavorite,
  onDelete,
}) => {
  const x = useMotionValue(0);
  const leftActionOpacity = useTransform(x, [-100, 0], [1, 0]);
  const rightActionOpacity = useTransform(x, [0, 100], [0, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 80;

    if (info.offset.x > threshold) {
      // Swipe right - Pin/Favorite
      onFavorite();
      x.set(0);
    } else if (info.offset.x < -threshold) {
      // Swipe left - Delete
      onDelete();
      x.set(0);
    } else {
      x.set(0);
    }
  };

  const getStatusText = () => {
    if (conversation.isTyping) return 'en train d\'écrire...';
    if (conversation.isOnline) return 'En ligne';
    if (conversation.lastSeen) {
      return `Vu ${formatDistanceToNow(conversation.lastSeen, { locale: fr, addSuffix: true })}`;
    }
    return '';
  };

  const getMessagePreview = () => {
    const msg = conversation.lastMessage;
    if (msg.type === 'text') return msg.content;
    if (msg.type === 'image') return '📷 Photo';
    if (msg.type === 'video') return '🎥 Vidéo';
    if (msg.type === 'audio') return '🎤 Message vocal';
    if (msg.type === 'sticker') return '😊 Sticker';
    if (msg.type === 'gif') return '🎬 GIF';
    return '';
  };

  return (
    <div className="relative overflow-hidden">
      {/* Swipe Actions Background */}
      <div className="absolute inset-0 flex items-center justify-between px-6">
        {/* Left Action - Delete */}
        <motion.div
          style={{ opacity: leftActionOpacity }}
          className="flex items-center gap-2 text-red-500"
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-sm font-medium">Supprimer</span>
        </motion.div>

        {/* Right Action - Favorite */}
        <motion.div
          style={{ opacity: rightActionOpacity }}
          className="flex items-center gap-2 text-yellow-500"
        >
          <span className="text-sm font-medium">Favori</span>
          <Star className="w-5 h-5 fill-current" />
        </motion.div>
      </div>

      {/* Conversation Item */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.2}
        style={{ x }}
        onDragEnd={handleDragEnd}
        whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
        onClick={onClick}
        className={cn(
          "relative bg-white dark:bg-gray-900 cursor-pointer",
          "border-b border-gray-200/50 dark:border-gray-800/50",
          "transition-colors duration-200"
        )}
      >
        <div className="flex items-center gap-3 p-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800">
              <img
                src={conversation.matchAvatar}
                alt={conversation.matchName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Online Indicator */}
            {conversation.isOnline && (
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
            )}

            {/* Pinned Icon */}
            {conversation.isPinned && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <Pin className="w-3 h-3 text-white fill-current" />
              </div>
            )}

            {/* Favorite Icon */}
            {conversation.isFavorite && (
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-current" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white font-display truncate">
                {conversation.matchName}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                {formatDistanceToNow(conversation.lastMessage.timestamp, {
                  locale: fr,
                  addSuffix: false,
                })}
              </span>
            </div>

            {/* Status */}
            {getStatusText() && (
              <div className="flex items-center gap-1 mb-1">
                {conversation.isTyping && (
                  <MoreHorizontal className="w-4 h-4 text-primary animate-pulse" />
                )}
                <span className={cn(
                  "text-xs",
                  conversation.isOnline ? "text-green-500 font-medium" :
                  conversation.isTyping ? "text-primary font-medium animate-pulse" :
                  "text-gray-500 dark:text-gray-400"
                )}>
                  {getStatusText()}
                </span>
              </div>
            )}

            {/* Last Message */}
            <div className="flex items-center gap-2">
              {conversation.lastMessage.sender === 'me' && (
                <CheckCheck
                  className={cn(
                    "w-4 h-4 flex-shrink-0",
                    conversation.lastMessage.status === 'seen'
                      ? "text-blue-500"
                      : "text-gray-400"
                  )}
                />
              )}
              <p className={cn(
                "text-sm truncate",
                conversation.unreadCount > 0
                  ? "text-gray-900 dark:text-white font-semibold"
                  : "text-gray-600 dark:text-gray-400"
              )}>
                {getMessagePreview()}
              </p>
            </div>
          </div>

          {/* Unread Badge */}
          {conversation.unreadCount > 0 && (
            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">
                {conversation.unreadCount}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
