import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  profession: string;
  images: string[];
  interests: string[];
}

interface ProfileCardProps {
  profile: Profile;
  onLike: (profileId: string) => void;
  onPass: (profileId: string) => void;
  className?: string;
}

export const ProfileCard = ({ profile, onLike, onPass, className }: ProfileCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onLike(profile.id);
      setIsAnimating(false);
    }, 300);
  };

  const handlePass = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onPass(profile.id);
      setIsAnimating(false);
    }, 300);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === profile.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? profile.images.length - 1 : prev - 1
    );
  };

  return (
    <Card className={cn(
      "w-full max-w-sm mx-auto overflow-hidden shadow-love transition-smooth",
      "hover:scale-105 hover:shadow-glow",
      isAnimating && "animate-pulse",
      className
    )}>
      <div className="relative h-96 overflow-hidden">
        <img
          src={profile.images[currentImageIndex]}
          alt={`${profile.name} photo ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Image navigation overlay */}
        <div className="absolute inset-0 flex">
          <button
            onClick={prevImage}
            className="flex-1 bg-transparent"
            aria-label="Previous image"
          />
          <button
            onClick={nextImage}
            className="flex-1 bg-transparent"
            aria-label="Next image"
          />
        </div>

        {/* Image indicators */}
        <div className="absolute top-4 left-4 right-4 flex gap-2">
          {profile.images.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full bg-white/30",
                index === currentImageIndex && "bg-white"
              )}
            />
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Profile info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">
            {profile.name}, {profile.age}
          </h3>
          <div className="flex items-center gap-2 mb-2 text-sm opacity-90">
            <MapPin className="w-4 h-4" />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Briefcase className="w-4 h-4" />
            <span>{profile.profession}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <p className="text-muted-foreground mb-4 line-clamp-3">{profile.bio}</p>
        
        {/* Interests */}
        <div className="flex flex-wrap gap-2 mb-6">
          {profile.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePass}
            className="w-16 h-16 rounded-full border-2 hover:bg-destructive hover:border-destructive hover:text-destructive-foreground"
          >
            <X className="w-6 h-6" />
          </Button>
          <Button
            size="lg"
            onClick={handleLike}
            className="w-16 h-16 rounded-full bg-gradient-primary hover:shadow-glow"
          >
            <Heart className="w-6 h-6 fill-current" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};