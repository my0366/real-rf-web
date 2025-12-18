import React from 'react';
import { useToast } from '../contexts/ToastContext';
import type { Toast } from '../contexts/ToastContext';
import { Button } from './ui';

const ToastItem: React.FC<{ toast: Toast; onClose: (id: string) => void }> = ({
  toast,
  onClose,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '!';
      case 'info':
        return 'i';
      default:
        return '•';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md
        animate-in fade-in slide-in-from-top-2 duration-200
        ${getColor(toast.type)}
      `}
    >
      <span className="text-lg flex-shrink-0">{getIcon(toast.type)}</span>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onClose(toast.id)}
        className="text-lg flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
      >
        ×
      </Button>
    </div>
  );
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
}
