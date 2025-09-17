import React, { useState } from 'react';
import type { Event } from '../types';
import EventCard from './EventCard';
import EditEventModal from './EditEventModal';
import AddEventForm from './AddEventForm';
import NotFoundIcon from './icons/NotFoundIcon';
import { useToast } from '../contexts/ToastContext';
import ConfirmationModal from './ConfirmationModal';

// Let's start with one example event
const initialCommunityEvents: Event[] = [
    {
        id: 'pertandingan-catur-komuniti',
        title: 'Pertandingan Catur Komuniti',
        category: 'Sukan',
        categoryIcon: 'default',
        date: '25 September 2025',
        endDate: '28 September 2025',
        startTime: '08:00',
        endTime: '19:00',
        location: 'Dewan Orang Ramai, Taman Jaya',
        description: 'Sertai pertandingan catur terbuka untuk semua peringkat umur. Yuran pendaftaran percuma.',
        imageUrl: 'https://picsum.photos/400/300?random=101',
        schedule: [
            { time: '09:00', activity: 'Pusingan 1' },
            { time: '11:00', activity: 'Pusingan 2' },
            { time: '14:00', activity: 'Pusingan Suku Akhir' },
            { time: '16:00', activity: 'Pusingan Separuh Akhir & Akhir' },
        ],
        bracketData: [
            {
                title: 'Separuh Akhir',
                matches: [
                    { participants: [{ name: 'Pemain A' }, { name: 'Pemain B' }] },
                    { participants: [{ name: 'Pemain C' }, { name: 'Pemain D' }] },
                ],
            },
            {
                title: 'Akhir',
                matches: [
                    { participants: [{ name: 'TBD' }, { name: 'TBD' }] },
                ],
            },
        ],
    }
];

interface CommunityEventsProps {
  isAdmin: boolean;
}

const CommunityEvents: React.FC<CommunityEventsProps> = ({ isAdmin }) => {
  const [events, setEvents] = useState<Event[]>(initialCommunityEvents);
  const [expandedEventIds, setExpandedEventIds] = useState<string[]>([]);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<{ event: Event, originalIndex: number } | null>(null);
  const [eventToDelete, setEventToDelete] = useState<{ event: Event, originalIndex: number } | null>(null);
  const { addToast } = useToast();
  
  const handleAddEvent = (eventData: Omit<Event, 'id'>) => {
      const newEvent: Event = {
          id: `${eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${Date.now()}`,
          ...eventData
      };
      setEvents(prevEvents => [newEvent, ...prevEvents]);
      addToast('Acara komuniti berjaya ditambah.');
  };

  const handleToggleExpand = (eventId: string) => {
    setExpandedEventIds(prev => prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]);
  };

  const handleOpenEditModal = (event: Event, index: number) => {
    setEventToEdit({ event, originalIndex: index });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEventToEdit(null);
  };
  
  const handleSaveChanges = (updatedEvent: Event) => {
    if (eventToEdit) {
      const eventWithUpdateDate: Event = { ...updatedEvent, lastUpdated: new Date().toISOString() };
      setEvents(current => current.map((event, index) => index === eventToEdit.originalIndex ? eventWithUpdateDate : event));
    }
    handleCloseEditModal();
    addToast('Acara komuniti berjaya dikemas kini.');
  };
  
  const handleRequestDelete = (event: Event, index: number) => {
    setEventToDelete({ event, originalIndex: index });
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      setEvents(current => current.filter((_, index) => index !== eventToDelete.originalIndex));
      setExpandedEventIds(prev => prev.filter(id => id !== eventToDelete.event.id));
      setEventToDelete(null);
      addToast('Acara komuniti berjaya dipadam.');
    }
  };

  const handleCancelDelete = () => {
    setEventToDelete(null);
  };

  // FIX: Add handler for toggling the featured status of an event.
  const handleToggleFeatured = (eventId: string) => {
    setEvents(currentEvents => {
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

  return (
    <section id="community-events" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary font-heading uppercase tracking-wider">Acara Komuniti</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Terokai acara-acara yang dianjurkan oleh dan untuk komuniti kita.
          </p>
        </div>

        {isAdmin && <AddEventForm onAddEvent={handleAddEvent} />}
        
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <EventCard 
                key={event.id}
                {...event}
                isAdmin={isAdmin}
                isExpanded={expandedEventIds.includes(event.id)}
                onToggleExpand={() => handleToggleExpand(event.id)}
                onEdit={() => handleOpenEditModal(event, index)}
                onDelete={() => handleRequestDelete(event, index)}
                onToggleFeatured={() => handleToggleFeatured(event.id)}
              />
            ))}
          </div>
        ) : (
            <div className="text-center py-16 px-6 bg-light rounded-lg shadow-sm mt-8">
              <NotFoundIcon />
              <p className="mt-4 text-xl font-semibold text-gray-600">
                Tiada Acara Komuniti Ditemui
              </p>
              <p className="mt-2 text-gray-500">
                {isAdmin ? 'Gunakan borang di atas untuk menambah acara baru.' : 'Sila semak kembali nanti untuk acara-acara baru.'}
              </p>
            </div>
        )}
      </div>

      {isAdmin && (
        <>
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
                title="Padam Acara Komuniti?"
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

export default CommunityEvents;