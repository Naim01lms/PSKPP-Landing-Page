import React from 'react';

const BowlingIcon: React.FC<{className?: string}> = ({className = "h-5 w-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="15" cy="9" r="1"/>
        <circle cx="9" cy="9" r="1"/>
        <circle cx="12" cy="15" r="1"/>
    </svg>
);

export default BowlingIcon;
