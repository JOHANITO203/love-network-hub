import { useEffect, useRef, useCallback } from 'react';
import { useToast } from './use-toast';

interface UseAutoSaveOptions<TData> {
  data: TData;
  saveFunction: (data: TData) => Promise<boolean>;
  delay?: number;
  enabled?: boolean;
  onSaveStart?: () => void;
  onSaveSuccess?: () => void;
  onSaveError?: (error: unknown) => void;
}

export const useAutoSave = <TData,>({
  data,
  saveFunction,
  delay = 2000, // 2 seconds delay
  enabled = true,
  onSaveStart,
  onSaveSuccess,
  onSaveError
}: UseAutoSaveOptions<TData>) => {
  const { toast } = useToast();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const lastSavedDataRef = useRef<string>('');
  const isSavingRef = useRef(false);

  const performSave = useCallback(async (dataToSave: TData) => {
    if (isSavingRef.current) return;

    try {
      isSavingRef.current = true;
      onSaveStart?.();

      const success = await saveFunction(dataToSave);

      if (success) {
        lastSavedDataRef.current = JSON.stringify(dataToSave);
        onSaveSuccess?.();

        // Show subtle success notification
        toast({
          title: "Sauvegardé",
          description: "Profil sauvegardé automatiquement",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      onSaveError?.(error);

      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder automatiquement",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      isSavingRef.current = false;
    }
  }, [saveFunction, onSaveStart, onSaveSuccess, onSaveError, toast]);

  const triggerAutoSave = useCallback(() => {
    if (!enabled) return;

    const currentDataString = JSON.stringify(data);

    // Don't save if data hasn't changed
    if (currentDataString === lastSavedDataRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      performSave(data);
    }, delay);
  }, [data, enabled, delay, performSave]);

  // Trigger auto-save when data changes
  useEffect(() => {
    triggerAutoSave();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [triggerAutoSave]);

  // Manual save function
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    return performSave(data);
  }, [performSave, data]);

  return {
    saveNow,
    isSaving: isSavingRef.current
  };
};
