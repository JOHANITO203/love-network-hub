import { useMemo, type ElementType } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/NotificationCenter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useFormatMessage } from "@/i18n/useFormatMessage";
import {
  MessageCircle,
  Sparkles,
  Heart,
  Users,
  User,
  LogOut,
} from "lucide-react";

interface NavItemDefinition {
  id: string;
  labelId: string;
  path: string;
  icon: ElementType;
}

const NAV_ITEMS: NavItemDefinition[] = [
  {
    id: "discover",
    labelId: "app.nav.discover",
    path: "/app/discover",
    icon: Sparkles,
  },
  {
    id: "matches",
    labelId: "app.nav.matches",
    path: "/app/matches",
    icon: Heart,
  },
  {
    id: "messages",
    labelId: "app.nav.messages",
    path: "/app/messages",
    icon: MessageCircle,
  },
  {
    id: "social",
    labelId: "app.nav.social",
    path: "/app/social",
    icon: Users,
  },
  {
    id: "profile",
    labelId: "app.nav.profile",
    path: "/app/profile",
    icon: User,
  },
];

export const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const formatMessage = useFormatMessage();

  const navigationItems = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        ...item,
        label: formatMessage(item.labelId),
      })),
    [formatMessage],
  );

  const activeItem = useMemo(() => {
    const match = navigationItems.find((item) =>
      location.pathname.startsWith(item.path),
    );
    return match ?? navigationItems[0];
  }, [location.pathname, navigationItems]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">
            {formatMessage("app.layout.loading")}
         </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    // TODO: connect Supabase API here
    navigate("/", { replace: true });
  };

  const headerLabel = activeItem?.label ?? "";
  const activePath = activeItem?.path ?? NAV_ITEMS[0]?.path ?? "/app/discover";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {formatMessage("app.brand.badge")}
            </span>
            <h1 className="text-lg font-semibold text-foreground">{headerLabel}</h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationCenter />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground"
              aria-label={formatMessage("app.nav.signOut")}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-4">
        <Outlet />
      </main>

      <AppNavigation
        activePath={activePath}
        items={navigationItems}
        onNavigate={(path) => {
          navigate(path);
        }}
      />

      {/* TODO: Re-enable DebugPanel for testing only. */}
    </div>
  );
};

interface AppNavigationProps {
  activePath: string;
  items: Array<NavItemDefinition & { label: string }>;
  onNavigate: (path: string) => void;
}

const AppNavigation = ({ activePath, items, onNavigate }: AppNavigationProps) => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/50 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90">
      <div className="mx-auto flex max-w-4xl items-center justify-around px-4 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-full px-3 py-2 text-xs font-medium transition-all",
                isActive
                  ? "text-love-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              type="button"
              aria-label={item.label}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive && "fill-current text-love-primary",
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="h-1 w-1 rounded-full bg-love-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
