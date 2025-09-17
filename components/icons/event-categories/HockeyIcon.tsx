import React from 'react';

const HockeyIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 13.5 18 22"/>
        <path d="M12 11 5 18"/>
        <path d="M21 13a7 7 0 1 1-14 0c0-4 7-10 7-10s7 6 7 10Z"/>
        <path d="m12 11 1.5-1.5"/>
    </svg>
);

export default HockeyIcon;
