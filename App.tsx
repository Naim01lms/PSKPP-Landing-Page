import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Events from './components/Events';
import Gallery from './components/Gallery';
import Sponsors from './components/Sponsors';
import Footer from './components/Footer';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AdminPanel from './components/AdminPanel';
import { AdminPanelProvider } from './contexts/AdminPanelContext';
import LinkManagerFAB from './components/LinkManagerFAB';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check for admin=true in URL query parameters to enable admin mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setIsAdmin(true);
    }
    
    // Load profile image from local storage
    const savedImage = localStorage.getItem('adminProfileImage');
    if (savedImage) {
      setProfileImageUrl(savedImage);
    }
  }, []);
  
  const handleProfileImageChange = (newImageUrl: string) => {
    localStorage.setItem('adminProfileImage', newImageUrl);
    setProfileImageUrl(newImageUrl);
  };

  return (
    <ToastProvider>
      <ThemeProvider>
        <AdminPanelProvider>
          <div className="bg-light text-dark font-sans">
            <Header 
              setSearchQuery={setSearchQuery} 
              isAdmin={isAdmin}
              profileImageUrl={profileImageUrl}
              onProfileImageChange={handleProfileImageChange}
            />
            <main>
              <Hero isAdmin={isAdmin} />
              <About isAdmin={isAdmin} />
              <Events searchQuery={searchQuery} isAdmin={isAdmin} />
              <Gallery isAdmin={isAdmin} />
              <Sponsors isAdmin={isAdmin} />
            </main>
            <Footer isAdmin={isAdmin} />
            <AdminPanel isAdmin={isAdmin} />
            <LinkManagerFAB />
          </div>
        </AdminPanelProvider>
      </ThemeProvider>
    </ToastProvider>
  );
};

export default App;