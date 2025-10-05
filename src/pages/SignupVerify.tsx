import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { OtpInput } from "@/components/auth/OtpInput";

const SignupVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { contact, method } = location.state || {};

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!contact) {
      navigate("/signup/contact");
    }
  }, [contact, navigate]);

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast({ title: "Erreur", description: "Code incomplet", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    // Simulation de vérification - à remplacer par votre logique auth
    setTimeout(() => {
      toast({ title: "Code vérifié !", description: "Redirection..." });
      navigate("/onboarding/basics");
      setIsLoading(false);
    }, 1000);
  };

  const handleResend = () => {
    setOtp(Array(6).fill(""));
    toast({ title: "Code renvoyé", description: `Un nouveau code a été envoyé à ${contact}` });
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="onboarding-card p-8 shadow-love">
          {/* Back Button */}
          <button
            onClick={() => navigate("/signup/contact")}
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold">Entrez le code de vérification</h1>
            <p className="text-muted-foreground">
              Code à 6 chiffres envoyé {method === "email" ? "par email" : "par SMS"} à
            </p>
            <p className="mt-2 font-semibold text-foreground">{contact}</p>
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <OtpInput
              value={otp}
              onChange={setOtp}
              length={6}
              disabled={isLoading}
            />
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerifyOtp}
            disabled={isLoading || otp.join("").length !== 6}
            className="h-12 w-full rounded-full bg-gradient-primary shadow-love transition-all hover:scale-[1.02] hover:shadow-glow"
          >
            {isLoading ? "Vérification..." : "Vérifier le code"}
          </Button>

          {/* Resend */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Code non reçu ?{" "}
            <button
              onClick={handleResend}
              className="font-semibold text-primary transition-colors hover:underline"
            >
              Renvoyer le code
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupVerify;
