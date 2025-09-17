
import React, { useState } from 'react';
import LockIcon from './icons/LockIcon';
import UnlockIcon from './icons/UnlockIcon';
import AdminLoginModal from './AdminLoginModal';

interface AdminToggleProps {
  isAdmin: boolean;
}

const AdminToggle: React.FC<AdminToggleProps> = ({ isAdmin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('admin');
    window.location.href = url.toString();
  };

  const handleLoginSuccess = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('admin', 'true');
    window.location.href = url.toString();
  };

  const handleToggle = () => {
    if (isAdmin) {
      handleLogout();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        title={isAdmin ? 'Keluar dari Mod Pentadbir' : 'Masuk ke Mod Pentadbir'}
        className={`p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary ${
          isAdmin
            ? 'bg-accent text-white hover:bg-emerald-600 focus:ring-accent'
            : 'bg-white/10 text-gray-300 hover:bg-white/25 focus:ring-secondary'
        }`}
      >
        <span className="sr-only">{isAdmin ? 'Keluar dari Mod Pentadbir' : 'Masuk ke Mod Pentadbir'}</span>
        {isAdmin ? <UnlockIcon /> : <LockIcon />}
      </button>

      <AdminLoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default AdminToggle;
