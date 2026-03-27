import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useConsent } from "@/hooks/useConsent";
import type { OnboardingState } from "./types";

export default function OnboardingLocation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { updateConsent } = useConsent();
  const baseState = (location.state as OnboardingState) ?? {};

  const [loading, setLoading] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(Boolean(baseState.location));

  const handleEnableLocation = () => {
    if (!("geolocation" in navigator)) {
      toast({
        title: "Non pris en charge",
        description: "La géolocalisation n'est pas disponible sur cet appareil.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        setLocationEnabled(true);
        void updateConsent("location", true);
        toast({ title: "Localisation activée" });

        const payload: OnboardingState = {
          ...baseState,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          locationEnabled: true,
        };

        setTimeout(() => {
          navigate("/onboarding/preferences", { state: payload });
        }, 600);
      },
      () => {
        setLoading(false);
        void updateConsent("location", false);
        toast({
          title: "Localisation impossible",
          description: "Vérifiez vos permissions et réessayez.",
          variant: "destructive",
        });
      }
    );
  };

  const handleSkip = () => {
    void updateConsent("location", false);
    navigate("/onboarding/preferences", { state: baseState });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 glass-surface border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full text-white/80">
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <h1 className="text-lg font-semibold text-white font-display">Localisation</h1>

            <div className="w-10" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a] shadow-xl"
          >
            <MapPin className="h-14 w-14 text-white" />
          </motion.div>

          <div className="space-y-4 max-w-md">
            <h2 className="text-3xl font-semibold text-white font-display">Activer la localisation</h2>
            <p className="text-white/60 text-lg">
              Trouvez des profils proches et voyez la distance réelle. Vous pourrez changer ça plus tard.
            </p>
          </div>

          <div className="w-full max-w-md space-y-3 glass-panel rounded-2xl p-6 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <p className="text-sm text-white/70 text-left">Découvrez des personnes proches</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <p className="text-sm text-white/70 text-left">Distance fiable sur chaque profil</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <p className="text-sm text-white/70 text-left">Recommandations plus pertinentes</p>
            </div>
          </div>

          <div className="w-full max-w-md space-y-3">
            <Button
              onClick={handleEnableLocation}
              disabled={loading || locationEnabled}
              className="h-14 w-full rounded-xl bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a] text-white text-base font-semibold shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Activation...
                </>
              ) : locationEnabled ? (
                <>
                  <MapPin className="mr-2 h-5 w-5" />
                  Localisation active
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-5 w-5" />
                  Activer la localisation
                </>
              )}
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
