import React, { createContext, useContext, useEffect, useState } from 'react';

import { THEME_KEY } from '../utils/constants';
import { generateTheme } from '../utils/themeGenerator';
import type { ThemeMode, ThemeColorMode } from '../types/theme';

export type { ThemeMode, ThemeColorMode };

const THEME_MODE_KEY = 'theme-mode';
const THEME_COLOR_MODE_KEY = 'theme-color-mode';
const THEME_CUSTOM_COLOR_KEY = 'theme-custom-color';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colorMode: ThemeColorMode;
  setColorMode: (mode: ThemeColorMode) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Appearance Mode: light | dark | black
  const [mode, setModeState] = useState<ThemeMode>(() => {
    // Migrate old key if exists
    const oldTheme = localStorage.getItem(THEME_KEY);
    if (oldTheme) {
      localStorage.removeItem(THEME_KEY);
      if (['light', 'dark', 'black'].includes(oldTheme)) {
        localStorage.setItem(THEME_MODE_KEY, oldTheme);
        return oldTheme as ThemeMode;
      }
    }
    const saved = localStorage.getItem(THEME_MODE_KEY);
    return (saved as ThemeMode) || 'light';
  });

  // Color Mode: default | custom
  const [colorMode, setColorModeState] = useState<ThemeColorMode>(() => {
    const saved = localStorage.getItem(THEME_COLOR_MODE_KEY);
    return (saved as ThemeColorMode) || 'default';
  });

  // Seed Color for Custom Theme
  const [customColor, setCustomColorState] = useState<string>(() => {
    const saved = localStorage.getItem(THEME_CUSTOM_COLOR_KEY);
    return saved || '#4285F4'; // Default Blue
  });

  // Apply Theme Mode (class-based)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'black');

    if (mode === 'black') {
      root.classList.add('dark', 'black');
    } else {
      root.classList.add(mode);
    }

    // Meta theme color update
    let themeColor = '#F6FAF6'; // light surface
    if (mode === 'dark') themeColor = '#0B0F0D'; // dark surface
    if (mode === 'black') themeColor = '#000000'; // black surface

    // If using custom color, we might want to update this too, 
    // but getting the computed variable is tricky here without delay.
    // For now, static base colors for meta tag is fine.

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', themeColor);

    localStorage.setItem(THEME_MODE_KEY, mode);
  }, [mode]);

  // Apply Theme Color (Dynamic Style or Default)
  useEffect(() => {
    const root = document.documentElement;

    if (colorMode === 'custom') {
      const variables = generateTheme(customColor, mode);

      // Apply generated variables
      Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    } else {
      // Clean up inline styles to revert to CSS classes
      // We need to know which properties to remove.
      // A simple way is to remove all `--color-` properties, 
      // or we can just remove the style attribute if we don't use it for anything else.
      // But clearing style attribute is dangerous if used by other libs.
      // Let's remove specific keys.

      // Getting keys from a dummy generation to know what to remove or defined list
      // For now, let's just create a list of known keys based on generator
      const knownKeys = [
        'primary', 'on-primary', 'primary-container', 'on-primary-container', 'inverse-primary',
        'secondary', 'on-secondary', 'secondary-container', 'on-secondary-container',
        'tertiary', 'on-tertiary', 'tertiary-container', 'on-tertiary-container',
        'error', 'on-error', 'error-container', 'on-error-container',
        'background', 'on-background',
        'surface', 'on-surface', 'surface-variant', 'on-surface-variant',
        'inverse-surface', 'inverse-on-surface',
        'outline', 'outline-variant', 'scrim',
        'surface-container-lowest', 'surface-container-low', 'surface-container',
        'surface-container-high', 'surface-container-highest', 'surface-dim', 'surface-bright'
      ];

      knownKeys.forEach(key => {
        root.style.removeProperty(`--color-${key}`);
      });
    }

    localStorage.setItem(THEME_COLOR_MODE_KEY, colorMode);
    localStorage.setItem(THEME_CUSTOM_COLOR_KEY, customColor);
  }, [mode, colorMode, customColor]);

  return (
    <ThemeContext.Provider value={{
      mode,
      setMode: setModeState,
      colorMode,
      setColorMode: setColorModeState,
      customColor,
      setCustomColor: setCustomColorState
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
