import React, { useState, useCallback } from 'react';
import {
  ToastContext,
  type ToastContextType,
  type Toast,
} from './useToastContext';

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'info' | 'warning',
      duration = 3000
    ) => {
      const id = Date.now().toString();
      const newToast: Toast = { id, message, type, duration };
      setToasts(prev => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const value: ToastContextType = { toasts, addToast, removeToast };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

export type { Toast } from './useToastContext';
