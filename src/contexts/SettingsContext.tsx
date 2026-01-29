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
  cycleCalibration: {
    cetus: number; // Offset in seconds
    vallis: number; // Offset in seconds
  };
}

const defaultDashboardConfig: DashboardWidget[] = [
  { id: 'cycles', visible: true, order: 0 },
  { id: 'alerts', visible: true, order: 1 },
  { id: 'invasions', visible: true, order: 2 },
  { id: 'sortie', visible: true, order: 3 },
  { id: 'archonHunt', visible: false, order: 4 },
  { id: 'archimedea', visible: false, order: 5 }, // New
  { id: 'resurgence', visible: true, order: 6 },
  { id: 'circuit', visible: true, order: 7 }, // New: Circuit
  { id: 'voidTrader', visible: true, order: 8 },
];

export const DEFAULT_CYCLE_CALIBRATION = {
  cetus: 31,
  vallis: 801,
};

const defaultSettings: Settings = {
  isFirstVisit: true,
  dashboardConfig: defaultDashboardConfig,
  lastSeenVersion: '0.0.0', // Default to 0.0.0 to trigger update on first load if version > 0.0.0
  cycleCalibration: DEFAULT_CYCLE_CALIBRATION,
};

interface SettingsContextType extends Settings {
  completeOnboarding: () => void;
  resetSettings: () => void;
  updateDashboardConfig: (newConfig: DashboardWidget[]) => void;
  markUpdateSeen: (version: string) => void; // New function
  resetUpdateSeen: () => void; // For debug
  updateCycleCalibration: (location: 'cetus' | 'vallis', offset: number) => void;
}

const SETTINGS_KEY = 'noctua-hub-settings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // Migration & Safe Merge
        const mergedSettings: Settings = {
          ...defaultSettings,
          ...parsed,
          // Explicitly merge nested objects to avoid overwriting with incomplete data
          cycleCalibration: {
            ...defaultSettings.cycleCalibration,
            ...(parsed.cycleCalibration || {}),
          },
        };

        // Ensure dashboardConfig has all required widgets
        if (mergedSettings.dashboardConfig) {
          const existingIds = new Set(mergedSettings.dashboardConfig.map((w: DashboardWidget) => w.id));
          const missingWidgets = defaultDashboardConfig.filter(w => !existingIds.has(w.id));
          if (missingWidgets.length > 0) {
            mergedSettings.dashboardConfig = [...mergedSettings.dashboardConfig, ...missingWidgets];
          }
        }

        return mergedSettings;
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

  const updateCycleCalibration = (location: 'cetus' | 'vallis', offset: number) => {
    setSettings((prev) => ({
      ...prev,
      cycleCalibration: {
        ...prev.cycleCalibration,
        [location]: offset,
      },
    }));
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
        updateCycleCalibration,
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
