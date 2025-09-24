import { useState, useEffect, useCallback, useMemo } from "react";
import { ProfileCard } from "./ProfileCard";
import { SocialFeed } from "./SocialFeed";
import { Navigation } from "./Navigation";
import { ChatInterface } from "./ChatInterface";
import { ProfileSetup } from "./ProfileSetup";
import { DebugPanel } from "./DebugPanel";
import { MatchingProfileCard } from "./MatchingProfileCard";
import { MatchingPreferences } from "./MatchingPreferences";
import { NotificationCenter } from "./NotificationCenter";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Sparkles, Users, Crown, LogOut, Settings, RefreshCw } from "lucide-react";
import { mockProfiles, mockDatePosts, mockMatches, type MatchSummary } from "@/data/mockData";

import { orientationOptions, pronounOptions } from "@/data/profileOptions";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMatching } from "@/hooks/useMatching";
import { useSocialComments } from "@/hooks/useSocialComments";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-love.jpg";

type NavSection = "discover" | "matches" | "messages" | "social" | "profile";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  profile_images: string[] | null;
  pronouns: string | null;
  custom_pronouns: string | null;
  orientation: string | null;
  persona_symbols: string[] | null;
}

interface SupabaseProfileRow extends UserProfile {
  user_id: string;
  bio: string | null;
  location: string | null;
  profession: string | null;
  astrological_sign: string | null;
  interests: string[] | null;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export const DatingApp = () => {
  const [activeSection, setActiveSection] = useState<NavSection>("discover");
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [socialPosts, setSocialPosts] = useState(mockDatePosts);
  const postIds = useMemo(() => socialPosts.map((post) => post.id), [socialPosts]);
  const { commentsByPost, loading: commentsLoading, addComment } = useSocialComments(postIds);
  const [selectedMatch, setSelectedMatch] = useState<MatchSummary | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const { 
    currentProfile, 
    potentialMatches, 
    userPreferences, 
    loading: matchingLoading,
    handleLike, 
    handlePass, 
    updatePreferences,
    loadPotentialMatches 
  } = useMatching();

  const checkProfileSetup = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from<SupabaseProfileRow>('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data && data.first_name && data.last_name) {
        const normalizedProfile: UserProfile = {
          id: data.id,
          first_name: data.first_name ?? null,
          last_name: data.last_name ?? null,
          profile_images: data.profile_images ?? null
        };
        setUserProfile(normalizedProfile);
        setProfileSetupComplete(true);
        setIsEditingProfile(false);
      } else {
        setUserProfile(null);
        setProfileSetupComplete(false);
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.error('Error checking profile setup:', error);
      setProfileSetupComplete(false);
      setIsEditingProfile(false);
      setUserProfile(null);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      checkProfileSetup();
    }
  }, [user, checkProfileSetup]);

  const handleProfileComplete = (profile: UserProfile) => {
    // Debug forcé dans console
    console.log('🚀 [FINALISATION] Profile completed:', profile);
    console.log('🚀 [FINALISATION] Profile type:', typeof profile);
    console.log('🚀 [FINALISATION] Profile keys:', Object.keys(profile || {}));
    console.log('🚀 [FINALISATION] first_name:', profile?.first_name);
    console.log('🚀 [FINALISATION] profileSetupComplete avant:', profileSetupComplete);

    window.addDebugLog?.('=== FINALISATION PROFIL ===');
    window.addDebugLog?.('Profil reçu: ' + JSON.stringify(profile).slice(0, 100));
    window.addDebugLog?.('first_name: ' + profile?.first_name);

    try {
      console.log('🚀 [FINALISATION] Étape 1: setUserProfile');
      const normalizedProfile: UserProfile = {
        id: profile.id,
        first_name: profile.first_name ?? null,
        last_name: profile.last_name ?? null,
        profile_images: profile.profile_images ?? null
      };
      setUserProfile(normalizedProfile);

      // PROTECTION: ne pas changer profileSetupComplete si profile est vide
      if (!profile || !profile.first_name) {
        console.error('🚀 [FINALISATION] ERREUR: Profil invalide - on ne change pas profileSetupComplete');
        window.addDebugLog?.('ERREUR: Profil invalide, finalisation annulée');
        return;
      }

      console.log('🚀 [FINALISATION] Étape 2: setProfileSetupComplete(true)');
      setProfileSetupComplete(true);
      setIsEditingProfile(false);

      console.log('🚀 [FINALISATION] Profile setup marked as complete');
      console.log('🚀 [FINALISATION] profileSetupComplete après:', true);
      window.addDebugLog?.('setProfileSetupComplete(true) OK');
      window.addDebugLog?.('Configuration profil terminée ✅');
    } catch (error) {
      console.error('🚀 [FINALISATION] Error in handleProfileComplete:', error);
      window.addDebugLog?.('Erreur finalisation profil: ' + getErrorMessage(error));
      toast({
        title: "Erreur",
        description: "Erreur lors de la finalisation du profil",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const handleLikeOld = (profileId: string) => {
    toast({
      title: "It's a match! 💕",
      description: "You and this person liked each other!",
    });
    
    // Move to next profile
    if (currentProfileIndex < mockProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setCurrentProfileIndex(0);
    }
  };

  const handlePassOld = (profileId: string) => {
    // Move to next profile
    if (currentProfileIndex < mockProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setCurrentProfileIndex(0);
    }
  };

  const handleSocialLike = (postId: string) => {
    setSocialPosts(posts =>
      posts.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleSubmitComment = useCallback(async (postId: string, comment: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour commenter une date story.",
        variant: "destructive",
      });
      return;
    }

    const authorName = [userProfile?.first_name ?? "", userProfile?.last_name ?? ""].join(" ").trim() || user.email || "Moi";
    const authorAvatar = userProfile?.profile_images?.[0] ?? null;

    await addComment(postId, comment, user.id, authorName, authorAvatar);
  }, [addComment, toast, user, userProfile]);

  const handleSocialShare = (postId: string) => {
    toast({
      title: "Shared successfully!",
      description: "This beautiful date story has been shared.",
    });
  };

  const renderDiscoverSection = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Découvrir
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreferences(true)}
            className="text-muted-foreground hover:text-primary"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-muted-foreground">Trouvez votre match parfait</p>
      </div>
      
      {matchingLoading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Recherche de profils compatibles...</p>
        </div>
      ) : currentProfile ? (
        <MatchingProfileCard
          profile={currentProfile}
          onLike={handleLike}
          onPass={handlePass}
        />
      ) : (
        <div className="text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-gradient-primary mx-auto flex items-center justify-center">
            <Heart className="w-12 h-12 text-white fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Plus de profils pour le moment</h3>
            <p className="text-muted-foreground mb-4">
              Revenez plus tard ou ajustez vos préférences
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => setShowPreferences(true)}
                variant="outline"
              >
                <Settings className="w-4 h-4 mr-2" />
                Préférences
              </Button>
              <Button
                onClick={loadPotentialMatches}
                className="bg-gradient-primary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMatchesSection = () => (
    <div className="p-4 pb-20 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Your Matches
        </h2>
        <p className="text-muted-foreground">People who liked you back</p>
      </div>

      <div className="space-y-4">
        {mockMatches.map((match) => (
          <Card key={match.id} className="overflow-hidden hover:shadow-card transition-smooth">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={match.avatar} alt={match.name} />
                    <AvatarFallback>{match.name[0]}</AvatarFallback>
                  </Avatar>
                  {match.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{match.name}</h3>
                    <Heart className="w-4 h-4 text-love-primary fill-current" />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {match.lastMessage}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {match.timeAgo}
                  </p>
                </div>

                <Button 
                  size="sm" 
                  className="bg-gradient-primary"
                  onClick={() => setSelectedMatch(match)}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMessagesSection = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4">
      <div className="text-center mb-8">
        <MessageCircle className="w-16 h-16 text-love-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Messages</h2>
        <p className="text-muted-foreground mb-6">Start conversations with your matches</p>
        <Button className="bg-gradient-primary">
          Browse Matches
        </Button>
      </div>
    </div>
  );

  const renderProfileSection = () => (
    <div className="p-4 pb-20 max-w-md mx-auto">
      <div className="text-center mb-6">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={userProfile?.profile_images?.[0] || ''} />
          <AvatarFallback>
            {userProfile?.first_name?.[0] || user?.email?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold mb-1">
          {userProfile?.first_name || 'Your Profile'}
        </h2>
        <p className="text-muted-foreground">Show your best self</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-love-primary" />
            Profile Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Profile Views</span>
            <Badge variant="secondary">142 this week</Badge>
          </div>
          <div className="flex justify-between">
            <span>Likes Received</span>
            <Badge variant="secondary">28 new</Badge>
          </div>
          <div className="flex justify-between">
            <span>Matches</span>
            <Badge className="bg-gradient-primary">12 total</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            setIsEditingProfile(true);
            setProfileSetupComplete(false);
          }}
        >
          Edit Profile
        </Button>
        <Button variant="outline" className="w-full">
          Settings & Privacy
        </Button>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <Crown className="w-4 h-4 text-yellow-500" />
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "discover":
        return renderDiscoverSection();
      case "matches":
        return renderMatchesSection();
      case "messages":
        return renderMessagesSection();
      case "social":
        return (
          <div className="pb-20 pt-4">
            <SocialFeed
              posts={socialPosts}
              commentsByPost={commentsByPost}
              commentsLoading={commentsLoading}
              onLike={handleSocialLike}
              onSubmitComment={handleSubmitComment}
              onShare={handleSocialShare}
            />
          </div>
        );
      case "profile":
        return renderProfileSection();
      default:
        return renderDiscoverSection();
    }
  };

  // Show preferences if requested
  if (showPreferences) {
    return (
      <MatchingPreferences
        preferences={userPreferences}
        onUpdatePreferences={updatePreferences}
        onBack={() => setShowPreferences(false)}
      />
    );
  }

  // Show profile setup if not complete
  if (!profileSetupComplete) {
    return (
      <ProfileSetup
        onProfileComplete={handleProfileComplete}
        onExit={isEditingProfile ? () => {
          setProfileSetupComplete(true);
          setIsEditingProfile(false);
          checkProfileSetup();
        } : undefined}
      />
    );
  }

  // Show chat interface if a match is selected
  if (selectedMatch) {
    return (
      <ChatInterface
        matchId={selectedMatch.id}
        matchName={selectedMatch.name}
        matchAvatar={selectedMatch.avatar}
        matchLanguages={selectedMatch.languages}
        onBack={() => setSelectedMatch(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* Header */}
      <header className="bg-card/80 dark:bg-background/90 backdrop-blur-lg border-b border-border/50 p-4 transition-colors">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-love-primary fill-current" />
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              МойDate
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <NotificationCenter />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-0">
        {renderContent()}
      </main>

      {/* Navigation */}
      <Navigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Debug Panel - visible partout */}
      <DebugPanel />
    </div>
  );
};
