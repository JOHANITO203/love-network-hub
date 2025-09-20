import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DatePost {
  id: string;
  user: {
    name: string;
    avatar: string;
    age: number;
  };
  partner: {
    name: string;
    avatar: string;
  };
  date: {
    title: string;
    location: string;
    date: string;
    rating: number;
    image: string;
    description: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  timeAgo: string;
}

interface SocialFeedProps {
  posts: DatePost[];
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

export const SocialFeed = ({ posts, onLike, onComment, onShare }: SocialFeedProps) => {
  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Date Stories
        </h2>
        <p className="text-muted-foreground">See how love stories unfold in our community</p>
      </div>

      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden shadow-card hover:shadow-love transition-smooth">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage src={post.partner.avatar} alt={post.partner.name} />
                  <AvatarFallback>{post.partner.name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {post.user.name} & {post.partner.name}
                </p>
                <p className="text-xs text-muted-foreground">{post.timeAgo}</p>
              </div>
              <Badge variant="outline" className="bg-gradient-subtle">
                ⭐ {post.date.rating}/5
              </Badge>
            </div>
          </CardHeader>

          <div className="relative">
            <img
              src={post.date.image}
              alt={post.date.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="font-bold text-lg mb-1">{post.date.title}</h3>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <MapPin className="w-4 h-4" />
                <span>{post.date.location}</span>
                <Calendar className="w-4 h-4 ml-2" />
                <span>{post.date.date}</span>
              </div>
            </div>
          </div>

          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {post.date.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLike(post.id)}
                  className={`gap-2 ${post.isLiked ? 'text-love-primary' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onComment(post.id)}
                  className="gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments}</span>
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(post.id)}
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};