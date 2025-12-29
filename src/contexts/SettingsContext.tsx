import React, { createContext, useContext, useEffect, useState } from 'react';

interface Settings {
  isFirstVisit: boolean;
  // 将来的に表示設定などがここに追加される
}

interface SettingsContextType extends Settings {
  completeOnboarding: () => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  isFirstVisit: true,
};

const SETTINGS_KEY = 'noctua-hub-settings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const completeOnboarding = () => {
    setSettings((prev) => ({ ...prev, isFirstVisit: false }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        completeOnboarding,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
