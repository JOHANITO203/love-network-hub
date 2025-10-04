import { useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  X,
  MoreHorizontal,
  Shield,
  Camera,
  Expand
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProfilePhoto } from '@/hooks/useProfilePhotos';

interface PhotoCarouselProps {
  photos: ProfilePhoto[];
  className?: string;
  showControls?: boolean;
  showIndicators?: boolean;
  showVerificationBadge?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onPhotoChange?: (index: number) => void;
  onLike?: () => void;
  onPass?: () => void;
  onExpand?: (photoIndex: number) => void;
  size?: 'small' | 'medium' | 'large';
  aspectRatio?: 'square' | 'portrait' | 'auto';
}

export const PhotoCarousel = ({
  photos,
  className,
  showControls = true,
  showIndicators = true,
  showVerificationBadge = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  onPhotoChange,
  onLike,
  onPass,
  onExpand,
  size = 'medium',
  aspectRatio = 'portrait'
}: PhotoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Filter active photos and sort by display order
  const activePhotos = photos
    .filter(photo => photo.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  const hasPhotos = activePhotos.length > 0;
  const currentPhoto = hasPhotos ? activePhotos[currentIndex] : null;

  // Size configurations
  const sizeClasses = {
    small: 'w-32 h-40',
    medium: 'w-80 h-96',
    large: 'w-96 h-[30rem]'
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    auto: ''
  };

  // Navigation functions
  const goToNext = useCallback(() => {
    if (activePhotos.length > 1) {
      const nextIndex = (currentIndex + 1) % activePhotos.length;
      setCurrentIndex(nextIndex);
      onPhotoChange?.(nextIndex);
    }
  }, [currentIndex, activePhotos.length, onPhotoChange]);

  const goToPrevious = useCallback(() => {
    if (activePhotos.length > 1) {
      const prevIndex = currentIndex === 0 ? activePhotos.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIndex);
      onPhotoChange?.(prevIndex);
    }
  }, [currentIndex, activePhotos.length, onPhotoChange]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < activePhotos.length) {
      setCurrentIndex(index);
      onPhotoChange?.(index);
    }
  }, [activePhotos.length, onPhotoChange]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || activePhotos.length <= 1) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, goToNext, activePhotos.length]);

  // Preload images
  useEffect(() => {
    if (!hasPhotos) return;

    const preloadImage = (src: string, index: number) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set(prev.add(index)));
        if (index === 0) setIsLoading(false);
      };
      img.onerror = () => {
        if (index === 0) setIsLoading(false);
      };
      img.src = src;
    };

    // Preload current and next few images
    const indicesToPreload = [
      currentIndex,
      (currentIndex + 1) % activePhotos.length,
      currentIndex === 0 ? activePhotos.length - 1 : currentIndex - 1
    ];

    indicesToPreload.forEach(index => {
      if (index < activePhotos.length && !loadedImages.has(index)) {
        preloadImage(activePhotos[index].file_path, index);
      }
    });
  }, [currentIndex, activePhotos, hasPhotos, loadedImages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  // Handle empty photos
  if (!hasPhotos) {
    return (
      <Card className={cn(
        'relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200',
        sizeClasses[size],
        aspectRatio !== 'auto' && aspectRatioClasses[aspectRatio],
        className
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Aucune photo</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'relative overflow-hidden group',
      sizeClasses[size],
      aspectRatio !== 'auto' && aspectRatioClasses[aspectRatio],
      className
    )}>
      {/* Main Image */}
      <div className="relative w-full h-full">
        {currentPhoto && (
          <>
            {/* Loading placeholder */}
            {isLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}

            {/* Main image */}
            <img
              src={currentPhoto.file_path}
              alt={`Photo ${currentIndex + 1}`}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                isLoading || !loadedImages.has(currentIndex) ? "opacity-0" : "opacity-100"
              )}
              draggable={false}
            />

            {/* Verification badge */}
            {showVerificationBadge && currentPhoto.is_verified && (
              <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
                <Shield className="w-3 h-3 mr-1" />
                Vérifié
              </Badge>
            )}

            {/* Photo count indicator */}
            {activePhotos.length > 1 && (
              <Badge variant="secondary" className="absolute top-2 right-2 bg-black/50 text-white">
                {currentIndex + 1}/{activePhotos.length}
              </Badge>
            )}

            {/* Expand button */}
            {onExpand && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute bottom-2 right-2 bg-black/50 text-white hover:bg-black/70"
                onClick={() => onExpand(currentIndex)}
              >
                <Expand className="w-4 h-4" />
              </Button>
            )}
          </>
        )}

        {/* Navigation Controls */}
        {showControls && activePhotos.length > 1 && (
          <>
            {/* Previous button */}
            <Button
              size="sm"
              variant="ghost"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Next button */}
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToNext}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* Click areas for navigation */}
            <div
              className="absolute left-0 top-0 w-1/3 h-full cursor-pointer"
              onClick={goToPrevious}
            />
            <div
              className="absolute right-0 top-0 w-1/3 h-full cursor-pointer"
              onClick={goToNext}
            />
          </>
        )}

        {/* Action buttons (like/pass) */}
        {(onLike || onPass) && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {onPass && (
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-14 h-14 bg-white/90 hover:bg-white border-2 border-gray-300 hover:border-red-300"
                onClick={onPass}
              >
                <X className="w-6 h-6 text-gray-600" />
              </Button>
            )}
            {onLike && (
              <Button
                size="lg"
                className="rounded-full w-14 h-14 bg-gradient-primary hover:opacity-90"
                onClick={onLike}
              >
                <Heart className="w-6 h-6 text-white fill-current" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Photo Indicators */}
      {showIndicators && activePhotos.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {activePhotos.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              )}
              onClick={() => goToIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Gradient overlay for better text visibility */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
    </Card>
  );
};

// Fullscreen photo viewer component
interface PhotoViewerProps {
  photos: ProfilePhoto[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoViewer = ({ photos, initialIndex = 0, isOpen, onClose }: PhotoViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const activePhotos = photos
    .filter(photo => photo.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  const currentPhoto = activePhotos[currentIndex];

  const goToNext = useCallback(() => {
    if (activePhotos.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % activePhotos.length);
    }
  }, [activePhotos.length]);

  const goToPrevious = useCallback(() => {
    if (activePhotos.length > 1) {
      setCurrentIndex((prev) => prev === 0 ? activePhotos.length - 1 : prev - 1);
    }
  }, [activePhotos.length]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrevious]);

  // Reset index when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </Button>

      {/* Photo count */}
      {activePhotos.length > 1 && (
        <Badge variant="secondary" className="absolute top-4 left-4 bg-black/50 text-white z-10">
          {currentIndex + 1} / {activePhotos.length}
        </Badge>
      )}

      {/* Main image */}
      <img
        src={currentPhoto.file_path}
        alt={`Photo ${currentIndex + 1}`}
        className="max-w-full max-h-full object-contain"
        onClick={onClose}
      />

      {/* Navigation */}
      {activePhotos.length > 1 && (
        <>
          <Button
            size="lg"
            variant="ghost"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={goToNext}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </>
      )}

      {/* Photo indicators */}
      {activePhotos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {activePhotos.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-200",
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};