import { useState, useEffect, useCallback } from 'react';
import { format, parse, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAutoSave } from '@/hooks/useAutoSave';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGeolocation } from '@/hooks/useGeolocation';
import { ImageUpload } from './ImageUpload';
import { ModeToggle } from '@/components/ModeToggle';
import { ModernDatePicker, DateInfo } from './ModernDatePicker';
import { DebugPanel } from './DebugPanel';
import { interests, pronounOptions, orientationOptions, personaSymbols } from '@/data/profileOptions';
import {
  Heart,
  User,
  MapPin,
  LocateFixed,
  Briefcase,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  Save,
  Camera,
  Gift,
  Target,
  Cloud,
  Home,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  age: number | null;
  date_of_birth: Date | null;
  bio: string;
  location: string;
  profession: string;
  astrological_sign: string;
  interests: string[];
  profile_images: string[];
  pronouns: string;
  custom_pronouns: string;
  orientation: string;
  persona_symbols: string[];
}

type SupabaseProfileRow = {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  date_of_birth: string | null;
  bio: string | null;
  location: string | null;
  profession: string | null;
  astrological_sign: string | null;
  interests: string[] | null;
  profile_images: string[] | null;
  pronouns: string | null;
  custom_pronouns: string | null;
  orientation: string | null;
  persona_symbols: string[] | null;
};

type SupabaseProfileUpsert = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  bio: string | null;
  location: string | null;
  profession: string | null;
  astrological_sign: string | null;
  interests: string[];
  profile_images: string[];
  pronouns: string | null;
  custom_pronouns: string | null;
  orientation: string | null;
  persona_symbols: string[];
};

const DATE_STORAGE_FORMAT = 'yyyy-MM-dd';

const formatDateForStorage = (date: Date | null): string | null => {
  if (!date) {
    return null;
  }

  return format(date, DATE_STORAGE_FORMAT);
};

const parseDateFromStorage = (value: string | null): Date | null => {
  if (!value) {
    return null;
  }

  const parsed = parse(value, DATE_STORAGE_FORMAT, new Date());
  return isValid(parsed) ? parsed : null;
};

const logDebug = (message: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.addDebugLog?.(message);
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }

  return 'Une erreur inattendue est survenue.';
};

const getErrorCode = (error: unknown): string | undefined => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string'
  ) {
    return (error as { code: string }).code;
  }

  return undefined;
};

interface ProfileSetupProps {
  onProfileComplete: (profile: Profile) => void;
  onExit?: () => void;
}

const STEPS = [
  {
    id: 1,
    title: 'Informations personnelles',
    description: 'Parlez-nous de vous',
    icon: User,
    color: 'text-blue-600'
  },
  {
    id: 2,
    title: 'Date d\'anniversaire',
    description: 'Votre âge et signe astrologique',
    icon: Gift,
    color: 'text-purple-600'
  },
  {
    id: 3,
    title: 'Photos et présentation',
    description: 'Montrez votre personnalité',
    icon: Camera,
    color: 'text-green-600'
  },
  {
    id: 4,
    title: 'Centres d\'intérêt',
    description: 'Ce qui vous passionne',
    icon: Target,
    color: 'text-orange-600'
  }
];

