import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SocialComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorAvatar?: string | null;
}

const buildAuthorName = (
  profile: { first_name: string | null; last_name: string | null } | undefined,
): string => {
  if (!profile) {
    return "Utilisateur";
  }

  const first = profile.first_name?.trim() ?? "";
  const last = profile.last_name?.trim() ?? "";
  const label = `${first} ${last}`.trim();
  return label.length > 0 ? label : "Utilisateur";
};

const extractAvatar = (profile: { profile_images: string[] | null } | undefined): string | null => {
  if (!profile?.profile_images || profile.profile_images.length === 0) {
    return null;
  }
  return profile.profile_images[0] ?? null;
};

const sortComments = (comments: SocialComment[]): SocialComment[] =>
  comments.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

interface UseSocialCommentsResult {
  commentsByPost: Record<string, SocialComment[]>;
  loading: boolean;
  addComment: (
    postId: string,
    content: string,
    userId: string,
    authorName: string,
    authorAvatar?: string | null,
  ) => Promise<void>;
}

export const useSocialComments = (postIds: string[]): UseSocialCommentsResult => {
  const { toast } = useToast();
  const [commentsByPost, setCommentsByPost] = useState<Record<string, SocialComment[]>>({});
  const [loading, setLoading] = useState(false);

  const loadComments = useCallback(async () => {
    if (!postIds.length) {
      setCommentsByPost({});
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("social_post_comments")
        .select("id, post_id, user_id, content, created_at")
        .in("post_id", postIds)
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      const rows = data ?? [];
      const uniqueUserIds = Array.from(new Set(rows.map((row) => row.user_id)));

      let profileMap: Record<string, { first_name: string | null; last_name: string | null; profile_images: string[] | null }> = {};

      if (uniqueUserIds.length > 0) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("user_id, first_name, last_name, profile_images")
          .in("user_id", uniqueUserIds);

        if (profileError) {
          throw profileError;
        }

        profileMap = Object.fromEntries(
          (profileData ?? []).map((profile) => [profile.user_id as string, profile])
        );
      }

      const mapped = rows.map((row) => {
        const profile = profileMap[row.user_id];
        return {
          id: row.id,
          postId: row.post_id,
          userId: row.user_id,
          content: row.content ?? "",
          createdAt: row.created_at,
          authorName: buildAuthorName(profile),
          authorAvatar: extractAvatar(profile),
        } as SocialComment;
      });

      const next: Record<string, SocialComment[]> = {};
      postIds.forEach((postId) => {
        next[postId] = sortComments(mapped.filter((comment) => comment.postId === postId));
      });

      setCommentsByPost(next);
    } catch (error) {
      console.error("Error loading comments", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commentaires.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [postIds, toast]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  useEffect(() => {
    if (!postIds.length) {
      return;
    }

    const channels = postIds.map((postId) =>
      supabase
        .channel(`social-comments-${postId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "social_post_comments",
            filter: `post_id=eq.${postId}`,
          },
          (payload) => {
            (async () => {
              const userId = payload.new.user_id as string;
              let profile:
                | { first_name: string | null; last_name: string | null; profile_images: string[] | null }
                | undefined;

              const { data: profileData } = await supabase
                .from("profiles")
                .select("first_name, last_name, profile_images")
                .eq("user_id", userId)
                .maybeSingle();

              if (profileData) {
                profile = profileData as typeof profile;
              }

              const newComment: SocialComment = {
                id: payload.new.id as string,
                postId,
                userId,
                content: (payload.new.content as string) ?? "",
                createdAt: payload.new.created_at as string,
                authorName: buildAuthorName(profile),
                authorAvatar: extractAvatar(profile),
              };

              setCommentsByPost((prev) => {
                const existing = prev[postId] ?? [];
                if (existing.some((comment) => comment.id === newComment.id)) {
                  return prev;
                }

                const withoutTemp = existing.filter((comment) =>
                  !(comment.id.startsWith("temp-") && comment.content === newComment.content && comment.userId === newComment.userId),
                );

                return {
                  ...prev,
                  [postId]: sortComments([...withoutTemp, newComment]),
                };
              });
            })().catch((error) => {
              console.error("Error handling realtime social comment", error);
            });
          },
        )
        .subscribe(),
    );

    return () => {
      channels.forEach((channel) => {
        void supabase.removeChannel(channel);
      });
    };
  }, [postIds]);

  const addComment = useCallback(
    async (
      postId: string,
      content: string,
      userId: string,
      authorName: string,
      authorAvatar?: string | null,
    ) => {
      const trimmed = content.trim();
      if (!trimmed) {
        toast({
          title: "Commentaire vide",
          description: "Veuillez saisir un commentaire avant d'envoyer.",
        });
        return;
      }

      const optimisticId = `temp-${Date.now()}`;
      const optimisticComment: SocialComment = {
        id: optimisticId,
        postId,
        userId,
        content: trimmed,
        createdAt: new Date().toISOString(),
        authorName,
        authorAvatar: authorAvatar ?? null,
      };

      setCommentsByPost((prev) => {
        const existing = prev[postId] ?? [];
        return {
          ...prev,
          [postId]: [...existing, optimisticComment],
        };
      });

      try {
        const { data, error } = await supabase
          .from("social_post_comments")
          .insert({
            post_id: postId,
            user_id: userId,
            content: trimmed,
          })
          .select("id, post_id, user_id, content, created_at")
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          const persisted: SocialComment = {
            id: data.id,
            postId: data.post_id,
            userId: data.user_id,
            content: data.content ?? "",
            createdAt: data.created_at,
            authorName,
            authorAvatar: authorAvatar ?? null,
          };

          setCommentsByPost((prev) => {
            const existing = prev[postId] ?? [];
            const withoutTemp = existing.filter((comment) => comment.id !== optimisticId);
            return {
              ...prev,
              [postId]: sortComments([...withoutTemp, persisted]),
            };
          });
        }
      } catch (error) {
        console.error("Error adding comment", error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le commentaire.",
          variant: "destructive",
        });
        setCommentsByPost((prev) => {
          const existing = prev[postId] ?? [];
          return {
            ...prev,
            [postId]: existing.filter((comment) => comment.id !== optimisticId),
          };
        });
      }
    },
    [toast],
  );

  return {
    commentsByPost,
    loading,
    addComment,
  };
};
