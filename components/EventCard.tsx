

import React, { useState } from 'react';
import type { Event } from '../types';
import LocationIcon from './icons/LocationIcon';
import EventDetails from './EventDetails';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import ShareIcon from './icons/ShareIcon';
import CheckIcon from './icons/CheckIcon';
import ClockIcon from './icons/ClockIcon';
import CategoryIcon from './CategoryIcon';
import StarIcon from './icons/StarIcon';

interface EventCardProps extends Event {
  isAdmin: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ id, imageUrl, title, category, categoryIcon, gameStatus, date, endDate, location, isExpanded, onToggleExpand, isAdmin, onEdit, onDelete, bracketData, description, schedule, lastUpdated, startTime, endTime, isFeatured, onToggleFeatured }) => {
  const [copied, setCopied] = useState(false);
  const hasBracket = bracketData && bracketData.length > 0;
  const hasDescription = description && description.trim() !== '';
  const hasSchedule = schedule && schedule.length > 0;
  const isExpandable = hasBracket || hasDescription || hasSchedule;

  const gameStatusStyles: { [key: string]: string } = {
    'Teras Kebangsaan': 'bg-yellow-500 text-white',
    'Teras Perak': 'bg-blue-500 text-white',
    'Pilihan Tuan Rumah': 'bg-purple-600 text-white',
    'Pilihan Kebangsaan': 'bg-green-600 text-white',
    'VIP': 'bg-gray-800 text-white',
  };

  const statusStyle = gameStatus ? gameStatusStyles[gameStatus] || 'bg-gray-400 text-white' : '';

  const formatDateDisplay = () => {
    // If no end date, or if end date is the same as the start date, show single date.
    if (!endDate || date === endDate) {
      return date;
    }

    const startDateParts = date.split(' ');
    const endDateParts = endDate.split(' ');

    // Fallback for unexpected date formats
    if (startDateParts.length < 3 || endDateParts.length < 3) {
      return `${date} - ${endDate}`;
    }

    const startDay = startDateParts[0];
    const startMonth = startDateParts[1];
    const startYear = startDateParts[2];
    
    const endDay = endDateParts[0];
    const endMonth = endDateParts[1];
    const endYear = endDateParts[2];

    // Different years
    if (startYear !== endYear) {
      return `${date} - ${endDate}`;
    }
    
    // Different months, same year
    if (startMonth !== endMonth) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
    }
    
    // Same month and year
    return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
  };

  const formatLastUpdated = (isoString: string): string => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ms-MY', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Asia/Kuala_Lumpur'
    }).format(date);
  };

  const displayDate = formatDateDisplay();

  const formatTime = (timeString?: string): string => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    if (isNaN(parseInt(hours)) || isNaN(parseInt(minutes))) return '';
    
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const displayTime = () => {
      const formattedStartTime = formatTime(startTime);
      const formattedEndTime = formatTime(endTime);
      if (formattedStartTime && formattedEndTime) {
          return `${formattedStartTime} - ${formattedEndTime}`;
      }
      if (formattedStartTime) {
          return `Bermula ${formattedStartTime}`;
      }
      return null;
  };

  const timeInfo = displayTime();

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#event-${id}`;
    const shareData = {
      title: `Acara PSKPP: ${title}`,
      text: description || `Sertai acara menarik ini: ${title} pada ${displayDate} di ${location}.`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Gagal menyalin pautan. Sila salin secara manual.');
      }
    }
  };


  return (
    <div id={`event-${id}`} className="bg-white rounded-lg shadow-lg overflow-hidden group transition-shadow duration-300 hover:shadow-xl flex flex-col relative">
      {isFeatured && (
        <div className="absolute top-3 left-3 bg-secondary text-primary font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 z-10">
          <StarIcon filled />
          PILIHAN
        </div>
      )}
      <div className="relative overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute top-0 right-0 mt-3 mr-3 flex flex-col items-end gap-2">
          <div className={`flex items-center gap-2 px-3 py-1 text-xs font-semibold text-white rounded-full ${category === 'Sukan' ? 'bg-accent' : category === 'Kebudayaan' ? 'bg-purple-600' : 'bg-secondary'}`}>
            <CategoryIcon icon={categoryIcon} size="sm" />
            <span>{category}</span>
          </div>
          {gameStatus && (
            <div className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle}`}>
              {gameStatus}
            </div>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-500 mb-1">{displayDate}</p>
            {lastUpdated && (
                <div className="group relative">
                    <p className="text-xs text-amber-600 mb-1 italic cursor-help">
                        Dikemas kini
                    </p>
                    <div 
                      className="absolute bottom-full right-0 mb-2 w-max max-w-xs bg-dark text-white text-xs rounded-md py-1.5 px-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      role="tooltip"
                    >
                      {formatLastUpdated(lastUpdated)}
                      <div className="absolute top-full right-3 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-dark"></div>
                    </div>
                </div>
            )}
          </div>

          {timeInfo && (
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <ClockIcon />
              <span className="ml-1.5">{timeInfo}</span>
            </div>
          )}

          <div className="relative flex items-center text-sm text-gray-500 mb-2 group">
            <LocationIcon />
            <span className="ml-1.5 truncate">{location}</span>
            <div 
              className="absolute bottom-full left-0 mb-2 w-max max-w-xs bg-dark text-white text-xs rounded-md py-1.5 px-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              role="tooltip"
            >
              {location}
              <div className="absolute top-full left-3 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-dark"></div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            {isFeatured && (
// FIX: The StarIcon component has been updated to accept a 'title' prop.
              <StarIcon filled className="h-5 w-5 text-amber-500 flex-shrink-0" title="Acara Pilihan" />
            )}
            <span>{title}</span>
          </h3>
        </div>
        
        <div className="mt-auto flex items-center gap-2">
            {isExpandable ? (
                <button 
                onClick={onToggleExpand} 
                className="flex-grow bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-2 px-4 rounded-md flex items-center justify-center text-sm transition-colors duration-200" 
                aria-expanded={isExpanded}
                >
                <span>{isExpanded ? 'Tutup' : 'Lihat Lanjut'}</span>
                <svg className={`w-4 h-4 ml-2 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
            ) : (
                <div className="flex-grow"></div> 
            )}

            <button
                onClick={handleShare}
                className={`flex-shrink-0 p-2.5 rounded-md text-sm font-semibold transition-all duration-300 ${copied ? 'bg-accent text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                aria-label={copied ? "Pautan disalin!" : `Kongsi ${title}`}
                title={copied ? "Pautan disalin!" : `Kongsi ${title}`}
                disabled={copied}
            >
                {copied ? <CheckIcon /> : <ShareIcon />}
            </button>

           {isAdmin && (
            <>
              <button
                onClick={onToggleFeatured}
                className={`flex-shrink-0 p-2.5 rounded-md text-sm transition-colors duration-200 font-semibold ${isFeatured ? 'bg-amber-400 hover:bg-amber-500 text-primary' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                aria-label={isFeatured ? `Buang tanda pilihan dari ${title}` : `Tandakan ${title} sebagai pilihan`}
                title={isFeatured ? 'Buang Tanda Pilihan' : 'Tandakan sebagai Pilihan'}
              >
                <StarIcon filled={isFeatured} />
              </button>
              <button
                  onClick={onEdit}
                  className="flex-shrink-0 p-2.5 rounded-md text-sm transition-colors duration-200 bg-secondary/80 hover:bg-secondary text-primary font-semibold"
                  aria-label={`Edit ${title}`}
              >
                  <EditIcon />
              </button>
              <button
                  onClick={onDelete}
                  className="flex-shrink-0 p-2.5 rounded-md text-sm transition-colors duration-200 bg-red-600 hover:bg-red-700 text-white font-semibold"
                  aria-label={`Delete ${title}`}
              >
                  <TrashIcon />
              </button>
            </>
          )}
        </div>
      </div>
      {isExpandable && (
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
          <EventDetails description={description} bracketData={bracketData} schedule={schedule} />
        </div>
      )}
    </div>
  );
};

export default EventCard;