import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OtpInput } from "@/components/auth/OtpInput";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/moydate-logo.png";

type AuthMode = "password" | "otp";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signInWithOtp, verifyOtp } = useAuth();

  const [authMode, setAuthMode] = useState<AuthMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordSignIn = async () => {
    if (!email || !password) {
      toast({ title: "Erreur", description: "Email et mot de passe requis", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      toast({ title: "Connexion réussie" });
      navigate("/app");
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast({ title: "Erreur", description: "Email requis", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signInWithOtp(email, false);
      if (error) throw error;
      setOtpSent(true);
      toast({ title: "Code envoyé !", description: "Vérifiez votre email" });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLoginOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4 || !email) return;

    setIsLoading(true);
    try {
      const { error } = await verifyOtp(email, otpCode, false);
      if (error) throw error;
      toast({ title: "Connexion réussie !" });
      navigate("/app");
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({ title: "Connexion sociale", description: `Redirection vers ${provider}...` });
    // TODO: Implémenter la connexion sociale
    setTimeout(() => navigate("/app"), 1000);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-accent/5 to-background px-4 py-12">
      {/* Animated background */}
      <motion.div
        className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-primary opacity-20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-gradient-warm opacity-20 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], rotate: [180, 0, 180] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="onboarding-card p-8 shadow-love">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img src={logo} alt="МойDate" className="h-16 w-auto" />
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">
              {otpSent ? "Vérification" : "Bon retour !"}
            </h1>
            <p className="text-muted-foreground">
              {otpSent ? "Entrez le code reçu par email" : "Connectez-vous à votre compte"}
            </p>
          </div>

          {!otpSent ? (
            <>
              {/* Social Login Buttons */}
              <div className="mb-6 space-y-3">
                <Button
                  onClick={() => handleSocialLogin("Google")}
                  variant="outline"
                  className="h-12 w-full rounded-full border-border/50 transition-all hover:scale-[1.02] hover:border-primary/50"
                >
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
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

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-4 text-muted-foreground">Ou avec email</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="vous@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-full pl-11"
                    />
                  </div>
                </div>

                {authMode === "password" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 rounded-full pl-11"
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <button className="text-sm text-primary transition-colors hover:underline">
                        Mot de passe oublié ?
                      </button>
                    </div>

                    <Button
                      onClick={handlePasswordSignIn}
                      disabled={isLoading}
                      className="h-12 w-full rounded-full bg-gradient-primary shadow-love transition-all hover:scale-[1.02] hover:shadow-glow"
                    >
                      {isLoading ? "Connexion..." : "Se connecter"}
                    </Button>

                    <div className="text-center">
                      <button
                        onClick={() => setAuthMode("otp")}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Ou recevoir un code par email
                      </button>
                    </div>
                  </>
                )}

                {authMode === "otp" && (
                  <>
                    <Button
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="h-12 w-full rounded-full bg-gradient-primary shadow-love transition-all hover:scale-[1.02] hover:shadow-glow"
                    >
                      {isLoading ? "Envoi..." : "Envoyer le code"}
                    </Button>

                    <div className="text-center">
                      <button
                        onClick={() => setAuthMode("password")}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Ou se connecter avec mot de passe
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Sign up link */}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <button
                  onClick={() => navigate("/signup/contact")}
                  className="font-semibold text-primary transition-colors hover:underline"
                >
                  Créer un compte
                </button>
              </div>
            </>
          ) : (
            /* OTP Verification */
            <div className="space-y-5">
              <div className="rounded-xl bg-primary/10 p-4 text-center">
                <Check className="mb-2 inline h-5 w-5 text-primary" />
                <p className="text-sm">Code envoyé à <strong>{email}</strong></p>
              </div>

              <div className="space-y-2">
                <Label>Code de vérification</Label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  length={4}
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={handleVerifyLoginOtp}
                disabled={isLoading || otp.join("").length !== 4}
                className="h-12 w-full rounded-full bg-gradient-primary shadow-love transition-all hover:scale-[1.02] hover:shadow-glow"
              >
                {isLoading ? "Vérification..." : "Vérifier"}
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setOtpSent(false)}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Retour
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;