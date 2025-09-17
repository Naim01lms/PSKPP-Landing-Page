import React, { useState, useRef, useEffect } from 'react';
import ImageIcon from './icons/ImageIcon';
import VideoIcon from './icons/VideoIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import { useToast } from '../contexts/ToastContext';

const pskppLogo = 'data:image/webp;base64,UklGRtQMAABXRUJQVlA4IMgMAADwEACdASoIAggAPm02lkikIqGYp7OYCADABoJZADcAFwBE/+5f/fN//8/9W/x//V/l7/PfAPyF/pf/L/jf8R/pf8L/cfYh/y/9T6F/lf7d/7v9//+f+wD+b/3X/q/3P/hf7v/yH94/yH/d/33/c/hp/Mfz/+4/5n/g/2T/d/3H3A/0b/I/3X/O/4b/o/4X9yP7b/nf9x/0v85/rv+J/yX9s/bz/Uf8v/qf2o/fz/Yf+H/l/4f+6H+h/yv+l/3P+I/w3/L/5f/M/4v+q/9r/jf6v/0/8x/vP/Z/xv/U/9z/3f7t/////+b/9f/h/////+Bf5n/l/8b/jP8t/mf/H/zP+h/5n/Y/6b/nf9l/zP+F/1P+o/8f/Bf6T/vf9b/3P+J/xv+n/4v+t/4f/f/8X/////9QP8v/vP/J/zH+Q/5/+w/9H/h/9r/sP+b/vP/d/4//if+J/xv/D/4/+G/8P/R/7v/Z/9z/////+b/9v/g////+iHw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4red-content-here...u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS74aOJ8NLvho4nw0u+GjifDS7aAA/915Qf9b//wH/99A99h+k1FqP12j81Goj/w/9vX/f/yH+p/2H+I/4v+r/8T/cf9P/0f79+oAAAAA/71W/9t//D/6v/Nf63/c/6H+4/+L+2v2YAD//48zVw877h897/j/8z/lf/P/0H/N/6v/O/8//k//Z/yP/x/i78//8v9R/xP+L/vP+f/53+0/+3+Gv0L/b+6/3r7i/h+Vf1X6g/Svp7/Q/nL9O/wH6L/uHwH6S/Wn60/Z/9r/1/+I/+P8e/2X95fs392fu/+3/6j/mP9f/uP+t/7D/uP+x/6b/c/7T/q/93/tvAB//+Ua2+eM+A9rP+8//3+N/3v/c/0v/D/6T/pP/P/oP/1/+g/+X/Y/8f/S//f8a/t/+y/4X+I/2v+r/vf/n/7v/l/7f/y/9d/2v/n/+X/xf/7/t39t/sv+M/y/+M/8v+R/2v9Z/uP9f/qP/P/1H/C/8n/c/6z/i/+F/qv+l/uX9g/1X9N/vP+M/uH+V/yH/R/8P+z/vf/Z/8//YAA';

// --- Encryption/Decryption Utilities ---
// NOTE: This is a simple XOR cipher for demonstration purposes.
// For production, a robust cryptographic library should be used.
const ENCRYPTION_KEY = 'PSKPP_SECRET_KEY_2025';

// Encodes data to Base64 and then applies XOR encryption.
const encryptData = (data: string, key: string): string => {
  let encrypted = '';
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    encrypted += String.fromCharCode(charCode);
  }
  return btoa(encrypted); // Base64 encode to handle binary data safely.
};

// Decrypts data by first decoding from Base64 and then reversing the XOR operation.
const decryptData = (encryptedData: string, key: string): string => {
  const decodedData = atob(encryptedData); // Decode from Base64.
  let decrypted = '';
  for (let i = 0; i < decodedData.length; i++) {
    const charCode = decodedData.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    decrypted += String.fromCharCode(charCode);
  }
  return decrypted;
};
// --- End of Utilities ---

interface HeroProps {
  isAdmin: boolean;
}

