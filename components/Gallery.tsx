import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { GalleryItem } from '../types';
import UploadIcon from './icons/UploadIcon';
import TrashIcon from './icons/TrashIcon';
import AlertIcon from './icons/AlertIcon';
import PlayIcon from './icons/PlayIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import { useToast } from '../contexts/ToastContext';

const initialItems: GalleryItem[] = [
  { id: 'img-1', type: 'image', src: 'https://picsum.photos/500/500?random=20' },
  { id: 'vid-1', type: 'video', src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: 'img-2', type: 'image', src: 'https://picsum.photos/500/500?random=22' },
  { id: 'img-3', type: 'image', src: 'https://picsum.photos/500/300?random=23' },
  { id: 'img-4', type: 'image', src: 'https://picsum.photos/500/500?random=24' },
  { id: 'img-5', type: 'image', src: 'https://picsum.photos/500/600?random=25' },
  { id: 'img-6', type: 'image', src: 'https://picsum.photos/500/500?random=26' },
  { id: 'img-7', type: 'image', src: 'https://picsum.photos/500/400?random=27' },
];

const LOCAL_STORAGE_KEY = 'galleryItems';

interface GalleryProps {
  isAdmin: boolean;
}

interface UploadProgress {
  id: string;
  file: File;
  progress: number;
  tempUrl: string;
  type: 'image' | 'video';
}

