
import React, { useState, useEffect } from 'react';
import LockIcon from './icons/LockIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import CheckIcon from './icons/CheckIcon';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [animateError, setAnimateError] = useState(false);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the input when the modal opens
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    } else {
      // Reset state when modal is closed
      setTimeout(() => {
        setPassword('');
        setError('');
        setIsSubmitting(false);
        setIsSuccess(false);
        setAnimateError(false);
      }, 300); // Wait for closing animation
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return;

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      if (password === 'pskpplms52') {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess();
        }, 800);
      } else {
        setError('Kata laluan salah. Sila cuba lagi.');
        setPassword('');
        setIsSubmitting(false);
        setAnimateError(true);
        setTimeout(() => setAnimateError(false), 500); // Reset animation class
      }
    }, 500); // Simulate network delay
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[110] p-4 transition-opacity duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center transform transition-all duration-300 ease-in-out ${animateError ? 'animate-shake' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
            <LockIcon className="h-8 w-8" />
        </div>
        <div className="mt-5">
            <h3 id="admin-login-title" className="text-xl font-bold text-gray-900">
                Akses Pentadbir
            </h3>
            <p className="mt-2 text-sm text-gray-500">
                Masukkan kata laluan untuk meneruskan.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </span>
            <input
              ref={passwordInputRef}
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={handlePasswordChange}
              placeholder="Kata Laluan"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all ${
                error 
                  ? 'border-red-500 text-red-600 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-primary'
              }`}
            />
          </div>
          {error && (
            <p className="text-red-600 text-xs text-center">{error}</p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full inline-flex justify-center items-center gap-2 rounded-lg border border-transparent shadow-sm px-4 py-3 text-base font-medium text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm
                ${isSuccess ? 'bg-accent focus:ring-emerald-400' : ''}
                ${isSubmitting ? 'bg-primary/80 cursor-wait' : ''}
                ${!isSubmitting && !isSuccess ? 'bg-primary hover:bg-blue-800 focus:ring-primary' : ''}
              `}
            >
              {isSuccess ? (
                  <>
                    <CheckIcon /> Berjaya!
                  </>
              ) : isSubmitting ? (
                  <>
                    <SpinnerIcon className="h-5 w-5" /> Mengesahkan...
                  </>
              ) : (
                'Log Masuk'
              )}
            </button>
             <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full text-center text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;