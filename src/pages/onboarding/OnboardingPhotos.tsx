import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Upload, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { MediaFileSummary, OnboardingState } from "./types";

const MAX_FILES = 10;

interface MediaFile extends MediaFileSummary {
  file?: File;
}

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
};

const createMediaFile = (file: File): MediaFile => ({
  id: createId(),
  url: URL.createObjectURL(file),
  type: file.type.startsWith("video/") ? "video" : "image",
  file,
});

export default function OnboardingPhotos() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const baseState = (location.state as OnboardingState) ?? {};

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(() => {
    if (!Array.isArray(baseState.mediaFiles)) return [];
    return baseState.mediaFiles.map((item) => ({ ...item }));
  });

  useEffect(() => {
    return () => {
      mediaFiles.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [mediaFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    if (mediaFiles.length + files.length > MAX_FILES) {
      toast({
        title: "Limite atteinte",
        description: `Vous pouvez ajouter jusqu'à ${MAX_FILES} fichiers.`,
        variant: "destructive",
      });
      return;
    }

    const next = files.map(createMediaFile);
    setMediaFiles((prev) => [...prev, ...next]);
  };

  const removeFile = (id: string) => {
    setMediaFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleContinue = () => {
    if (!mediaFiles.length) return;

    const summaries: MediaFileSummary[] = mediaFiles.map(({ id, url, type }) => ({ id, url, type }));
    const rawFiles = mediaFiles
      .map((item) => item.file)
      .filter((item): item is File => Boolean(item));

    const payload: OnboardingState = {
      ...baseState,
      mediaFiles: summaries,
      photos: summaries.map((item) => item.url),
      rawMediaFiles: rawFiles,
    };

    navigate("/onboarding/bio", { state: payload });
  };

  const handleSkip = () => {
    navigate("/onboarding/bio", { state: baseState });
  };

  const uploadHint = useMemo(() => {
    if (!mediaFiles.length) return `Ajoutez jusqu'à ${MAX_FILES} photos ou vidéos`;
    return `${mediaFiles.length} / ${MAX_FILES} fichiers sélectionnés`;
  }, [mediaFiles.length]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 glass-surface border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full text-white/80">
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <h1 className="text-lg font-semibold text-white font-display">Photos</h1>

            <div className="w-10" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white font-display mb-2">Montrez-vous</h2>
            <p className="text-white/60">{uploadHint}</p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <AnimatePresence>
                {mediaFiles.map((media, index) => (
                  <motion.div
                    key={media.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-white/5 border border-white/10"
                  >
                    {media.type === "image" ? (
                      <img src={media.url} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="relative h-full w-full">
                        <video src={media.url} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Play className="h-12 w-12 text-white drop-shadow-lg" />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => removeFile(media.id)}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white opacity-0 transition-all group-hover:opacity-100 shadow-lg hover:scale-110"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a] text-white text-xs font-bold rounded-full shadow-lg">
                        Photo principale
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {mediaFiles.length < MAX_FILES && (
                <label
                  className={cn(
                    "aspect-square cursor-pointer rounded-xl border-2 border-dashed transition-all hover:scale-105",
                    "flex flex-col items-center justify-center gap-3",
                    "bg-white/5 border-white/20 hover:border-white/40",
                    mediaFiles.length === 0 && "col-span-2 sm:col-span-3"
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    {mediaFiles.length === 0 ? (
                      <ImageIcon className="h-16 w-16 text-white/70" />
                    ) : (
                      <Upload className="h-10 w-10 text-white/70" />
                    )}
                    <span className="text-sm font-semibold text-white/70">
                      {mediaFiles.length === 0 ? "Ajouter une première photo" : "Ajouter"}
                    </span>
                  </div>
                  <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>

            {mediaFiles.length > 0 && (
              <p className="text-xs text-center text-white/50 mt-4">
                💡 La première photo devient votre photo principale
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              disabled={!mediaFiles.length}
              className="h-14 w-full rounded-xl bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a] text-white text-base font-semibold shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Continuer
            </Button>

            <button
              onClick={handleSkip}
              className="w-full py-3 text-sm font-semibold text-white/60 hover:text-white transition-colors"
            >
              Passer pour l'instant
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
