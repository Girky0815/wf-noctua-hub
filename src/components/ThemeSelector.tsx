import React from 'react';
import { useTheme, type Theme } from '../contexts/ThemeContext';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: { id: Theme; label: string; icon: string }[] = [
    { id: 'light', label: 'ライト', icon: 'light_mode' },
    { id: 'dark', label: 'ダーク', icon: 'dark_mode' },
    { id: 'black', label: 'ブラック', icon: 'contrast' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`
            flex flex-col items-center justify-center rounded-2xl border p-4 transition-all
            ${theme === t.id
              ? 'border-primary bg-primary-container text-on-primary-container'
              : 'border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container-high'
            }
          `}
          type="button"
        >
          <span className="material-symbols-rounded mb-2 text-2xl">
            {t.icon}
          </span>
          <span className="text-sm font-medium">{t.label}</span>
        </button>
      ))}
    </div>
  );
};
