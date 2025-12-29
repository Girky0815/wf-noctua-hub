import React, { type ReactNode } from 'react';

// セクション（見出し + 設定グループ）
export const SettingsSection: React.FC<{ title?: string; children: ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    {title && (
      <h3
        className="mb-2 ml-4 text-sm font-bold text-primary font-display"
        style={{ fontVariationSettings: "'ROND' 100" }}
      >
        {title}
      </h3>
    )}
    {children}
  </div>
);

// 設定グループ（角丸のコンテナ、要素間2px）
export const SettingsGroup: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-[2px] overflow-hidden rounded-3xl border-[2px] border-surface-container bg-surface-container">
    {children}
  </div>
);

interface SettingsTileProps {
  icon?: string;
  title: string;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  destructive?: boolean;
}

// 設定項目（リストタイル）
export const SettingsTile: React.FC<SettingsTileProps> = ({
  icon,
  title,
  subtitle,
  trailing,
  onClick,
  destructive = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center justify-between bg-surface-bright px-4 py-4 transition-colors
        ${onClick ? 'cursor-pointer hover:bg-surface-container-high' : ''}
        ${destructive ? 'text-error' : 'text-on-surface'}
      `}
    >
      <div className="flex items-center gap-4 overflow-hidden">
        {icon && (
          <span className={`material-symbols-rounded text-2xl ${destructive ? 'text-error' : 'text-on-surface-variant'}`}>
            {icon}
          </span>
        )}
        <div className="flex flex-col overflow-hidden">
          <span
            className="truncate font-medium text-base font-display"
            style={{ fontVariationSettings: "'ROND' 100" }}
          >
            {title}
          </span>
          {subtitle && (
            <span className={`truncate text-sm ${destructive ? 'text-error/80' : 'text-on-surface-variant'}`}>
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {trailing && (
        <div className="ml-4 flex-shrink-0">
          {trailing}
        </div>
      )}
    </div>
  );
};
