import React, { useState } from 'react';
import { events as initialEvents } from '../data/mockEvents';
import type { Event } from '../types';
import EventCard from './EventCard';
import EditEventModal from './EditEventModal';
import AddEventModal from './AddEventModal';
import NotFoundIcon from './icons/NotFoundIcon';
import CalendarView from './CalendarView';
import ScheduleView from './ScheduleView';
import CalendarIcon from './icons/CalendarIcon';
import ListIcon from './icons/ListIcon';
import ScheduleIcon from './icons/ScheduleIcon';
import { useToast } from '../contexts/ToastContext';
import PlusIcon from './icons/PlusIcon';
import ConfirmationModal from './ConfirmationModal';

const monthMap: { [key: string]: number } = {
  'Januari': 0, 'Februari': 1, 'Mac': 2, 'April': 3, 'Mei': 4, 'Jun': 5,
  'Julai': 6, 'Ogos': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Disember': 11
};

const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const parts = dateString.split(' ');
  if (parts.length < 3) return null;
  const day = parseInt(parts[0], 10);
  const month = monthMap[parts[1]];
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || month === undefined || isNaN(year)) return null;
  return new Date(Date.UTC(year, month, day));
};

interface EventsProps {
  searchQuery: string;
  isAdmin: boolean;
}

