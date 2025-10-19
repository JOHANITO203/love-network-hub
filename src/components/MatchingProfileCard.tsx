import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, X, MapPin, Briefcase, Star, Sparkles } from 'lucide-react';
import { astrologicalSigns, interests } from '@/data/profileOptions';
import { PhotoCarousel, PhotoViewer } from './PhotoCarousel';
import { useProfilePhotos, ProfilePhoto } from '@/hooks/useProfilePhotos';

interface MatchingProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  age: number;
  bio: string;
  location: string;
  profession: string;
  astrological_sign: string;
  interests: string[];
  profile_images: string[];
  compatibility_score: number;
  common_interests: string[];
}

interface MatchingProfileCardProps {
  profile: MatchingProfile;
  onLike: (profileId: string) => void;
  onPass: (profileId: string) => void;
}

export const MatchingProfileCard = ({ profile, onLike, onPass }: MatchingProfileCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
  const { getProfilePhotos } = useProfilePhotos();

  // Load profile photos from database
  useEffect(() => {
    const loadPhotos = async () => {
      const userPhotos = await getProfilePhotos(profile.user_id);
      if (userPhotos.length > 0) {
        setPhotos(userPhotos);
      } else if (profile.profile_images.length > 0) {
        // Fallback to legacy profile_images array
        const legacyPhotos: ProfilePhoto[] = profile.profile_images.map((url, index) => ({
          id: `legacy-${index}`,
          user_id: profile.user_id,
          file_name: `photo-${index}`,
          file_path: url,
          file_size: 0,
          mime_type: 'image/jpeg',
          width: 800,
          height: 1000,
          display_order: index + 1,
          is_primary: index === 0,
          is_verified: false,
          is_active: true,
          upload_source: 'legacy',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        setPhotos(legacyPhotos);
      }
    };
    loadPhotos();
  }, [profile.user_id, profile.profile_images, getProfilePhotos]);

  const getAstrologicalLabel = (sign: string) => {
    return astrologicalSigns.find(s => s.value === sign)?.label || sign;
  };

  const getInterestLabel = (interestValue: string) => {
    return interests.find(i => i.value === interestValue)?.label || interestValue;
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const handleExpandPhoto = (index: number) => {
    setPhotoViewerIndex(index);
    setPhotoViewerOpen(true);
  };

  return (
    <>
      <div className="w-full max-w-sm mx-auto">
        <Card className="overflow-hidden bg-card/95 backdrop-blur-md border-border/40 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.08),0_16px_48px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12),0_24px_64px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div className="relative">
            {/* PhotoCarousel with multiple photos */}
            <div className="relative" onClick={() => setShowDetails(!showDetails)}>
              <PhotoCarousel
                photos={photos}
                showControls={true}
                showIndicators={true}
                showVerificationBadge={true}
                onExpand={handleExpandPhoto}
                size="medium"
                aspectRatio="portrait"
                className="cursor-pointer"
              />

              {/* Compatibility Score Overlay */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className={`${getCompatibilityColor(profile.compatibility_score)} bg-black/60 backdrop-blur-md border-white/30 shadow-md px-3 py-1.5`}>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  <span className="font-semibold">{profile.compatibility_score}%</span>
                </Badge>
              </div>

              {/* Basic Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 text-white z-10 pointer-events-none">
                <h3 className="text-xl font-bold">
                  {profile.first_name} {profile.last_name}
                </h3>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <span>{profile.age} ans</span>
                  {profile.location && (
                    <>
                      <span>•</span>
                      <MapPin className="w-3 h-3" />
                      <span>{profile.location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

          {/* Detailed Info Panel */}
          {showDetails && (
            <CardContent className="p-6 space-y-5">
              {profile.bio && (
                <div>
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                </div>
              )}

              {profile.profession && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span>{profile.profession}</span>
                </div>
              )}

              {profile.astrological_sign && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span>{getAstrologicalLabel(profile.astrological_sign)}</span>
                </div>
              )}

              {/* Common Interests */}
              {profile.common_interests.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-primary">
                    🤝 Intérêts communs
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.common_interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {getInterestLabel(interest)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* All Interests */}
              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Centres d'intérêt</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.interests.slice(0, 6).map((interest) => (
                      <Badge
                        key={interest}
                        variant="outline"
                        className={`text-xs ${
                          profile.common_interests.includes(interest)
                            ? 'border-primary text-primary'
                            : ''
                        }`}
                      >
                        {getInterestLabel(interest)}
                      </Badge>
                    ))}
                    {profile.interests.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{profile.interests.length - 6}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex justify-center gap-6">
          <Button
            onClick={() => onPass(profile.id)}
            size="lg"
            variant="outline"
            className="rounded-full w-16 h-16 p-0 border-2 shadow-sm transition-all duration-300 hover:border-red-500 hover:text-red-500 hover:shadow-md hover:scale-110"
          >
            <X className="w-7 h-7" />
          </Button>

          <Button
            onClick={() => onLike(profile.id)}
            size="lg"
            className="rounded-full w-16 h-16 p-0 bg-gradient-primary shadow-md transition-all duration-300 hover:shadow-[0_8px_24px_rgba(233,64,87,0.35)] hover:scale-110"
          >
            <Heart className="w-7 h-7 fill-current" />
          </Button>
        </div>
      </Card>
    </div>

    {/* Fullscreen Photo Viewer */}
    <PhotoViewer
      photos={photos}
      initialIndex={photoViewerIndex}
      isOpen={photoViewerOpen}
      onClose={() => setPhotoViewerOpen(false)}
    />
  </>
  );
};