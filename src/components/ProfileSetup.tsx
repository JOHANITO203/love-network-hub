import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ImageUpload } from './ImageUpload';
import { astrologicalSigns, interests, professionCategories } from '@/data/profileOptions';
import { Heart, CalendarIcon, User, MapPin, Briefcase, Star, Sparkles } from 'lucide-react';
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
}

interface ProfileSetupProps {
  onProfileComplete: (profile: Profile) => void;
}

export const ProfileSetup = ({ onProfileComplete }: ProfileSetupProps) => {
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
    profile_images: []
  });
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile({
          id: data.id,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          age: data.age,
          date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
          bio: data.bio || '',
          location: data.location || '',
          profession: data.profession || '',
          astrological_sign: data.astrological_sign || '',
          interests: data.interests || [],
          profile_images: data.profile_images || []
        });
      }
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const updateProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          date_of_birth: profile.date_of_birth?.toISOString().split('T')[0] || null,
          bio: profile.bio,
          location: profile.location,
          profession: profile.profession,
          astrological_sign: profile.astrological_sign,
          interests: profile.interests,
          profile_images: profile.profile_images
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Profile updated!",
        description: "Your profile has been saved successfully.",
      });

      // Convert data to Profile format for callback
      const profileForCallback: Profile = {
        id: data.id,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        age: data.age,
        date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
        bio: data.bio || '',
        location: data.location || '',
        profession: data.profession || '',
        astrological_sign: data.astrological_sign || '',
        interests: data.interests || [],
        profile_images: data.profile_images || []
      };

      onProfileComplete(profileForCallback);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpdate = (imageUrl: string) => {
    const updatedImages = imageUrl 
      ? [...profile.profile_images.filter(img => img !== imageUrl), imageUrl]
      : profile.profile_images.slice(0, -1);
    
    setProfile(prev => ({
      ...prev,
      profile_images: updatedImages
    }));
  };

  const toggleInterest = (interestValue: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interestValue)
        ? prev.interests.filter(i => i !== interestValue)
        : [...prev.interests, interestValue]
    }));
  };

  const getCompletionPercentage = () => {
    const fields = [
      profile.first_name,
      profile.last_name,
      profile.date_of_birth,
      profile.bio,
      profile.location,
      profile.profession,
      profile.profile_images.length > 0,
      profile.interests.length > 0
    ];
    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return profile.first_name && profile.last_name && profile.date_of_birth;
      case 2: return profile.profile_images.length > 0;
      case 3: return profile.location && profile.profession;
      case 4: return profile.bio && profile.interests.length > 0;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-primary mx-auto mb-2" />
              <h3 className="text-xl font-semibold">Informations de base</h3>
              <p className="text-muted-foreground">Comment vous appelez-vous ?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={profile.first_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={profile.last_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date de naissance *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !profile.date_of_birth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {profile.date_of_birth ? (
                      format(profile.date_of_birth, "dd MMMM yyyy", { locale: fr })
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={profile.date_of_birth || undefined}
                    onSelect={(date) => setProfile(prev => ({ ...prev, date_of_birth: date || null }))}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Signe astrologique</Label>
              <Select
                value={profile.astrological_sign}
                onValueChange={(value) => setProfile(prev => ({ ...prev, astrological_sign: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir votre signe" />
                </SelectTrigger>
                <SelectContent>
                  {astrologicalSigns.map((sign) => (
                    <SelectItem key={sign.value} value={sign.value}>
                      {sign.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-2" />
              <h3 className="text-xl font-semibold">Votre photo de profil</h3>
              <p className="text-muted-foreground">Montrez votre plus beau sourire !</p>
            </div>

            <div className="flex justify-center">
              <ImageUpload
                currentImage={profile.profile_images[0]}
                onImageUpdate={handleImageUpdate}
                size="lg"
              />
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>💡 Conseil : Une photo souriante et récente fonctionne mieux !</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
              <h3 className="text-xl font-semibold">Où êtes-vous ?</h3>
              <p className="text-muted-foreground">Votre localisation et profession</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Localisation *</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Paris, France"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession *</Label>
                <Input
                  id="profession"
                  value={profile.profession}
                  onChange={(e) => setProfile(prev => ({ ...prev, profession: e.target.value }))}
                  placeholder="Que faites-vous dans la vie ?"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Star className="w-12 h-12 text-primary mx-auto mb-2" />
              <h3 className="text-xl font-semibold">Parlez de vous</h3>
              <p className="text-muted-foreground">Vos passions et votre personnalité</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Décrivez-vous en quelques mots..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Centres d'intérêt * (minimum 1)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {interests.map((interest) => (
                    <Badge
                      key={interest.value}
                      variant={profile.interests.includes(interest.value) ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer justify-start p-2 h-auto",
                        profile.interests.includes(interest.value) && "bg-gradient-primary"
                      )}
                      onClick={() => toggleInterest(interest.value)}
                    >
                      <span className="mr-2">{interest.icon}</span>
                      {interest.label.split(' ')[1]}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {profile.interests.length} sélectionné(s)
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Créez votre profil
            </h1>
          </div>
          <p className="text-muted-foreground">Étape {currentStep} sur {totalSteps}</p>
        </div>

        <Card className="backdrop-blur-sm bg-card/80 border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profil complété</span>
              <span className="text-sm text-muted-foreground">{getCompletionPercentage()}%</span>
            </div>
            <Progress value={getCompletionPercentage()} className="h-2" />
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-card/80 border-border/50">
          <CardContent className="p-6">
            {renderStepContent()}

            <Separator className="my-6" />

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Précédent
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceedToNext()}
                  className="bg-gradient-primary"
                >
                  Suivant
                </Button>
              ) : (
                <Button
                  onClick={updateProfile}
                  disabled={loading || !canProceedToNext()}
                  className="bg-gradient-primary"
                >
                  {loading ? "Enregistrement..." : "Terminer"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};