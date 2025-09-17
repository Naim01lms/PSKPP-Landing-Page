import React from 'react';
import type { Round, ScheduleItem } from '../types';
import TournamentBracket from './TournamentBracket';

interface EventDetailsProps {
  description?: string;
  bracketData?: Round[];
  schedule?: ScheduleItem[];
}

const formatTime = (timeString?: string): string => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  if (isNaN(parseInt(hours)) || isNaN(parseInt(minutes))) return '';

  const date = new Date();
  // Use UTC hours/minutes to avoid timezone shifts when formatting
  date.setUTCHours(parseInt(hours, 10));
  date.setUTCMinutes(parseInt(minutes, 10));

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });
};


const EventDetails: React.FC<EventDetailsProps> = ({ description, bracketData, schedule }) => {
  const hasBracket = bracketData && bracketData.length > 0;
  const hasDescription = description && description.trim() !== '';
  const hasSchedule = schedule && schedule.length > 0;

  if (!hasBracket && !hasDescription && !hasSchedule) {
    return null;
  }

  return (
    <div className="px-6 pb-6">
      <div className="border-t pt-4 space-y-6">
        {hasDescription && (
          <div>
            <h4 className="text-md font-bold text-primary mb-2">Butiran Acara</h4>
            <p className="text-gray-600 text-sm whitespace-pre-line">{description}</p>
          </div>
        )}
        {hasSchedule && (
           <div>
            <h4 className="text-md font-bold text-primary mb-2">Jadual Acara</h4>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Masa</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktiviti</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedule.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{formatTime(item.time)}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{item.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {hasBracket && (
          <div>
            <h4 className="text-md font-bold text-primary mb-2">Carta Pertandingan</h4>
            <div className="relative bg-light/50 p-4 rounded-lg">
                <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-light/50 to-transparent pointer-events-none z-10"></div>
                <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-light/50 to-transparent pointer-events-none z-10"></div>
                <TournamentBracket data={bracketData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;