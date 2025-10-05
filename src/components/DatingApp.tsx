import { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { ProfileCard } from "./ProfileCard";

import { Navigation } from "./Navigation";

import { ChatInterface } from "./ChatInterface";


import { MatchingProfileCard } from "./MatchingProfileCard";


import { NotificationCenter } from "./NotificationCenter";
import { ThemeToggle } from "./ThemeToggle";

import { MatchModal } from "./match/MatchModal";

import { MatchesView, mockMatchesListing } from "@/features/matches";
import { MatchesScreen } from "@/features/matches-modern";

import {

  MessagesView,

  mockStories,

  mockMessages,

  ConversationView,

  mockConversations,

} from "@/features/messages";

import { MessagesScreen } from "@/features/messages-modern";

import { StoryViewer, mockStorySlides } from "@/features/stories";

import { ProfileHub } from "@/features/profile";
import { ProfileScreen } from "@/features/profile-modern";

import { SocialFeedView } from "@/features/feed";
import { SocialFeedScreen } from "@/features/social-modern";

import { DiscoverMain } from "@/features/discover";
import { Discover } from "@/features/discover-modern";

import { Button } from "@/components/ui/button";

import {

  Heart,

  MessageCircle,

  Users,

  Crown,

  LogOut,

  Settings,

  RefreshCw,

} from "lucide-react";

import {

  mockProfiles,

  type MatchSummary,

} from "@/data/mockData";

import { useToast } from "@/hooks/use-toast";

import { useAuth } from "@/hooks/useAuth";

import { useMatching } from "@/hooks/useMatching";

import heroImage from "@/assets/hero-love.jpg";

type NavSection = "discover" | "matches" | "messages" | "social" | "profile";

interface UserProfile {

  id: string;

  first_name: string | null;

  last_name: string | null;

  profile_images: string[] | null;

}

interface SupabaseProfileRow extends UserProfile {

  profile_images: string[] | null;

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

  const [selectedMatch, setSelectedMatch] = useState<MatchSummary | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [profileSetupComplete, setProfileSetupComplete] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);


  const [showStory, setShowStory] = useState(false);

  const { toast } = useToast();

  const { signOut, user } = useAuth();

  const navigate = useNavigate();

  const {

    currentProfile,

    potentialMatches,

    userPreferences,

    loading: matchingLoading,

    handleLike,

    handlePass,

    updatePreferences,

    loadPotentialMatches,

    matchModalData,

    showMatchModal,

    closeMatchModal,

  } = useMatching();

  const checkProfileSetup = useCallback(async () => {

    if (!user) return;

    try {

      // Mock: Check localStorage for profile

      const storedProfile = localStorage.getItem("moydate_profile");

      if (storedProfile) {

        const data = JSON.parse(storedProfile);

        if (data.firstName && data.dateOfBirth) {

          const normalizedProfile: UserProfile = {

            id: user.id,

            first_name: data.firstName ?? null,

            last_name: data.lastName ?? null,

            profile_images: null, // Don't try to load File objects from localStorage

          };

          setUserProfile(normalizedProfile);

          setProfileSetupComplete(true);

          setIsEditingProfile(false);

        } else {

          setUserProfile(null);

          setProfileSetupComplete(false);

          setIsEditingProfile(false);

        }

      } else {

        setUserProfile(null);

        setProfileSetupComplete(false);

        setIsEditingProfile(false);

      }

    } catch (error) {

      console.error("Error checking profile setup:", error);

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

  const handleProfileComplete = (
    profile: UserProfile & { profile_images: string[] | null },
  ) => {
    try {



      const normalizedProfile: UserProfile = {

        id: profile.id,

        first_name: profile.first_name ?? null,

        last_name: profile.last_name ?? null,

        profile_images: profile.profile_images ?? null,

      };

      setUserProfile(normalizedProfile);

      // PROTECTION: ne pas changer profileSetupComplete si profile est vide

      if (!profile || !profile.first_name) {

        console.error(

          "🚀 [FINALISATION] ERREUR: Profil invalide - on ne change pas profileSetupComplete",

        );

        return;

      }

      setProfileSetupComplete(true);

      setIsEditingProfile(false);

    } catch (error) {

      console.error("🚀 [FINALISATION] Error in handleProfileComplete:", error);

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

    setSocialPosts((posts) =>

      posts.map((post) =>

        post.id === postId

          ? {

              ...post,

              isLiked: !post.isLiked,

              likes: post.isLiked ? post.likes - 1 : post.likes + 1,

            }

          : post,

      ),

    );

  };

  const handleSocialComment = (postId: string) => {

    toast({

      title: "Comment feature coming soon!",

      description: "We're working on making conversations even better.",

    });

  };

  const handleSocialShare = (postId: string) => {

    toast({

      title: "Shared successfully!",

      description: "This beautiful date story has been shared.",

    });

  };

  const renderDiscoverSection = () => <Discover />;

  const renderMatchesSection = () => <MatchesScreen />;

  const renderMessagesSection = () => <MessagesScreen />;

  const handleProfileSettings = () => {

    toast({

      title: 'Param\u00e8tres',

      description: 'Les param\u00e8tres arrivent bient\u00f4t.',

    });

  };



  const handleUpgrade = () => {

    toast({

      title: 'Premium en approche',

      description: 'Le pass Premium sera disponible tr\u00e8s bient\u00f4t.',

    });

  };



  const renderProfileSection = () => <ProfileScreen />;



  const renderContent = () => {

    switch (activeSection) {

      case "discover":

        return renderDiscoverSection();

      case "matches":

        return renderMatchesSection();

      case "messages":

        return renderMessagesSection();

      case "social":

        return <SocialFeedScreen />;

      case "profile":

        return renderProfileSection();

      default:

        return renderDiscoverSection();

    }

  };

  // Show preferences if requested


  // Profile setup is now handled via onboarding flow for new users
  // Existing users go directly to the app
  // ProfileSetupScreen is available as manual route for editing profile later

  // Show chat interface if a match is selected

  if (selectedMatch) {

    const conversation = mockConversations.find(

      (entry) => entry.matchId === selectedMatch.id,

    );

    const fallback = conversation?.messages ?? [

      {

        id: "fallback-1",

        sender: "them" as const,

        content: `Say hello to ${selectedMatch.name}!`,

        time: "Just now",

      },

    ];

    return (

      <ConversationView

        matchName={selectedMatch.name}

        matchAvatar={selectedMatch.avatar}

        statusLabel={selectedMatch.isOnline ? "Online" : selectedMatch.timeAgo}

        messages={fallback}

        onBack={() => setSelectedMatch(null)}

      />

    );

  }

  return (

    <div className="min-h-screen bg-gradient-subtle dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-950 dark:to-black">

      {/* Header */}

      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-border/50 dark:border-gray-800 p-4">

        <div className="flex items-center justify-between max-w-md mx-auto">

          <div className="flex items-center gap-2">

            <Heart className="w-6 h-6 text-love-primary fill-current" />

            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">

              МойDate

            </h1>

          </div>

          <div className="flex items-center gap-2">

            <ThemeToggle />

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

      <main className="relative z-0">{renderContent()}</main>

      {/* Navigation */}

      <Navigation

        activeSection={activeSection}

        onSectionChange={setActiveSection}

      />

      {/* Match Modal */}

      {matchModalData && (

        <MatchModal

          isOpen={showMatchModal}

          onClose={closeMatchModal}

          currentUserPhoto={matchModalData.currentUserPhoto}

          currentUserName={matchModalData.currentUserName}

          matchedUserPhoto={matchModalData.matchedUserPhoto}

          matchedUserName={matchModalData.matchedUserName}

          onSayHello={() => {

            // TODO: Navigate to chat with matched user

            toast({

              title: "Chat ouvert",

              description: `Commencez à discuter avec ${matchModalData.matchedUserName}`,

            });

            closeMatchModal();

          }}

        />

      )}

    </div>

  );

};
