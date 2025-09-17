import React from 'react';

const CultureIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6V4H8V2h8v2h-4v2"/>
        <path d="M12 11.5a2.5 2.5 0 0 1-5 0V9a2.5 2.5 0 0 1 5 0V7"/>
        <path d="M12 11.5a2.5 2.5 0 0 0 5 0V9a2.5 2.5 0 0 0-5 0V7"/>
        <path d="M12 22v-4h4"/>
        <path d="M12 18h-4"/>
        <path d="M12 15h.01"/>
        <path d="M15 12h.01"/>
        <path d="M9 12h.01"/>
    </svg>
);

export default CultureIcon;