const Events: React.FC<EventsProps> = ({ searchQuery, isAdmin }) => {
  const [eventList, setEventList] = useState<Event[]>(initialEvents);
  const [expandedEventIds, setExpandedEventIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Semua']);
  const [selectedGameStatus, setSelectedGameStatus] = useState<string[]>(['Semua']);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<{ event: Event, originalIndex: number } | null>(null);
  const [eventToDelete, setEventToDelete] = useState<{ event: Event, originalIndex: number } | null>(null);
  const [view, setView] = useState<'card' | 'calendar' | 'schedule'>('schedule');
  const { addToast } = useToast();

  const categories = ['Semua', ...Array.from(new Set(eventList.map(event => event.category)))];
  const gameStatuses = ['Semua', ...Array.from(new Set(eventList.map(event => event.gameStatus).filter(Boolean))) as string[]];

  const handleToggleExpand = (eventId: string) => {
    setExpandedEventIds(prevIds => {
      if (prevIds.includes(eventId)) {
        return prevIds.filter(id => id !== eventId);
      } else {
        return [...prevIds, eventId];
      }
    });
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedCategories(['Semua']);
    setSelectedGameStatus(['Semua']);
  };

  const handleCategoryToggle = (category: string) => {
    if (category === 'Semua') {
      setSelectedCategories(['Semua']);
    } else {
      setSelectedCategories(prev => {
        const newCategories = new Set(prev.filter(c => c !== 'Semua'));
        if (newCategories.has(category)) {
          newCategories.delete(category);
        } else {
          newCategories.add(category);
        }

        if (newCategories.size === 0) {
          return ['Semua'];
        }
        return Array.from(newCategories);
      });
    }
  };

  const handleGameStatusToggle = (status: string) => {
    if (status === 'Semua') {
      setSelectedGameStatus(['Semua']);
    } else {
      setSelectedGameStatus(prev => {
        const newStatuses = new Set(prev.filter(s => s !== 'Semua'));
        if (newStatuses.has(status)) {
          newStatuses.delete(status);
        } else {
          newStatuses.add(status);
        }

        if (newStatuses.size === 0) {
          return ['Semua'];
        }
        return Array.from(newStatuses);
      });
    }
  };
  
  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleOpenEditModal = (event: Event, index: number) => {
    setEventToEdit({ event, originalIndex: index });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEventToEdit(null);
  };
  
  const handleSaveNewEvent = (newEventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      id: `${newEventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${Date.now()}`,
      ...newEventData,
      lastUpdated: new Date().toISOString(),
    };
    setEventList(prevEvents => [newEvent, ...prevEvents]);
    handleCloseAddModal();
    addToast('Acara baru berjaya ditambah.');
  };

  const handleSaveChanges = (updatedEvent: Event) => {
    if (eventToEdit) {
      const { originalIndex } = eventToEdit;
      const eventWithUpdateTimestamp: Event = {
        ...updatedEvent,
        lastUpdated: new Date().toISOString(),
      };
      setEventList(currentEvents =>
        currentEvents.map((event, index) =>
          index === originalIndex ? eventWithUpdateTimestamp : event
        )
      );
    }
    handleCloseEditModal();
    addToast('Acara berjaya dikemas kini.');
  };
  
  const handleRequestDelete = (event: Event, index: number) => {
    setEventToDelete({ event, originalIndex: index });
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      setEventList(currentEvents =>
        currentEvents.filter((_, index) => index !== eventToDelete.originalIndex)
      );
      setExpandedEventIds(prev => prev.filter(id => id !== eventToDelete.event.id));
      setEventToDelete(null);
      addToast('Acara berjaya dipadam.');
    }
  };

  const handleCancelDelete = () => {
    setEventToDelete(null);
  };

  const handleToggleFeatured = (eventId: string) => {
    setEventList(currentEvents => {
      return currentEvents.map(event => {
        if (event.id === eventId) {
          const updatedEvent = { ...event, isFeatured: !event.isFeatured };
          addToast(`"${updatedEvent.title}" ${updatedEvent.isFeatured ? 'ditandakan sebagai pilihan' : 'dibuang dari pilihan'}.`);
          return updatedEvent;
        }
        return event;
      });
    });
  };

  const filteredEvents = eventList
    .map((event, index) => ({ ...event, originalIndex: index }))
    .filter(event => {
      const searchMatch = event.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const categoryMatch = selectedCategories.includes('Semua') || selectedCategories.includes(event.category);
      const gameStatusMatch = selectedGameStatus.includes('Semua') || (event.gameStatus && selectedGameStatus.includes(event.gameStatus));

      if (!searchMatch || !categoryMatch || !gameStatusMatch) {
        return false;
      }

      if (!startDate && !endDate) {
        return true;
      }

      const eventStart = parseDate(event.date);
      const eventEnd = event.endDate ? parseDate(event.endDate) : eventStart;

      if (!eventStart || !eventEnd) {
        return true; 
      }

      const filterStart = startDate ? new Date(startDate + 'T00:00:00.000Z') : null;
      const filterEnd = endDate ? new Date(endDate + 'T23:59:59.999Z') : null;

      if (filterStart && eventEnd < filterStart) {
        return false;
      }
      
      if (filterEnd && eventStart > filterEnd) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
        // Sort featured events to the top
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        // Otherwise, maintain original order
        return a.originalIndex - b.originalIndex;
    });

  return (
    <section id="events" className="py-20 bg-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary font-heading uppercase tracking-wider">Acara Pilihan</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Sertai pelbagai acara sukan dan kebudayaan yang menarik.
          </p>
        </div>
        
        <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {isAdmin && (
                <button
                    onClick={handleOpenAddModal}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-800 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-300"
                >
                    <PlusIcon />
                    Tambah Acara
                </button>
            )}
            <div className={`inline-flex rounded-lg shadow-sm ${isAdmin ? '' : 'ml-auto'}`} role="group">
                <button
                    onClick={() => setView('card')}
                    className={`relative inline-flex items-center rounded-l-lg px-4 py-2 text-sm font-medium transition-colors focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${
                        view === 'card' ? 'bg-primary text-white border border-primary' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-pressed={view === 'card'}
                >
                   <ListIcon />
                   <span className="hidden sm:inline ml-2">Kad</span>
                </button>
                <button
                    onClick={() => setView('calendar')}
                    className={`relative -ml-px inline-flex items-center px-4 py-2 text-sm font-medium transition-colors focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${
                        view === 'calendar' ? 'bg-primary text-white border border-primary' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-pressed={view === 'calendar'}
                >
                   <CalendarIcon />
                   <span className="hidden sm:inline ml-2">Kalendar</span>
                </button>
                 <button
                    onClick={() => setView('schedule')}
                    className={`relative -ml-px inline-flex items-center rounded-r-lg px-4 py-2 text-sm font-medium transition-colors focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${
                        view === 'schedule' ? 'bg-primary text-white border border-primary' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                    aria-pressed={view === 'schedule'}
                >
                   <ScheduleIcon />
                   <span className="hidden sm:inline ml-2">Jadual</span>
                </button>
            </div>
        </div>

        <div className="mb-12 p-4 sm:p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                        <button 
                            key={category} 
                            onClick={() => handleCategoryToggle(category)} 
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 ${selectedCategories.includes(category) ? 'bg-primary text-white shadow' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                            aria-pressed={selectedCategories.includes(category)}
                        >
                            {category}
                        </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status Permainan</label>
                    <div className="flex flex-wrap gap-2">
                        {gameStatuses.map(status => (
                        <button 
                            key={status} 
                            onClick={() => handleGameStatusToggle(status)} 
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-200 ${selectedGameStatus.includes(status) ? 'bg-primary text-white shadow' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                            aria-pressed={selectedGameStatus.includes(status)}
                        >
                            {status}
                        </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mt-6 pt-4 border-t border-gray-200">
                <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">Tarikh Mula</label>
                    <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                </div>
                <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">Tarikh Akhir</label>
                    <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm" />
                </div>
                <div className="w-full">
                    <button onClick={handleResetFilters} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors duration-200">
                        Set Semula
                    </button>
                </div>
            </div>
        </div>
        
        {filteredEvents.length > 0 ? (
          view === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  {...event}
                  isAdmin={isAdmin}
                  isExpanded={expandedEventIds.includes(event.id)}
                  onToggleExpand={() => handleToggleExpand(event.id)}
                  onEdit={() => handleOpenEditModal(event, event.originalIndex)}
                  onDelete={() => handleRequestDelete(event, event.originalIndex)}
                  onToggleFeatured={() => handleToggleFeatured(event.id)}
                />
              ))}
            </div>
          ) : view === 'calendar' ? (
            <CalendarView events={filteredEvents} isAdmin={isAdmin} />
          ) : (
            <ScheduleView events={filteredEvents} />
          )
        ) : (
            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm mt-8">
              <NotFoundIcon />
              <p className="mt-4 text-xl font-semibold text-gray-600">
                Tiada acara ditemui
              </p>
              <p className="mt-2 text-gray-500">
                Cuba laraskan carian atau penapis anda untuk hasil yang lebih baik.
              </p>
            </div>
        )}
      </div>
      {isAdmin && (
        <>
            <AddEventModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onSave={handleSaveNewEvent}
            />
            <EditEventModal
              isOpen={isEditModalOpen}
              event={eventToEdit?.event ?? null}
              onClose={handleCloseEditModal}
              onSave={handleSaveChanges}
            />
            <ConfirmationModal
                isOpen={!!eventToDelete}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Padam Acara?"
                message={
                    <>
                        Adakah anda pasti ingin memadam acara "<strong>{eventToDelete?.event.title}</strong>"? 
                        Tindakan ini tidak boleh diubah lagi.
                    </>
                }
            />
        </>
      )}
    </section>
  );
};

export default Events;