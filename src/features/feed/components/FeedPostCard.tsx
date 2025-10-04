import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { FeedPost } from '../data/posts';

interface FeedPostCardProps {
  post: FeedPost;
  onViewProfile: (userId: string) => void;
  onOpenStory: (storyId: string) => void;
  onReact: (postId: string, reaction: 'like' | 'comment' | 'superlike' | 'share') => void;
}

const reactionButtonBase =
  'inline-flex items-center gap-2 rounded-full border border-border/40 px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-300 hover:border-brand-red hover:text-brand-red hover:shadow-md hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/50';

const initials = (value: string) =>
  value
    .split(' ')
    .map((chunk) => chunk.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const FeedPostCard = ({ post, onViewProfile, onOpenStory, onReact }: FeedPostCardProps) => {
  const handleOpenStory = () => {
    if (post.storyRef) {
      onOpenStory(post.storyRef);
    }
  };

  const renderMedia = () => {
    if (!post.media) {
      return null;
    }

    return (
      <motion.div
        className="relative overflow-hidden rounded-3xl shadow-sm"
        initial={{ opacity: 0.6, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <img src={post.media.url} alt={post.media.alt} className="h-64 w-full object-cover" />
        {post.storyRef && (
          <button
            type="button"
            onClick={handleOpenStory}
            className="absolute bottom-4 left-4 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-black/80"
          >
            Voir la story
          </button>
        )}
      </motion.div>
    );
  };

  const renderOverlay = () => {
    if (!post.overlay) return null;

    return (
      <motion.div
        className="absolute -top-8 right-6 min-w-[220px] max-w-[240px] rounded-2xl border border-brand-purple/20 bg-white/95 backdrop-blur-md p-5 text-sm font-semibold text-brand-purple shadow-[0_8px_24px_rgba(138,35,135,0.15),0_16px_48px_rgba(138,35,135,0.1)]"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {post.overlay.message}
      </motion.div>
    );
  };

  const renderSecondaryUser = () => {
    if (!post.secondaryUser) return null;

    return (
      <button
        type="button"
        onClick={() => onViewProfile(post.secondaryUser!.id)}
        className="flex items-center gap-2 text-left text-sm text-muted-foreground transition hover:text-brand-red"
      >
        <Avatar className="h-11 w-11 border-2 border-white shadow-md ring-2 ring-offset-2 ring-brand-red/10">
          <AvatarImage src={post.secondaryUser.avatar} alt={post.secondaryUser.name} />
          <AvatarFallback>{initials(post.secondaryUser.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{post.secondaryUser.name}</span>
          {post.secondaryUser.sign && <span>{post.secondaryUser.sign}</span>}
        </div>
      </button>
    );
  };

  return (
    <motion.article
      className="relative space-y-6 rounded-3xl border border-border/40 bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {renderOverlay()}

      <header className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => onViewProfile(post.primaryUser.id)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <Avatar className="h-14 w-14 border-2 border-brand-red/40 shadow-md ring-2 ring-offset-2 ring-brand-red/10">
            <AvatarImage src={post.primaryUser.avatar} alt={post.primaryUser.name} />
            <AvatarFallback>{initials(post.primaryUser.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">{post.headline}</h3>
              {post.tags?.slice(0, 1).map((tag) => (
                <Badge key={tag} variant="outline" className="border-brand-red/30 text-xs text-brand-red">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{post.subheadline}</p>
          </div>
        </button>
        <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold text-brand-red">
          {post.timestamp}
        </span>
      </header>

      {post.secondaryUser && (
        <div className="flex items-center justify-between rounded-2xl bg-brand-red/5 p-4">
          <div className="flex items-center gap-3">
            {renderSecondaryUser()}
          </div>
          <Badge variant="secondary" className="bg-brand-purple/10 text-brand-purple">
            Duo
          </Badge>
        </div>
      )}

      {renderMedia()}

      {post.body && <p className="text-sm leading-relaxed text-foreground/90">{post.body}</p>}

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-border/60 text-xs text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <footer className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onReact(post.id, 'like')}
            className={cn(reactionButtonBase, 'bg-white text-foreground')}
          >
            <Heart className="h-4 w-4" />
            {post.stats.likes}
          </button>
          <button
            type="button"
            onClick={() => onReact(post.id, 'comment')}
            className={reactionButtonBase}
          >
            <MessageCircle className="h-4 w-4" />
            {post.stats.comments}
          </button>
          {typeof post.stats.superLikes !== 'undefined' && (
            <button
              type="button"
              onClick={() => onReact(post.id, 'superlike')}
              className={cn(reactionButtonBase, 'border-brand-purple/40 text-brand-purple hover:border-brand-purple hover:text-brand-purple')}
            >
              <Sparkles className="h-4 w-4" />
              {post.stats.superLikes}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => onReact(post.id, 'share')}
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition hover:text-brand-red"
        >
          <Share2 className="h-4 w-4" />
          Partager
        </button>
      </footer>
    </motion.article>
  );
};
