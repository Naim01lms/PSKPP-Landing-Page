
import React from 'react';
import AlertIcon from './icons/AlertIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Ya, Padam',
  cancelButtonText = 'Batal',
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] transition-opacity duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-dialog-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md m-4 text-center transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <AlertIcon />
        </div>
        <div className="mt-5">
          <h3 id="confirmation-dialog-title" className="text-xl font-bold text-gray-900">
            {title}
          </h3>
          <div className="mt-2">
            <div className="text-sm text-gray-500">{message}</div>
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-white text-gray-800 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
