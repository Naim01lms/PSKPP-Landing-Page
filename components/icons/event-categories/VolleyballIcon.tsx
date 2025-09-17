import React from 'react';

const VolleyballIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 12a10 10 0 0 0-2.5-6.1L2.8 3.1"/>
        <path d="M12 12a10 10 0 0 1-2.5-6.1L18.2 3.1"/>
        <path d="M12 12a10 10 0 0 0-2.5 6.1L2.8 20.9"/>
        <path d="M12 12a10 10 0 0 1-2.5 6.1L18.2 20.9"/>
    </svg>
);

export default VolleyballIcon;
