/**
 * МойDate - SearchBar Component
 * Intelligent search bar with filters
 */

import { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { ConversationFilter } from '../types';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  filter: ConversationFilter;
  onFilterChange: (filter: ConversationFilter) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  filter,
  onFilterChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const filters: Array<{ id: ConversationFilter; label: string }> = [
    { id: 'all', label: 'Tous' },
    { id: 'unread', label: 'Non lus' },
    { id: 'favorites', label: 'Favoris' },
    { id: 'recent', label: 'Récents' },
  ];

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Rechercher par nom ou message..."
            className={cn(
              "w-full pl-10 pr-20 py-3 rounded-2xl",
              "bg-gray-100 dark:bg-gray-800",
              "border border-transparent",
              "text-gray-900 dark:text-white placeholder-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "transition-all duration-200"
            )}
          />

          {/* Clear Button */}
          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
              showFilters
                ? "bg-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => onFilterChange(f.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                  filter === f.id
                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-md"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
