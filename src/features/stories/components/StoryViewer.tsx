import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryHeader } from "./StoryHeader";
import { StoryFooter } from "./StoryFooter";
import { StorySlide } from "../data";

interface StoryViewerProps {
  slides: StorySlide[];
  onClose: () => void;
}

export const StoryViewer = ({ slides, onClose }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = slides[currentIndex];
  const duration = currentSlide?.duration ?? 5;

  useEffect(() => {
    if (!currentSlide) return;

    setProgress(0);
    intervalRef.current && clearInterval(intervalRef.current);

    const startTime = performance.now();
    const step = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      const value = Math.min(elapsed / duration, 1);
      setProgress(value);
      if (value < 1) {
        intervalRef.current = setTimeout(step, 16);
      } else {
        goNext();
      }
    };

    intervalRef.current = setTimeout(step, 16);

    return () => {
      intervalRef.current && clearTimeout(intervalRef.current);
    };
  }, [currentIndex, currentSlide, duration]);

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      onClose();
    }
  };

  if (!currentSlide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <button type="button" onClick={goPrevious} className="absolute inset-y-0 left-0 w-1/4" aria-label="Previous story" />
      <button type="button" onClick={goNext} className="absolute inset-y-0 right-0 w-1/4" aria-label="Next story" />

      <div className="relative h-full max-h-[812px] w-full max-w-[375px] overflow-hidden rounded-[36px] bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide.id}
            src={currentSlide.mediaUrl}
            alt={currentSlide.user.name}
            initial={{ opacity: 0.2, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>

        <StoryHeader
          name={currentSlide.user.name}
          avatar={currentSlide.user.avatar}
          progress={progress}
          onClose={onClose}
        />

        <StoryFooter onSendMessage={(value) => } />
      </div>
    </div>
  );
};
