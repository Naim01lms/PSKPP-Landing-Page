import React from 'react';

const RunningIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12a2 2 0 1 0-2-2"/>
        <path d="M17.8 8.4a2 2 0 1 0-2.6-2.6"/>
        <path d="m14 17-2-1-2 1v-4l-2-1-2 1v-4l-2-1-2 1"/>
        <path d="m6 17 2-1 2 1v-4l2-1 2 1v-4l2-1 2 1"/>
    </svg>
);

export default RunningIcon;
