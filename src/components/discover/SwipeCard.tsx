import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, X, Star, MapPin, Briefcase, Sparkles, Check, Globe } from 'lucide-react';
import { astrologicalSigns, interests } from '@/data/profileOptions';
import { PhotoCarousel, PhotoViewer } from '@/components/PhotoCarousel';
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
  country?: string;
  current_country?: string;
}

interface SwipeCardProps {
  profile: MatchingProfile;
  onLike: (profileId: string) => void;
  onPass: (profileId: string) => void;
  onSuperlike: (profileId: string) => void;
}

const SWIPE_THRESHOLD = 100;
const ROTATION_RANGE = 15;

export const SwipeCard = ({ profile, onLike, onPass, onSuperlike }: SwipeCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
  const [exitX, setExitX] = useState(0);
  const { getProfilePhotos } = useProfilePhotos();

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-ROTATION_RANGE, 0, ROTATION_RANGE]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

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

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
      // Swipe left or right
      setExitX(info.offset.x > 0 ? 1000 : -1000);

      if (info.offset.x > 0) {
        onLike(profile.id);
      } else {
        onPass(profile.id);
      }
    } else if (info.offset.y < -SWIPE_THRESHOLD) {
      // Swipe up for superlike
      setExitX(0);
      onSuperlike(profile.id);
    }
  };

  const handleButtonClick = (action: 'pass' | 'like' | 'superlike') => {
    switch (action) {
      case 'pass':
        setExitX(-1000);
        onPass(profile.id);
        break;
      case 'like':
        setExitX(1000);
        onLike(profile.id);
        break;
      case 'superlike':
        setExitX(0);
        onSuperlike(profile.id);
        break;
    }
  };

  const isIntercultural = profile.country && profile.current_country && profile.country !== profile.current_country;

  return (
    <>
      <div className="w-full max-w-sm mx-auto">
        <motion.div
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
          animate={exitX !== 0 ? { x: exitX } : {}}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative cursor-grab active:cursor-grabbing"
        >
          <Card className="overflow-hidden bg-card/95 backdrop-blur-md border-brand-red/20 rounded-3xl shadow-[0_8px_24px_rgba(233,64,87,0.12),0_16px_48px_rgba(233,64,87,0.08)] hover:shadow-[0_12px_32px_rgba(233,64,87,0.16),0_24px_64px_rgba(233,64,87,0.12)] transition-all duration-500">
            <div className="relative">
              {/* Photo Carousel */}
              <div className="relative" onClick={() => setShowDetails(!showDetails)}>
                <PhotoCarousel
                  photos={photos}
                  showControls={true}
                  showIndicators={true}
                  showVerificationBadge={true}
                  onExpand={handleExpandPhoto}
                  size="large"
                  aspectRatio="portrait"
                  className="cursor-pointer"
                />

                {/* Compatibility Score Overlay */}
                <div className="absolute top-5 right-5 z-10">
                  <Badge className={`${getCompatibilityColor(profile.compatibility_score)} bg-black/70 backdrop-blur-md border-white/40 shadow-lg px-3.5 py-2`}>
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    <span className="font-semibold text-base">{profile.compatibility_score}%</span>
                  </Badge>
                </div>

                {/* Verified Badge */}
                <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                  {photos.some(p => p.is_verified) && (
                    <Badge className="bg-blue-500/90 backdrop-blur-md border-white/40 text-white shadow-lg px-3 py-1.5">
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      <span className="font-semibold">Vérifié</span>
                    </Badge>
                  )}
                  {isIntercultural && (
                    <Badge className="bg-brand-purple/90 backdrop-blur-md border-white/40 text-white shadow-lg px-3 py-1.5">
                      <Globe className="w-3.5 h-3.5 mr-1.5" />
                      <span className="font-semibold">Interculturel</span>
                    </Badge>
                  )}
                </div>

                {/* Basic Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 text-white z-10 pointer-events-none">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold">
                      {profile.first_name}, {profile.age}
                    </h3>
                    {profile.country && (
                      <span className="text-2xl">{profile.country}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm opacity-90">
                    {profile.profession && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{profile.profession}</span>
                      </div>
                    )}
                    {profile.astrological_sign && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{getAstrologicalLabel(profile.astrological_sign)}</span>
                      </div>
                    )}
                  </div>

                  {profile.location && (
                    <div className="flex items-center gap-1 text-sm opacity-90 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Info Panel */}
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-8 space-y-5 bg-card/95 backdrop-blur-md border-t border-brand-red/10">
                    {profile.bio && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
                      </motion.div>
                    )}

                    {/* Common Interests */}
                    {profile.common_interests.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h4 className="text-sm font-medium mb-2 text-brand-red flex items-center gap-1">
                          <Heart className="w-4 h-4 fill-current" />
                          Intérêts communs
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.common_interests.map((interest) => (
                            <Badge key={interest} className="bg-gradient-moydate text-white shadow-soft">
                              {getInterestLabel(interest)}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* All Interests */}
                    {profile.interests && profile.interests.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h4 className="text-sm font-medium mb-2">Centres d'intérêt</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.slice(0, 8).map((interest) => (
                            <Badge
                              key={interest}
                              variant="outline"
                              className={`text-xs transition-smooth ${
                                profile.common_interests.includes(interest)
                                  ? 'border-brand-red text-brand-red bg-brand-red/5'
                                  : 'hover:border-brand-orange hover:text-brand-orange'
                              }`}
                            >
                              {getInterestLabel(interest)}
                            </Badge>
                          ))}
                          {profile.interests.length > 8 && (
                            <Badge variant="outline" className="text-xs">
                              +{profile.interests.length - 8}
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="p-8 flex justify-center items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={() => handleButtonClick('pass')}
              size="lg"
              variant="outline"
              className="rounded-full w-16 h-16 p-0 border-2 border-gray-300 shadow-md transition-all duration-300 hover:border-red-500 hover:text-red-500 hover:bg-red-50 hover:shadow-lg"
            >
              <X className="w-7 h-7" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }} whileTap={{ scale: 0.85 }}>
            <Button
              onClick={() => handleButtonClick('superlike')}
              size="lg"
              variant="outline"
              className="rounded-full w-14 h-14 p-0 border-2 border-yellow-400 shadow-md transition-all duration-300 hover:border-yellow-500 hover:text-yellow-500 hover:bg-yellow-50 hover:shadow-lg"
            >
              <Star className="w-6 h-6" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <Button
              onClick={() => handleButtonClick('like')}
              size="lg"
              className="rounded-full w-16 h-16 p-0 bg-gradient-moydate shadow-md transition-all duration-300 hover:shadow-[0_8px_24px_rgba(233,64,87,0.35)]"
            >
              <Heart className="w-7 h-7 fill-current" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Keyboard Shortcuts Hint */}
        <div className="text-center text-xs text-muted-foreground mt-2">
          <p>← Passer • ↑ Superlike • → Aimer</p>
        </div>
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
