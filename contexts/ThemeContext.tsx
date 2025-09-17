import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { useToast } from './ToastContext';

// --- Color Conversion Utilities ---
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const formatHslForCssVar = (hsl: { h: number; s: number; l: number }): string => {
    return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
};
// --- End of Utilities ---

interface ThemeContextType {
  primaryColor: string;
  secondaryColor: string;
  headingFont: string;
  bodyFont: string;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setHeadingFont: (font: string) => void;
  setBodyFont: (font: string) => void;
  saveTheme: () => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultTheme = {
  primary: '#1F2937',
  secondary: '#FBBF24',
  headingFont: 'Teko',
  bodyFont: 'Inter',
};

const LOCAL_STORAGE_KEY = 'pskppTheme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState(defaultTheme.primary);
  const [secondaryColor, setSecondaryColor] = useState(defaultTheme.secondary);
  const [headingFont, setHeadingFont] = useState(defaultTheme.headingFont);
  const [bodyFont, setBodyFont] = useState(defaultTheme.bodyFont);
  const { addToast } = useToast();

  const applyTheme = useCallback((primary: string, secondary: string, heading: string, body: string) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', formatHslForCssVar(hexToHsl(primary)));
    root.style.setProperty('--color-secondary', formatHslForCssVar(hexToHsl(secondary)));
    root.style.setProperty('--font-family-heading', `'${heading}', sans-serif`);
    root.style.setProperty('--font-family-body', `'${body}', sans-serif`);
  }, []);
  
  // Load theme from localStorage on initial render
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTheme) {
        const { primary, secondary, heading, body } = JSON.parse(savedTheme);
        if (primary) setPrimaryColor(primary);
        if (secondary) setSecondaryColor(secondary);
        if (heading) setHeadingFont(heading);
        if (body) setBodyFont(body);
      }
    } catch (error) {
      console.error("Failed to load theme from local storage:", error);
    }
  }, []);

  // Apply theme whenever colors or fonts change (for live preview)
  useEffect(() => {
    applyTheme(primaryColor, secondaryColor, headingFont, bodyFont);
  }, [primaryColor, secondaryColor, headingFont, bodyFont, applyTheme]);

  const saveTheme = () => {
    try {
      const theme = JSON.stringify({
        primary: primaryColor,
        secondary: secondaryColor,
        heading: headingFont,
        body: bodyFont
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, theme);
      addToast('Tema berjaya disimpan!');
    } catch (error) {
      console.error("Failed to save theme:", error);
      addToast('Gagal menyimpan tema.', 'error');
    }
  };

  const resetTheme = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setPrimaryColor(defaultTheme.primary);
      setSecondaryColor(defaultTheme.secondary);
      setHeadingFont(defaultTheme.headingFont);
      setBodyFont(defaultTheme.bodyFont);
      addToast('Tema telah ditetapkan semula kepada lalai.');
    } catch (error) {
      console.error("Failed to reset theme:", error);
      addToast('Gagal menetapkan semula tema.', 'error');
    }
  };
  
  const value = {
    primaryColor,
    secondaryColor,
    headingFont,
    bodyFont,
    setPrimaryColor,
    setSecondaryColor,
    setHeadingFont,
    setBodyFont,
    saveTheme,
    resetTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};