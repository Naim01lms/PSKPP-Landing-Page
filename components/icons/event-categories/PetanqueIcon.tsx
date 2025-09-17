import React from 'react';

const PetanqueIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 12a5 5 0 0 0-5 5" />
        <path d="M12 12a5 5 0 0 1 5 5" />
        <path d="M12 12a5 5 0 0 1-5-5h10a5 5 0 0 1-5 5Z" />
    </svg>
);

export default PetanqueIcon;
