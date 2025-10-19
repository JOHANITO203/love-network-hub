import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import SignupContact from "./pages/SignupContact";
import SignupVerify from "./pages/SignupVerify";
import OnboardingBasics from "./pages/onboarding/OnboardingBasics";
import OnboardingGender from "./pages/onboarding/OnboardingGender";
import OnboardingPhotos from "./pages/onboarding/OnboardingPhotos";
import OnboardingBio from "./pages/onboarding/OnboardingBio";
import OnboardingLocation from "./pages/onboarding/OnboardingLocation";
import OnboardingPreferences from "./pages/onboarding/OnboardingPreferences";
import OnboardingComplete from "./pages/onboarding/OnboardingComplete";
import ProfileSetupScreen from "./pages/ProfileSetupScreen";
import ProfileDetailsPage from "./pages/ProfileDetails";
import ProfileDetailScreen from "./pages/ProfileDetailScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup/contact" element={<SignupContact />} />
              <Route path="/signup/verify" element={<SignupVerify />} />
              <Route path="/onboarding/basics" element={<OnboardingBasics />} />
              <Route path="/onboarding/gender" element={<OnboardingGender />} />
              <Route path="/onboarding/photos" element={<OnboardingPhotos />} />
              <Route path="/onboarding/bio" element={<OnboardingBio />} />
              <Route path="/onboarding/location" element={<OnboardingLocation />} />
              <Route path="/onboarding/preferences" element={<OnboardingPreferences />} />
              <Route path="/onboarding/complete" element={<OnboardingComplete />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile-setup" element={<ProfileSetupScreen />} />
              <Route path="/profile/details" element={<ProfileDetailsPage />} />
              <Route path="/app" element={<Index />} />
              <Route path="/profile/:profileId" element={<ProfileDetailScreen />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
