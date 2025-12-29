import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'black';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const THEME_KEY = 'noctua-hub-theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    // リセット
    root.classList.remove('light', 'dark', 'black');

    if (theme === 'black') {
      // black モードは dark モードの一種として扱うため、dark も付与する
      // これにより Tailwind の dark: 修飾子が機能する
      root.classList.add('dark', 'black');
    } else {
      root.classList.add(theme);
    }

    // meta theme-color の更新（ブラウザのツールバー色など）
    // 簡易的な実装。必要に応じて色コードを定数化する
    let themeColor = '#F6FAF6'; // light surface
    if (theme === 'dark') themeColor = '#0B0F0D'; // dark surface
    if (theme === 'black') themeColor = '#000000'; // black surface

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', themeColor);

    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
