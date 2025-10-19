import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DiscoverActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant: "pass" | "like" | "superlike";
  size?: "md" | "lg";
  disabled?: boolean;
}

const baseStyles = "flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const variantStyles: Record<DiscoverActionButtonProps["variant"], string> = {
  pass: "border border-white/60 bg-white/90 text-brand-red/80 shadow-soft hover:border-brand-red/40 hover:text-brand-red",
  like: "bg-gradient-to-br from-brand-red via-brand-red to-brand-orange text-white shadow-love hover:shadow-glow",
  superlike: "border border-white/80 bg-white/95 text-brand-purple/80 shadow-soft hover:border-brand-purple/50 hover:text-brand-purple",
};

const sizeStyles: Record<NonNullable<DiscoverActionButtonProps["size"]>, string> = {
  md: "h-16 w-16",
  lg: "h-20 w-20",
};

export const DiscoverActionButton = ({ icon, label, onClick, variant, size = "md", disabled }: DiscoverActionButtonProps) => {
  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onClick()}
      aria-label={label}
      disabled={disabled}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && "cursor-not-allowed opacity-60 hover:scale-100"
      )}
      whileHover={disabled ? undefined : { scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.92 }}
    >
      {icon}
    </motion.button>
  );
};
