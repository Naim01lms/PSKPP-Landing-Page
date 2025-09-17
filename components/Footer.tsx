import React, { useState, useEffect, useRef } from 'react';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import GripVerticalIcon from './icons/GripVerticalIcon';

interface FooterContent {
  description: string;
  quickLinks: { name: string; href: string; }[];
  socialText: string;
}

const initialContent: FooterContent = {
  description: "Pesta Persatuan Sukan dan Kebudayaan Perkhidmatan Pendidikan Malaysia.",
  quickLinks: [
    { name: 'Tentang Kami', href: '#about' },
    { name: 'Acara', href: '#events' },
    { name: 'Galeri', href: '#gallery' },
  ],
  socialText: "Facebook | Instagram | Twitter",
};
const LOCAL_STORAGE_KEY = 'footerContent';

interface FooterProps {
    isAdmin: boolean;
}

const Footer: React.FC<FooterProps> = ({ isAdmin }) => {
  const [content, setContent] = useState<FooterContent>(initialContent);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const isInitialMount = useRef(true);
  
  // Load content from localStorage on mount
  useEffect(() => {
    try {
        const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedContent) {
            const parsed = JSON.parse(savedContent);
            setContent(parsed);
        }
    } catch (error) {
        console.error("Failed to load footer content:", error);
    }
  }, []);
  
  // Save content to localStorage automatically whenever it changes
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(content));
    } catch (error) {
        console.error("Failed to save footer content:", error);
    }
  }, [content]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setContent(prev => {
        const newContent = JSON.parse(JSON.stringify(prev)); // Deep copy
        
        if (name === 'description' || name === 'socialText') {
            newContent[name] = value;
        } else {
             const [field, indexStr, property] = name.split('_');
             if (field === 'quickLink' && indexStr && property) {
                const index = parseInt(indexStr, 10);
                (newContent.quickLinks[index] as any)[property] = value;
            }
        }
        return newContent;
    });
  };

  const handleAddLink = () => {
    setContent(prev => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { name: 'Pautan Baru', href: '#' }],
    }));
  };

  const handleRemoveLink = (indexToRemove: number) => {
    setContent(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
        setDragOverIndex(index);
    }
  };

  const handleDrop = () => {
    if (draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex) {
        handleDragEnd();
        return;
    }
    
    const newLinks = [...content.quickLinks];
    const [removed] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(dragOverIndex, 0, removed);

    setContent(prev => ({ ...prev, quickLinks: newLinks }));
    handleDragEnd();
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const inlineInputClass = "w-full bg-transparent text-inherit border-0 rounded p-1 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:bg-gray-600/50 transition-all";

  return (
    <footer id="footer" className="bg-dark text-gray-300 relative group">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white font-heading tracking-wider mb-4">PSKPP</h3>
            {isAdmin ? (
                <input
                    type="text"
                    name="description"
                    value={content.description}
                    onChange={handleChange}
                    className={`${inlineInputClass} text-sm text-gray-400`}
                    aria-label="Edit description"
                />
            ) : (
                <p className="text-sm text-gray-400">{content.description}</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Pautan Pantas</h3>
             {isAdmin ? (
                <>
                    <div className="space-y-2" onDragOver={(e) => e.preventDefault()}>
                        {content.quickLinks.map((link, index) => (
                            <div
                                key={`link-${index}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={() => handleDragEnter(index)}
                                onDrop={handleDrop}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center gap-2 transition-all duration-200 group/link border-t-2 ${
                                    draggedIndex === index ? 'opacity-30' : 'opacity-100'
                                } ${
                                    dragOverIndex === index ? 'border-secondary' : 'border-transparent'
                                }`}
                            >
                                <span className="cursor-grab text-gray-500 hover:text-white touch-none" title="Seret untuk susun semula">
                                    <GripVerticalIcon />
                                </span>
                                <input
                                    type="text"
                                    name={`quickLink_${index}_name`}
                                    value={link.name}
                                    onChange={handleChange}
                                    placeholder="Teks Pautan"
                                    className={`${inlineInputClass} hover:text-secondary`}
                                    aria-label={`Edit text for link ${index+1}`}
                                />
                                <input
                                    type="text"
                                    name={`quickLink_${index}_href`}
                                    value={link.href}
                                    onChange={handleChange}
                                    placeholder="URL"
                                    className={`${inlineInputClass} text-xs text-gray-500 w-24`}
                                    aria-label={`Edit URL for link ${index+1}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveLink(index)}
                                    className="p-1.5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover/link:opacity-100 focus:opacity-100"
                                    aria-label="Padam Pautan"
                                    title="Padam Pautan"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddLink}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-lg transition-colors text-sm"
                    >
                        <PlusIcon />
                        Tambah Pautan
                    </button>
                </>
            ) : (
                <ul className="space-y-2">
                    {content.quickLinks.map((link, index) => (
                        <li key={index}>
                           {link.name && link.href ? (
                                <a href={link.href} className="hover:text-secondary transition-colors">{link.name}</a>
                            ) : (
                                <span className="text-gray-500 italic">{link.name || '(Pautan kosong)'}</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Ikuti Kami</h3>
            {isAdmin ? (
                <input
                    type="text"
                    name="socialText"
                    value={content.socialText}
                    onChange={handleChange}
                    className={`${inlineInputClass} text-sm text-gray-400`}
                    aria-label="Edit social text"
                />
            ) : (
                <p className="text-sm text-gray-400">{content.socialText}</p>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} PSKPP. Hak Cipta Terpelihara.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;