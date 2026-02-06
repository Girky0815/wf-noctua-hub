import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeMode, ThemeColorMode } from '../types/theme';

import { ColorPicker } from './ui/ColorPicker';

interface ThemeSelectorProps {
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className = '' }) => {
  const { mode, setMode, colorMode, setColorMode, customColor, setCustomColor } = useTheme();
  const [showPicker, setShowPicker] = React.useState(false);

  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const handleColorModeChange = (newColorMode: ThemeColorMode) => {
    setColorMode(newColorMode);
  };

  // Helper buttons
  const ModeButton = ({ targetMode, label, icon }: { targetMode: ThemeMode, label: string, icon: string }) => {
    const isActive = mode === targetMode;
    return (
      <button
        type="button"
        onClick={() => handleModeChange(targetMode)}
        className={`
          flex flex-1 items-center justify-center gap-2 rounded-xl py-3 px-2 text-sm font-bold transition-all duration-200
          ${isActive
            ? 'bg-primary-container text-on-primary-container shadow-sm'
            : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
          }
        `}
      >
        <span className={`material-symbols-rounded text-[20px] ${isActive ? 'fill-current' : ''}`}>
          {icon}
        </span>
        <span className="whitespace-nowrap">{label}</span>
      </button>
    );
  };

  const ColorModeButton = ({ targetMode, label, icon }: { targetMode: ThemeColorMode, label: string, icon: string }) => {
    const isActive = colorMode === targetMode;
    return (
      <button
        type="button"
        onClick={() => handleColorModeChange(targetMode)}
        className={`
          flex flex-1 items-center justify-center gap-2 rounded-xl py-3 px-2 text-sm font-bold transition-all duration-200
          ${isActive
            ? 'bg-secondary-container text-on-secondary-container shadow-sm'
            : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
          }
        `}
      >
        <span className={`material-symbols-rounded text-[20px] ${isActive ? 'fill-current' : ''}`}>
          {icon}
        </span>
        <span className="whitespace-nowrap">{label}</span>
      </button>
    );
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* カラーモード (Light/Dark/Black) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-on-surface-variant ml-1">カラーモード</label>
        <div className="flex w-full gap-2 rounded-2xl bg-surface-container p-1">
          <ModeButton targetMode="light" label="ライト" icon="light_mode" />
          <ModeButton targetMode="dark" label="ダーク" icon="dark_mode" />
          <ModeButton targetMode="black" label="ブラック" icon="contrast" />
        </div>
      </div>

      {/* テーマカラー (Default/Custom) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-on-surface-variant ml-1">テーマカラー</label>
        <div className="flex flex-col gap-3">
          <div className="flex w-full gap-2 rounded-2xl bg-surface-container p-1">
            <ColorModeButton targetMode="default" label="デフォルト" icon="palette" />
            <ColorModeButton targetMode="custom" label="カスタム" icon="tune" />
          </div>

          {/* カスタムカラーピッカー */}
          {colorMode === 'custom' && (
            <div className="flex items-center gap-4 rounded-2xl bg-surface-container-high p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div
                className="h-10 w-10 rounded-full border border-outline/20 shadow-sm shrink-0 cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: customColor }}
                onClick={() => setShowPicker(true)}
              />
              <div className="flex flex-col flex-1">
                <label className="text-xs font-bold text-on-surface-variant mb-1">
                  シードカラー(元にする色)を設定
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowPicker(true)}
                    className="relative flex-1 h-10 w-full rounded-lg bg-surface-container-highest border border-outline-variant flex items-center px-3 hover:bg-surface-variant transition-colors group"
                  >
                    <span className="text-sm font-mono opacity-80 uppercase tracking-widest">{customColor}</span>
                    <span className="material-symbols-rounded absolute right-3 opacity-50 group-hover:opacity-100 text-lg">palette</span>
                  </button>
                </div>
              </div>

              {/* Custom Color Picker Modal */}
              {showPicker && (
                <ColorPicker
                  color={customColor}
                  onChange={(c) => {
                    setCustomColor(c);
                  }}
                  onClose={() => setShowPicker(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