const Gallery: React.FC<GalleryProps> = ({ isAdmin }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isModalLoading, setIsModalLoading] = useState(true);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const isDraggingActive = draggedIndex !== null;

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const isInitialMount = useRef(true);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedItems) {
        setGalleryItems(JSON.parse(savedItems));
      } else {
        setGalleryItems(initialItems);
      }
    } catch (error) {
      console.error("Failed to load gallery items from storage:", error);
      setGalleryItems(initialItems);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(galleryItems));
    } catch (error) {
        console.error("Failed to save gallery items to storage:", error);
        addToast("Gagal menyimpan susunan galeri.", "error");
    }
  }, [galleryItems]);


  const resetTransform = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsPanning(false);
  }, []);

  const openModal = (itemToOpen: GalleryItem) => {
    if (draggedIndex !== null) return;
    const index = galleryItems.findIndex(item => item.id === itemToOpen.id);
    if (index === -1) return;
    setIsModalLoading(true);
    setSelectedItemIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const showNext = useCallback(() => {
    setIsModalLoading(true);
    setSelectedItemIndex(prevIndex => (prevIndex + 1) % galleryItems.length);
  }, [galleryItems.length]);

  const showPrev = useCallback(() => {
    setIsModalLoading(true);
    setSelectedItemIndex(prevIndex => (prevIndex - 1 + galleryItems.length) % galleryItems.length);
  }, [galleryItems.length]);

  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => setIsModalVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  useEffect(() => {
    resetTransform();
  }, [selectedItemIndex, resetTransform]);


  const handleTransitionEnd = () => {
    if (!isModalVisible) {
      setIsModalOpen(false);
      resetTransform();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, showNext, showPrev, closeModal]);

  useEffect(() => {
    if (isModalOpen && galleryItems.length > 1) {
      const nextIndex = (selectedItemIndex + 1) % galleryItems.length;
      const nextItem = galleryItems[nextIndex];
      if (nextItem.type === 'image') {
        const preloadImage = new Image();
        preloadImage.src = nextItem.src;
      }
    }
  }, [isModalOpen, selectedItemIndex, galleryItems]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    e.preventDefault();
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const zoomIntensity = 0.1;

    const newScale = scale - e.deltaY * zoomIntensity;
    const clampedScale = Math.max(1, Math.min(newScale, 5));

    if (clampedScale === scale) return;

    if (clampedScale <= 1) {
      resetTransform();
      return;
    }

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate position as if there were no constraints
    let newX = mouseX - (mouseX - position.x) * (clampedScale / scale);
    let newY = mouseY - (mouseY - position.y) * (clampedScale / scale);
    
    // Now apply constraints based on the new scale
    const image = imageRef.current;
    if (image) {
        const scaledWidth = image.offsetWidth * clampedScale;
        const scaledHeight = image.offsetHeight * clampedScale;

        const overageX = scaledWidth > rect.width ? (scaledWidth - rect.width) / 2 : 0;
        const overageY = scaledHeight > rect.height ? (scaledHeight - rect.height) / 2 : 0;
        
        const minX = -overageX;
        const maxX = overageX;
        const minY = -overageY;
        const maxY = overageY;

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));
    }

    setScale(clampedScale);
    setPosition({ x: newX, y: newY });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsPanning(true);
    setStartPanPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      e.preventDefault();

      const imageContainer = imageContainerRef.current;
      const image = imageRef.current;
      if (!imageContainer || !image) return;

      const containerRect = imageContainer.getBoundingClientRect();
      const scaledWidth = image.offsetWidth * scale;
      const scaledHeight = image.offsetHeight * scale;

      const overageX = scaledWidth > containerRect.width ? (scaledWidth - containerRect.width) / 2 : 0;
      const overageY = scaledHeight > containerRect.height ? (scaledHeight - containerRect.height) / 2 : 0;
      
      const minX = -overageX;
      const maxX = overageX;
      const minY = -overageY;
      const maxY = overageY;

      let newX = e.clientX - startPanPosition.x;
      let newY = e.clientY - startPanPosition.y;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleWindowMouseUp = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isPanning, startPanPosition, scale]);


  const handleDoubleClick = () => {
    if (scale > 1) {
      resetTransform();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
            validFiles.push(file);
        } else {
            invalidFiles.push(file);
        }
    });

    if (invalidFiles.length > 0) {
        const invalidNames = invalidFiles.map(f => `"${f.name}"`).join(', ');
        addToast(`Jenis fail tidak disokong untuk ${invalidNames}. Sila pilih imej atau video.`, 'error');
    }

    if (validFiles.length === 0) {
        if (event.target) event.target.value = '';
        return;
    }

    const newUploads = validFiles.map(file => {
      const isVideo = file.type.startsWith('video/');
      return {
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
        tempUrl: URL.createObjectURL(file),
        type: isVideo ? 'video' : 'image',
      } as UploadProgress;
    });

    setUploadProgress(prev => [...prev, ...newUploads]);

    newUploads.forEach(upload => {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentUpload = prev.find(item => item.id === upload.id);
          if (!currentUpload) {
            clearInterval(interval);
            return prev;
          }

          const newProgress = currentUpload.progress + 10;

          if (newProgress >= 100) {
            clearInterval(interval);
            const finalState = prev.map(item => item.id === upload.id ? { ...item, progress: 100 } : item);

            const reader = new FileReader();
            reader.onload = e => {
              const result = e.target?.result as string;
              const newItem: GalleryItem = {
                id: upload.id,
                type: upload.type,
                src: result,
              };
              setGalleryItems(prevItems => [newItem, ...prevItems]);
              addToast(`"${upload.file.name}" berjaya dimuat naik.`);
              
              setTimeout(() => {
                setUploadProgress(current => current.filter(item => item.id !== upload.id));
                URL.revokeObjectURL(upload.tempUrl);
              }, 500);
            };
            reader.onerror = err => {
              console.error("File reading error:", err);
              addToast(`Gagal memuat naik "${upload.file.name}".`, 'error');
              setTimeout(() => {
                setUploadProgress(current => current.filter(item => item.id !== upload.id));
                URL.revokeObjectURL(upload.tempUrl);
              }, 500);
            };
            reader.readAsDataURL(upload.file);

            return finalState;
          } else {
            return prev.map(item => item.id === upload.id ? { ...item, progress: newProgress } : item);
          }
        });
      }, 150);
    });

    if (event.target) {
      event.target.value = '';
    }
  };

  const requestDeleteItem = (e: React.MouseEvent<HTMLButtonElement>, item: GalleryItem) => {
    e.stopPropagation();
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setGalleryItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
      setItemToDelete(null);
      addToast('Media berjaya dipadam.');
    }
  };

  const cancelDelete = () => {
    setItemToDelete(null);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (!isAdmin) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (!isAdmin || draggedIndex === null || draggedIndex === index) return;
    e.preventDefault();
    setDragOverIndex(index);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isAdmin) return;
    e.preventDefault();
  };

  const handleDrop = () => {
    if (!isAdmin || draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex) return;
    
    const newItems = [...galleryItems];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(dragOverIndex, 0, removed);

    setGalleryItems(newItems);
  };
  
  const handleDragEnd = () => {
    if (!isAdmin) return;
    setDraggedIndex(null);
    setDragOverIndex(null);
  };


  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary font-heading uppercase tracking-wider">Galeri Kenangan</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Imbas kembali detik-detik indah dari acara-acara yang lepas.
          </p>
          {isAdmin && (
            <div className="mt-6">
              <button
                onClick={handleUploadClick}
                className="inline-flex items-center gap-2 bg-primary hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105"
              >
                <UploadIcon />
                Muat Naik Media
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
                aria-hidden="true"
                multiple
              />
            </div>
          )}
        </div>
        
        {isAdmin && uploadProgress.length > 0 && (
          <div className="max-w-2xl mx-auto mb-12 space-y-4">
            <h3 className="text-lg font-semibold text-primary text-left">Memuat Naik...</h3>
            {uploadProgress.map(({ id, file, progress, tempUrl, type }) => (
              <div key={id} className="flex items-center gap-4 p-3 bg-light rounded-lg border">
                 {type === 'image' ? (
                   <img src={tempUrl} alt={file.name} className="w-14 h-14 object-cover rounded-md flex-shrink-0" />
                 ) : (
                   <video src={tempUrl} className="w-14 h-14 object-cover rounded-md flex-shrink-0 bg-black" />
                 )}
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-dark truncate">{file.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-width duration-150 ease-linear" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 w-10 text-right">{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {galleryItems.map((item, itemIndex) => {
            const isDragging = draggedIndex === itemIndex;
            const isDragOver = dragOverIndex === itemIndex;

            return (
              <div 
                key={item.id} 
                onClick={() => openModal(item)}
                draggable={isAdmin}
                onDragStart={e => handleDragStart(e, itemIndex)}
                onDragEnter={e => handleDragEnter(e, itemIndex)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={`relative mb-4 break-inside-avoid overflow-hidden rounded-lg shadow-md group transition-all duration-300 bg-light
                  ${isAdmin ? (isDraggingActive ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-pointer'}
                  ${isDragging ? 'opacity-30' : 'hover:shadow-xl hover:-translate-y-1'}
                  ${isDragOver ? 'ring-4 ring-accent ring-offset-2' : ''}
                `}
              >
                {item.type === 'image' ? (
                  <img 
                    className={`h-auto w-full object-cover block transition-transform duration-300
                      ${!isDragging ? 'group-hover:scale-105' : ''}
                    `}
                    src={item.src} 
                    alt={`Gallery image ${itemIndex + 1}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="relative w-full h-full bg-black">
                    <video 
                      src={item.src} 
                      className="h-auto w-full object-cover block" 
                      muted 
                      loop 
                      playsInline 
                      preload="metadata" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center pointer-events-none group-hover:bg-opacity-40 transition-all opacity-70 group-hover:opacity-100">
                      <PlayIcon />
                    </div>
                  </div>
                )}
                {isAdmin && (
                  <button
                    onClick={(e) => requestDeleteItem(e, item)}
                    className="absolute top-3 right-3 z-10 bg-black/50 p-2 rounded-full text-white transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-red-600 transform hover:scale-125"
                    aria-label="Padam Media"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && galleryItems[selectedItemIndex] && (
        <div
          className={`fixed inset-0 bg-black flex items-center justify-center z-[100] transition-opacity duration-300 ease-in-out ${isModalVisible ? 'bg-opacity-80' : 'bg-opacity-0'}`}
          onClick={closeModal}
          onTransitionEnd={handleTransitionEnd}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all duration-300 z-[101]"
            aria-label="Previous item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isModalLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <SpinnerIcon />
          </div>

          {galleryItems[selectedItemIndex].type === 'image' ? (
            <div
               className={`relative transition-all duration-300 ease-in-out ${isModalVisible ? 'scale-100' : 'scale-95'} ${isModalLoading ? 'opacity-0' : 'opacity-100'}`}
               onClick={(e) => e.stopPropagation()}
               onDoubleClick={handleDoubleClick}
            >
              <figure>
                <div
                  ref={imageContainerRef}
                  className="overflow-hidden max-w-[90vw] max-h-[85vh] flex items-center justify-center"
                  style={{ cursor: scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'auto' }}
                  onWheel={handleWheel}
                  onMouseDown={handleMouseDown}
                >
                  <img
                    ref={imageRef}
                    src={galleryItems[selectedItemIndex].src}
                    onLoad={() => setIsModalLoading(false)}
                    alt={`Gallery item ${selectedItemIndex + 1}`}
                    className="object-contain rounded-lg shadow-2xl block"
                    style={{
                      transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                      transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                      touchAction: 'none', maxWidth: 'none', maxHeight: 'none',
                    }}
                  />
                </div>
              </figure>
            </div>
          ) : (
            <div
              className={`relative transition-opacity duration-300 ease-in-out w-full h-full flex items-center justify-center max-w-[90vw] max-h-[85vh] ${isModalVisible ? 'scale-100' : 'scale-95'} ${isModalLoading ? 'opacity-0' : 'opacity-100'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={galleryItems[selectedItemIndex].src}
                onLoadedData={() => setIsModalLoading(false)}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg shadow-2xl block"
              />
            </div>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all duration-300 z-[101]"
            aria-label="Next item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          
          <div className="absolute top-4 right-4 flex items-center gap-4 z-[101]">
              <span className="text-white text-sm font-mono bg-black/30 px-3 py-1.5 rounded-full" aria-live="polite">
                  {selectedItemIndex + 1} / {galleryItems.length}
              </span>
              <button
                onClick={closeModal}
                className="text-white bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
          </div>
        </div>
      )}

      {itemToDelete && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] transition-opacity duration-300 ease-in-out"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          onClick={cancelDelete}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md m-4 text-center transform transition-all"
            onClick={e => e.stopPropagation()}
          >
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <AlertIcon />
            </div>
            <div className="mt-5">
                <h3 id="delete-confirm-title" className="text-xl font-bold text-gray-900">
                    Padam Media?
                </h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        Adakah anda pasti ingin memadam item ini? Tindakan ini tidak boleh diubah lagi.
                    </p>
                </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={cancelDelete}
                className="px-8 py-2.5 bg-white text-gray-800 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={!itemToDelete}
                className="px-8 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Ya, Padam
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;