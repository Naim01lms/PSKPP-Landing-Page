import React, { createContext, useState, useContext, ReactNode } from 'react';

type AdminPanelView = 'main' | 'theme' | 'about' | 'links' | 'contact';

interface AdminPanelContextType {
  isPanelOpen: boolean;
  panelView: AdminPanelView;
  openPanel: (view?: AdminPanelView) => void;
  closePanel: () => void;
  setPanelView: (view: AdminPanelView) => void;
}

const AdminPanelContext = createContext<AdminPanelContextType | undefined>(undefined);

export const useAdminPanel = () => {
  const context = useContext(AdminPanelContext);
  if (!context) {
    throw new Error('useAdminPanel must be used within an AdminPanelProvider');
  }
  return context;
};

export const AdminPanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState({ isOpen: false, view: 'main' as AdminPanelView });

  const openPanel = (view: AdminPanelView = 'main') => {
    setConfig({ isOpen: true, view });
  };
  
  const closePanel = () => {
    setConfig(prev => ({ ...prev, isOpen: false }));
    // Reset view after a short delay for animation to complete
    setTimeout(() => {
        setConfig(prev => ({...prev, view: 'main'}));
    }, 300);
  };
  
  const setPanelView = (view: AdminPanelView) => {
    setConfig(prev => ({ ...prev, view }));
  };

  const value = {
    isPanelOpen: config.isOpen,
    panelView: config.view,
    openPanel,
    closePanel,
    setPanelView,
  };

  return <AdminPanelContext.Provider value={value}>{children}</AdminPanelContext.Provider>;
};