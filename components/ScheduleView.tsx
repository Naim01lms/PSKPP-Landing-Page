import React, { useMemo } from 'react';
import type { Event } from '../types';
import CategoryIcon from './CategoryIcon';
import LocationIcon from './icons/LocationIcon';
import StarIcon from './icons/StarIcon';

interface ScheduleViewProps {
  events: Event[];
}

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

// Styles for status badges
const gameStatusStyles: { [key: string]: string } = {
  'Teras Kebangsaan': 'bg-yellow-500 text-white',
  'Teras Perak': 'bg-blue-500 text-white',
  'Pilihan Tuan Rumah': 'bg-purple-600 text-white',
  'Pilihan Kebangsaan': 'bg-green-600 text-white',
  'VIP': 'bg-gray-800 text-white',
};

const ScheduleView: React.FC<ScheduleViewProps> = ({ events }) => {
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);

      if (!dateA || !dateB) return 0;

      const dateComparison = dateA.getTime() - dateB.getTime();
      if (dateComparison !== 0) {
        return dateComparison;
      }

      // If dates are the same, sort by start time, putting events without a time last
      return (a.startTime || '23:59').localeCompare(b.startTime || '23:59');
    });
  }, [events]);

  const eventsGroupedByDate = useMemo(() => {
    const grouped = new Map<string, Event[]>();
    sortedEvents.forEach(event => {
        const date = parseDate(event.date);
        if (!date) return;
        const dateKey = date.toISOString().split('T')[0];
        if (!grouped.has(dateKey)) {
            grouped.set(dateKey, []);
        }
        grouped.get(dateKey)!.push(event);
    });
    return Array.from(grouped.entries());
  }, [sortedEvents]);


  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('ms-MY', {
        weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto relative max-h-[800px]">
            <div className="align-middle inline-block min-w-full">
                <table className="min-w-full border-separate border-spacing-0">
                    <thead className="bg-light sticky top-0 z-10">
                        {/* Desktop Header */}
                        <tr className="hidden md:table-row">
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-2/5">Acara</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Masa</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Lokasi</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Kategori</th>
                            <th scope="col" className="py-3.5 pl-3 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6">Status</th>
                        </tr>
                        {/* Mobile Header */}
                        <tr className="md:hidden">
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Acara</th>
                            <th scope="col" className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-6">Masa</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {eventsGroupedByDate.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-500">
                                    Tiada acara untuk dipaparkan.
                                </td>
                            </tr>
                        )}
                        {eventsGroupedByDate.map(([dateKey, eventsOnDay]) => (
                            <React.Fragment key={dateKey}>
                                {/* Mobile date header */}
                                <tr className="md:hidden">
                                    <th colSpan={2} className="bg-primary/10 backdrop-blur-sm text-left px-4 sm:px-6 py-2.5 text-sm font-bold text-primary sticky top-[53px] z-[9]">
                                        { formatDate(new Date(dateKey + 'T00:00:00Z')) }
                                    </th>
                                </tr>
                                {/* Desktop date header */}
                                <tr className="hidden md:table-row">
                                    <th colSpan={5} className="bg-primary/10 backdrop-blur-sm text-left px-4 sm:px-6 py-2.5 text-sm font-bold text-primary sticky top-[53px] z-[9]">
                                        { formatDate(new Date(dateKey + 'T00:00:00Z')) }
                                    </th>
                                </tr>
                                {eventsOnDay.map((event, eventIndex) => {
                                    const formattedStartTime = formatTime(event.startTime);
                                    const formattedEndTime = formatTime(event.endTime);
                                    let timeInfo = 'Sepanjang hari';
                                    if (formattedStartTime && formattedEndTime) {
                                        timeInfo = `${formattedStartTime} - ${formattedEndTime}`;
                                    } else if (formattedStartTime) {
                                        timeInfo = formattedStartTime;
                                    }
                                    const statusStyle = event.gameStatus ? gameStatusStyles[event.gameStatus] || 'bg-gray-400 text-white' : '';

                                    return(
                                        <React.Fragment key={event.id}>
                                            {/* Desktop Row */}
                                            <tr className={`hidden md:table-row ${event.isFeatured ? 'bg-amber-50' : (eventIndex % 2 === 0 ? 'bg-white' : 'bg-light/50')}`}>
                                                <td className="w-full max-w-xs py-4 pl-4 pr-3 text-sm font-semibold text-primary sm:pl-6">
                                                    <div className="flex items-center gap-2">
                                                        {event.isFeatured && <StarIcon filled className="h-4 w-4 text-amber-500" />}
                                                        <span>{event.title}</span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{timeInfo}</td>
                                                <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">{event.location}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-white ${event.category === 'Sukan' ? 'bg-accent' : 'bg-purple-600'}`}>
                                                        <CategoryIcon icon={event.categoryIcon} size="xs" />
                                                        {event.category}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-sm text-gray-500 sm:pr-6">
                                                    {event.gameStatus ? (
                                                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle}`}>
                                                          {event.gameStatus}
                                                      </span>
                                                    ) : '-'}
                                                </td>
                                            </tr>
                                            {/* Mobile Row */}
                                            <tr className={`md:hidden ${event.isFeatured ? 'bg-amber-50' : (eventIndex % 2 === 0 ? 'bg-white' : 'bg-light/50')}`}>
                                                <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                    <div className="font-semibold text-primary flex items-center gap-2">
                                                        {event.isFeatured && <StarIcon filled className="h-4 w-4 text-amber-500" />}
                                                        <span>{event.title}</span>
                                                    </div>
                                                    <div className="mt-1 flex flex-col items-start gap-1 text-xs text-gray-500">
                                                        <div className="flex items-center gap-1.5">
                                                            <LocationIcon />
                                                            <span>{event.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <CategoryIcon icon={event.categoryIcon} size="xs" />
                                                            <span>{event.category}</span>
                                                        </div>
                                                        {event.gameStatus && (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className={`h-2 w-2 rounded-full ${statusStyle.replace(' text-white', '')}`}></span>
                                                                <span>{event.gameStatus}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right align-top text-sm text-gray-600 sm:pr-6">
                                                    {timeInfo}
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    )
                                })}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default ScheduleView;