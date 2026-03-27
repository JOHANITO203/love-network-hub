/**
 * МойDate - FiltersSidebar Component
 * Filters panel with all discovery options
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { DiscoverFilters } from '../types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface FiltersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: DiscoverFilters;
  onFiltersChange: (filters: DiscoverFilters) => void;
  onReset: () => void;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onReset,
}) => {
  const handleGenderChange = (gender: DiscoverFilters['gender']) => {
    onFiltersChange({ ...filters, gender });
  };

  const handleDistanceChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      distance: { ...filters.distance, max: values[0] },
    });
  };

  const handleAgeChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      ageRange: { min: values[0], max: values[1] },
    });
  };

  const handleVerifiedToggle = (checked: boolean) => {
    onFiltersChange({ ...filters, verifiedOnly: checked });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-surface shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-semibold text-white">Filtres</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white/80" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div>
                <Label className="text-sm font-semibold text-white mb-3 block">Je veux voir</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'all' as const, label: 'Tout le monde' },
                    { value: 'male' as const, label: 'Hommes' },
                    { value: 'female' as const, label: 'Femmes' },
                    { value: 'non-binary' as const, label: 'Non-binaire' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleGenderChange(option.value)}
                      className={cn(
                        'px-4 py-3 rounded-xl border font-medium transition-all duration-200',
                        filters.gender === option.value
                          ? 'border-primary bg-primary text-white shadow-md'
                          : 'border-white/10 text-white/70 hover:border-primary/50'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-semibold text-white">Distance max</Label>
                  <span className="text-sm font-medium text-primary">{filters.distance.max} km</span>
                </div>
                <Slider
                  value={[filters.distance.max]}
                  onValueChange={handleDistanceChange}
                  min={10}
                  max={200}
                  step={5}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>10 km</span>
                  <span>200 km</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-semibold text-white">Âge</Label>
                  <span className="text-sm font-medium text-primary">
                    {filters.ageRange.min} - {filters.ageRange.max} ans
                  </span>
                </div>
                <Slider
                  value={[filters.ageRange.min, filters.ageRange.max]}
                  onValueChange={handleAgeChange}
                  min={18}
                  max={70}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-white/40">
                  <span>18</span>
                  <span>70</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex-1">
                  <Label htmlFor="verified-only" className="text-sm font-semibold text-white block mb-1 cursor-pointer">
                    Profils vérifiés uniquement
                  </Label>
                  <p className="text-xs text-white/40">
                    Afficher seulement les profils vérifiés
                  </p>
                </div>
                <Switch
                  id="verified-only"
                  checked={filters.verifiedOnly}
                  onCheckedChange={handleVerifiedToggle}
                />
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-semibold text-white mb-2">Résumé</h3>
                <ul className="text-xs text-white/50 space-y-1">
                  <li>• Genre: {filters.gender === 'all' ? 'Tout le monde' : filters.gender}</li>
                  <li>• Distance: jusqu'à {filters.distance.max} km</li>
                  <li>• Âge: {filters.ageRange.min}-{filters.ageRange.max} ans</li>
                  {filters.verifiedOnly && <li>• Profils vérifiés uniquement</li>}
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 space-y-3">
              <Button onClick={onReset} variant="outline" className="w-full border-white/20 text-white" size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a]"
                size="lg"
              >
                Appliquer
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
