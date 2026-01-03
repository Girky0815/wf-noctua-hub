import React, { type ReactNode } from 'react';

// List Container
// 枠線なし、背景色（Gapの色）、要素間隔（2px）を持つコンテナ
export const ListGroup: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex flex-col gap-[2px] bg-surface-container ${className}`}>
    {children}
  </div>
);

interface ListItemProps {
  children: ReactNode;
  className?: string; // 追加のスタイル用
  onClick?: () => void;
}

// Generic List Item
// 自由なコンテンツを持つリストアイテム。角丸ロジックのみ適用。
export const ListItem: React.FC<ListItemProps> = ({ children, className = '', onClick }) => (
  <div
    onClick={onClick}
    className={`
      bg-surface-bright transition-colors
      rounded-[4px] first:rounded-t-3xl last:rounded-b-3xl
      ${onClick ? 'cursor-pointer hover:bg-surface-container-high' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

interface ListTileProps {
  icon?: string;
  title: string;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  destructive?: boolean;
  className?: string; // 追加のスタイル用
}

// List Item
// CSS擬似クラスを使用して角丸ロジックを自動適用
export const ListTile: React.FC<ListTileProps> = ({
  icon,
  title,
  subtitle,
  trailing,
  onClick,
  destructive = false,
  className = ''
}) => {
  return (
    <ListItem
      onClick={onClick}
      className={`
        flex items-center justify-between px-4 py-4
        ${destructive ? 'text-error' : 'text-on-surface'}
        ${className}
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
            <span className="text-xs text-on-surface-variant opacity-80 leading-snug">
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
    </ListItem>
  );
};
