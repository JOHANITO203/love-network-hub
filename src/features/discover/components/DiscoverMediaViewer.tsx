import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Sparkles, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DiscoverMediaViewerProps {
  media: string[];
  name: string;
  subtitle?: string;
  locationLabel?: string;
  distanceLabel?: string;
  onClose: () => void;
  initialIndex?: number;
  onLike?: () => void;
  onSuperlike?: () => void;
}

export const DiscoverMediaViewer = ({
  media,
  name,
  subtitle,
  locationLabel,
  distanceLabel,
  onClose,
  initialIndex = 0,
  onLike,
  onSuperlike,
}: DiscoverMediaViewerProps) => {
  const { toast } = useToast();
  const [index, setIndex] = useState(initialIndex);

  const assets = useMemo(() => (media.length > 0 ? media : fallbackMedia), [media]);
  const total = assets.length;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') goNext();
      if (event.key === 'ArrowLeft') goPrevious();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const goNext = () => {
    setIndex((current) => (current + 1) % total);
  };

  const goPrevious = () => {
    setIndex((current) => (current - 1 + total) % total);
  };

  const handleLike = () => {
    onLike?.();
    toast({ title: 'Like envoyé', description: `Ton like est noté pour ${name}.` });
  };

  const handleSuperlike = () => {
    onSuperlike?.();
    toast({ title: 'Superlike envoyé', description: `Un superlike pour ${name}. Bonne chance !` });
  };

  const currentMedia = assets[index];

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/90'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />

        <motion.button
          type='button'
          onClick={onClose}
          className='absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60'
          whileTap={{ scale: 0.9 }}
          aria-label='Fermer'
        >
          <X className='h-5 w-5' />
        </motion.button>

        <motion.button
          type='button'
          onClick={goPrevious}
          className='absolute left-6 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:flex'
          whileTap={{ scale: 0.9 }}
          aria-label='Média précédent'
        >
          ‹
        </motion.button>

        <motion.button
          type='button'
          onClick={goNext}
          className='absolute right-6 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:flex'
          whileTap={{ scale: 0.9 }}
          aria-label='Média suivant'
        >
          ›
        </motion.button>

        <motion.div
          key={currentMedia}
          className='relative flex w-full max-w-4xl flex-col gap-6 px-4 text-white'
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
        >
          <div className='relative overflow-hidden rounded-[40px] border border-white/10 shadow-[0_60px_120px_rgba(0,0,0,0.45)]'>
            <img src={currentMedia} alt={`${name} media ${index + 1}`} className='max-h-[70vh] w-full object-cover' />

            <div className='absolute left-6 top-6 flex items-center gap-3 rounded-full bg-black/35 px-4 py-2 text-sm font-medium backdrop-blur'>
              <MapPin className='h-4 w-4' />
              <span>{locationLabel ?? 'Paris, France'}</span>
              {distanceLabel ? <span className='text-white/70'>• {distanceLabel}</span> : null}
            </div>

            <div className='absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/35 px-4 py-1 text-xs font-medium backdrop-blur'>
              {Array.from({ length: total }).map((_, dotIndex) => (
                <span
                  key={dotIndex}
                  className={dotIndex === index ? 'h-[6px] w-6 rounded-full bg-white' : 'h-[6px] w-6 rounded-full bg-white/30'}
                />
              ))}
            </div>
          </div>

          <motion.div
            className='flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/10 p-6 backdrop-blur'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
              <div>
                <h2 className='text-2xl font-semibold'>{name}</h2>
                {subtitle ? <p className='text-sm text-white/70'>{subtitle}</p> : null}
              </div>
              <div className='flex gap-3'>
                <Button
                  size='sm'
                  variant='outline'
                  className='border-white/30 text-white hover:border-white hover:bg-white/10'
                  onClick={handleLike}
                >
                  <Heart className='mr-2 h-4 w-4' /> Like
                </Button>
                <Button
                  size='sm'
                  className='bg-gradient-moydate text-white shadow-love hover:opacity-90'
                  onClick={handleSuperlike}
                >
                  <Sparkles className='mr-2 h-4 w-4' /> Superlike
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  className='border-white/30 text-white hover:border-white hover:bg-white/10'
                  onClick={() => toast({ title: 'Partage simulé', description: 'Capture envoyée aux BFF (en théorie).' })}
                >
                  <Share2 className='mr-2 h-4 w-4' /> Partager
                </Button>
              </div>
            </div>
            <p className='text-sm text-white/80'>Swipe left or right to choose. Ici, tu peux zoomer et décider si {name.split(' ')[0] ?? 'ce profil'} mérite ton superlike légendaire.</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const fallbackMedia = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
];
