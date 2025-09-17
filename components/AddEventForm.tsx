import React, { useState } from 'react';
import type { Event, EventCategoryIcon } from '../types';
import IconSelector from './IconSelector';

interface AddEventFormProps {
  onAddEvent: (event: Omit<Event, 'id'>) => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ onAddEvent }) => {
  const initialState = {
    title: '',
    category: 'Sukan',
    // FIX: Changed type from 'default' as const to EventCategoryIcon to match the type from IconSelector's onSelect.
    categoryIcon: 'default' as EventCategoryIcon,
    date: '',
    endDate: '',
    location: '',
    description: '',
  };
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) {
      alert('Sila isi semua medan yang diperlukan.');
      return;
    }
    setIsSubmitting(true);

    const formatDateToString = (dateString: string): string => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    };

    const newEventData: Omit<Event, 'id'> = {
      ...formData,
      imageUrl: `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
      date: formatDateToString(formData.date),
      endDate: formData.endDate ? formatDateToString(formData.endDate) : undefined,
      description: formData.description,
    };
    
    // Simulate API call
    setTimeout(() => {
        onAddEvent(newEventData);
        setFormData(initialState);
        setIsSubmitting(false);
    }, 500);
  };

  const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary";

  return (
    <div className="mb-12 p-6 bg-white rounded-lg shadow-md border border-gray-200 relative">
        <h3 className="text-xl font-bold text-primary mb-4">Tambah Acara Komuniti Baru</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="title-comm" className="block text-sm font-medium text-gray-700">Tajuk Acara</label>
                    <input type="text" name="title" id="title-comm" value={formData.title} onChange={handleChange} className={inputClasses} required />
                </div>
                <div>
                    <label htmlFor="category-comm" className="block text-sm font-medium text-gray-700">Kategori</label>
                    <select name="category" id="category-comm" value={formData.category} onChange={handleChange} className={inputClasses} required>
                        <option>Sukan</option>
                        <option>Kebudayaan</option>
                        <option>Lain-lain</option>
                    </select>
                </div>
            </div>
            <IconSelector
                selectedIcon={formData.categoryIcon}
                onSelect={(icon) => setFormData(prev => ({...prev, categoryIcon: icon}))}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date-comm" className="block text-sm font-medium text-gray-700">Tarikh Mula</label>
                    <input type="date" name="date" id="date-comm" value={formData.date} onChange={handleChange} className={inputClasses} required />
                </div>
                <div>
                    <label htmlFor="endDate-comm" className="block text-sm font-medium text-gray-700">Tarikh Akhir (Pilihan)</label>
                    <input type="date" name="endDate" id="endDate-comm" value={formData.endDate} min={formData.date} onChange={handleChange} className={inputClasses} />
                </div>
            </div>
            <div>
                <label htmlFor="location-comm" className="block text-sm font-medium text-gray-700">Lokasi</label>
                <input type="text" name="location" id="location-comm" value={formData.location} onChange={handleChange} className={inputClasses} required />
            </div>
            <div>
                <label htmlFor="description-comm" className="block text-sm font-medium text-gray-700">Keterangan Ringkas</label>
                <textarea name="description" id="description-comm" rows={3} value={formData.description} onChange={handleChange} className={inputClasses}></textarea>
            </div>
            <div className="text-right">
                <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Menambah...' : 'Tambah Acara'}
                </button>
            </div>
        </form>
    </div>
  );
};

export default AddEventForm;
