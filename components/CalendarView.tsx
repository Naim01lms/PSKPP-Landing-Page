import React, { useState, useMemo } from 'react';
import type { Event } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import LocationIcon from './icons/LocationIcon';
import ClockIcon from './icons/ClockIcon';
import EventDetailModal from './EventDetailModal';
import CategoryIcon from './CategoryIcon';
import StarIcon from './icons/StarIcon';

interface CalendarViewProps {
  events: Event[];
  isAdmin: boolean;
}

// Helper to parse 'DD Month YYYY' string to a Date object at UTC midnight
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

const CalendarView: React.FC<CalendarViewProps> = ({ events, isAdmin }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const firstDayOfMonth = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1));
  const daysInMonth = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)).getUTCDate();
  
  // getDay() is locale-dependent, getUTCDay() is not.
  const startingDayOfWeek = firstDayOfMonth.getUTCDay(); // 0 for Sunday, 1 for Monday, etc.

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach(event => {
      const start = parseDate(event.date);
      if (!start) return;
      
      const end = event.endDate ? parseDate(event.endDate) : start;
      if(!end) return;

      // Iterate from start to end date
      let current = new Date(start);
      while (current <= end) {
        const dateKey = current.toISOString().split('T')[0];
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }
        map.get(dateKey)!.push(event);
        current.setUTCDate(current.getUTCDate() + 1);
      }
    });
    return map;
  }, [events]);

  const featuredEventsByDate = useMemo(() => {
    const map = new Map<string, boolean>();
    events.forEach(event => {
        if (!event.isFeatured) return;
        const start = parseDate(event.date);
        if (!start) return;
        const end = event.endDate ? parseDate(event.endDate) : start;
        if(!end) return;
        let current = new Date(start);
        while (current <= end) {
            const dateKey = current.toISOString().split('T')[0];
            map.set(dateKey, true);
            current.setUTCDate(current.getUTCDate() + 1);
        }
    });
    return map;
  }, [events]);
  
  const calendarGrid: (Date | null)[] = [];
  // Add blank days for the start of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarGrid.push(null);
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarGrid.push(new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), i)));
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)));
  };
  
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEventModalOpen(false);
    // Add a delay to allow for closing animation before clearing data
    setTimeout(() => {
      setSelectedEvent(null);
    }, 300);
  };
  
  const selectedDateKey = selectedDate.toISOString().split('T')[0];
  const eventsForSelectedDay = eventsByDate.get(selectedDateKey) || [];

  const today = new Date();
  today.setUTCHours(0,0,0,0);

  const formatTime = (timeString?: string): string => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    if (isNaN(parseInt(hours)) || isNaN(parseInt(minutes))) return '';
    
    const date = new Date();
    date.setUTCHours(parseInt(hours, 10));
    date.setUTCMinutes(parseInt(minutes, 10));

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Bulan sebelumnya">
            <ChevronLeftIcon />
          </button>
          <h3 className="text-lg sm:text-xl font-bold text-primary font-heading tracking-wider uppercase">
            {currentDate.toLocaleString('ms-MY', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
          </h3>
          <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Bulan berikutnya">
            <ChevronRightIcon />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm font-semibold text-gray-500 mb-2">
          {['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'].map(day => (
            <div key={day} className="py-2 hidden sm:block">{day}</div>
          ))}
           {['A', 'I', 'S', 'R', 'K', 'J', 'S'].map((index) => (
            <div key={index} className="py-2 sm:hidden">{index}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarGrid.map((day, index) => {
            if (!day) return <div key={`empty-${index}`}></div>;
            
            const dateKey = day.toISOString().split('T')[0];
            const eventCount = eventsByDate.get(dateKey)?.length ?? 0;
            const hasEvents = eventCount > 0;
            const isToday = day.getTime() === today.getTime();
            const isSelected = day.getTime() === selectedDate.getTime();
            const hasFeaturedEvent = featuredEventsByDate.has(dateKey);

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={`relative h-14 w-full text-center text-sm rounded-lg transition-colors duration-200
                  ${isSelected ? 'bg-primary text-white font-bold' : 'hover:bg-light'}
                  ${isToday && !isSelected ? 'bg-secondary/20' : ''}
                `}
              >
                <span className={`
                  flex items-center justify-center h-6 w-6 rounded-full mx-auto 
                  ${isToday ? 'bg-secondary text-primary' : ''}
                  ${isSelected ? 'bg-white text-primary' : ''}
                `}>
                  {day.getUTCDate()}
                </span>
                {hasEvents && (
                  <div className={`
                    absolute bottom-1 left-1/2 -translate-x-1/2
                    flex items-center justify-center
                    min-w-[1rem] h-4 px-1 rounded-full text-[10px] font-bold leading-none
                    ${isSelected ? 'bg-secondary text-primary' : 'bg-primary text-white'}
                  `}>
                    {eventCount}
                  </div>
                )}
                {hasFeaturedEvent && (
                    <div className={`absolute top-1 right-1 text-amber-500 ${isSelected ? 'text-white' : 'text-amber-500'}`}>
                        <StarIcon filled={true} className="h-3 w-3" />
                    </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t">
          <h4 className="font-bold text-gray-800 mb-3">
            Acara pada {selectedDate.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}
          </h4>
          {eventsForSelectedDay.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {eventsForSelectedDay.map(event => {
                  const formattedStartTime = formatTime(event.startTime);
                  const formattedEndTime = formatTime(event.endTime);
                  let timeInfo = null;
                  if (formattedStartTime && formattedEndTime) {
                      timeInfo = `${formattedStartTime} - ${formattedEndTime}`;
                  } else if (formattedStartTime) {
                      timeInfo = `Bermula ${formattedStartTime}`;
                  }

                  return (
                      <button 
                        key={event.id} 
                        onClick={() => handleEventClick(event)}
                        className="w-full text-left p-3 bg-light rounded-lg hover:bg-primary/10 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                          <div className="flex justify-between items-start gap-2">
                            <p className="font-semibold text-primary flex items-center gap-1.5">
                                {event.isFeatured && <StarIcon filled className="text-amber-500 h-4 w-4" />}
                                {event.title}
                            </p>
                            <span className="flex-shrink-0 text-gray-500">
                                <CategoryIcon icon={event.categoryIcon} size="md" />
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1.5 flex-wrap">
                              {timeInfo && (
                                  <div className="flex items-center mr-3">
                                      <ClockIcon /> <span className="ml-1">{timeInfo}</span>
                                  </div>
                              )}
                              <div className="flex items-center min-w-0">
                                  <LocationIcon /> <span className="ml-1 truncate">{event.location}</span>
                              </div>
                          </div>
                      </button>
                  );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Tiada acara dijadualkan pada hari ini.</p>
          )}
        </div>
      </div>
      <EventDetailModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default CalendarView;