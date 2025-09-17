
import React, { useState, useEffect, useRef } from 'react';
import type { Sponsor } from '../types';
import UploadIcon from './icons/UploadIcon';
import TrashIcon from './icons/TrashIcon';
import { useToast } from '../contexts/ToastContext';
import SpinnerIcon from './icons/SpinnerIcon';

interface SponsorsProps {
  isAdmin: boolean;
}

const Sponsors: React.FC<SponsorsProps> = ({ isAdmin }) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  // Load sponsors from local storage on initial render
  useEffect(() => {
    try {
      const savedSponsors = localStorage.getItem('sponsors');
      if (savedSponsors) {
        setSponsors(JSON.parse(savedSponsors));
      }
    } catch (error) {
      console.error("Failed to load sponsors from local storage:", error);
      setSponsors([]);
    }
  }, []);

  // Save sponsors to local storage whenever they change
  const saveSponsors = (updatedSponsors: Sponsor[]) => {
    setSponsors(updatedSponsors);
    if (updatedSponsors.length > 0) {
      localStorage.setItem('sponsors', JSON.stringify(updatedSponsors));
    } else {
      localStorage.removeItem('sponsors');
    }
  };

  const handleUploadClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    setIsUploading(true);

    const uploadPromises: Promise<Sponsor | null>[] = Array.from(files).map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            name: file.name.split('.').slice(0, -1).join('.') || file.name,
            logoUrl: result,
          });
        };
        reader.onerror = (error) => {
          console.error(`Error reading file ${file.name}:`, error);
          resolve(null); // Resolve with null on error to not fail the whole batch
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(uploadPromises).then(results => {
      const newSponsors = results.filter((r): r is Sponsor => r !== null);
      const failedCount = files.length - newSponsors.length;

      if (newSponsors.length > 0) {
        saveSponsors([...sponsors, ...newSponsors]);
        addToast(`${newSponsors.length} logo berjaya dimuat naik.`);
      }

      if (failedCount > 0) {
        addToast(`${failedCount} logo gagal dimuat naik.`, 'error');
      }
    }).finally(() => {
      setIsUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    });
  };

  const handleDeleteSponsor = (sponsorId: string) => {
    const updatedSponsors = sponsors.filter(s => s.id !== sponsorId);
    saveSponsors(updatedSponsors);
    addToast('Logo penaja berjaya dipadam.');
  };

  return (
    <section id="sponsors" className="py-20 bg-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-500 uppercase tracking-widest">Disokong Oleh</h2>
          {isAdmin && (
            <div className="mt-6">
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105 disabled:opacity-75 disabled:cursor-wait"
              >
                {isUploading ? (
                  <>
                    <SpinnerIcon className="h-5 w-5" />
                    Memuat Naik...
                  </>
                ) : (
                  <>
                    <UploadIcon />
                    Muat Naik Logo
                  </>
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                className="hidden"
                aria-hidden="true"
                multiple
              />
            </div>
          )}
        </div>
        
        {sponsors.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-10">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="relative group text-center" title={sponsor.name}>
                <img 
                  src={sponsor.logoUrl} 
                  alt={sponsor.name} 
                  className="h-16 max-w-[10rem] object-contain filter grayscale hover:grayscale-0 transition-all duration-300" 
                />
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteSponsor(sponsor.id)}
                    className="absolute -top-2 -right-2 z-10 bg-black/60 p-1.5 rounded-full text-white transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-red-600 transform hover:scale-110"
                    aria-label={`Padam logo ${sponsor.name}`}
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {isAdmin ? "Tiada logo dimuat naik. Gunakan butang di atas untuk menambah logo penaja." : "Maklumat penaja akan dipaparkan di sini."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Sponsors;
