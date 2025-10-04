import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Camera, ChevronRight, Calendar, MapPin, Briefcase, Heart } from 'lucide-react';
import { t } from '@/utils/i18n';
import { useAuth } from '@/hooks/useAuth';

/**
 * МойDate Profile Setup Screen - Étape 3
 * Complete user profile with photos, info, interests, and location
 */

interface ProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  orientation: string;
  bio: string;
  profession: string;
  interests: string[];
  originCountry: string;
  currentCountry: string;
  photos: File[];
}

const INTERESTS_OPTIONS = [
  { id: 'voyage', label: '✈️ Voyage', icon: '✈️' },
  { id: 'cuisine', label: '🍳 Cuisine', icon: '🍳' },
  { id: 'sport', label: '⚽ Sport', icon: '⚽' },
  { id: 'musique', label: '🎵 Musique', icon: '🎵' },
  { id: 'cinema', label: '🎬 Cinéma', icon: '🎬' },
  { id: 'lecture', label: '📚 Lecture', icon: '📚' },
  { id: 'art', label: '🎨 Art', icon: '🎨' },
  { id: 'danse', label: '💃 Danse', icon: '💃' },
  { id: 'photographie', label: '📸 Photo', icon: '📸' },
  { id: 'tech', label: '💻 Tech', icon: '💻' },
  { id: 'yoga', label: '🧘 Yoga', icon: '🧘' },
  { id: 'nature', label: '🌿 Nature', icon: '🌿' },
];

const COUNTRIES = [
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'RU', name: 'Russie', flag: '🇷🇺' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪' },
];

const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calculateAstrologicalSign = (dob: string): string => {
  const date = new Date(dob);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '♈ Bélier';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '♉ Taureau';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return '♊ Gémeaux';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return '♋ Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '♌ Lion';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '♍ Vierge';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return '♎ Balance';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return '♏ Scorpion';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '♐ Sagittaire';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '♑ Capricorne';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '♒ Verseau';
  return '♓ Poissons';
};

const ProfileSetupScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Redirect only if no user session
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    orientation: '',
    bio: '',
    profession: '',
    interests: [],
    originCountry: 'FR',
    currentCountry: 'FR',
    photos: [],
  });

  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + photoPreviewUrls.length > 9) {
      toast({
        title: "Limite atteinte",
        description: "Vous pouvez ajouter maximum 9 photos",
        variant: "destructive",
      });
      return;
    }

    // Create preview URLs
    const newUrls = files.map(file => URL.createObjectURL(file));
    setPhotoPreviewUrls([...photoPreviewUrls, ...newUrls]);
    setProfileData({ ...profileData, photos: [...profileData.photos, ...files] });
  };

  const handleRemovePhoto = (index: number) => {
    const newUrls = photoPreviewUrls.filter((_, i) => i !== index);
    const newPhotos = profileData.photos.filter((_, i) => i !== index);
    setPhotoPreviewUrls(newUrls);
    setProfileData({ ...profileData, photos: newPhotos });
  };

  const toggleInterest = (interestId: string) => {
    const currentInterests = profileData.interests;
    const newInterests = currentInterests.includes(interestId)
      ? currentInterests.filter(id => id !== interestId)
      : [...currentInterests, interestId];

    setProfileData({ ...profileData, interests: newInterests });
  };

  const handleSubmit = async () => {
    // Validation
    if (!profileData.firstName || !profileData.dateOfBirth || !profileData.gender) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (profileData.photos.length === 0) {
      toast({
        title: "Photo requise",
        description: "Ajoutez au moins une photo de profil",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store in localStorage
      const age = calculateAge(profileData.dateOfBirth);
      const sign = calculateAstrologicalSign(profileData.dateOfBirth);

      localStorage.setItem('moydate_profile', JSON.stringify({
        ...profileData,
        age,
        astrologicalSign: sign,
        isDiaspora: profileData.originCountry !== profileData.currentCountry
      }));

      toast({
        title: "🎉 Profil créé !",
        description: "Bienvenue sur МойDate",
      });

      navigate('/app');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const age = profileData.dateOfBirth ? calculateAge(profileData.dateOfBirth) : null;
  const sign = profileData.dateOfBirth ? calculateAstrologicalSign(profileData.dateOfBirth) : null;
  const isDiaspora = profileData.originCountry !== profileData.currentCountry;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            Créez votre profil
          </h1>
          <p className="text-text-secondary">
            Partagez vos informations pour trouver votre match parfait
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-text-dark">Progression</span>
            <span className="text-sm font-medium text-primary">
              {Math.round(((currentStep - 1) / 4) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background-light rounded-xl shadow-soft p-6 space-y-8"
        >
          {/* Step 1: Photos */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" />
                Photos (1-9)
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {photoPreviewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        Principale
                      </span>
                    )}
                  </div>
                ))}

                {photoPreviewUrls.length < 9 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Ajouter</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <Button
                onClick={() => setCurrentStep(2)}
                disabled={photoPreviewUrls.length === 0}
                className="w-full h-12 rounded-xl bg-primary hover:bg-brand-orange shadow-love transition-smooth"
              >
                Continuer <ChevronRight className="ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-text-dark">
                Informations personnelles
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prénom *</Label>
                  <Input
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="rounded-xl"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <Label>Nom</Label>
                  <Input
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="rounded-xl"
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div>
                <Label>Date de naissance *</Label>
                <Input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  className="rounded-xl"
                />
                {age && sign && (
                  <p className="text-sm text-text-meta mt-2">
                    {age} ans • {sign}
                  </p>
                )}
              </div>

              <div>
                <Label>Genre *</Label>
                <div className="flex gap-2">
                  {['Homme', 'Femme', 'Autre'].map((gender) => (
                    <Button
                      key={gender}
                      type="button"
                      variant={profileData.gender === gender ? 'default' : 'outline'}
                      onClick={() => setProfileData({ ...profileData, gender })}
                      className="flex-1 rounded-xl"
                    >
                      {gender}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Orientation (privée)</Label>
                <select
                  value={profileData.orientation}
                  onChange={(e) => setProfileData({ ...profileData, orientation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-300 focus:border-primary outline-none"
                >
                  <option value="">Sélectionner...</option>
                  <option value="heterosexual">Hétérosexuel(le)</option>
                  <option value="homosexual">Homosexuel(le)</option>
                  <option value="bisexual">Bisexuel(le)</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 rounded-xl"
                >
                  Retour
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!profileData.firstName || !profileData.dateOfBirth || !profileData.gender}
                  className="flex-1 rounded-xl bg-primary hover:bg-brand-orange"
                >
                  Continuer <ChevronRight className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Bio & Interests */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-text-dark">
                À propos de vous
              </h2>

              <div>
                <Label>Bio</Label>
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="rounded-xl min-h-[100px]"
                  placeholder="Parlez de vous..."
                />
              </div>

              <div>
                <Label>Profession</Label>
                <Input
                  value={profileData.profession}
                  onChange={(e) => setProfileData({ ...profileData, profession: e.target.value })}
                  className="rounded-xl"
                  placeholder="Votre métier"
                />
              </div>

              <div>
                <Label>Centres d'intérêt</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {INTERESTS_OPTIONS.map((interest) => (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        profileData.interests.includes(interest.id)
                          ? 'bg-primary text-white shadow-love'
                          : 'bg-gray-100 text-text-dark hover:bg-gray-200'
                      }`}
                    >
                      {interest.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 rounded-xl"
                >
                  Retour
                </Button>
                <Button
                  onClick={() => setCurrentStep(4)}
                  className="flex-1 rounded-xl bg-primary hover:bg-brand-orange"
                >
                  Continuer <ChevronRight className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Location */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Localisation
              </h2>

              <div>
                <Label>Pays d'origine</Label>
                <select
                  value={profileData.originCountry}
                  onChange={(e) => setProfileData({ ...profileData, originCountry: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-300 focus:border-primary outline-none"
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Pays actuel</Label>
                <select
                  value={profileData.currentCountry}
                  onChange={(e) => setProfileData({ ...profileData, currentCountry: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border-2 border-gray-300 focus:border-primary outline-none"
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {isDiaspora && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <p className="text-sm font-medium text-purple-900">
                    🌍 Badge Diaspora activé !
                  </p>
                  <p className="text-xs text-purple-700 mt-1">
                    Vous faites partie de la diaspora {COUNTRIES.find(c => c.code === profileData.originCountry)?.name}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 rounded-xl"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-primary hover:bg-brand-orange shadow-love transition-smooth"
                >
                  {loading ? 'Enregistrement...' : 'Terminer'} <Heart className="ml-2" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Skip options */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/app')}
            className="text-sm text-text-meta hover:text-text-dark transition-colors"
          >
            Compléter plus tard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupScreen;


