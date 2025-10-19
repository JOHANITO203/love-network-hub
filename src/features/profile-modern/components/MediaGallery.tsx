/**
 * МойDate - Media Gallery Component
 * Photos and videos with upload/delete/reorder
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Star, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProfileMedia } from '../types';
import { useState } from 'react';

interface MediaGalleryProps {
  media: ProfileMedia[];
  mainPhotoIndex: number;
  canEdit?: boolean;
  onAdd?: () => void;
  onRemove?: (mediaId: string) => void;
  onSetMain?: (index: number) => void;
}

export const MediaGallery = ({
  media,
  mainPhotoIndex,
  canEdit = true,
  onAdd,
  onRemove,
  onSetMain,
}: MediaGalleryProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxMedia = 10;
  const canAddMore = media.length < maxMedia;

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl p-6 border border-border/50 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Photos & Vidéos</h2>
        <span className="text-sm text-muted-foreground">
          {media.length}/{maxMedia}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {media.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 group cursor-pointer"
            >
              {/* Image/Video */}
              <img
                src={item.type === 'video' ? item.thumbnail : item.url}
                alt={`Media ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Video Indicator */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-8 h-8 text-white" fill="white" />
                  {item.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {item.duration}s
                    </span>
                  )}
                </div>
              )}

              {/* Main Photo Star */}
              {index === mainPhotoIndex && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Star className="w-4 h-4 text-white" fill="white" />
                </motion.div>
              )}

              {/* Hover Actions */}
              {canEdit && hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  {index !== mainPhotoIndex && onSetMain && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSetMain(index)}
                      className="text-white hover:bg-white/20"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}

                  {onRemove && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemove(item.id)}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}

          {/* Add Button */}
          {canEdit && canAddMore && onAdd && (
            <motion.button
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAdd}
              className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-love-primary dark:hover:border-love-primary transition-colors"
            >
              <Plus className="w-8 h-8 text-gray-400 dark:text-gray-600" />
              <span className="text-xs text-muted-foreground">Ajouter</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Tips */}
      {canEdit && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-xs text-muted-foreground text-center"
        >
          💡 Ajoute une vidéo courte (≤15s) pour +34% de superlikes
        </motion.p>
      )}
    </div>
  );
};
