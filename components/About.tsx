import React, { useState, useEffect } from 'react';
import SportsIcon from './icons/SportsIcon';
import UnityIcon from './icons/UnityIcon';
import EditIcon from './icons/EditIcon';
import { useAdminPanel } from '../contexts/AdminPanelContext';
import { initialAboutContent } from '../data/initialContent';
import type { AboutContent } from '../types';

const featureIcons = [<SportsIcon key="sports" />, <UnityIcon key="unity" />];
const LOCAL_STORAGE_KEY = 'aboutContent';

interface AboutProps {
  isAdmin: boolean;
}

const About: React.FC<AboutProps> = ({ isAdmin }) => {
  const [content, setContent] = useState<AboutContent>(initialAboutContent);
  const { openPanel } = useAdminPanel();

  useEffect(() => {
    try {
      const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        // Basic validation to ensure content structure is as expected
        if (parsedContent.features && parsedContent.features.length === featureIcons.length) {
            setContent(parsedContent);
        }
      }
    } catch (error) {
      console.error("Failed to load about content from local storage:", error);
    }
  }, []);

  return (
    <section id="about" className="py-20 bg-white relative group">
      {isAdmin && (
         <button
            onClick={() => openPanel('about')}
            className="absolute top-4 right-4 bg-secondary text-primary p-2.5 rounded-full shadow-lg hover:bg-amber-500 transition-colors z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Edit Bahagian Tentang Kami"
            title="Edit Bahagian Tentang Kami"
          >
            <EditIcon />
          </button>
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary font-heading uppercase tracking-wider">{content.title}</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                {content.subtitle}
            </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {content.features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-light rounded-lg shadow-md transition-transform transform hover:-translate-y-2 duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-secondary text-primary mx-auto mb-4">
                {featureIcons[index]}
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
