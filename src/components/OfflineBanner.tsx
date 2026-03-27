import { WifiOff, Wifi } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const formatRelativeTime = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  if (diff < 5_000) return "à l’instant";
  if (diff < 60_000) return "il y a quelques secondes";
  if (diff < 3_600_000) {
    const minutes = Math.floor(diff / 60_000);
    return `il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  const hours = Math.floor(diff / 3_600_000);
  return `il y a ${hours} heure${hours > 1 ? "s" : ""}`;
};

export const OfflineBanner = () => {
  const { isOnline, lastChangedAt } = useNetworkStatus();
  const [visible, setVisible] = useState<boolean>(!isOnline);

  useEffect(() => {
    if (!isOnline) {
      setVisible(true);
      return;
    }

    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 4000);
    return () => window.clearTimeout(timeout);
  }, [isOnline, lastChangedAt]);

  const message = useMemo(() => {
    if (isOnline) {
      return `Connexion rétablie (${formatRelativeTime(lastChangedAt)}).`;
    }
    return "Mode hors ligne : vos actions seront synchronisées automatiquement.";
  }, [isOnline, lastChangedAt]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`fixed left-1/2 top-4 z-[2000] w-[90%] max-w-md -translate-x-1/2 rounded-full border px-4 py-3 text-sm shadow-lg transition-all ${
        isOnline
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/40 dark:text-emerald-200"
          : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-900/40 dark:text-amber-100"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
        <span>{message}</span>
      </div>
    </div>
  );
};
