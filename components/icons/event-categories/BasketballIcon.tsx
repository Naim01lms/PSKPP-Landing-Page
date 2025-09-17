import React from 'react';

const BasketballIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a10 10 0 0 0-10 10c0 9 5 10 10 10s10-1 10-10a10 10 0 0 0-10-10Z"/>
        <path d="M2 12h20"/>
    </svg>
);

export default BasketballIcon;
