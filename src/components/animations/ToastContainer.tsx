import React from 'react';
import FeedbackToast, { ToastType } from './FeedbackToast';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  position = 'top-right'
}) => {
  return (
    <>
      {toasts.map((toast) => (
        <FeedbackToast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          description={toast.description}
          isVisible={true}
          onClose={() => onClose(toast.id)}
          duration={toast.duration}
          position={position}
        />
      ))}
    </>
  );
};

export default ToastContainer;
