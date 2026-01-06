import React, { createContext, useContext, useEffect, useState } from 'react';

export interface DashboardWidget {
  id: string;
  visible: boolean;
  order: number;
}

interface Settings {
  isFirstVisit: boolean;
  dashboardConfig: DashboardWidget[];
  lastSeenVersion: string; // Add version tracking
}

const defaultDashboardConfig: DashboardWidget[] = [
  { id: 'cycles', visible: true, order: 0 },
  { id: 'alerts', visible: true, order: 1 },
  { id: 'invasions', visible: true, order: 2 },
  { id: 'sortie', visible: true, order: 3 },
  { id: 'archonHunt', visible: false, order: 4 },
  { id: 'archimedea', visible: false, order: 5 }, // New
  { id: 'resurgence', visible: true, order: 6 },
  { id: 'voidTrader', visible: true, order: 7 },
];

const defaultSettings: Settings = {
  isFirstVisit: true,
  dashboardConfig: defaultDashboardConfig,
  lastSeenVersion: '0.0.0', // Default to 0.0.0 to trigger update on first load if version > 0.0.0
};

interface SettingsContextType extends Settings {
  completeOnboarding: () => void;
  resetSettings: () => void;
  updateDashboardConfig: (newConfig: DashboardWidget[]) => void;
  markUpdateSeen: (version: string) => void; // New function
  resetUpdateSeen: () => void; // For debug
}

const SETTINGS_KEY = 'noctua-hub-settings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // Migration: Ensure new widgets are added to existing config
        if (parsed.dashboardConfig) {
          const existingIds = new Set(parsed.dashboardConfig.map((w: DashboardWidget) => w.id));
          const missingWidgets = defaultDashboardConfig.filter(w => !existingIds.has(w.id));
          if (missingWidgets.length > 0) {
            parsed.dashboardConfig = [...parsed.dashboardConfig, ...missingWidgets];
          }
        }

        // Merge to ensure new settings (like lastSeenVersion) are present
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

  const markUpdateSeen = (version: string) => {
    setSettings((prev) => ({ ...prev, lastSeenVersion: version }));
  };

  const resetUpdateSeen = () => {
    setSettings((prev) => ({ ...prev, lastSeenVersion: '0.0.0' }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        completeOnboarding,
        resetSettings,
        updateDashboardConfig,
        markUpdateSeen,
        resetUpdateSeen,
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
