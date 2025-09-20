import { useState } from "react";
import { ProfileCard } from "./ProfileCard";
import { SocialFeed } from "./SocialFeed";
import { Navigation } from "./Navigation";
import { ChatInterface } from "./ChatInterface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Sparkles, Users, Crown, LogOut } from "lucide-react";
import { mockProfiles, mockDatePosts, mockMatches } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-love.jpg";

type NavSection = "discover" | "matches" | "messages" | "social" | "profile";

export const DatingApp = () => {
  const [activeSection, setActiveSection] = useState<NavSection>("discover");
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [socialPosts, setSocialPosts] = useState(mockDatePosts);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const { toast } = useToast();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  const handleLike = (profileId: string) => {
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

  const handlePass = (profileId: string) => {
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

  const renderDiscoverSection = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Find Your Match
        </h1>
        <p className="text-muted-foreground">Discover amazing people near you</p>
      </div>
      
      {mockProfiles.length > 0 && (
        <ProfileCard
          profile={mockProfiles[currentProfileIndex]}
          onLike={handleLike}
          onPass={handlePass}
        />
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
          <AvatarImage src={mockProfiles[0].images[0]} />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold mb-1">Your Profile</h2>
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
        <Button variant="outline" className="w-full">
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
              onLike={handleSocialLike}
              onComment={handleSocialComment}
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

  // Show chat interface if a match is selected
  if (selectedMatch) {
    return (
      <ChatInterface
        matchName={selectedMatch.name}
        matchAvatar={selectedMatch.avatar}
        onBack={() => setSelectedMatch(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-border/50 p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-love-primary fill-current" />
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              LoveConnect
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
          </Button>
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
    </div>
  );
};