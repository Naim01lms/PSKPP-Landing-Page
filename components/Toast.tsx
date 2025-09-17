import React, { useEffect, useState } from 'react';
import type { Toast as ToastProps, ToastType } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XIcon from './icons/XIcon';

interface Props extends ToastProps {
  onDismiss: (id: string) => void;
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircleIcon />,
  error: null, // Placeholder for future error icon
  info: null,  // Placeholder for future info icon
};

const toastStyles: Record<ToastType, string> = {
  success: 'bg-accent text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
};

const Toast: React.FC<Props> = ({ id, message, type, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const enterTimeout = setTimeout(() => setIsVisible(true), 50);
    
    // Auto-dismiss
    const timer = setTimeout(() => {
      handleDismiss();
    }, 4000);

    return () => {
      clearTimeout(enterTimeout);
      clearTimeout(timer);
    };
  }, [id]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for animation to finish before removing from DOM
    setTimeout(() => onDismiss(id), 300);
  };

  const Icon = toastIcons[type];
  const style = toastStyles[type];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        flex items-center w-full max-w-sm p-4 rounded-lg shadow-2xl transition-all duration-300 ease-in-out
        ${style}
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      {Icon && <div className="flex-shrink-0 h-6 w-6 mr-3">{Icon}</div>}
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={handleDismiss}
        className="ml-4 -mr-2 p-1.5 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Tutup notifikasi"
      >
        <XIcon />
      </button>
    </div>
  );
};

export default Toast;
