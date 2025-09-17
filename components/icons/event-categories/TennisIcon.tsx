import React from 'react';

const TennisIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 13.5 18 22"/>
        <path d="M5 18 8.5 14.5"/>
        <path d="M12 11a5 5 0 0 1 5 5h0a5 5 0 0 1-10 0h0a5 5 0 0 1 5-5Z"/>
    </svg>
);

export default TennisIcon;
