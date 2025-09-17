import React from 'react';
import type { EventCategoryIcon } from '../types';

import BadmintonIcon from './icons/event-categories/BadmintonIcon';
import BasketballIcon from './icons/event-categories/BasketballIcon';
import BowlingIcon from './icons/event-categories/BowlingIcon';
import CultureIcon from './icons/event-categories/CultureIcon';
import DefaultCategoryIcon from './icons/event-categories/DefaultCategoryIcon';
import FootballIcon from './icons/event-categories/FootballIcon';
import GolfIcon from './icons/event-categories/GolfIcon';
import HockeyIcon from './icons/event-categories/HockeyIcon';
import PetanqueIcon from './icons/event-categories/PetanqueIcon';
import PingPongIcon from './icons/event-categories/PingPongIcon';
import RunningIcon from './icons/event-categories/RunningIcon';
import SepakTakrawIcon from './icons/event-categories/SepakTakrawIcon';
import SoftballIcon from './icons/event-categories/SoftballIcon';
import TennisIcon from './icons/event-categories/TennisIcon';
import VolleyballIcon from './icons/event-categories/VolleyballIcon';


const availableIcons: { name: EventCategoryIcon; component: React.ReactNode; title: string }[] = [
    { name: 'default', component: <DefaultCategoryIcon />, title: 'Lalai' },
    { name: 'football', component: <FootballIcon />, title: 'Bola Sepak' },
    { name: 'running', component: <RunningIcon />, title: 'Olahraga/Larian' },
    { name: 'hockey', component: <HockeyIcon />, title: 'Hoki' },
    { name: 'golf', component: <GolfIcon />, title: 'Golf' },
    { name: 'bowling', component: <BowlingIcon />, title: 'Boling' },
    { name: 'tennis', component: <TennisIcon />, title: 'Tenis/Pickleball' },
    { name: 'badminton', component: <BadmintonIcon />, title: 'Badminton' },
    { name: 'petanque', component: <PetanqueIcon />, title: 'Petanque' },
    { name: 'volleyball', component: <VolleyballIcon />, title: 'Bola Tampar' },
    { name: 'softball', component: <SoftballIcon />, title: 'Sofbol' },
    { name: 'sepak-takraw', component: <SepakTakrawIcon />, title: 'Sepak Takraw' },
    { name: 'ping-pong', component: <PingPongIcon />, title: 'Ping Pong' },
    { name: 'basketball', component: <BasketballIcon />, title: 'Bola Keranjang/Jaring' },
    { name: 'culture', component: <CultureIcon />, title: 'Kebudayaan' },
];

interface IconSelectorProps {
    selectedIcon: EventCategoryIcon | undefined;
    onSelect: (iconName: EventCategoryIcon) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onSelect }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">Ikon Kategori</label>
            <div className="mt-2 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {availableIcons.map(({ name, component, title }) => (
                    <button 
                        key={name} 
                        type="button" 
                        onClick={() => onSelect(name)}
                        className={`p-3 border rounded-lg flex items-center justify-center transition-all duration-200 aspect-square
                            ${selectedIcon === name 
                                ? 'ring-2 ring-primary bg-primary/10 border-primary' 
                                : 'border-gray-300 bg-white hover:bg-gray-100 hover:border-gray-400'
                            }`
                        }
                        aria-label={`Pilih ikon ${title}`}
                        title={title}
                    >
                        {/* FIX: Explicitly type the cloned element's props to include className. */}
                        {React.cloneElement(component as React.ReactElement<{ className?: string }>, { className: 'h-6 w-6 text-gray-700' })}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default IconSelector;