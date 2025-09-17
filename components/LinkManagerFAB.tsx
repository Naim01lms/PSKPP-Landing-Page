import React, { useState, useEffect } from 'react';
import type { ManagedLink } from '../types';
import LinkIcon from './icons/LinkIcon';
import XIcon from './icons/XIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';

const LOCAL_STORAGE_KEY = 'managedLinks';

const LinkManagerFAB: React.FC = () => {
  const [links, setLinks] = useState<ManagedLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const loadLinks = () => {
    try {
      const savedLinks = localStorage.getItem(LOCAL_STORAGE_KEY);
      setLinks(savedLinks ? JSON.parse(savedLinks) : []);
    } catch (error) {
      console.error("Failed to load managed links:", error);
      setLinks([]);
    }
  };

  useEffect(() => {
    loadLinks();

    const handleLinksUpdate = () => {
      loadLinks();
    };

    window.addEventListener('linksUpdated', handleLinksUpdate);
    return () => {
      window.removeEventListener('linksUpdated', handleLinksUpdate);
    };
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setIsModalVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
    }
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleTransitionEnd = () => {
    if (!isModalVisible) {
      setIsModalOpen(false);
    }
  };

  if (links.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-5 left-5 z-[80]">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-primary rounded-full p-4 shadow-lg hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transform transition-all duration-300 hover:scale-110"
          aria-label="Buka Pautan Pantas"
          title="Pautan Pantas"
        >
          <LinkIcon />
        </button>
      </div>

      {isModalOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-[120] p-4 transition-opacity duration-300 ease-in-out ${isModalVisible ? 'bg-black/70 opacity-100' : 'bg-transparent opacity-0'}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="links-modal-title"
          onClick={closeModal}
          onTransitionEnd={handleTransitionEnd}
        >
          <div
            className={`bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out ${isModalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 id="links-modal-title" className="text-xl font-bold text-primary font-heading tracking-wider">Pautan Pantas</h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Tutup"
              >
                <XIcon />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {links.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-light rounded-lg hover:bg-primary/10 hover:shadow-sm transition-all duration-200 group"
                  title={`Buka ${link.title} dalam tab baru`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-primary">{link.title}</p>
                    <span className="text-gray-400 group-hover:text-primary transition-colors">
                        <ExternalLinkIcon />
                    </span>
                  </div>
                  {link.description && (
                    <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LinkManagerFAB;
