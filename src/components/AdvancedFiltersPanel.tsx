import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Check, Sliders } from 'lucide-react';
import { AdvancedFilters } from '@/hooks/useAdvancedFilters';

interface AdvancedFiltersPanelProps {
  filters: AdvancedFilters;
  onFiltersChange: (filters: Partial<AdvancedFilters>) => void;
  onApply: () => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const EDUCATION_LEVELS = [
  { value: 'high_school', label: 'Lycée' },
  { value: 'bachelors', label: 'Licence/Bachelor' },
  { value: 'masters', label: 'Master' },
  { value: 'doctorate', label: 'Doctorat' },
  { value: 'professional', label: 'Formation professionnelle' },
];

const PROFESSION_CATEGORIES = [
  { value: 'tech', label: 'Tech/IT' },
  { value: 'business', label: 'Business' },
  { value: 'creative', label: 'Créatif' },
  { value: 'healthcare', label: 'Santé' },
  { value: 'education', label: 'Éducation' },
  { value: 'engineering', label: 'Ingénierie' },
  { value: 'finance', label: 'Finance' },
  { value: 'legal', label: 'Juridique' },
  { value: 'service', label: 'Services' },
  { value: 'other', label: 'Autre' },
];

const LIFESTYLE_OPTIONS = {
  smoking: [
    { value: 'no_preference', label: 'Pas de préférence' },
    { value: 'never', label: 'Jamais' },
    { value: 'socially', label: 'Socialement' },
    { value: 'regularly', label: 'Régulièrement' },
  ],
  drinking: [
    { value: 'no_preference', label: 'Pas de préférence' },
    { value: 'never', label: 'Jamais' },
    { value: 'socially', label: 'Socialement' },
    { value: 'regularly', label: 'Régulièrement' },
  ],
  exercise: [
    { value: 'no_preference', label: 'Pas de préférence' },
    { value: 'never', label: 'Jamais' },
    { value: 'sometimes', label: 'Parfois' },
    { value: 'regularly', label: 'Régulièrement' },
    { value: 'daily', label: 'Quotidien' },
  ],
};

export const AdvancedFiltersPanel = ({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  isOpen,
  onClose,
}: AdvancedFiltersPanelProps) => {
  if (!isOpen) return null;

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(v => v !== value)
      : [...array, value];
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sliders className="w-5 h-5" />
            Filtres avancés
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Age Range */}
          <div className="space-y-2">
            <Label>Âge: {filters.min_age} - {filters.max_age} ans</Label>
            <div className="flex gap-4">
              <Slider
                value={[filters.min_age, filters.max_age]}
                onValueChange={([min, max]) =>
                  onFiltersChange({ min_age: min, max_age: max })
                }
                min={18}
                max={80}
                step={1}
              />
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-2">
            <Label>Distance maximale: {filters.max_distance_km} km</Label>
            <Slider
              value={[filters.max_distance_km]}
              onValueChange={([value]) =>
                onFiltersChange({ max_distance_km: value })
              }
              min={5}
              max={200}
              step={5}
            />
          </div>

          {/* Education Level */}
          <div className="space-y-2">
            <Label>Niveau d'éducation</Label>
            <div className="flex flex-wrap gap-2">
              {EDUCATION_LEVELS.map((level) => (
                <Badge
                  key={level.value}
                  variant={
                    filters.education_level.includes(level.value)
                      ? 'default'
                      : 'outline'
                  }
                  className="cursor-pointer"
                  onClick={() =>
                    onFiltersChange({
                      education_level: toggleArrayValue(
                        filters.education_level,
                        level.value
                      ),
                    })
                  }
                >
                  {level.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Profession Category */}
          <div className="space-y-2">
            <Label>Catégories professionnelles</Label>
            <div className="flex flex-wrap gap-2">
              {PROFESSION_CATEGORIES.map((category) => (
                <Badge
                  key={category.value}
                  variant={
                    filters.profession_category.includes(category.value)
                      ? 'default'
                      : 'outline'
                  }
                  className="cursor-pointer"
                  onClick={() =>
                    onFiltersChange({
                      profession_category: toggleArrayValue(
                        filters.profession_category,
                        category.value
                      ),
                    })
                  }
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Lifestyle Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tabac</Label>
              <Select
                value={filters.lifestyle_smoking}
                onValueChange={(value) =>
                  onFiltersChange({ lifestyle_smoking: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIFESTYLE_OPTIONS.smoking.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Alcool</Label>
              <Select
                value={filters.lifestyle_drinking}
                onValueChange={(value) =>
                  onFiltersChange({ lifestyle_drinking: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIFESTYLE_OPTIONS.drinking.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sport</Label>
              <Select
                value={filters.lifestyle_exercise}
                onValueChange={(value) =>
                  onFiltersChange({ lifestyle_exercise: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIFESTYLE_OPTIONS.exercise.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Verification & Photos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="verified-only">Profils vérifiés uniquement</Label>
              <Switch
                id="verified-only"
                checked={filters.verified_only}
                onCheckedChange={(checked) =>
                  onFiltersChange({ verified_only: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="photos-only">Avec photos uniquement</Label>
              <Switch
                id="photos-only"
                checked={filters.with_photos_only}
                onCheckedChange={(checked) =>
                  onFiltersChange({ with_photos_only: checked })
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={onReset} variant="outline" className="flex-1">
              Réinitialiser
            </Button>
            <Button onClick={onApply} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Appliquer les filtres
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
