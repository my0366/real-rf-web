import { createContext, useContext } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    duration?: number
  ) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
