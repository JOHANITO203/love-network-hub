/**
 * МойDate - UserPost Component
 * Standard user post with images and interactions
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Shield,
  MoreHorizontal,
} from 'lucide-react';
import { UserPost as UserPostType } from '../types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UserPostProps {
  post: UserPostType;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
}

export const UserPost: React.FC<UserPostProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onSave,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "mb-6 rounded-3xl overflow-hidden",
        "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md",
        "border border-gray-200/50 dark:border-gray-700/50",
        "shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]",
        "transition-shadow duration-300"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-800">
              <img
                src={post.userAvatar}
                alt={post.userName}
                className="w-full h-full object-cover"
              />
            </div>
            {post.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                <Shield className="w-3 h-3 text-white fill-current" />
              </div>
            )}
          </div>

          {/* Name & Time */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white font-display">
                {post.userName}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>
                {formatDistanceToNow(post.timestamp, {
                  locale: fr,
                  addSuffix: true,
                })}
              </span>
              {post.location && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{post.location}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* More Button */}
        <button className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="relative">
          <img
            src={post.images[currentImageIndex]}
            alt={`Post by ${post.userName}`}
            className="w-full aspect-square object-cover"
          />

          {/* Image Navigation Dots */}
          {post.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {post.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/75"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            {/* Like */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLike}
              className="flex items-center gap-2"
            >
              <Heart
                className={cn(
                  "w-6 h-6 transition-colors",
                  post.isLiked
                    ? "text-red-500 fill-current"
                    : "text-gray-600 dark:text-gray-400 hover:text-red-500"
                )}
              />
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {post.likes}
              </span>
            </motion.button>

            {/* Comment */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onComment}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-6 h-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {post.comments}
              </span>
            </motion.button>

            {/* Share */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-6 h-6 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {post.shares}
              </span>
            </motion.button>
          </div>

          {/* Save */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSave}
          >
            <Bookmark
              className={cn(
                "w-6 h-6 transition-colors",
                post.isSaved
                  ? "text-primary fill-current"
                  : "text-gray-600 dark:text-gray-400 hover:text-primary"
              )}
            />
          </motion.button>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
            <span className="font-bold mr-2">{post.userName}</span>
            {post.caption}
          </p>
        )}
      </div>
    </motion.div>
  );
};
