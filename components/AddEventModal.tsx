import React, { useState, useRef } from 'react';
import type { Event, Round, Match as MatchType, ScheduleItem } from '../types';
import ImageIcon from './icons/ImageIcon';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';
import IconSelector from './IconSelector';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newEventData: Omit<Event, 'id'>) => void;
}

const initialEventState: Omit<Event, 'id'> = {
  title: '',
  category: 'Sukan',
  categoryIcon: 'default',
  date: '',
  location: '',
  imageUrl: 'https://picsum.photos/400/300?random=100', // Placeholder
  description: '',
  bracketData: [],
  schedule: [],
  gameStatus: 'Teras Kebangsaan',
  startTime: '',
  endDate: '',
  endTime: '',
  isFeatured: false,
};

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Omit<Event, 'id'>>>(initialEventState);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => {
        const newState = { ...prev, [name]: isCheckbox ? checked : value };
        if (name === 'endDate' && !value) {
            newState.endTime = '';
        }
        return newState;
    });
  };
  
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Sila pilih fail imej yang sah (JPEG, PNG, WebP).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result;
      if (typeof result === 'string') {
        setFormData(prev => ({ ...prev, imageUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formatDateToString = (dateString: string | undefined): string => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    };

    const finalEventData: Omit<Event, 'id'> = {
        title: formData.title || 'Acara Baru',
        category: formData.category || 'Sukan',
        categoryIcon: formData.categoryIcon || 'default',
        date: formatDateToString(formData.date),
        location: formData.location || 'Akan Diumumkan',
        imageUrl: formData.imageUrl || initialEventState.imageUrl,
        endDate: formData.endDate ? formatDateToString(formData.endDate) : undefined,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        description: formData.description || '',
        gameStatus: formData.gameStatus || undefined,
        bracketData: formData.bracketData || [],
        schedule: formData.schedule?.filter(item => item.time && item.activity) || [],
        isFeatured: formData.isFeatured || false,
    };
    
    onSave(finalEventData);
    setFormData(initialEventState); // Reset form for next use
  };

  const handleBracketChange = (roundIndex: number, matchIndex: number, pIndex: number, field: 'name' | 'score', value: string | number) => {
      setFormData(prev => {
          const newBracketData: Round[] = JSON.parse(JSON.stringify(prev.bracketData || []));
          const participant = newBracketData[roundIndex].matches[matchIndex].participants[pIndex];
          if (field === 'score') {
              participant.score = value === '' ? undefined : Number(value);
          } else {
              participant.name = String(value);
          }
          return { ...prev, bracketData: newBracketData };
      });
  };

  const handleRoundTitleChange = (roundIndex: number, title: string) => {
      setFormData(prev => {
          const newBracketData: Round[] = JSON.parse(JSON.stringify(prev.bracketData || []));
          if (newBracketData[roundIndex]) newBracketData[roundIndex].title = title;
          return { ...prev, bracketData: newBracketData };
      });
  };

  const addRound = () => {
      setFormData(prev => {
          const newBracketData = [...(prev.bracketData || [])];
          const newRound: Round = { title: `Pusingan ${newBracketData.length + 1}`, matches: [] };
          return { ...prev, bracketData: [...newBracketData, newRound] };
      });
  };

  const removeRound = (roundIndex: number) => {
      setFormData(prev => ({
          ...prev,
          bracketData: (prev.bracketData || []).filter((_, i) => i !== roundIndex)
      }));
  };

  const addMatch = (roundIndex: number) => {
      setFormData(prev => {
          const newBracketData: Round[] = JSON.parse(JSON.stringify(prev.bracketData || []));
          const newMatch: MatchType = { participants: [{ name: 'Peserta TBD' }, { name: 'Peserta TBD' }] };
          newBracketData[roundIndex].matches.push(newMatch);
          return { ...prev, bracketData: newBracketData };
      });
  };

  const removeMatch = (roundIndex: number, matchIndex: number) => {
      setFormData(prev => {
          const newBracketData: Round[] = JSON.parse(JSON.stringify(prev.bracketData || []));
          newBracketData[roundIndex].matches = newBracketData[roundIndex].matches.filter((_, i) => i !== matchIndex);
          return { ...prev, bracketData: newBracketData };
      });
  };
    
  const handleScheduleChange = (index: number, field: keyof ScheduleItem, value: string) => {
    setFormData(prev => {
      const newSchedule = [...(prev.schedule || [])];
      newSchedule[index] = { ...newSchedule[index], [field]: value };
      return { ...prev, schedule: newSchedule };
    });
  };

  const addScheduleItem = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...(prev.schedule || []), { time: '', activity: '' }],
    }));
  };

  const removeScheduleItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: (prev.schedule || []).filter((_, i) => i !== index),
    }));
  };
  
  const inputClass = "block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary";
  const gameStatusOptions = ['Teras Kebangsaan', 'Teras Perak', 'Pilihan Tuan Rumah', 'Pilihan Kebangsaan', 'VIP'];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110] transition-opacity duration-300 ease-in-out"
      role="dialog" aria-modal="true" aria-labelledby="add-event-title" onClick={onClose}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-2xl m-4 transform transition-all overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h3 id="add-event-title" className="text-xl sm:text-2xl font-bold text-primary">Tambah Acara Baru</h3>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100" aria-label="Tutup">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Acara</label>
                <div className="mt-1 relative group">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg bg-gray-100 border" />
                    <div onClick={handleImageUploadClick} className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-lg cursor-pointer transition-all" role="button" aria-label="Muat naik gambar">
                        <div className="text-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="inline-block bg-black/40 p-3 rounded-full"><ImageIcon /></div>
                            <p className="mt-2 text-sm font-semibold">Tukar Gambar</p>
                        </div>
                    </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" aria-hidden="true" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                    <label htmlFor="title-new" className="block text-sm font-medium text-gray-700">Tajuk</label>
                    <input type="text" name="title" id="title-new" value={formData.title || ''} onChange={handleChange} className={`mt-1 ${inputClass}`} required />
                </div>
                <div>
                    <label htmlFor="category-new" className="block text-sm font-medium text-gray-700">Kategori</label>
                    <select name="category" id="category-new" value={formData.category} onChange={handleChange} className={`mt-1 ${inputClass}`}>
                        <option>Sukan</option>
                        <option>Kebudayaan</option>
                    </select>
                </div>
            </div>

            <IconSelector
                selectedIcon={formData.categoryIcon}
                onSelect={(icon) => setFormData(prev => ({...prev, categoryIcon: icon}))}
            />

             <div>
                <label htmlFor="gameStatus-new" className="block text-sm font-medium text-gray-700">Status Permainan</label>
                 <select name="gameStatus" id="gameStatus-new" value={formData.gameStatus} onChange={handleChange} className={`mt-1 ${inputClass}`}>
                    {gameStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>

            <div className="pt-2">
                <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                    <input
                        id="isFeatured-new"
                        name="isFeatured"
                        type="checkbox"
                        checked={formData.isFeatured || false}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    </div>
                    <div className="ml-3 text-sm">
                    <label htmlFor="isFeatured-new" className="font-medium text-gray-700">
                        Tandakan sebagai Pilihan
                    </label>
                    <p className="text-gray-500">Acara pilihan akan dipaparkan di bahagian atas senarai.</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="date-new" className="block text-sm font-medium text-gray-700">Tarikh Mula</label>
                    <div className="flex items-center gap-2 mt-1">
                        <input type="date" name="date" id="date-new" value={formData.date || ''} onChange={handleChange} className={inputClass} required />
                        <input type="time" name="startTime" id="startTime-new" value={formData.startTime || ''} onChange={handleChange} className={`${inputClass} w-auto`} />
                    </div>
                </div>
                 <div>
                    <label htmlFor="endDate-new" className="block text-sm font-medium text-gray-700">Tarikh Akhir (Pilihan)</label>
                    <div className="flex items-center gap-2 mt-1">
                        <input type="date" name="endDate" id="endDate-new" value={formData.endDate || ''} onChange={handleChange} min={formData.date} className={inputClass} />
                        <input type="time" name="endTime" id="endTime-new" value={formData.endTime || ''} onChange={handleChange} className={`${inputClass} w-auto`} disabled={!formData.endDate} />
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="location-new" className="block text-sm font-medium text-gray-700">Lokasi</label>
                <input type="text" name="location" id="location-new" value={formData.location || ''} onChange={handleChange} className={`mt-1 ${inputClass}`} required />
            </div>

            <div>
                <label htmlFor="description-new" className="block text-sm font-medium text-gray-700">Keterangan</label>
                <textarea name="description" id="description-new" rows={3} value={formData.description || ''} onChange={handleChange} className={`mt-1 ${inputClass}`} />
            </div>
            
            <hr className="my-6 border-t" />
            
            <div>
                <h4 className="text-lg font-bold text-primary mb-4">Jadual Acara (Pilihan)</h4>
                <div className="space-y-3">
                    {(formData.schedule || []).map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-light/80 rounded-lg border">
                            <input
                                type="time"
                                value={item.time}
                                onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                                className={`${inputClass} w-auto text-sm p-1.5`}
                            />
                            <input
                                type="text"
                                value={item.activity}
                                onChange={(e) => handleScheduleChange(index, 'activity', e.target.value)}
                                className={`${inputClass} w-full text-sm p-1.5`}
                                placeholder="Penerangan Aktiviti"
                            />
                            <button
                                type="button"
                                onClick={() => removeScheduleItem(index)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
                                aria-label="Padam Item Jadual"
                                title="Padam Item Jadual"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addScheduleItem}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-lg transition-colors text-sm"
                >
                    <PlusIcon />
                    Tambah Item Jadual
                </button>
            </div>


            <hr className="my-6 border-t" />

            <div>
                <h4 className="text-lg font-bold text-primary mb-4">Carta Pertandingan (Pilihan)</h4>
                <div className="space-y-4">
                    {(formData.bracketData || []).map((round, roundIndex) => (
                        <div key={roundIndex} className="p-4 border border-gray-200 rounded-lg bg-light/80">
                            <div className="flex justify-between items-center mb-3">
                                <input type="text" value={round.title} onChange={(e) => handleRoundTitleChange(roundIndex, e.target.value)} className="font-semibold text-primary bg-transparent border-b border-gray-300 focus:outline-none focus:border-primary w-full" placeholder="Nama Pusingan" />
                                <button type="button" onClick={() => removeRound(roundIndex)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-full ml-2" aria-label="Padam Pusingan" title="Padam Pusingan"><TrashIcon /></button>
                            </div>
                            <div className="space-y-3">
                                {round.matches.map((match, matchIndex) => (
                                    <div key={matchIndex} className="p-3 bg-white rounded-md border flex items-center gap-2">
                                        <div className="flex-grow space-y-2">
                                            {match.participants.map((p, pIndex) => (
                                                <div key={pIndex} className="flex flex-col sm:flex-row gap-2 items-center">
                                                    <input type="text" value={p.name} onChange={(e) => handleBracketChange(roundIndex, matchIndex, pIndex, 'name', e.target.value)} className={`${inputClass} text-sm p-1.5`} placeholder={`Peserta ${pIndex + 1}`} />
                                                    <input type="number" value={p.score ?? ''} onChange={(e) => handleBracketChange(roundIndex, matchIndex, pIndex, 'score', e.target.value)} className={`${inputClass} w-full sm:w-20 text-sm p-1.5 text-center`} placeholder="Skor" />
                                                </div>
                                            ))}
                                        </div>
                                         <button type="button" onClick={() => removeMatch(roundIndex, matchIndex)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Padam Perlawanan" title="Padam Perlawanan"><TrashIcon /></button>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => addMatch(roundIndex)} className="mt-4 text-sm flex items-center gap-2 text-primary font-semibold hover:text-blue-700"><PlusIcon />Tambah Perlawanan</button>
                        </div>
                    ))}
                     <button type="button" onClick={addRound} className="w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-lg flex items-center justify-center gap-2"><PlusIcon />Tambah Pusingan</button>
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-6 py-2 bg-white text-gray-800 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">Batal</button>
                <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">Tambah Acara</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;