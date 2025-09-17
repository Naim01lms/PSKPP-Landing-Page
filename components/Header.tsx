import React, { useState, useEffect, useRef } from 'react';
import type { NavLink } from '../types';
import SearchIcon from './icons/SearchIcon';
import AdminToggle from './AdminToggle';
import UserIcon from './icons/UserIcon';
import CameraIcon from './icons/CameraIcon';
import XIcon from './icons/XIcon';

const navLinks: NavLink[] = [
  { name: 'Utama', href: '#home' },
  { name: 'Tentang Kami', href: '#about' },
  { name: 'Acara', href: '#events' },
  { name: 'Galeri', href: '#gallery' },
];

interface HeaderProps {
  setSearchQuery: (query: string) => void;
  isAdmin: boolean;
  profileImageUrl: string | null;
  onProfileImageChange: (url: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setSearchQuery, isAdmin, profileImageUrl, onProfileImageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adminNavLinks = [
    { name: 'Tentang Kami', href: '#about' },
    { name: 'Acara', href: '#events' },
    { name: 'Galeri', href: '#gallery' },
    { name: 'Penaja', href: '#sponsors' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Change header background on scroll for better visibility
      const SCROLL_THRESHOLD = 10;
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);

      // --- Active Nav Link Highlighting ---
      const sections = navLinks.map(link => document.querySelector(link.href) as HTMLElement).filter(Boolean);
      
      // Offset is header height (h-20 = 5rem = 80px) + a buffer (70px).
      // This makes the link active when the section is near the top of the viewport.
      const ACTIVE_LINK_OFFSET = 150;
      const scrollPosition = window.scrollY + ACTIVE_LINK_OFFSET;

      // Find the current section by looping backwards.
      // The last one whose top is above the scrollPosition is the current one.
      let currentSectionId = '#home';
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.offsetTop <= scrollPosition) {
          // Derive the ID from the navLink array to ensure consistency
          currentSectionId = navLinks[i].href;
          break;
        }
      }
      setActiveLink(currentSectionId);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial state on page load

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // This effect runs once on mount. `navLinks` is stable.

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSearchOpen(false);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
        document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleProfileImageClick = () => {
    if (isAdmin) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onProfileImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-primary/95 shadow-lg backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0">
              <a href="#home" className={`text-white font-bold font-heading tracking-wider transition-all duration-300 group ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
                <span className="border-b-2 border-transparent group-hover:border-secondary transition-colors duration-300 pb-1">
                  PSKPP Portal
                </span>
              </a>
            </div>
            
            {/* Center Nav Links (Tablet & Desktop) */}
            <nav className="hidden md:flex items-center">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeLink === link.href
                        ? 'text-white bg-white/10'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                    aria-current={activeLink === link.href ? 'page' : undefined}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Desktop Search Bar (Large screens only) */}
              <div className="ml-6 relative hidden lg:block">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <SearchIcon />
                  </span>
                  <input
                      type="search"
                      name="search-desktop"
                      placeholder="Cari acara..."
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:bg-white/25 focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-secondary transition-all duration-300"
                      aria-label="Cari acara"
                  />
              </div>

              {/* Search Icon (Mobile & Tablet) */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 lg:hidden"
                aria-label="Buka carian"
              >
                <SearchIcon />
              </button>
              
              <AdminToggle isAdmin={isAdmin} />

              {/* Profile/Login (Tablet & Desktop) */}
              <div className="hidden md:block">
                {isAdmin ? (
                  <div className="relative group ml-2">
                    <button
                      onClick={handleProfileImageClick}
                      className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-offset-primary ring-secondary focus:outline-none focus:ring-amber-400"
                      title="Tukar gambar profil"
                    >
                      {profileImageUrl ? (
                        <img src={profileImageUrl} alt="Admin profile" className="h-full w-full object-cover rounded-full" />
                      ) : (
                        <UserIcon />
                      )}
                    </button>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <CameraIcon />
                    </div>
                    <input
                      type="file" ref={fileInputRef} onChange={handleFileSelected}
                      accept="image/png, image/jpeg, image/webp" className="hidden" aria-hidden="true"
                    />
                  </div>
                ) : (
                  <button className="ml-2 bg-secondary hover:bg-amber-500 text-primary font-bold py-2 px-4 rounded-full text-sm transition-colors duration-300">
                    Masuk
                  </button>
                )}
              </div>

              {/* Hamburger (Mobile only) */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none md:hidden"
                aria-expanded={isOpen}
                aria-controls="mobile-menu-panel"
              >
                <span className="sr-only">Buka menu utama</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay for Mobile/Tablet */}
        {isSearchOpen && (
            <div className="absolute top-0 left-0 right-0 h-20 bg-primary/95 backdrop-blur-sm z-40 flex items-center px-4 sm:px-6 lg:px-8 lg:hidden">
                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon />
                    </span>
                    <input
                        type="search"
                        name="search-mobile-overlay"
                        placeholder="Cari acara..."
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-10 py-2 rounded-full bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:bg-white/25 focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-secondary"
                        aria-label="Cari acara"
                        autoFocus
                    />
                    <button
                        onClick={() => setIsSearchOpen(false)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-300 hover:text-white"
                        aria-label="Tutup carian"
                    >
                        <XIcon />
                    </button>
                </div>
            </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ease-in-out ${isOpen ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      >
        <div
          id="mobile-menu-panel"
          className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-primary shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 id="mobile-menu-title" className="text-white font-bold font-heading text-xl tracking-wider">MENU</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-300 hover:text-white"
              aria-label="Tutup menu"
            >
              <XIcon />
            </button>
          </div>

          <div className="p-4 flex-grow flex flex-col">
            <nav className="flex-1 overflow-y-auto">
              <div className="space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-4 rounded-lg text-xl font-semibold transition-colors ${
                      activeLink === link.href
                        ? 'text-white bg-white/10'
                        : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }`}
                    aria-current={activeLink === link.href ? 'page' : undefined}
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {isAdmin && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="px-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Navigasi Pentadbir
                  </p>
                  <div className="space-y-1">
                    {adminNavLinks.map((link) => (
                      <a
                        key={`admin-${link.name}`}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </nav>

            <div className="mt-auto space-y-4 pt-4 border-t border-white/10">
              <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <SearchIcon />
                  </span>
                  <input
                      type="search"
                      name="search-mobile"
                      placeholder="Cari acara..."
                      onChange={handleSearchChange}
                      className="w-full pl-10 pr-4 py-2 rounded-full bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:bg-white/25 focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-secondary transition-all duration-300"
                      aria-label="Cari acara"
                  />
              </div>
               {isAdmin ? (
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                      <button
                        onClick={handleProfileImageClick}
                        className="h-12 w-12 bg-white/20 rounded-full flex-shrink-0 flex items-center justify-center ring-2 ring-secondary"
                        title="Tukar gambar profil"
                      >
                        {profileImageUrl ? (
                          <img src={profileImageUrl} alt="Admin profile" className="h-full w-full object-cover rounded-full" />
                        ) : (
                          <UserIcon />
                        )}
                      </button>
                       <div className="text-left">
                           <p className="font-bold text-white">Admin</p>
                           <p className="text-sm text-gray-300">Mod Pentadbir Aktif</p>
                       </div>
                    </div>
                  ) : (
                    <button className="w-full bg-secondary hover:bg-amber-500 text-primary font-bold py-3 px-4 rounded-full text-base transition-colors duration-300">
                        Masuk
                    </button>
                  )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;