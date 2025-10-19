import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FiltersSheetProps {
  interestedIn: string;
  onInterestedInChange: (value: string) => void;
  distance: number;
  onDistanceChange: (value: number) => void;
  ageRange: [number, number];
  onAgeRangeChange: (range: [number, number]) => void;
  showOnlyVerified: boolean;
  onShowOnlyVerifiedChange: (value: boolean) => void;
  onClear: () => void;
  onApply: () => void;
}


const INTERESTED_IN_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'women', label: 'Femmes' },
  { value: 'men', label: 'Hommes' },
  { value: 'nonbinary', label: 'Non-binaire' },
];

const DISTANCE_MARKS = [10, 25, 50, 100, 200];

export const FiltersSheet = ({
  interestedIn,
  onInterestedInChange,
  distance,
  onDistanceChange,
  ageRange,
  onAgeRangeChange,
  showOnlyVerified,
  onShowOnlyVerifiedChange,
  onClear,
  onApply,
}: FiltersSheetProps) => {
  const ageSummary = useMemo(() => `${ageRange[0]} – ${ageRange[1]} ans`, [ageRange]);
  const distanceSummary = useMemo(() => `${distance} km`, [distance]);

  return (
    <motion.aside
      className='fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[420px] overflow-hidden rounded-t-[32px] border border-white/20 bg-white/95 shadow-[0_-24px_64px_rgba(17,17,17,0.25)] backdrop-blur'
      initial={{ y: '100%' }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
    >
      <div className='relative flex flex-col gap-6 px-6 pb-8 pt-6'>
        <div className='flex items-center justify-between'>
          <p className='text-xs font-semibold uppercase tracking-[0.3em] text-brand-red'>Filtres</p>
          <button
            type='button'
            className='text-xs font-semibold text-muted-foreground hover:text-brand-red'
            onClick={onClear}
          >
            Réinitialiser
          </button>
        </div>

        <section className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-[#1F1F33]'>Je veux rencontrer</h2>
            <Badge variant='secondary' className='bg-brand-red/10 text-brand-red'>
              {INTERESTED_IN_OPTIONS.find((option) => option.value === interestedIn)?.label}
            </Badge>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            {INTERESTED_IN_OPTIONS.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => onInterestedInChange(option.value)}
                className={cn(
                  'rounded-2xl border border-border/60 py-3 text-sm font-medium transition hover:border-brand-red hover:text-brand-red',
                  option.value === interestedIn && 'border-brand-red bg-brand-red/10 text-brand-red shadow-soft'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <Separator />

        <section className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-[#1F1F33]'>Distance</h2>
            <span className='text-sm font-semibold text-brand-red'>{distanceSummary}</span>
          </div>
          <Slider
            value={[distance]}
            min={10}
            max={200}
            step={5}
            onValueChange={(value) => onDistanceChange(value[0])}
            className='mx-2'
          />
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            {DISTANCE_MARKS.map((mark) => (
              <span key={mark}>{mark} km</span>
            ))}
          </div>
        </section>

        <Separator />

        <section className='space-y-5'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-[#1F1F33]'>Tranche d’âge</h2>
            <Badge variant='outline' className='border-brand-red/20 text-brand-red'>
              {ageSummary}
            </Badge>
          </div>
          <div className='space-y-4'>
            <div>
              <p className='text-sm font-medium text-[#1F1F33]'>Âge minimum : {ageRange[0]} ans</p>
              <Slider
                value={[ageRange[0]]}
                min={18}
                max={70}
                step={1}
                onValueChange={(value) => onAgeRangeChange([value[0], Math.max(value[0], ageRange[1])])}
                className='mt-2'
              />
            </div>
            <div>
              <p className='text-sm font-medium text-[#1F1F33]'>Âge maximum : {ageRange[1]} ans</p>
              <Slider
                value={[ageRange[1]]}
                min={18}
                max={70}
                step={1}
                onValueChange={(value) => onAgeRangeChange([Math.min(value[0], ageRange[0]), value[0]])}
                className='mt-2'
              />
            </div>
            <div className='rounded-2xl bg-muted/40 p-3 text-center text-sm text-muted-foreground'>
              Tu verras les profils entre
              <span className='ml-1 font-semibold text-brand-red'>{ageRange[0]}</span>

              et
              <span className='ml-1 font-semibold text-brand-red'>{ageRange[1]}</span> ans
            </div>
          </div>
        </section>

        <Separator />

        <section className='space-y-3'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-[#1F1F33]'>Options avancées</h2>
            <Badge variant='secondary' className='bg-brand-purple/10 text-brand-purple'>Pro tips</Badge>
          </div>
          <div className='flex items-center justify-between rounded-2xl border border-border/60 p-4'>
            <div>
              <p className='text-sm font-semibold text-[#1F1F33]'>Profils vérifiés uniquement</p>
              <p className='text-xs text-muted-foreground'>Moins de catfishes, plus de stories tea.</p>
            </div>
            <Switch checked={showOnlyVerified} onCheckedChange={onShowOnlyVerifiedChange} />
          </div>
        </section>

        <Separator />

        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            className='h-12 flex-1 border-brand-red/40 text-brand-red hover:border-brand-red hover:text-brand-red'
            onClick={onClear}
          >
            Effacer
          </Button>
          <Button
            className='h-12 flex-1 bg-gradient-moydate text-white shadow-love hover:opacity-90'
            onClick={onApply}
          >
            Appliquer les filtres
          </Button>
        </div>
      </div>
    </motion.aside>
  );
};
