import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, X, MapPin, Briefcase, Star, Sparkles, User } from 'lucide-react';
import { astrologicalSigns, interests } from '@/data/profileOptions';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const getAstrologicalLabel = (sign: string) => {
    return astrologicalSigns.find(s => s.value === sign)?.label || sign;
  };

  const getInterestLabel = (interestValue: string) => {
    return interests.find(i => i.value === interestValue)?.label || interestValue;
  };

  const nextImage = () => {
    if (profile.profile_images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === profile.profile_images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (profile.profile_images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? profile.profile_images.length - 1 : prev - 1
      );
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
        <div className="relative">
          {/* Main Image */}
          <div 
            className="aspect-[3/4] bg-gradient-to-b from-transparent to-black/20 relative cursor-pointer"
            onClick={() => setShowDetails(!showDetails)}
          >
            {profile.profile_images.length > 0 ? (
              <img
                src={profile.profile_images[currentImageIndex]}
                alt={`${profile.first_name}'s photo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <User className="w-24 h-24 text-muted-foreground" />
              </div>
            )}

            {/* Image Navigation */}
            {profile.profile_images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
                >
                  ›
                </button>

                {/* Image indicators */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {profile.profile_images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Compatibility Score */}
            <div className="absolute top-4 right-4">
              <Badge className={`${getCompatibilityColor(profile.compatibility_score)} bg-black/20 backdrop-blur-sm border-white/20`}>
                <Sparkles className="w-3 h-3 mr-1" />
                {profile.compatibility_score}%
              </Badge>
            </div>

            {/* Basic Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
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
            <CardContent className="p-4 space-y-4">
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
        <div className="p-4 flex justify-center gap-4">
          <Button
            onClick={() => onPass(profile.id)}
            size="lg"
            variant="outline"
            className="rounded-full w-14 h-14 p-0 border-2 hover:border-red-500 hover:text-red-500"
          >
            <X className="w-6 h-6" />
          </Button>

          <Button
            onClick={() => onLike(profile.id)}
            size="lg"
            className="rounded-full w-14 h-14 p-0 bg-gradient-primary hover:scale-105 transition-transform"
          >
            <Heart className="w-6 h-6 fill-current" />
          </Button>
        </div>
      </Card>
    </div>
  );
};