import React, { useState, useEffect } from 'react';
import EditIcon from './icons/EditIcon';
import { useAdminPanel } from '../contexts/AdminPanelContext';
import { initialContactContent } from '../data/initialContent';
import type { ContactContent } from '../types';

const LOCAL_STORAGE_KEY = 'contactContent';

interface ContactProps {
  isAdmin: boolean;
}

const Contact: React.FC<ContactProps> = ({ isAdmin }) => {
  const [content, setContent] = useState<ContactContent>(initialContactContent);
  const { openPanel } = useAdminPanel();

  useEffect(() => {
    try {
      const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent.formLabels) { // Basic validation
            setContent(parsedContent);
        }
      }
    } catch (error) {
      console.error("Failed to load contact content from local storage:", error);
    }
  }, []);

  return (
    <section id="contact" className="py-20 bg-white relative group">
       {isAdmin && (
         <button
            onClick={() => openPanel('contact')}
            className="absolute top-4 right-4 bg-secondary text-primary p-2.5 rounded-full shadow-lg hover:bg-amber-500 transition-colors z-10 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Edit Bahagian Hubungi Kami"
            title="Edit Bahagian Hubungi Kami"
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
        <div className="max-w-4xl mx-auto bg-light p-8 rounded-lg shadow-md">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{content.formLabels.name}</label>
                <input type="text" name="name" id="name" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{content.formLabels.email}</label>
                <input type="email" name="email" id="email" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">{content.formLabels.message}</label>
              <textarea id="message" name="message" rows={4} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
            </div>
            <div className="mt-6 text-center">
              <button type="submit" className="bg-primary hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full text-lg uppercase transition-colors duration-300">
                {content.formLabels.submit}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;