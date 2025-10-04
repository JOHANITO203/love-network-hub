import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Heart, MapPin, Calendar } from 'lucide-react';

interface UserPreferences {
  min_age: number;
  max_age: number;
  max_distance: number;
  interested_in: string[];
}

interface MatchingPreferencesProps {
  preferences: UserPreferences | null;
  onUpdatePreferences: (preferences: Partial<UserPreferences>) => void;
  onBack: () => void;
}

export const MatchingPreferences = ({ preferences, onUpdatePreferences, onBack }: MatchingPreferencesProps) => {
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>({
    min_age: preferences?.min_age || 18,
    max_age: preferences?.max_age || 50,
    max_distance: preferences?.max_distance || 50,
    interested_in: preferences?.interested_in || ['all']
  });

  const handleSave = () => {
    onUpdatePreferences(localPreferences);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-border/50 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button variant="ghost" onClick={onBack}>
            ← Retour
          </Button>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold">Préférences</h1>
          </div>
          <div></div>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Age Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5 text-primary" />
              Âge préféré
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium">
                Âge minimum: {localPreferences.min_age} ans
              </Label>
              <Slider
                value={[localPreferences.min_age]}
                onValueChange={(value) => 
                  setLocalPreferences(prev => ({ ...prev, min_age: value[0] }))
                }
                min={18}
                max={70}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                Âge maximum: {localPreferences.max_age} ans
              </Label>
              <Slider
                value={[localPreferences.max_age]}
                onValueChange={(value) => 
                  setLocalPreferences(prev => ({ ...prev, max_age: value[0] }))
                }
                min={18}
                max={70}
                step={1}
                className="mt-2"
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-center">
                Rechercher des personnes entre{' '}
                <span className="font-semibold text-primary">
                  {localPreferences.min_age}
                </span>
                {' '}et{' '}
                <span className="font-semibold text-primary">
                  {localPreferences.max_age}
                </span>
                {' '}ans
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Distance Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="w-5 h-5 text-primary" />
              Distance maximale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label className="text-sm font-medium">
                Jusqu'à {localPreferences.max_distance} km
              </Label>
              <Slider
                value={[localPreferences.max_distance]}
                onValueChange={(value) => 
                  setLocalPreferences(prev => ({ ...prev, max_distance: value[0] }))
                }
                min={5}
                max={200}
                step={5}
                className="mt-2"
              />
            </div>

            <div className="bg-muted/50 p-3 rounded-lg mt-4">
              <p className="text-sm text-center">
                Voir les profils dans un rayon de{' '}
                <span className="font-semibold text-primary">
                  {localPreferences.max_distance} km
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Matching Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="w-5 h-5 text-primary" />
              Conseils de matching
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm space-y-2">
              <p>💡 <strong>Score de compatibilité :</strong></p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• <span className="text-green-500 font-medium">80%+</span> : Très compatible</li>
                <li>• <span className="text-yellow-500 font-medium">60-79%</span> : Compatible</li>
                <li>• <span className="text-orange-500 font-medium">40-59%</span> : Potentiel</li>
              </ul>
            </div>
            
            <Separator />
            
            <div className="text-sm space-y-2">
              <p>🎯 <strong>Basé sur :</strong></p>
              <ul className="space-y-1 ml-4 text-muted-foreground">
                <li>• Tranche d'âge préférée</li>
                <li>• Intérêts communs</li>
                <li>• Proximité géographique</li>
                <li>• Compatibilité astrologique</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-primary"
          size="lg"
        >
          Sauvegarder les préférences
        </Button>
      </div>
    </div>
  );
};