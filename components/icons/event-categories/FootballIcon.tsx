import React from 'react';

const FootballIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 12-2.1 4.9"/>
        <path d="M12 12 2.1 4.9"/>
        <path d="M12 12 2.1 19.1"/>
        <path d="m12 12 9.9 7.1"/>
        <path d="m12 12 9.9-7.1"/>
        <path d="m12 12-9.9 7.1"/>
        <path d="M2.1 4.9 7 10.5"/>
        <path d="M2.1 19.1 7 13.5"/>
        <path d="M21.9 4.9 17 10.5"/>
        <path d="M21.9 19.1 17 13.5"/>
        <path d="M7 10.5 12 2"/>
        <path d="M7 13.5 12 22"/>
        <path d="M17 10.5 12 2"/>
        <path d="M17 13.5 12 22"/>
    </svg>
);

export default FootballIcon;