const Hero: React.FC<HeroProps> = ({ isAdmin }) => {
  const [background, setBackground] = useState({
    image: 'https://picsum.photos/1920/1080?random=1',
    video: null as string | null,
    active: 'image' as 'image' | 'video',
  });
  const [uploadingType, setUploadingType] = useState<'image' | 'video' | null>(null);
  const { addToast } = useToast();

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedBackground = localStorage.getItem('heroBackground');
    if (savedBackground) {
      try {
        const decrypted = decryptData(savedBackground, ENCRYPTION_KEY);
        const parsed = JSON.parse(decrypted);
        if (parsed.image && parsed.active) {
            setBackground(parsed);
        }
      } catch (error) {
        console.error("Failed to load hero background:", error);
      }
    } else {
      // Backward compatibility for old image-only setup
      const savedImage = localStorage.getItem('heroBackgroundImage');
      if (savedImage) {
        try {
          const decryptedImage = decryptData(savedImage, ENCRYPTION_KEY);
          setBackground(prev => ({ ...prev, image: decryptedImage, active: 'image' }));
        } catch (error) {
          console.error("Failed to decrypt old hero image:", error);
          // Handle old unencrypted data
          setBackground(prev => ({ ...prev, image: savedImage, active: 'image' }));
        }
      }
    }
  }, []);
  
  const saveBackground = (newBackground: typeof background) => {
    try {
      const encrypted = encryptData(JSON.stringify(newBackground), ENCRYPTION_KEY);
      localStorage.setItem('heroBackground', encrypted);
      setBackground(newBackground);
      // Clean up old key if it exists
      localStorage.removeItem('heroBackgroundImage');
    } catch(error) {
        console.error("Could not save background", error);
    }
  };

  const handleImageUploadClick = () => imageFileInputRef.current?.click();
  const handleVideoUploadClick = () => videoFileInputRef.current?.click();

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      addToast('Sila pilih fail imej yang sah (JPEG, PNG, WebP).', 'error');
      return;
    }

    setUploadingType('image');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      saveBackground({ ...background, image: result, active: 'image' });
      addToast('Latar belakang imej berjaya dikemas kini.');
      setUploadingType(null);
    };
    reader.onerror = () => {
      addToast('Gagal memuat naik imej.', 'error');
      setUploadingType(null);
    };
    reader.readAsDataURL(file);
  };
  
  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      addToast('Sila pilih fail video yang sah (MP4, WebM, Ogg).', 'error');
      return;
    }
  
    setUploadingType('video');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      saveBackground({ ...background, video: result, active: 'video' });
      addToast('Latar belakang video berjaya dikemas kini.');
      setUploadingType(null);
    };
    reader.onerror = () => {
        addToast('Gagal memuat naik video.', 'error');
        setUploadingType(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      
      {background.active === 'video' && background.video ? (
        <video
          key={background.video} // Key ensures React replaces the element on src change
          className="absolute inset-0 w-full h-full object-cover"
          src={background.video}
          poster={background.image}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          src={background.image}
          alt="Sports and Culture Festival"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        <img
          src={pskppLogo}
          alt="Logo PSKPP 52 Perak 2025"
          className="h-48 md:h-64 w-auto mb-6 drop-shadow-2xl"
        />
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-heading uppercase tracking-wider mb-4 text-shadow-lg">
          Pesta Sukan & Kebudayaan
        </h1>
        <p className="text-lg md:text-2xl font-light mb-8 max-w-3xl mx-auto">
          Perkhidmatan Pendidikan (PSKPP)
        </p>
        <a
          href="#events"
          className="bg-secondary hover:bg-amber-500 text-primary font-bold py-3 px-8 rounded-full text-lg uppercase transform hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
        >
          Lihat Acara
        </a>
      </div>
      
      {isAdmin && (
        <div className="absolute bottom-5 right-5 flex flex-col gap-3 z-20">
            <button
              onClick={handleImageUploadClick}
              disabled={uploadingType !== null}
              className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:bg-black/70 flex items-center justify-center h-[48px] w-[48px]"
              aria-label="Tukar imej latar belakang"
              title="Tukar imej latar belakang"
            >
              {uploadingType === 'image' ? <SpinnerIcon className="h-6 w-6" /> : <ImageIcon />}
            </button>
            <input
              type="file"
              ref={imageFileInputRef}
              onChange={handleImageFileChange}
              accept="image/jpeg, image/png, image/webp"
              className="hidden"
              aria-hidden="true"
            />
             <button
              onClick={handleVideoUploadClick}
              disabled={uploadingType !== null}
              className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:bg-black/70 flex items-center justify-center h-[48px] w-[48px]"
              aria-label="Muat naik video latar belakang"
              title="Muat naik video latar belakang"
            >
              {uploadingType === 'video' ? <SpinnerIcon className="h-6 w-6" /> : <VideoIcon />}
            </button>
             <input
              type="file"
              ref={videoFileInputRef}
              onChange={handleVideoFileChange}
              accept="video/mp4,video/webm,video/ogg"
              className="hidden"
              aria-hidden="true"
            />
        </div>
      )}
    </section>
  );
};

export default Hero;