import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Users, MessageSquare, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type NavSection = "discover" | "matches" | "messages" | "social" | "profile";

interface NavigationProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
}

export const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const navItems = [
    { id: "discover" as const, icon: Sparkles, label: "Discover" },
    { id: "matches" as const, icon: Heart, label: "Matches" },
    { id: "messages" as const, icon: MessageSquare, label: "Messages" },
    { id: "social" as const, icon: Users, label: "Social" },
    { id: "profile" as const, icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-border/50 dark:border-gray-800 z-50">
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
                isActive
                  ? "text-love-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive && "fill-current"
                )}
              />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-love-primary rounded-full" />
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
};