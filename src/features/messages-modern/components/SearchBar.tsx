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
    <div className="glass-surface border-b border-white/10">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Rechercher un prénom, une ville, un message"
            className={cn(
              'w-full pl-11 pr-20 py-3 rounded-2xl',
              'bg-white/5 text-white placeholder-white/40',
              'border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/40',
              'transition-all duration-200'
            )}
          />

          {value && (
            <button
              onClick={() => onChange('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-3 h-3 text-white/70" />
            </button>
          )}

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              showFilters
                ? 'bg-gradient-to-br from-[#ff4d6d] to-[#ff8b5a] text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {showFilters && (
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => onFilterChange(f.id)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200',
                  filter === f.id
                    ? 'bg-white text-black shadow-sm'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
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
