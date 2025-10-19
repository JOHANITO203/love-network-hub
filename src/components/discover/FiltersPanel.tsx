import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Check, Sliders, Globe } from 'lucide-react';
import { interests } from '@/data/profileOptions';

interface UserPreferences {
  user_id?: string;
  min_age: number;
  max_age: number;
  max_distance: number;
  interested_in: string[];
  preferred_interests?: string[];
  preferred_languages?: string[];
  preferred_origins?: string[];
}

interface FiltersPanelProps {
  preferences: UserPreferences | null;
  onApply: (preferences: Partial<UserPreferences>) => void;
  onClose: () => void;
}

const GENDERS = [
  { value: 'men', label: 'Hommes', icon: '♂️' },
  { value: 'women', label: 'Femmes', icon: '♀️' },
  { value: 'all', label: 'Tous', icon: '⚧️' },
];

const LANGUAGES = [
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'ru', label: 'Русский', flag: '🇷🇺' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  { value: 'pt', label: 'Português', flag: '🇵🇹' },
  { value: 'ar', label: 'العربية', flag: '🇸🇦' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
];

const ORIGINS = [
  { value: 'europe', label: 'Europe', flag: '🇪🇺' },
  { value: 'asia', label: 'Asie', flag: '🌏' },
  { value: 'africa', label: 'Afrique', flag: '🌍' },
  { value: 'americas', label: 'Amériques', flag: '🌎' },
  { value: 'oceania', label: 'Océanie', flag: '🌏' },
  { value: 'middle_east', label: 'Moyen-Orient', flag: '🕌' },
];

export const FiltersPanel = ({ preferences, onApply, onClose }: FiltersPanelProps) => {
  const [localPrefs, setLocalPrefs] = useState<Partial<UserPreferences>>({
    min_age: preferences?.min_age || 18,
    max_age: preferences?.max_age || 50,
    max_distance: preferences?.max_distance || 50,
    interested_in: preferences?.interested_in || ['all'],
    preferred_interests: preferences?.preferred_interests || [],
    preferred_languages: preferences?.preferred_languages || [],
    preferred_origins: preferences?.preferred_origins || [],
  });

  const [interculturalBoost, setInterculturalBoost] = useState(false);

  useEffect(() => {
    if (preferences) {
      setLocalPrefs({
        min_age: preferences.min_age || 18,
        max_age: preferences.max_age || 50,
        max_distance: preferences.max_distance || 50,
        interested_in: preferences.interested_in || ['all'],
        preferred_interests: preferences.preferred_interests || [],
        preferred_languages: preferences.preferred_languages || [],
        preferred_origins: preferences.preferred_origins || [],
      });
    }
  }, [preferences]);

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(v => v !== value)
      : [...array, value];
  };

  const handleClear = () => {
    setLocalPrefs({
      min_age: 18,
      max_age: 50,
      max_distance: 50,
      interested_in: ['all'],
      preferred_interests: [],
      preferred_languages: [],
      preferred_origins: [],
    });
    setInterculturalBoost(false);
  };

  const handleSave = () => {
    const prefsToApply = {
      ...localPrefs,
      // If intercultural boost is enabled, prioritize different origins
      intercultural_boost: interculturalBoost,
    };
    onApply(prefsToApply);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8 shadow-love">
        <CardHeader className="flex flex-row items-center justify-between border-b border-brand-red/10">
          <CardTitle className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-red" />
            Filtres de recherche
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-brand-red/10 hover:text-brand-red transition-smooth rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Gender Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Genre recherché</Label>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map((gender) => (
                <Badge
                  key={gender.value}
                  variant={
                    localPrefs.interested_in?.includes(gender.value)
                      ? 'default'
                      : 'outline'
                  }
                  className="cursor-pointer text-sm py-2 px-4"
                  onClick={() =>
                    setLocalPrefs({
                      ...localPrefs,
                      interested_in: [gender.value],
                    })
                  }
                >
                  <span className="mr-2">{gender.icon}</span>
                  {gender.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Age Range */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Âge: {localPrefs.min_age} - {localPrefs.max_age} ans
            </Label>
            <Slider
              value={[localPrefs.min_age || 18, localPrefs.max_age || 50]}
              onValueChange={([min, max]) =>
                setLocalPrefs({ ...localPrefs, min_age: min, max_age: max })
              }
              min={18}
              max={80}
              step={1}
              className="w-full"
            />
          </div>

          {/* Distance */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Distance maximale: {localPrefs.max_distance} km
            </Label>
            <Slider
              value={[localPrefs.max_distance || 50]}
              onValueChange={([value]) =>
                setLocalPrefs({ ...localPrefs, max_distance: value })
              }
              min={5}
              max={200}
              step={5}
              className="w-full"
            />
          </div>

          {/* Intercultural Boost */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-purple/10 to-brand-orange/10 rounded-xl border-2 border-brand-purple/20 shadow-soft hover:shadow-md transition-smooth">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-brand-purple" />
              <div>
                <Label htmlFor="intercultural-boost" className="text-base font-semibold cursor-pointer text-brand-purple">
                  Boost Interculturel
                </Label>
                <p className="text-sm text-muted-foreground">
                  Privilégier les profils d'origines différentes
                </p>
              </div>
            </div>
            <Switch
              id="intercultural-boost"
              checked={interculturalBoost}
              onCheckedChange={setInterculturalBoost}
            />
          </div>

          {/* Origins Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Origines</Label>
            <div className="flex flex-wrap gap-2">
              {ORIGINS.map((origin) => (
                <Badge
                  key={origin.value}
                  variant={
                    localPrefs.preferred_origins?.includes(origin.value)
                      ? 'default'
                      : 'outline'
                  }
                  className="cursor-pointer text-sm py-2 px-3"
                  onClick={() =>
                    setLocalPrefs({
                      ...localPrefs,
                      preferred_origins: toggleArrayValue(
                        localPrefs.preferred_origins || [],
                        origin.value
                      ),
                    })
                  }
                >
                  <span className="mr-2">{origin.flag}</span>
                  {origin.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Interests Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Centres d'intérêt</Label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge
                  key={interest.value}
                  variant={
                    localPrefs.preferred_interests?.includes(interest.value)
                      ? 'default'
                      : 'outline'
                  }
                  className="cursor-pointer text-sm py-2 px-3"
                  onClick={() =>
                    setLocalPrefs({
                      ...localPrefs,
                      preferred_interests: toggleArrayValue(
                        localPrefs.preferred_interests || [],
                        interest.value
                      ),
                    })
                  }
                >
                  {interest.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Languages Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Langues parlées</Label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((language) => (
                <Badge
                  key={language.value}
                  variant={
                    localPrefs.preferred_languages?.includes(language.value)
                      ? 'default'
                      : 'outline'
                  }
                  className="cursor-pointer text-sm py-2 px-3"
                  onClick={() =>
                    setLocalPrefs({
                      ...localPrefs,
                      preferred_languages: toggleArrayValue(
                        localPrefs.preferred_languages || [],
                        language.value
                      ),
                    })
                  }
                >
                  <span className="mr-2">{language.flag}</span>
                  {language.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-brand-red/10">
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1 hover:border-brand-red hover:text-brand-red transition-smooth"
            >
              Réinitialiser
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-moydate shadow-love hover:shadow-glow transition-smooth"
            >
              <Check className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
