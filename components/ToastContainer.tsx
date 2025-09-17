import React from 'react';
import type { Toast as ToastProps } from '../types';
import Toast from './Toast';

interface ToastContainerProps {
  toasts: ToastProps[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="polite"
      className="fixed top-24 right-5 z-[200] w-full max-w-sm space-y-3"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default ToastContainer;
