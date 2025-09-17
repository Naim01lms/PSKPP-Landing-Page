import React from 'react';

export interface NavLink {
  name: string;
  href: string;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface AboutContent {
  title: string;
  subtitle: string;
  features: { title: string; description: string }[];
}

export interface Participant {
  name: string;
  score?: number;
}

export interface Match {
  participants: [Participant, Participant];
}

export interface Round {
  title:string;
  matches: Match[];
}

export type EventCategoryIcon =
  | 'football'
  | 'hockey'
  | 'badminton'
  | 'basketball'
  | 'volleyball'
  | 'bowling'
  | 'tennis'
  | 'golf'
  | 'running'
  | 'culture'
  | 'sepak-takraw'
  | 'softball'
  | 'petanque'
  | 'ping-pong'
  | 'default';

export interface ScheduleItem {
  time: string;
  activity: string;
}

export interface Event {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  categoryIcon?: EventCategoryIcon;
  gameStatus?: string;
  date: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  location: string;
  description?: string;
  bracketData?: Round[];
  schedule?: ScheduleItem[];
  lastUpdated?: string;
  isFeatured?: boolean;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
}

export type GalleryItem = {
  id: string;
  type: 'image' | 'video';
  src: string;
};

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ManagedLink {
  id: string;
  title: string;
  url: string;
  description?: string;
}

// FIX: Add ContactContent interface to fix compilation error in Contact.tsx.
export interface ContactContent {
  title: string;
  subtitle: string;
  formLabels: {
    name: string;
    email: string;
    message: string;
    submit: string;
  };
}
