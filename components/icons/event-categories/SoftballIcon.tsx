import React from 'react';

const SoftballIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="m7 7 10 10"/>
        <path d="m10 6 3 3"/>
        <path d="m15 11 3 3"/>
    </svg>
);

export default SoftballIcon;
