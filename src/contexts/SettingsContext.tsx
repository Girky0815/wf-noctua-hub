import React, { createContext, useContext, useEffect, useState } from 'react';

export interface DashboardWidget {
  id: string;
  visible: boolean;
  order: number;
}

interface Settings {
  isFirstVisit: boolean;
  dashboardConfig: DashboardWidget[];
}

const defaultDashboardConfig: DashboardWidget[] = [
  { id: 'cycles', visible: true, order: 0 },
  { id: 'alerts', visible: true, order: 1 },
  { id: 'invasions', visible: true, order: 2 },
  { id: 'sortie', visible: true, order: 3 },
  { id: 'archonHunt', visible: true, order: 4 },
  { id: 'resurgence', visible: true, order: 5 },
  { id: 'voidTrader', visible: true, order: 6 },
];

const defaultSettings: Settings = {
  isFirstVisit: true,
  dashboardConfig: defaultDashboardConfig,
};

interface SettingsContextType extends Settings {
  completeOnboarding: () => void;
  resetSettings: () => void;
  updateDashboardConfig: (newConfig: DashboardWidget[]) => void;
}

const SETTINGS_KEY = 'noctua-hub-settings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // マージして新しい設定項目(dashboardConfig等)が欠けないようにする
        return { ...defaultSettings, ...parsed };
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

  const updateDashboardConfig = (newConfig: DashboardWidget[]) => {
    setSettings((prev) => ({ ...prev, dashboardConfig: newConfig }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        completeOnboarding,
        resetSettings,
        updateDashboardConfig,
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
