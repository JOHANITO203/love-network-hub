import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { nanoid } from "nanoid";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

type OfflineActionType = "like" | "message" | "profile-update" | "custom";

export interface OfflineAction<TPayload = unknown> {
  id: string;
  type: OfflineActionType | string;
  payload: TPayload;
  createdAt: number;
}

type OfflineActionHandler = (action: OfflineAction) => Promise<void>;

interface OfflineQueueContextValue {
  isOnline: boolean;
  queue: OfflineAction[];
  enqueueAction: (action: Omit<OfflineAction, "id" | "createdAt">) => Promise<void>;
  registerHandler: (type: OfflineAction["type"], handler: OfflineActionHandler) => void;
  flushQueue: () => Promise<void>;
}

const STORAGE_KEY = "moydate_offline_queue";

const OfflineQueueContext = createContext<OfflineQueueContextValue | undefined>(undefined);

const getPersistedQueue = (): OfflineAction[] => {
  if (typeof localStorage === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OfflineAction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistQueue = (queue: OfflineAction[]) => {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // storage quota exceeded or disabled; ignoring for now
  }
};

export const OfflineQueueProvider = ({ children }: PropsWithChildren) => {
  const { isOnline } = useNetworkStatus();
  const [queue, setQueue] = useState<OfflineAction[]>(() => getPersistedQueue());
  const handlersRef = useRef<Map<OfflineAction["type"], OfflineActionHandler>>(new Map());
  const flushInProgressRef = useRef(false);

  useEffect(() => {
    persistQueue(queue);
  }, [queue]);

  const registerHandler = useCallback(
    (type: OfflineAction["type"], handler: OfflineActionHandler) => {
      handlersRef.current.set(type, handler);
    },
    []
  );

  const processQueue = useCallback(
    async (currentQueue: OfflineAction[]) => {
      const pending: OfflineAction[] = [];

      for (const action of currentQueue) {
        const handler = handlersRef.current.get(action.type);
        if (!handler) {
          pending.push(action);
          continue;
        }

        try {
          await handler(action);
        } catch (error) {
          console.error("[offline-queue] failed to process action", action.type, error);
          pending.push(action);
        }
      }

      setQueue(pending);
    },
    []
  );

  const flushQueue = useCallback(async () => {
    if (flushInProgressRef.current) return;
    flushInProgressRef.current = true;
    try {
      await processQueue(queue);
    } finally {
      flushInProgressRef.current = false;
    }
  }, [processQueue, queue]);

  useEffect(() => {
    if (isOnline && queue.length > 0) {
      void flushQueue();
    }
  }, [isOnline, queue.length, flushQueue]);

  const enqueueAction = useCallback(
    async (action: Omit<OfflineAction, "id" | "createdAt">) => {
      const enriched: OfflineAction = {
        id: nanoid(),
        createdAt: Date.now(),
        ...action,
      };

      setQueue((prev) => [...prev, enriched]);

      if (isOnline) {
        const handler = handlersRef.current.get(enriched.type);
        if (handler) {
          try {
            await handler(enriched);
            setQueue((prev) => prev.filter((item) => item.id !== enriched.id));
            return;
          } catch {
            // keep in queue
          }
        }
      }
    },
    [isOnline]
  );

  const contextValue = useMemo<OfflineQueueContextValue>(
    () => ({
      isOnline,
      queue,
      enqueueAction,
      registerHandler,
      flushQueue,
    }),
    [enqueueAction, flushQueue, isOnline, queue, registerHandler]
  );

  return <OfflineQueueContext.Provider value={contextValue}>{children}</OfflineQueueContext.Provider>;
};

export const useOfflineQueue = () => {
  const context = useContext(OfflineQueueContext);
  if (!context) {
    throw new Error("useOfflineQueue must be used within an OfflineQueueProvider");
  }
  return context;
};
