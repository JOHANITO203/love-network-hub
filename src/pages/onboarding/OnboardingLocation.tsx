import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { OnboardingState } from "./types";

export default function OnboardingLocation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const baseState = (location.state as OnboardingState) ?? {};

  const [loading, setLoading] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(Boolean(baseState.location));

  const handleEnableLocation = () => {
    if (!("geolocation" in navigator)) {
      toast({
        title: "Not supported",
        description: "Geolocation is not available on this device.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        setLocationEnabled(true);
        toast({ title: "Location enabled" });

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
        toast({
          title: "Unable to fetch location",
          description: "Please check your permissions and try again.",
          variant: "destructive",
        });
      }
    );
  };

  const handleSkip = () => {
    navigate("/onboarding/preferences", { state: baseState });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">
              Location
            </h1>

            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center space-y-8"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-xl"
          >
            <MapPin className="h-16 w-16 text-white" />
          </motion.div>

          {/* Content */}
          <div className="space-y-4 max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-display">
              Turn on location
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Find matches nearby and see who's around you. You can change this later from your settings.
            </p>
          </div>

          {/* Benefits */}
          <div className="w-full max-w-md space-y-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-800/50">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 text-left">
                Discover people near you
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 text-left">
                See accurate distance to matches
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                ✓
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 text-left">
                Get better match recommendations
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full max-w-md space-y-3">
            <Button
              onClick={handleEnableLocation}
              disabled={loading || locationEnabled}
              className="h-14 w-full rounded-xl bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white text-base font-semibold shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enabling...
                </>
              ) : locationEnabled ? (
                <>
                  <MapPin className="mr-2 h-5 w-5" />
                  Location active
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-5 w-5" />
                  Enable location
                </>
              )}
            </Button>

            <button
              onClick={handleSkip}
              className="w-full py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Skip for now
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
