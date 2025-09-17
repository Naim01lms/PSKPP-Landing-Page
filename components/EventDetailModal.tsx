
import React from 'react';
import type { Event } from '../types';
import EventDetails from './EventDetails';
import LocationIcon from './icons/LocationIcon';
import ClockIcon from './icons/ClockIcon';
import XIcon from './icons/XIcon';
import CalendarIcon from './icons/CalendarIcon';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      // Delay visibility to allow for CSS transition
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) {
    return null;
  }

  if (!event) return null;


  const formatDateDisplay = () => {
    if (!event.endDate || event.date === event.endDate) {
      return event.date;
    }
    const startDateParts = event.date.split(' ');
    const endDateParts = event.endDate.split(' ');
    if (startDateParts.length < 3 || endDateParts.length < 3) return `${event.date} - ${event.endDate}`;
    const [startDay, startMonth, startYear] = startDateParts;
    const [endDay, endMonth, endYear] = endDateParts;
    if (startYear !== endYear) return `${event.date} - ${event.endDate}`;
    if (startMonth !== endMonth) return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
    return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
  };

  const formatTime = (timeString?: string): string => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    if (isNaN(parseInt(hours)) || isNaN(parseInt(minutes))) return '';
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const displayTime = () => {
    const formattedStartTime = formatTime(event.startTime);
    const formattedEndTime = formatTime(event.endTime);
    if (formattedStartTime && formattedEndTime) return `${formattedStartTime} - ${formattedEndTime}`;
    if (formattedStartTime) return `Bermula ${formattedStartTime}`;
    return null;
  };

  const displayDate = formatDateDisplay();
  const timeInfo = displayTime();

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[120] p-4 transition-opacity duration-300 ease-in-out ${isVisible && isOpen ? 'bg-black/70 opacity-100' : 'bg-transparent opacity-0'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${event.id}`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out ${isVisible && isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <img src={event.imageUrl} alt={event.title} className="w-full h-48 md:h-56 object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Tutup"
          >
            <XIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
                <span className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full ${event.category === 'Sukan' ? 'bg-accent' : event.category === 'Kebudayaan' ? 'bg-purple-600' : 'bg-secondary'}`}>
                {event.category}
                </span>
                {event.gameStatus && (
                    <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                        {event.gameStatus}
                    </span>
                )}
            </div>

            <h2 id={`modal-title-${event.id}`} className="text-2xl font-bold text-primary mb-4">{event.title}</h2>
            
            <div className="space-y-3 text-gray-600 mb-6">
              <div className="flex items-start">
                <CalendarIcon />
                <span className="ml-3">{displayDate}</span>
              </div>
               {timeInfo && (
                <div className="flex items-start">
                  <ClockIcon />
                  <span className="ml-3">{timeInfo}</span>
                </div>
              )}
              <div className="flex items-start">
                <LocationIcon />
                <span className="ml-3">{event.location}</span>
              </div>
            </div>
            
            <EventDetails 
              description={event.description} 
              bracketData={event.bracketData}
              schedule={event.schedule}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;