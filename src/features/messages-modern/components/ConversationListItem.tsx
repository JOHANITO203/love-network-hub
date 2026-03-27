/**
 * МойDate - ConversationListItem Component
 * Swipeable conversation item with actions
 */

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { CheckCheck } from 'lucide-react';
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
      onFavorite();
      x.set(0);
    } else if (info.offset.x < -threshold) {
      onDelete();
      x.set(0);
    } else {
      x.set(0);
    }
  };

  const getMessagePreview = () => {
    const msg = conversation.lastMessage;
    if (msg.type === 'text') return msg.content;
    if (msg.type === 'image') return 'Photo';
    if (msg.type === 'video') return 'Vidéo';
    if (msg.type === 'audio') return 'Pièce jointe';
    if (msg.type === 'sticker') return 'Sticker';
    if (msg.type === 'gif') return 'GIF';
    return '';
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-between px-6">
        <motion.div style={{ opacity: leftActionOpacity }} className="text-rose-400 text-sm">
          Supprimer
        </motion.div>
        <motion.div style={{ opacity: rightActionOpacity }} className="text-amber-300 text-sm">
          Favori
        </motion.div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -120, right: 120 }}
        dragElastic={0.2}
        style={{ x }}
        onDragEnd={handleDragEnd}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
        onClick={onClick}
        className={cn(
          'relative cursor-pointer rounded-2xl glass-panel border border-white/10 px-4 py-4',
          conversation.unreadCount > 0 && 'border-white/20'
        )}
      >
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <img
              src={conversation.matchAvatar}
              alt={conversation.matchName}
              className="w-12 h-12 rounded-full object-cover"
            />
            {conversation.unreadCount > 0 && (
              <span className="absolute -right-1 -bottom-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-[#0b0f1a]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white truncate">
                {conversation.matchName}
              </h3>
              <span className="text-xs text-white/50">
                {formatDistanceToNow(conversation.lastMessage.timestamp, { locale: fr, addSuffix: false })}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              {conversation.lastMessage.sender === 'me' && (
                <CheckCheck
                  className={cn(
                    'w-4 h-4 flex-shrink-0',
                    conversation.lastMessage.status === 'seen' ? 'text-sky-300' : 'text-white/40'
                  )}
                />
              )}
              <p className="text-sm text-white/80 truncate">{getMessagePreview()}</p>
            </div>

            {conversation.lastMessage.translated?.text && (
              <p className="text-xs text-white/50 truncate mt-1">
                {conversation.lastMessage.translated.text}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
