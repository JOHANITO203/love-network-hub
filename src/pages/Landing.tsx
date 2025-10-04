import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/moydate-logo.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-accent/5 to-background px-4">
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12 flex justify-center"
        >
          <img src={logo} alt="МойDate" className="h-24 w-auto" />
        </motion.div>

        {/* Welcome text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="mb-3 text-4xl font-bold">Bienvenue</h1>
          <p className="text-lg text-muted-foreground">
            Trouvez des connexions authentiques
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-4"
        >
          <Button
            onClick={() => navigate("/signup/contact")}
            className="h-14 w-full rounded-full bg-gradient-primary text-lg font-semibold shadow-love transition-all hover:scale-[1.02] hover:shadow-glow"
          >
            Créer un compte
          </Button>

          <Button
            onClick={() => navigate("/auth")}
            variant="outline"
            className="h-14 w-full rounded-full border-2 text-lg font-semibold transition-all hover:scale-[1.02] hover:border-primary/50"
          >
            Connexion
          </Button>
        </motion.div>

        {/* Terms */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-xs text-muted-foreground"
        >
          En continuant, vous acceptez nos{" "}
          <button className="underline hover:text-foreground">
            Conditions d'utilisation
          </button>{" "}
          et notre{" "}
          <button className="underline hover:text-foreground">
            Politique de confidentialité
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Landing;
