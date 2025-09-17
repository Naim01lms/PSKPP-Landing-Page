import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAdminPanel } from '../contexts/AdminPanelContext';
import SettingsIcon from './icons/SettingsIcon';
import LogoutIcon from './icons/LogoutIcon';
import XIcon from './icons/XIcon';
import HomeIcon from './icons/HomeIcon';
import InfoIcon from './icons/InfoIcon';
import CalendarIcon from './icons/CalendarIcon';
import UsersIcon from './icons/UsersIcon';
import ImageIcon from './icons/ImageIcon';
import SponsorIcon from './icons/SponsorIcon';
import CodeIcon from './icons/CodeIcon';
import PaletteIcon from './icons/PaletteIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import type { AboutContent, ManagedLink, ContactContent } from '../types';
import { initialAboutContent, initialContactContent } from '../data/initialContent';
import { useToast } from '../contexts/ToastContext';
import LinkIcon from './icons/LinkIcon';
import GripVerticalIcon from './icons/GripVerticalIcon';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';
import MailIcon from './icons/MailIcon';


interface AdminPanelProps {
  isAdmin: boolean;
}

const mainSections = [
  { name: 'Tentang Kami', view: 'about', icon: <InfoIcon /> },
  { name: 'Hubungi Kami', view: 'contact', icon: <MailIcon /> },
  { name: 'Pengurus Pautan', view: 'links', icon: <LinkIcon /> },
  { name: 'Sesuaikan Tema', view: 'theme', icon: <PaletteIcon /> },
];

const pageSections = [
  { name: 'Hero', href: '#home', icon: <HomeIcon /> },
  { name: 'Acara Pilihan', href: '#events', icon: <CalendarIcon /> },
  { name: 'Galeri', href: '#gallery', icon: <ImageIcon /> },
  { name: 'Penaja', href: '#sponsors', icon: <SponsorIcon /> },
  { name: 'Footer', href: 'footer', icon: <CodeIcon /> },
];

const fontOptions = ['Teko', 'Inter', 'Lato'];

