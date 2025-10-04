import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface AdvancedFilters {
  // Basic filters
  min_age: number;
  max_age: number;
  max_distance_km: number;

  // Education & Career
  education_level: string[];
  profession_category: string[];
  income_range?: string;

  // Relationship
  relationship_type: string[];

  // Lifestyle
  lifestyle_smoking: string;
  lifestyle_drinking: string;
  lifestyle_exercise: string;
  lifestyle_diet: string;

  // Family & Personal
  family_plans: string;
  pets: string;
  religion?: string;
  languages: string[];

  // Physical
  height_range_min?: number;
  height_range_max?: number;

  // Preferences
  last_active_within: string; // interval as string
  verified_only: boolean;
  with_photos_only: boolean;
  dealbreakers: string[];
}

export interface FilterOption {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

export interface FilterOptions {
  education_levels: FilterOption[];
  profession_categories: FilterOption[];
  personality_traits: FilterOption[];
}

export interface FilteredMatch {
  profile_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  age: number;
  bio: string;
  location: string;
  profession: string;
  education_level: string;
  lifestyle_smoking: string;
  lifestyle_drinking: string;
  lifestyle_exercise: string;
  height: number;
  astrological_sign: string;
  interests: string[];
  personality_traits: string[];
  profile_images: string[];
  distance_km: number;
  compatibility_score: number;
  filter_match_score: number;
  profile_completion_score: number;
  last_active: string;
  is_verified: boolean;
}

const DEFAULT_FILTERS: AdvancedFilters = {
  min_age: 18,
  max_age: 50,
  max_distance_km: 50,
  education_level: [],
  profession_category: [],
  relationship_type: ['serious', 'casual'],
  lifestyle_smoking: 'no_preference',
  lifestyle_drinking: 'no_preference',
  lifestyle_exercise: 'no_preference',
  lifestyle_diet: 'no_preference',
  family_plans: 'no_preference',
  pets: 'no_preference',
  languages: [],
  last_active_within: '30 days',
  verified_only: false,
  with_photos_only: true,
  dealbreakers: [],
};

export const useAdvancedFilters = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [filters, setFilters] = useState<AdvancedFilters>(DEFAULT_FILTERS);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    education_levels: [],
    profession_categories: [],
    personality_traits: [],
  });
  const [filteredMatches, setFilteredMatches] = useState<FilteredMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Load filter options (static data)
  const loadFilterOptions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('filter_options')
        .select('category, options');

      if (error) throw error;

      const options: FilterOptions = {
        education_levels: [],
        profession_categories: [],
        personality_traits: [],
      };

      data?.forEach(item => {
        if (item.category === 'education_levels') {
          options.education_levels = item.options;
        } else if (item.category === 'profession_categories') {
          options.profession_categories = item.options;
        } else if (item.category === 'personality_traits') {
          options.personality_traits = item.options;
        }
      });

      setFilterOptions(options);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  }, []);

  // Load user's current filters
  const loadUserFilters = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFilters({
          min_age: data.min_age ?? DEFAULT_FILTERS.min_age,
          max_age: data.max_age ?? DEFAULT_FILTERS.max_age,
          max_distance_km: data.max_distance_km ?? DEFAULT_FILTERS.max_distance_km,
          education_level: data.education_level ?? DEFAULT_FILTERS.education_level,
          profession_category: data.profession_category ?? DEFAULT_FILTERS.profession_category,
          income_range: data.income_range,
          relationship_type: data.relationship_type ?? DEFAULT_FILTERS.relationship_type,
          lifestyle_smoking: data.lifestyle_smoking ?? DEFAULT_FILTERS.lifestyle_smoking,
          lifestyle_drinking: data.lifestyle_drinking ?? DEFAULT_FILTERS.lifestyle_drinking,
          lifestyle_exercise: data.lifestyle_exercise ?? DEFAULT_FILTERS.lifestyle_exercise,
          lifestyle_diet: data.lifestyle_diet ?? DEFAULT_FILTERS.lifestyle_diet,
          family_plans: data.family_plans ?? DEFAULT_FILTERS.family_plans,
          pets: data.pets ?? DEFAULT_FILTERS.pets,
          religion: data.religion,
          languages: data.languages ?? DEFAULT_FILTERS.languages,
          height_range_min: data.height_range_min,
          height_range_max: data.height_range_max,
          last_active_within: data.last_active_within ?? DEFAULT_FILTERS.last_active_within,
          verified_only: data.verified_only ?? DEFAULT_FILTERS.verified_only,
          with_photos_only: data.with_photos_only ?? DEFAULT_FILTERS.with_photos_only,
          dealbreakers: data.dealbreakers ?? DEFAULT_FILTERS.dealbreakers,
        });
      }
    } catch (error) {
      console.error('Error loading user filters:', error);
    }
  }, [user]);

  // Count active filters (non-default values)
  const countActiveFilters = useCallback((currentFilters: AdvancedFilters) => {
    let count = 0;

    // Age filters (always active if different from defaults)
    if (currentFilters.min_age !== DEFAULT_FILTERS.min_age) count++;
    if (currentFilters.max_age !== DEFAULT_FILTERS.max_age) count++;
    if (currentFilters.max_distance_km !== DEFAULT_FILTERS.max_distance_km) count++;

    // Array filters
    if (currentFilters.education_level.length > 0) count++;
    if (currentFilters.profession_category.length > 0) count++;
    if (currentFilters.languages.length > 0) count++;
    if (currentFilters.dealbreakers.length > 0) count++;

    // String filters (non-default values)
    if (currentFilters.lifestyle_smoking !== 'no_preference') count++;
    if (currentFilters.lifestyle_drinking !== 'no_preference') count++;
    if (currentFilters.lifestyle_exercise !== 'no_preference') count++;
    if (currentFilters.lifestyle_diet !== 'no_preference') count++;
    if (currentFilters.family_plans !== 'no_preference') count++;
    if (currentFilters.pets !== 'no_preference') count++;

    // Optional filters
    if (currentFilters.income_range) count++;
    if (currentFilters.religion) count++;
    if (currentFilters.height_range_min) count++;
    if (currentFilters.height_range_max) count++;

    // Boolean filters
    if (currentFilters.verified_only) count++;
    if (!currentFilters.with_photos_only) count++;

    // Time filter
    if (currentFilters.last_active_within !== '30 days') count++;

    setActiveFilterCount(count);
    return count;
  }, []);

  // Update filters locally
  const updateFilters = useCallback((updates: Partial<AdvancedFilters>) => {
    setFilters(prev => {
      const newFilters = { ...prev, ...updates };
      countActiveFilters(newFilters);
      return newFilters;
    });
  }, [countActiveFilters]);

  // Save filters to database
  const saveFilters = useCallback(async (filtersToSave?: AdvancedFilters) => {
    if (!user) return false;

    const currentFilters = filtersToSave || filters;

    setSaving(true);
    try {
      const { error } = await supabase.rpc('update_user_filters', {
        filters: currentFilters
      });

      if (error) throw error;

      toast({
        title: "Filtres sauvegardés",
        description: "Vos préférences de matching ont été mises à jour.",
      });

      return true;
    } catch (error) {
      console.error('Error saving filters:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les filtres.",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, filters, toast]);

  // Get filtered matches
  const getFilteredMatches = useCallback(async (
    limit: number = 20,
    strictFilters: boolean = true
  ) => {
    if (!user) return [];

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_filtered_matches', {
        limit_count: limit,
        apply_strict_filters: strictFilters
      });

      if (error) throw error;

      setFilteredMatches(data || []);
      return data || [];
    } catch (error) {
      console.error('Error getting filtered matches:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les profils correspondants.",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Reset filters to defaults
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    countActiveFilters(DEFAULT_FILTERS);
  }, [countActiveFilters]);

  // Get filter summary text
  const getFilterSummary = useCallback(() => {
    const summaryParts: string[] = [];

    if (filters.min_age !== DEFAULT_FILTERS.min_age || filters.max_age !== DEFAULT_FILTERS.max_age) {
      summaryParts.push(`${filters.min_age}-${filters.max_age} ans`);
    }

    if (filters.max_distance_km !== DEFAULT_FILTERS.max_distance_km) {
      summaryParts.push(`Dans ${filters.max_distance_km}km`);
    }

    if (filters.education_level.length > 0) {
      const educationNames = filters.education_level
        .map(id => filterOptions.education_levels.find(opt => opt.id === id)?.name)
        .filter(Boolean);
      if (educationNames.length > 0) {
        summaryParts.push(`Éducation: ${educationNames.join(', ')}`);
      }
    }

    if (filters.lifestyle_smoking !== 'no_preference') {
      const smokingMap: Record<string, string> = {
        never: 'Non-fumeur',
        sometimes: 'Fumeur occasionnel',
        regularly: 'Fumeur régulier'
      };
      summaryParts.push(smokingMap[filters.lifestyle_smoking] || filters.lifestyle_smoking);
    }

    if (filters.verified_only) {
      summaryParts.push('Profils vérifiés uniquement');
    }

    return summaryParts.length > 0 ? summaryParts.join(' • ') : 'Aucun filtre actif';
  }, [filters, filterOptions]);

  // Preset filter combinations
  const applyPreset = useCallback((preset: 'serious' | 'casual' | 'nearby' | 'verified') => {
    let presetFilters: Partial<AdvancedFilters> = {};

    switch (preset) {
      case 'serious':
        presetFilters = {
          relationship_type: ['serious'],
          education_level: ['bachelor', 'master', 'doctorate'],
          family_plans: 'want_children',
          verified_only: true,
          min_age: 25,
          max_age: 45,
        };
        break;

      case 'casual':
        presetFilters = {
          relationship_type: ['casual'],
          min_age: 18,
          max_age: 35,
          last_active_within: '7 days',
        };
        break;

      case 'nearby':
        presetFilters = {
          max_distance_km: 10,
          last_active_within: '3 days',
        };
        break;

      case 'verified':
        presetFilters = {
          verified_only: true,
          with_photos_only: true,
          lifestyle_smoking: 'never',
        };
        break;
    }

    updateFilters(presetFilters);
  }, [updateFilters]);

  // Initialize
  useEffect(() => {
    loadFilterOptions();
  }, [loadFilterOptions]);

  useEffect(() => {
    if (user) {
      loadUserFilters();
    }
  }, [user, loadUserFilters]);

  useEffect(() => {
    countActiveFilters(filters);
  }, [filters, countActiveFilters]);

  return {
    filters,
    filterOptions,
    filteredMatches,
    loading,
    saving,
    activeFilterCount,
    updateFilters,
    saveFilters,
    getFilteredMatches,
    resetFilters,
    getFilterSummary,
    applyPreset,
    loadUserFilters,
  };
};