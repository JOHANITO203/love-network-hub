import { Button } from "@/components/ui/button";
import { MessageSquare, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type NavSection = "discover" | "messages" | "profile";

interface NavigationProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
}

export const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const navItems = [
    { id: "discover" as const, icon: Sparkles, label: "Découvrir" },
    { id: "messages" as const, icon: MessageSquare, label: "Messages" },
    { id: "profile" as const, icon: User, label: "Profil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-surface border-t border-white/10 z-50">
      <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 h-auto transition-smooth",
                isActive ? "text-white" : "text-white/50 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
              <span className="text-[11px] font-medium">{item.label}</span>
              {isActive && <div className="w-5 h-1 rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#ff8b5a]" />}
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
