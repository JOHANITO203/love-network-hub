import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Chrome } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const SignupContact = () => {
  const navigate = useNavigate();
  const { signUp, signInWithOtp } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<"email" | "phone" | null>(null);
  const [pending, setPending] = useState(false);

  // Email form
  const [email, setEmail] = useState("");

  // Phone form
  const [dialCode, setDialCode] = useState("+33");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleEmailSignup = async () => {
    if (!email) {
      toast({ title: "Veuillez entrer votre email", variant: "destructive" });
      return;
    }
    setPending(true);
    const { error } = await signInWithOtp(email, false);
    setPending(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      navigate("/signup/verify", { state: { contact: email, method: "email" } });
    }
  };

  const handlePhoneSignup = async () => {
    if (!phoneNumber) {
      toast({ title: "Veuillez entrer votre numéro", variant: "destructive" });
      return;
    }
    setPending(true);
    const contact = dialCode + phoneNumber;
    const { error } = await signInWithOtp(contact, true);
    setPending(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      navigate("/signup/verify", { state: { contact, method: "phone" } });
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({ title: `Connexion avec ${provider}`, description: "Fonctionnalité à venir" });
    // Après connexion sociale réussie, rediriger vers /onboarding/basics
    // navigate("/onboarding/basics");
  };

  return (
    <div className="relative flex min-h-screen w-full justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <motion.div
        className="absolute top-20 right-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-1 flex-col px-6 pb-16 pt-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          type="button"
          onClick={() => navigate("/")}
          className="mb-12 inline-flex h-14 w-14 items-center justify-center rounded-full border border-border/50 bg-background/80 text-foreground shadow-sm backdrop-blur-sm transition-all hover:border-primary hover:scale-105 hover:shadow-md"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">Créer un compte</h1>
            <p className="text-muted-foreground">Choisissez votre méthode d'inscription</p>
          </div>

          {!mode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <Button
                onClick={() => setMode("email")}
                className="h-14 w-full rounded-xl bg-primary text-white shadow-love hover:scale-[1.02]"
              >
                <Mail className="mr-2 h-5 w-5" />
                Email
              </Button>

              <Button
                onClick={() => setMode("phone")}
                variant="outline"
                className="h-14 w-full rounded-xl border-2"
              >
                <Phone className="mr-2 h-5 w-5" />
                Numéro de téléphone
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => handleSocialLogin("Google")}
                  variant="outline"
                  className="h-12 w-full rounded-full border-border/50 transition-all hover:scale-[1.02] hover:border-primary/50"
                >
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuer avec Google
                </Button>

                <Button
                  onClick={() => handleSocialLogin("Facebook")}
                  variant="outline"
                  className="h-12 w-full rounded-full border-border/50 transition-all hover:scale-[1.02] hover:border-primary/50"
                >
                  <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continuer avec Facebook
                </Button>

                <Button
                  onClick={() => handleSocialLogin("Apple")}
                  variant="outline"
                  className="h-12 w-full rounded-full border-border/50 transition-all hover:scale-[1.02] hover:border-primary/50"
                >
                  <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Continuer avec Apple
                </Button>

                <Button
                  onClick={() => handleSocialLogin("Instagram")}
                  variant="outline"
                  className="h-12 w-full rounded-full border-border/50 transition-all hover:scale-[1.02] hover:border-primary/50"
                >
                  <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Continuer avec Instagram
                </Button>

                <Button
                  onClick={() => handleSocialLogin("VK")}
                  variant="outline"
                  className="h-12 w-full rounded-full border-border/50 transition-all hover:scale-[1.02] hover:border-primary/50"
                >
                  <svg className="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.523-2.049-1.714-1.033-1.01-1.49-1.145-1.744-1.145-.356 0-.459.102-.459.593v1.563c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.167-3.61 2.167-3.61.119-.254.322-.491.763-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
                  </svg>
                  VK
                </Button>
              </div>
            </motion.div>
          )}

          {mode === "email" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <button
                onClick={() => setMode(null)}
                className="text-sm text-primary hover:underline"
              >
                ← Changer de méthode
              </button>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>

              <Button
                onClick={handleEmailSignup}
                disabled={pending}
                className="h-14 w-full rounded-xl bg-primary text-white shadow-love hover:scale-[1.02]"
              >
                Envoyer le code OTP
              </Button>
            </motion.div>
          )}

          {mode === "phone" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <button
                onClick={() => setMode(null)}
                className="text-sm text-primary hover:underline"
              >
                ← Changer de méthode
              </button>

              <div className="space-y-2">
                <Label>Numéro de téléphone</Label>
                <div className="flex gap-2">
                  <select
                    value={dialCode}
                    onChange={(e) => setDialCode(e.target.value)}
                    className="h-12 w-24 rounded-lg border border-input bg-background px-3"
                  >
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+7">🇷🇺 +7</option>
                  </select>
                  <Input
                    type="tel"
                    placeholder="6 12 34 56 78"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12 flex-1"
                  />
                </div>
              </div>

              <Button
                onClick={handlePhoneSignup}
                disabled={pending}
                className="h-14 w-full rounded-xl bg-primary text-white shadow-love hover:scale-[1.02]"
              >
                Envoyer le code OTP
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SignupContact;
