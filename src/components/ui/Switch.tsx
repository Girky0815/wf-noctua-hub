import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, disabled = false }) => {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        relative h-8 w-[52px] rounded-full transition-colors duration-200 ease-in-out border-2 box-border flex items-center
        ${checked
          ? 'bg-primary border-primary'
          : 'bg-surface-container-highest border-outline'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-checked={checked}
      role="switch"
    >
      <div
        className={`
          absolute h-6 w-6 rounded-full shadow-sm transition-all duration-200 flex items-center justify-center
          ${checked
            ? 'translate-x-[23px] bg-on-primary text-primary-fixed-dim'
            : 'translate-x-[2px] bg-outline text-surface-container-highest'
          }
        `}
      >
        <span
          className="material-symbols-rounded text-[16px] transition-opacity duration-200"
          style={{
            color: checked ? 'var(--primary)' : 'var(--surface-container-highest)',
            fontWeight: 700, // クラスではなくスタイルで指定して .font-bold の上書きを回避
            fontFamily: 'Material Symbols Rounded', // 明示的に指定
            fontVariationSettings: "'FILL' 0, 'wght' 700, 'GRAD' 0, 'opsz' 20"
          }}
        >
          {checked ? 'check' : 'close'}
        </span>
      </div>
    </button>
  );
};
