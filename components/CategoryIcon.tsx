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

interface CategoryIconProps {
  icon?: EventCategoryIcon;
  size?: 'sm' | 'md' | 'lg' | 'xs';
}

const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
};

const iconMap: Record<EventCategoryIcon, React.FC<{className?: string}>> = {
    football: FootballIcon,
    hockey: HockeyIcon,
    badminton: BadmintonIcon,
    basketball: BasketballIcon,
    volleyball: VolleyballIcon,
    bowling: BowlingIcon,
    tennis: TennisIcon,
    golf: GolfIcon,
    running: RunningIcon,
    culture: CultureIcon,
    'sepak-takraw': SepakTakrawIcon,
    softball: SoftballIcon,
    petanque: PetanqueIcon,
    'ping-pong': PingPongIcon,
    default: DefaultCategoryIcon,
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ icon = 'default', size = 'md' }) => {
  const IconComponent = iconMap[icon] || iconMap.default;
  const className = sizeClasses[size];
  
  return <IconComponent className={className} />;
};

export default CategoryIcon;