const AdminPanel: React.FC<AdminPanelProps> = ({ isAdmin }) => {
  const { isPanelOpen, panelView, openPanel, closePanel, setPanelView } = useAdminPanel();
  
  const { 
    primaryColor, 
    secondaryColor, 
    headingFont,
    bodyFont,
    setPrimaryColor, 
    setSecondaryColor, 
    setHeadingFont, 
    setBodyFont,
    saveTheme, 
    resetTheme 
  } = useTheme();
  
  const { addToast } = useToast();

  const [originalTheme, setOriginalTheme] = useState({ primary: '', secondary: '', heading: '', body: '' });
  const [aboutData, setAboutData] = useState<AboutContent>(initialAboutContent);
  const [contactData, setContactData] = useState<ContactContent>(initialContactContent);
  const [linksData, setLinksData] = useState<ManagedLink[]>([]);
  const [editingLink, setEditingLink] = useState<{ id: string | null; title: string; url: string; description?: string }>({ id: null, title: '', url: '', description: '' });
  const [draggedLinkIndex, setDraggedLinkIndex] = useState<number | null>(null);
  const [dragOverLinkIndex, setDragOverLinkIndex] = useState<number | null>(null);


  useEffect(() => {
    if (panelView === 'about') {
      const savedContent = localStorage.getItem('aboutContent');
      const content = savedContent ? JSON.parse(savedContent) : initialAboutContent;
      setAboutData(content);
    }
    if (panelView === 'contact') {
      const savedContent = localStorage.getItem('contactContent');
      const content = savedContent ? JSON.parse(savedContent) : initialContactContent;
      setContactData(content);
    }
    if (panelView === 'links') {
      const savedLinks = localStorage.getItem('managedLinks');
      setLinksData(savedLinks ? JSON.parse(savedLinks) : []);
    }
    if (panelView === 'theme') {
         setOriginalTheme({
            primary: primaryColor,
            secondary: secondaryColor,
            heading: headingFont,
            body: bodyFont,
        });
    }
  }, [panelView, primaryColor, secondaryColor, headingFont, bodyFont]);

  if (!isAdmin) {
    return null;
  }

  const handleCancelThemeChanges = () => {
    setPrimaryColor(originalTheme.primary);
    setSecondaryColor(originalTheme.secondary);
    setHeadingFont(originalTheme.heading);
    setBodyFont(originalTheme.body);
    setPanelView('main');
  };

  const handleSaveTheme = () => {
    saveTheme();
    setPanelView('main');
  };
  
  const handleLogout = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('admin');
    window.location.href = url.toString();
  };
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    } else if (href === 'footer') {
        document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
    }
    closePanel();
  };
  
  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setAboutData(prev => {
        const newContent = JSON.parse(JSON.stringify(prev));
        if (name === 'title' || name === 'subtitle') {
            newContent[name] = value;
        } else if (name.startsWith('feature_title_')) {
            const index = parseInt(name.replace('feature_title_', ''), 10);
            newContent.features[index].title = value;
        } else if (name.startsWith('feature_desc_')) {
            const index = parseInt(name.replace('feature_desc_', ''), 10);
            newContent.features[index].description = value;
        }
        return newContent;
    });
  };

  const handleSaveAbout = () => {
    localStorage.setItem('aboutContent', JSON.stringify(aboutData));
    addToast('Bahagian "Tentang Kami" berjaya disimpan.');
    window.location.reload();
  };
  
  const handleResetAbout = () => {
    localStorage.removeItem('aboutContent');
    addToast('Bahagian "Tentang Kami" telah ditetapkan semula.');
    window.location.reload();
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData(prev => {
        const newContent = JSON.parse(JSON.stringify(prev));
        if (name === 'title' || name === 'subtitle') {
            newContent[name] = value;
        } else {
            newContent.formLabels[name as keyof typeof newContent.formLabels] = value;
        }
        return newContent;
    });
  };

  const handleSaveContact = () => {
      localStorage.setItem('contactContent', JSON.stringify(contactData));
      addToast('Bahagian "Hubungi Kami" berjaya disimpan.');
      window.location.reload();
  };
  
  const handleResetContact = () => {
      localStorage.removeItem('contactContent');
      addToast('Bahagian "Hubungi Kami" telah ditetapkan semula.');
      window.location.reload();
  };

  const handleLinkInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingLink(prev => ({ ...prev!, [name]: value }));
  };

  const handleAddOrUpdateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink.title || !editingLink.url) return;

    if (editingLink.id) { // Update existing
      setLinksData(linksData.map(link => link.id === editingLink.id ? { ...editingLink, id: editingLink.id! } : link));
    } else { // Add new
      const newLink: ManagedLink = {
        id: `link-${Date.now()}`,
        title: editingLink.title,
        url: editingLink.url,
        description: editingLink.description,
      };
      setLinksData([newLink, ...linksData]);
    }
    setEditingLink({ id: null, title: '', url: '', description: '' });
  };
  
  const handleEditLink = (link: ManagedLink) => {
    setEditingLink(link);
  };
  
  const handleCancelEdit = () => {
    setEditingLink({ id: null, title: '', url: '', description: '' });
  };

  const handleDeleteLink = (id: string) => {
    setLinksData(linksData.filter(link => link.id !== id));
  };
  
  const handleSaveLinks = () => {
    localStorage.setItem('managedLinks', JSON.stringify(linksData));
    window.dispatchEvent(new CustomEvent('linksUpdated'));
    addToast('Senarai pautan berjaya disimpan.');
    setPanelView('main');
  };

  const handleResetLinks = () => {
    localStorage.removeItem('managedLinks');
    setLinksData([]);
    window.dispatchEvent(new CustomEvent('linksUpdated'));
    addToast('Senarai pautan telah dikosongkan.');
  };

  const handleDragStart = (index: number) => setDraggedLinkIndex(index);
  const handleDragEnter = (index: number) => {
    if (draggedLinkIndex !== null) setDragOverLinkIndex(index);
  };
  const handleDragEnd = () => {
    setDraggedLinkIndex(null);
    setDragOverLinkIndex(null);
  };
  const handleDrop = () => {
    if (draggedLinkIndex !== null && dragOverLinkIndex !== null) {
      const newLinks = [...linksData];
      const [movedLink] = newLinks.splice(draggedLinkIndex, 1);
      newLinks.splice(dragOverLinkIndex, 0, movedLink);
      setLinksData(newLinks);
    }
    handleDragEnd();
  };


  const getHeader = () => {
    const views: { [key: string]: { title: string; onBack: () => void } } = {
        about: { title: 'TENTANG KAMI', onBack: () => setPanelView('main') },
        contact: { title: 'HUBUNGI KAMI', onBack: () => setPanelView('main') },
        links: { title: 'PENGURUS PAUTAN', onBack: () => setPanelView('main') },
        theme: { title: 'SESUAIKAN TEMA', onBack: handleCancelThemeChanges },
    };

    const currentViewConfig = views[panelView];

    return (
        <div className="flex items-center gap-2">
            {currentViewConfig ? (
                <button onClick={currentViewConfig.onBack} className="p-1 hover:text-secondary transition-colors rounded-full hover:bg-white/10" title="Kembali">
                    <ChevronLeftIcon />
                </button>
            ) : null}
            <h3 className="font-bold text-lg font-heading tracking-wider">
                {currentViewConfig ? currentViewConfig.title : 'PANEL PENTADBIR'}
            </h3>
        </div>
    );
  };
  
  const inputStyles = "w-full bg-white/10 text-white p-2 mt-1 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-secondary";
  const buttonStyles = "flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/10 transition-colors text-sm w-full text-left";
  const activeStyles = "bg-white/10 font-semibold";

  return (
    <>
      <div className={`fixed bottom-5 right-5 z-[90] transition-all duration-300 ease-in-out ${isPanelOpen ? 'pointer-events-none' : ''}`}>
        <button
          onClick={() => openPanel()}
          className={`bg-primary text-white rounded-full p-4 shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transform transition-all duration-300 hover:scale-110
            ${isPanelOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
          `}
          aria-label="Buka Panel Pentadbir"
          title="Buka Panel Pentadbir"
        >
          <SettingsIcon />
        </button>
      </div>

      <div
        className={`fixed bottom-5 right-5 z-[90] w-[calc(100%-2.5rem)] max-w-xs bg-dark/95 backdrop-blur-sm rounded-xl shadow-2xl text-white transition-all duration-300 ease-in-out origin-bottom-right
          ${isPanelOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          {getHeader()}
          <button 
            onClick={closePanel} 
            className="p-2 hover:bg-white/10 rounded-full"
            aria-label="Tutup Panel Pentadbir"
            title="Tutup Panel Pentadbir"
          >
            <XIcon />
          </button>
        </div>

        {panelView === 'main' && (
          <>
            <div className="p-2">
                <nav className="flex flex-col space-y-1">
                     <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Edit Kandungan</p>
                    {mainSections.map(section => (
                        <button 
                            key={section.name} 
                            onClick={() => setPanelView(section.view as any)}
                            className={`${buttonStyles} ${panelView === section.view ? activeStyles : ''}`}
                        >
                            <span className="text-secondary">{section.icon}</span>
                            <span>{section.name}</span>
                        </button>
                    ))}
                    <p className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Lompat Ke Bahagian</p>
                     {pageSections.map(section => (
                        <a 
                            key={section.name} 
                            href={section.href}
                            onClick={(e) => handleLinkClick(e, section.href)}
                            className={`${buttonStyles}`}
                        >
                            <span className="text-secondary">{section.icon}</span>
                            <span>{section.name}</span>
                        </a>
                    ))}
                </nav>
            </div>
            <div className="p-4 border-t border-white/10 mt-2">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 py-2.5 bg-red-600/80 hover:bg-red-600 rounded-lg font-semibold transition-colors"
                >
                    <LogoutIcon />
                    Log Keluar
                </button>
            </div>
          </>
        )}
        
        {panelView === 'theme' && (
          <div className="p-4 space-y-6">
              <div className="space-y-4">
                  <div>
                      <label htmlFor="primary-color" className="text-sm font-medium text-gray-300 mb-2 block">Warna Primer</label>
                      <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                          <label htmlFor="primary-color" className="w-8 h-8 rounded-md cursor-pointer ring-1 ring-inset ring-white/30" style={{ backgroundColor: primaryColor }}>
                              <input type="color" id="primary-color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="opacity-0 w-0 h-0 absolute" aria-label="Pilih warna primer" />
                          </label>
                          <span className="font-mono text-sm uppercase tracking-wider text-gray-200">{primaryColor}</span>
                      </div>
                  </div>
                  <div>
                      <label htmlFor="secondary-color" className="text-sm font-medium text-gray-300 mb-2 block">Warna Sekunder</label>
                      <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                           <label htmlFor="secondary-color" className="w-8 h-8 rounded-md cursor-pointer ring-1 ring-inset ring-white/30" style={{ backgroundColor: secondaryColor }}>
                              <input type="color" id="secondary-color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="opacity-0 w-0 h-0 absolute" aria-label="Pilih warna sekunder" />
                           </label>
                          <span className="font-mono text-sm uppercase tracking-wider text-gray-200">{secondaryColor}</span>
                      </div>
                  </div>
                  <div>
                      <label htmlFor="heading-font" className="text-sm font-medium text-gray-300 mb-2 block">Fon Tajuk</label>
                      <select id="heading-font" value={headingFont} onChange={e => setHeadingFont(e.target.value)} className={inputStyles}>
                          {fontOptions.map(font => <option key={font} value={font} className="bg-dark">{font}</option>)}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="body-font" className="text-sm font-medium text-gray-300 mb-2 block">Fon Teks</label>
                      <select id="body-font" value={bodyFont} onChange={e => setBodyFont(e.target.value)} className={inputStyles}>
                          {fontOptions.map(font => <option key={font} value={font} className="bg-dark">{font}</option>)}
                      </select>
                  </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-white/10">
                  <button onClick={handleSaveTheme} className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors text-sm">Simpan Perubahan</button>
                  <button onClick={resetTheme} className="w-full py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-sm">Set Semula ke Lalai</button>
              </div>
          </div>
        )}

        {panelView === 'about' && (
           <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
             <div>
                <label className="text-sm font-medium text-gray-300">Tajuk Utama</label>
                <input type="text" name="title" value={aboutData.title} onChange={handleAboutChange} className={inputStyles} />
             </div>
             <div>
                <label className="text-sm font-medium text-gray-300">Sub-tajuk</label>
                <textarea name="subtitle" value={aboutData.subtitle} onChange={handleAboutChange} rows={2} className={inputStyles} />
             </div>
             {aboutData.features.map((feature, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg space-y-2">
                    <label className="text-sm font-medium text-gray-300">Ciri {index + 1}</label>
                    <input type="text" name={`feature_title_${index}`} value={feature.title} onChange={handleAboutChange} placeholder="Tajuk Ciri" className={inputStyles} />
                    <textarea name={`feature_desc_${index}`} value={feature.description} onChange={handleAboutChange} placeholder="Penerangan Ciri" rows={3} className={inputStyles} />
                </div>
             ))}
              <div className="space-y-3 pt-4 border-t border-white/10">
                  <button onClick={handleSaveAbout} className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors text-sm">Simpan Perubahan</button>
                  <button onClick={handleResetAbout} className="w-full py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-sm">Set Semula ke Lalai</button>
              </div>
           </div>
        )}
        
        {panelView === 'contact' && (
           <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
             <div>
                <label className="text-sm font-medium text-gray-300">Tajuk Utama</label>
                <input type="text" name="title" value={contactData.title} onChange={handleContactChange} className={inputStyles} />
             </div>
             <div>
                <label className="text-sm font-medium text-gray-300">Sub-tajuk</label>
                <textarea name="subtitle" value={contactData.subtitle} onChange={handleContactChange} rows={2} className={inputStyles} />
             </div>
             <div className="p-3 bg-white/5 rounded-lg space-y-2">
                <label className="text-sm font-medium text-gray-300">Label Borang</label>
                <input type="text" name="name" value={contactData.formLabels.name} onChange={handleContactChange} placeholder="Label Nama" className={inputStyles} />
                <input type="text" name="email" value={contactData.formLabels.email} onChange={handleContactChange} placeholder="Label E-mel" className={inputStyles} />
                <input type="text" name="message" value={contactData.formLabels.message} onChange={handleContactChange} placeholder="Label Mesej" className={inputStyles} />
                <input type="text" name="submit" value={contactData.formLabels.submit} onChange={handleContactChange} placeholder="Label Butang Hantar" className={inputStyles} />
             </div>
              <div className="space-y-3 pt-4 border-t border-white/10">
                  <button onClick={handleSaveContact} className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors text-sm">Simpan Perubahan</button>
                  <button onClick={handleResetContact} className="w-full py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-sm">Set Semula ke Lalai</button>
              </div>
           </div>
        )}

        {panelView === 'links' && (
           <div className="p-4 flex flex-col max-h-[75vh]">
             <form onSubmit={handleAddOrUpdateLink} className="p-3 bg-white/10 rounded-lg space-y-3 mb-4">
                <h4 className="font-semibold text-base">{editingLink.id ? 'Edit Pautan' : 'Tambah Pautan Baru'}</h4>
                <input type="text" name="title" value={editingLink.title || ''} onChange={handleLinkInputChange} placeholder="Tajuk Pautan" className={`${inputStyles} text-sm`} required />
                <input type="url" name="url" value={editingLink.url || ''} onChange={handleLinkInputChange} placeholder="URL (cth: https://...)" className={`${inputStyles} text-sm`} required />
                <textarea name="description" value={editingLink.description || ''} onChange={handleLinkInputChange} placeholder="Penerangan (Pilihan)" rows={2} className={`${inputStyles} text-sm`} />
                <div className="flex gap-2 justify-end">
                    {editingLink.id && <button type="button" onClick={handleCancelEdit} className="px-3 py-1.5 bg-gray-500/80 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors text-xs">Batal</button>}
                    <button type="submit" className="px-3 py-1.5 bg-secondary/90 hover:bg-secondary text-primary font-bold rounded-lg transition-colors text-xs">{editingLink.id ? 'Kemas Kini' : 'Tambah'}</button>
                </div>
             </form>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 -mr-2" onDragOver={(e) => e.preventDefault()}>
                {linksData.map((link, index) => (
                    <div key={link.id} draggable onDragStart={() => handleDragStart(index)} onDragEnter={() => handleDragEnter(index)} onDrop={handleDrop} onDragEnd={handleDragEnd}
                        className={`flex items-center gap-2 p-2 rounded-md bg-white/5 transition-all duration-200 border-t-2 ${draggedLinkIndex === index ? 'opacity-30' : ''} ${dragOverLinkIndex === index ? 'border-secondary' : 'border-transparent'}`}>
                        <span className="cursor-grab text-gray-400 touch-none" title="Seret untuk susun semula"><GripVerticalIcon /></span>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold truncate text-white">{link.title}</p>
                            <p className="text-xs truncate text-gray-400">{link.url}</p>
                        </div>
                        <button onClick={() => handleEditLink(link)} className="p-2 text-secondary hover:bg-secondary/20 rounded-full"><EditIcon /></button>
                        <button onClick={() => handleDeleteLink(link.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-full"><TrashIcon /></button>
                    </div>
                ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10 mt-auto">
                <button onClick={handleSaveLinks} className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors text-sm">Simpan Perubahan</button>
                <button onClick={handleResetLinks} className="w-full py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-sm">Kosongkan Semua</button>
            </div>
           </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;