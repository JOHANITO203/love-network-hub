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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Filters
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content - FIXED HEIGHT */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Gender Filter */}
              <div>
                <Label className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">
                  Show me
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'all' as const, label: 'Everyone' },
                    { value: 'male' as const, label: 'Men' },
                    { value: 'female' as const, label: 'Women' },
                    { value: 'non-binary' as const, label: 'Non-binary' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleGenderChange(option.value)}
                      className={cn(
                        "px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200",
                        filters.gender === option.value
                          ? "border-primary bg-primary text-primary-foreground shadow-md"
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary/50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Maximum Distance
                  </Label>
                  <span className="text-sm font-medium text-primary">
                    {filters.distance.max} km
                  </span>
                </div>
                <Slider
                  value={[filters.distance.max]}
                  onValueChange={handleDistanceChange}
                  min={10}
                  max={200}
                  step={5}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>10 km</span>
                  <span>200 km</span>
                </div>
              </div>

              {/* Age Range Filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Age Range
                  </Label>
                  <span className="text-sm font-medium text-primary">
                    {filters.ageRange.min} - {filters.ageRange.max} years
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
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>18</span>
                  <span>70</span>
                </div>
              </div>

              {/* Verified Only */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex-1">
                  <Label
                    htmlFor="verified-only"
                    className="text-sm font-semibold text-gray-900 dark:text-white block mb-1 cursor-pointer"
                  >
                    Verified profiles only
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Show only profiles with verified badges
                  </p>
                </div>
                <Switch
                  id="verified-only"
                  checked={filters.verifiedOnly}
                  onCheckedChange={handleVerifiedToggle}
                />
              </div>

              {/* Active Filters Summary */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Active Filters
                </h3>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Gender: {filters.gender === 'all' ? 'Everyone' : filters.gender}</li>
                  <li>• Distance: up to {filters.distance.max} km</li>
                  <li>• Age: {filters.ageRange.min}-{filters.ageRange.max} years</li>
                  {filters.verifiedOnly && <li>• Verified profiles only</li>}
                </ul>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
              <Button
                onClick={onReset}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
              <Button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-primary to-pink-500"
                size="lg"
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