export const ProfileSetup = ({ onProfileComplete, onExit }: ProfileSetupProps) => {
  const [profile, setProfile] = useState<Profile>({
    id: '',
    first_name: '',
    last_name: '',
    age: null,
    date_of_birth: null,
    bio: '',
    location: '',
    profession: '',
    astrological_sign: '',
    interests: [],
    profile_images: [],
    pronouns: '',
    custom_pronouns: '',
    orientation: '',
    persona_symbols: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  console.log('🎯 [RENDER] ProfileSetup rendered, currentStep:', currentStep);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({});
  const { toast } = useToast();
  const { user } = useAuth();

  const {
    location: detectedLocation,
    requestLocation,
    loading: geolocationLoading,
    permission: geolocationPermission
  } = useGeolocation();

  const [locationManuallyEdited, setLocationManuallyEdited] = useState(false);
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);

  useEffect(() => {
    const validations = {
      1: Boolean(
        profile.first_name &&
        profile.last_name &&
        profile.location &&
        profile.profession &&
        profile.orientation
      ),
      2: Boolean(profile.date_of_birth && typeof profile.age === 'number' && profile.age >= 18),
      3: Boolean(profile.bio && profile.bio.length >= 20 && profile.profile_images.length > 0),
      4: profile.interests.length >= 3
    } as const;

    setStepValidation(prev => {
      const next = { ...prev } as Record<number, boolean>;
      let hasChanged = false;

      if (next[1] !== validations[1]) {
        next[1] = validations[1];
        hasChanged = true;
      }

      if (next[2] !== validations[2]) {
        next[2] = validations[2];
        hasChanged = true;
      }

      if (next[3] !== validations[3]) {
        next[3] = validations[3];
        hasChanged = true;
      }

      if (next[4] !== validations[4]) {
        next[4] = validations[4];
        hasChanged = true;
      }

      return hasChanged ? next : prev;
    });
  }, [
    profile.first_name,
    profile.last_name,
    profile.location,
    profile.profession,
    profile.pronouns,
    profile.orientation,
    profile.date_of_birth,
    profile.age,
    profile.bio,
    profile.profile_images.length,
    profile.interests.length
  ]);

  useEffect(() => {
    if (
      currentStep === 1 &&
      !hasRequestedLocation &&
      !locationManuallyEdited &&
      geolocationPermission !== 'denied'
    ) {
      setHasRequestedLocation(true);
      void requestLocation();
    }
  }, [
    currentStep,
    geolocationPermission,
    hasRequestedLocation,
    locationManuallyEdited,
    requestLocation
  ]);

  useEffect(() => {
    if (!detectedLocation) {
      return;
    }

    const parts = [
      detectedLocation.city,
      detectedLocation.region,
      detectedLocation.country
    ].filter(Boolean);
    const formatted = parts.join(', ').trim();

    if (!formatted) {
      return;
    }

    let updated = false;
    setProfile(prev => {
      if (locationManuallyEdited && prev.location?.trim()) {
        return prev;
      }
      if (prev.location === formatted) {
        return prev;
      }
      updated = true;
      return { ...prev, location: formatted };
    });

    if (updated) {
      setLocationManuallyEdited(false);
    }
  }, [detectedLocation, locationManuallyEdited]);

  const handleUseCurrentLocation = useCallback(async () => {
    setLocationManuallyEdited(false);
    setHasRequestedLocation(true);
    await requestLocation();
  }, [requestLocation]);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from<SupabaseProfileRow>('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        console.log('Profile data found:', data);
        logDebug(`Données profil trouvées: ${JSON.stringify(data).slice(0, 100)}`);

        setProfile({
          id: data.id,
          first_name: data.first_name ?? '',
          last_name: data.last_name ?? '',
          age: data.age,
          date_of_birth: parseDateFromStorage(data.date_of_birth),
          bio: data.bio ?? '',
          location: data.location ?? '',
          profession: data.profession ?? '',
          astrological_sign: data.astrological_sign ?? '',
          interests: data.interests ?? [],
          profile_images: data.profile_images ?? [],
          pronouns: data.pronouns ?? '',
          custom_pronouns: data.custom_pronouns ?? '',
          orientation: data.orientation ?? '',
          persona_symbols: Array.isArray(data.persona_symbols) ? data.persona_symbols : []
        });

        const hasLocation = Boolean(data.location && data.location.trim().length > 0);
        setLocationManuallyEdited(hasLocation);
        setHasRequestedLocation(hasLocation);

        logDebug(`Images: ${(data.profile_images ?? []).length}`);
      } else {
        console.log('No existing profile found');
        logDebug('Aucun profil existant');
        setLocationManuallyEdited(false);
        setHasRequestedLocation(false);
      }
    } catch (error) {
      const description = getErrorMessage(error);

      toast({
        title: "Erreur de chargement",
        description,
        variant: "destructive",
      });
      logDebug(`Erreur de chargement: ${description}`);
    } finally {
      setInitialLoading(false);
    }
  }, [toast, user]);

  useEffect(() => {
    if (!user) {
      setInitialLoading(false);
      return;
    }

    console.log('Loading profile for user:', user.id);
    logDebug(`Chargement profil pour: ${user.id}`);
    fetchProfile();
  }, [fetchProfile, user]);
    const handleDateChange = useCallback(({ date, age, zodiacSign }: DateInfo) => {
    console.log('?? [DATE] handleDateChange called with:', date, age, zodiacSign);

    setProfile(prev => {
      const prevDateTime = prev.date_of_birth ? prev.date_of_birth.getTime() : null;
      const nextDateTime = date ? date.getTime() : null;

      if (
        prevDateTime === nextDateTime &&
        prev.age === age &&
        prev.astrological_sign === (zodiacSign || '')
      ) {
        return prev;
      }

      return {
        ...prev,
        date_of_birth: date,
        age: age ?? null,
        astrological_sign: zodiacSign || ''
      };
    });
  }, []);

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSymbolToggle = (symbol: string) => {
    setProfile(prev => ({
      ...prev,
      persona_symbols: prev.persona_symbols.includes(symbol)
        ? prev.persona_symbols.filter(s => s !== symbol)
        : [...prev.persona_symbols, symbol]
    }));
  };

  const handleNext = () => {
    console.log('🔥 [NEXT] handleNext appelé');
    console.log('🔥 [NEXT] currentStep:', currentStep);
    console.log('🔥 [NEXT] totalSteps:', totalSteps);
    console.log('🔥 [NEXT] stepValidation:', stepValidation);
    console.log('🔥 [NEXT] stepValidation[currentStep]:', stepValidation[currentStep]);

    logDebug(`🔥 NEXT: Étape ${currentStep} -> ${currentStep + 1}`);

    if (stepValidation[currentStep] && currentStep < totalSteps) {
      console.log('🔥 [NEXT] Conditions OK, changement d\'étape');
      setCurrentStep(prev => {
        const newStep = prev + 1;
        console.log('🔥 [NEXT] Nouvelle étape:', newStep);
        logDebug(`🔥 NEXT: Passage à l'étape ${newStep}`);
        return newStep;
      });
    } else {
      console.log('🔥 [NEXT] Conditions NOK - pas de changement');
      logDebug('🔥 NEXT: Conditions non remplies');
    }
  };

  const handlePrevious = () => {
    console.log('Previous button clicked, current step:', currentStep);
    logDebug(`Bouton précédent cliqué, étape: ${currentStep}`);
    if (currentStep > 1) {
      setCurrentStep(prev => {
        const newStep = prev - 1;
        console.log('Moving to step:', newStep);
        logDebug(`Passage à l'étape: ${newStep}`);
        return newStep;
      });
    }
  };

  const handleSubmit = async () => {
    if (!stepValidation[4]) {
      toast({
        title: "Profil incomplet",
        description: "Veuillez compléter tous les champs requis.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Utilisateur non identifié",
        description: "Veuillez vous reconnecter avant de finaliser votre profil.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const profileData: SupabaseProfileUpsert = {
        user_id: user.id,
        first_name: profile.first_name || null,
        last_name: profile.last_name || null,
        date_of_birth: formatDateForStorage(profile.date_of_birth),
        bio: profile.bio || null,
        location: profile.location || null,
        profession: profile.profession || null,
        astrological_sign: profile.astrological_sign || null,
        interests: profile.interests,
        profile_images: profile.profile_images,
        pronouns: profile.pronouns || null,
        custom_pronouns:
          profile.pronouns === 'custom' && profile.custom_pronouns
            ? profile.custom_pronouns
            : null,
        orientation: profile.orientation || null,
        persona_symbols: profile.persona_symbols
      };

      const { data, error } = await supabase
        .from<SupabaseProfileRow>('profiles')
        .upsert(profileData, { onConflict: 'user_id' })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Profil créé ! 🎉",
        description: "Bienvenue sur LoveDate ! Votre profil est maintenant actif.",
      });

      if (data) {
        console.log('Calling onProfileComplete with:', { ...profile, id: data.id });
        logDebug(`Appel onProfileComplete avec profil: ${profile.first_name}`);

        onProfileComplete({
          ...profile,
          id: data.id
        });

        logDebug('onProfileComplete appelé avec succès');
      }
    } catch (error) {
      const description = getErrorMessage(error);

      toast({
        title: "Erreur de sauvegarde",
        description,
        variant: "destructive",
      });
      logDebug(`Erreur de sauvegarde: ${description}`);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de sauvegarde automatique (sans validation stricte)
  const autoSaveProfile = async (profileData: Profile): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const dataToSave: SupabaseProfileUpsert = {
        user_id: user.id,
        first_name: profileData.first_name || null,
        last_name: profileData.last_name || null,
        date_of_birth: formatDateForStorage(profileData.date_of_birth),
        bio: profileData.bio || null,
        location: profileData.location || null,
        profession: profileData.profession || null,
        astrological_sign: profileData.astrological_sign || null,
        interests: profileData.interests,
        profile_images: profileData.profile_images,
        pronouns: profileData.pronouns || null,
        custom_pronouns:
          profileData.pronouns === 'custom' && profileData.custom_pronouns
            ? profileData.custom_pronouns
            : null,
        orientation: profileData.orientation || null,
        persona_symbols: profileData.persona_symbols || []
      };

      console.log('Auto-saving profile data:', dataToSave);
      logDebug('Auto-sauvegarde en cours...');
      logDebug(`Date formatée: ${dataToSave.date_of_birth ?? 'null'}`);

      const { error: upsertError } = await supabase
        .from<SupabaseProfileRow>('profiles')
        .upsert(dataToSave, { onConflict: 'user_id' });

      if (upsertError) {
        const message = getErrorMessage(upsertError);
        const code = getErrorCode(upsertError);

        console.error('Auto-save error:', upsertError);
        logDebug(`Erreur auto-save: ${message}`);
        if (code) {
          logDebug(`Code erreur: ${code}`);
        }
        return false;
      }

      console.log('Auto-save successful');
      logDebug('Auto-sauvegarde réussie ✅');
      return true;
    } catch (error) {
      console.error('Auto-save error:', error);
      logDebug(`Auto-save exception: ${getErrorMessage(error)}`);
      return false;
    }
  };

  // Configuration de l'auto-sauvegarde
  const { saveNow, isSaving } = useAutoSave<Profile>({
    data: profile,
    saveFunction: autoSaveProfile,
    delay: 3000, // 3 secondes après modification
    enabled: true,
    onSaveSuccess: () => {
      console.log('Profile auto-saved successfully');
    },
    onSaveError: (error) => {
      console.error('Auto-save failed:', error);
      logDebug(`Auto-save callback error: ${getErrorMessage(error)}`);
    }
  });

  const handleExit = useCallback(async () => {
    if (!onExit) {
      return;
    }

    try {
      await saveNow();
    } catch (error) {
      console.error('Manual exit save error:', error);
      logDebug(`Manual exit save error: ${getErrorMessage(error)}`);
    } finally {
      onExit();
    }
  }, [onExit, saveNow]);

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  const currentStepData = STEPS[currentStep - 1];
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* Header with Progress */}
      <div className="bg-card/80 dark:bg-background/90 backdrop-blur-lg border-b border-border/50 sticky top-0 z-10 transition-colors">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-love-primary fill-current" />
              <div>
                <h1 className="text-xl font-bold">Configuration du profil</h1>
                <p className="text-sm text-muted-foreground">
                  Étape {currentStep} sur {totalSteps}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ModeToggle />
              {onExit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExit}
                  className="flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Accueil
                </Button>
              )}

              {currentStep > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Retour
                </Button>
              )}
            </div>
          </div>

          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between mb-8">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = stepValidation[step.id] && step.id < currentStep;
            const isAccessible = step.id <= currentStep;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col items-center text-center flex-1 cursor-pointer transition-all",
                  isAccessible ? "opacity-100" : "opacity-50 cursor-not-allowed"
                )}
                onClick={() => isAccessible && setCurrentStep(step.id)}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all",
                  isActive && "bg-primary text-white shadow-lg scale-110",
                  isCompleted && "bg-green-500 text-white",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground"
                )}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <h3 className={cn(
                  "text-xs font-medium",
                  isActive && "text-primary",
                  isCompleted && "text-green-600"
                )}>
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "bg-gradient-to-br from-primary to-secondary"
                )}>
                  <currentStepData.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                  <p className="text-muted-foreground">{currentStepData.description}</p>
                </div>
              </div>

              {/* Auto-save indicator */}
              <div className="flex items-center gap-2">
                {isSaving ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Cloud className="w-4 h-4 animate-pulse" />
                    <span>Sauvegarde...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Cloud className="w-4 h-4" />
                    <span>Sauvegardé</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (

              <div className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-2">

                    <Label htmlFor="firstName">Prénom *</Label>

                    <Input

                      id="firstName"

                      value={profile.first_name}

                      onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}

                      placeholder="Votre prénom"

                      className="h-12"

                    />

                  </div>

                  <div className="space-y-2">

                    <Label htmlFor="lastName">Nom *</Label>

                    <Input

                      id="lastName"

                      value={profile.last_name}

                      onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}

                      placeholder="Votre nom"

                      className="h-12"

                    />

                  </div>

                  {geolocationPermission === 'denied' && (
                    <p className="text-xs text-destructive mt-1">
                      Activez la localisation dans votre navigateur pour remplir automatiquement ce champ.
                    </p>
                  )}

                </div>



                <div className="space-y-2">

                  <Label htmlFor="location">Localisation *</Label>

                  <div className="relative">

                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                    <Input

                      id="location"

                      value={profile.location}

                      onChange={(e) => {
                        const value = e.target.value;
                        setLocationManuallyEdited(true);
                        setProfile(prev => ({ ...prev, location: value }));
                      }}

                      placeholder="Ville, Région"

                      className="h-12 pl-10"

                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleUseCurrentLocation}
                      disabled={geolocationLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Utiliser ma position actuelle"
                    >
                      {geolocationLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LocateFixed className="w-4 h-4" />
                      )}
                    </Button>

                  </div>

                </div>



                <div className="space-y-2">

                  <Label htmlFor="profession">Profession *</Label>

                  <div className="relative">

                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                    <Input

                      id="profession"

                      value={profile.profession}

                      onChange={(e) => setProfile(prev => ({ ...prev, profession: e.target.value }))}

                      placeholder="Votre métier"

                      className="h-12 pl-10"

                    />

                  </div>

                </div>



                <div className="space-y-2">

                  <Label>Pronoms</Label>

                  <Select

                    value={profile.pronouns || undefined}

                    onValueChange={(value) =>

                      setProfile(prev => ({

                        ...prev,

                        pronouns: value,

                        custom_pronouns: value === 'custom' ? prev.custom_pronouns : ''

                      }))

                    }

                  >

                    <SelectTrigger className="h-12">

                      <SelectValue placeholder="Choisissez vos pronoms" />

                    </SelectTrigger>

                    <SelectContent>

                      {pronounOptions.map(option => (

                        <SelectItem key={option.value} value={option.value}>

                          {option.label}

                        </SelectItem>

                      ))}

                    </SelectContent>

                  </Select>

                  <p className="text-xs text-muted-foreground">

                    Cette information sera visible sur votre profil et dans vos conversations.

                  </p>

                </div>



                {profile.pronouns === 'custom' && (

                  <div className="space-y-2">

                    <Label htmlFor="customPronouns">Pronoms personnalisés</Label>

                    <Input

                      id="customPronouns"

                      value={profile.custom_pronouns}

                      onChange={(e) => setProfile(prev => ({ ...prev, custom_pronouns: e.target.value }))}

                      placeholder="Ex : elle/iel"

                      className="h-12"

                    />

                    <p className="text-xs text-muted-foreground">

                      Une courte formulation (30 caractères max).

                    </p>

                  </div>

                )}



                <div className="space-y-3">

                  <Label>Orientation *</Label>

                  <p className="text-xs text-muted-foreground">

                    Vos préférences restent confidentielles et optimisent vos suggestions.

                  </p>

                  <div className="flex flex-wrap gap-2">

                    {orientationOptions.map(option => {

                      const isSelected = profile.orientation === option.value;

                      return (

                        <Button

                          key={option.value}

                          type="button"

                          variant={isSelected ? 'default' : 'outline'}

                          onClick={() => setProfile(prev => ({ ...prev, orientation: option.value }))}

                          className="px-4"

                        >

                          {option.label}

                        </Button>

                      );

                    })}

                  </div>

                </div>



                <div className="space-y-3">

                  <Label>Symboles de personnalité</Label>

                  <p className="text-xs text-muted-foreground">

                    Ces symboles sont visibles uniquement des profils compatibles et reflètent vos valeurs.

                  </p>

                  <div className="flex flex-wrap gap-2">

                    {personaSymbols.map(symbol => {

                      const isSelected = profile.persona_symbols.includes(symbol.value);

                      return (

                        <Button

                          key={symbol.value}

                          type="button"

                          variant={isSelected ? 'default' : 'outline'}

                          onClick={() => handleSymbolToggle(symbol.value)}

                          className="flex items-center gap-2"

                          title={symbol.description}

                        >

                          <span className="text-lg" role="img" aria-hidden="true">{symbol.emoji}</span>

                          <span>{symbol.label}</span>

                        </Button>

                      );

                    })}

                  </div>

                </div>

              </div>

            )}

            {/* Step 2: Birth Date */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <ModernDatePicker
                  value={profile.date_of_birth}
                  onChange={handleDateChange}
                  label="Votre date d'anniversaire"
                  placeholder="Sélectionnez votre date de naissance"
                  minAge={18}
                  maxAge={80}
                />

                {/* Remove the duplicate age display - ModernDatePicker already shows this */}
              </div>
            )}

            {/* Step 3: Photos and Bio */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Photo de profil *</Label>
                  <ImageUpload
                    onImageUpdate={(url) => setProfile(prev => ({
                      ...prev,
                      profile_images: url ? [url] : []
                    }))}
                    currentImage={profile.profile_images[0]}
                  />
                  <p className="text-sm text-muted-foreground">
                    Ajoutez une photo qui vous représente bien. Cette photo sera votre photo principale.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Présentez-vous *</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Parlez-nous de vous, de vos passions, de ce que vous recherchez..."
                    className="min-h-32 resize-none"
                    maxLength={500}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Minimum 20 caractères</span>
                    <span>{profile.bio.length}/500</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Interests */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">
                      Sélectionnez vos centres d'intérêt * (minimum 3)
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choisissez ce qui vous passionne pour trouver des personnes compatibles
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {interests && Array.isArray(interests) ? interests.map((interest) => {
                      console.log('🎯 [INTERESTS] Rendering interest:', interest);
                      const userInterests = profile.interests || [];
                      const isSelected = userInterests.includes(interest.value);

                      return (
                        <Badge
                          key={interest.value}
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-all hover:scale-105",
                            isSelected && "bg-primary text-white"
                          )}
                          onClick={() => handleInterestToggle(interest.value)}
                        >
                          {interest.label}
                        </Badge>
                      );
                    }) : (
                      <p className="text-red-500">Erreur: interests non défini</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">
                      {profile.interests.length} intérêt{profile.interests.length > 1 ? 's' : ''} sélectionné{profile.interests.length > 1 ? 's' : ''}
                    </span>
                    {profile.interests.length >= 3 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ✓ Validé
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Vos symboles de personnalité</Label>
                  <p className="text-sm text-muted-foreground">
                    Ces symboles restent privés et servent uniquement à améliorer vos compatibilités.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {personaSymbols.map(symbol => {
                      const isSelected = profile.persona_symbols.includes(symbol.value);
                      return (
                        <Badge
                          key={symbol.value}
                          variant={isSelected ? 'default' : 'outline'}
                          className={cn(
                            'flex items-center gap-1 px-3 py-1 text-sm',
                            isSelected && 'bg-primary text-white'
                          )}
                        >
                          <span role="img" aria-hidden="true">{symbol.emoji}</span>
                          <span>{symbol.label}</span>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Précédent
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!stepValidation[currentStep]}
                  className="flex items-center gap-2"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!stepValidation[4] || loading}
                  className="flex items-center gap-2 bg-gradient-primary"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Création...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Créer mon profil
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
};

