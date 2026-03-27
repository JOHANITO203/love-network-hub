import { useEffect, useState } from "react";

export const useNetworkStatus = () => {
  const getInitialStatus = () => {
    if (typeof navigator === "undefined") {
      return true;
    }
    return navigator.onLine;
  };

  const [isOnline, setIsOnline] = useState<boolean>(getInitialStatus);
  const [lastChangedAt, setLastChangedAt] = useState<number>(Date.now());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastChangedAt(Date.now());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastChangedAt(Date.now());
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  return { isOnline, lastChangedAt };
};
