import React from 'react';

const GolfIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 18h-8s-4-1-4-5 4-5 4-5h8"/>
        <path d="M18 18v-8"/>
        <path d="M18 10s-1-4-4-4-4 4-4 4"/>
        <circle cx="10" cy="8" r="1"/>
    </svg>
);

export default GolfIcon;
