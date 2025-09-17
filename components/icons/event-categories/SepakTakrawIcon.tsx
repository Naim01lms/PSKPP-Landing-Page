import React from 'react';

const SepakTakrawIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.3 5.3a2 2 0 1 0-2.6 2.6"/>
        <path d="M14 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/>
        <path d="M12 12a2 2 0 1 0-4 0 2 2 0 0 0 4 0"/>
        <path d="M2.5 13.5h9"/>
        <path d="M13 18.5V11"/>
        <path d="M18 10.5 15 8"/>
    </svg>
);

export default SepakTakrawIcon;
