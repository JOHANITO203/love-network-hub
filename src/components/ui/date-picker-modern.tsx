/**
 * МойDate - Modern Intuitive Date Picker
 * Wheel-style date picker for better UX on mobile and desktop
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface DatePickerModernProps {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1950;
const MAX_YEAR = CURRENT_YEAR - 18; // Must be 18+ for dating app

export const DatePickerModern: React.FC<DatePickerModernProps> = ({
  value,
  onChange,
  label = 'Date of birth',
  placeholder = 'Select your birth date',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(value?.getDate() || 15);
  const [selectedMonth, setSelectedMonth] = useState(value?.getMonth() || 0);
  const [selectedYear, setSelectedYear] = useState(value?.getFullYear() || MAX_YEAR - 7);

  const dayRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  // Generate arrays
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MAX_YEAR - i);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInSelectedMonth = getDaysInMonth(selectedMonth, selectedYear);
  const validDays = days.filter(d => d <= daysInSelectedMonth);

  // Adjust day if invalid for selected month
  useEffect(() => {
    if (selectedDay > daysInSelectedMonth) {
      setSelectedDay(daysInSelectedMonth);
    }
  }, [selectedMonth, selectedYear, selectedDay, daysInSelectedMonth]);

  const handleConfirm = () => {
    const date = new Date(selectedYear, selectedMonth, selectedDay);
    onChange(date);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedDay(15);
    setSelectedMonth(0);
    setSelectedYear(MAX_YEAR - 7);
  };

  const formatDate = (date?: Date) => {
    if (!date) return placeholder;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Scroll wheel component
  const ScrollWheel = ({
    items,
    selected,
    onSelect,
    type
  }: {
    items: (string | number)[],
    selected: number,
    onSelect: (val: number) => void,
    type: 'day' | 'month' | 'year'
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = (index: number) => {
      if (type === 'month') {
        onSelect(index);
      } else {
        onSelect(items[index] as number);
      }
    };

    return (
      <div className="flex-1 h-64 overflow-y-auto scrollbar-hide relative">
        <div
          ref={containerRef}
          className="py-24"
        >
          {items.map((item, index) => {
            const isSelected = type === 'month'
              ? selected === index
              : selected === item;

            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleScroll(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "w-full py-3 px-4 text-center transition-all duration-200",
                  isSelected
                    ? "text-2xl font-bold bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg shadow-md"
                    : "text-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {item}
              </motion.button>
            );
          })}
        </div>

        {/* Selection indicator lines */}
        <div className="absolute inset-y-0 left-0 right-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-12 border-t-2 border-b-2 border-pink-300/30 dark:border-pink-600/30" />
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full h-12 px-4 flex items-center justify-between",
          "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700",
          "rounded-xl transition-all duration-200",
          "hover:border-pink-400 dark:hover:border-pink-600",
          "focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent",
          !value && "text-gray-400 dark:text-gray-500"
        )}
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-pink-500" />
          <span className="text-base">
            {formatDate(value)}
          </span>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto"
            >
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">
                    Select your birth date
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Date Wheels */}
                <div className="px-6 py-6">
                  <div className="flex gap-4">
                    {/* Day */}
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-center mb-2 text-gray-600 dark:text-gray-400">
                        Day
                      </div>
                      <ScrollWheel
                        items={validDays}
                        selected={selectedDay}
                        onSelect={setSelectedDay}
                        type="day"
                      />
                    </div>

                    {/* Month */}
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-center mb-2 text-gray-600 dark:text-gray-400">
                        Month
                      </div>
                      <ScrollWheel
                        items={MONTHS}
                        selected={selectedMonth}
                        onSelect={setSelectedMonth}
                        type="month"
                      />
                    </div>

                    {/* Year */}
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-center mb-2 text-gray-600 dark:text-gray-400">
                        Year
                      </div>
                      <ScrollWheel
                        items={years}
                        selected={selectedYear}
                        onSelect={setSelectedYear}
                        type="year"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirm}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg"
                  >
                    Confirm
                  </Button>
                </div>

                {/* Preview */}
                <div className="px-6 pb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Selected date:
                    </p>
                    <p className="text-lg font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                      {MONTHS[selectedMonth]} {selectedDay}, {selectedYear}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Age: {CURRENT_YEAR - selectedYear} years old
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add custom scrollbar hiding */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
