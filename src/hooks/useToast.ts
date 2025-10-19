import { useState, useCallback } from 'react';
import { ToastType } from '../components/animations/FeedbackToast';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((
    type: ToastType,
    message: string,
    description?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      type,
      message,
      description,
      duration
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, description?: string, duration?: number) =>
      showToast('success', message, description, duration),
    [showToast]
  );

  const error = useCallback(
    (message: string, description?: string, duration?: number) =>
      showToast('error', message, description, duration),
    [showToast]
  );

  const warning = useCallback(
    (message: string, description?: string, duration?: number) =>
      showToast('warning', message, description, duration),
    [showToast]
  );

  const info = useCallback(
    (message: string, description?: string, duration?: number) =>
      showToast('info', message, description, duration),
    [showToast]
  );

  return {
    toasts,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info
  };
};
