import React, { useCallback, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

// Preset colors (Material Design friendly seeds)
const PRESET_COLORS = [
  '#286A56', // Default Green
  '#4285F4', // Google Blue
  '#EA4335', // Google Red
  '#FBBC04', // Google Yellow
  '#673AB7', // Deep Purple
  '#E91E63', // Pink
  '#009688', // Teal
  '#FF5722', // Deep Orange
  '#607D8B', // Blue Grey
  '#795548', // Brown
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, onClose }) => {
  // Local state for the input field to allow typing without jitter
  const [inputValue, setInputValue] = useState(color);

  const handleColorChange = useCallback((newColor: string) => {
    setInputValue(newColor);
    onChange(newColor);
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onChange(val);
    }
  };

  const handleBlur = () => {
    // Reset input to valid color if invalid
    if (!/^#[0-9A-Fa-f]{6}$/.test(inputValue)) {
      setInputValue(color);
    }
  };

  // Sync input value if color prop changes externally
  useMemo(() => {
    setInputValue(color);
  }, [color]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xs overflow-hidden rounded-3xl bg-surface-container-high shadow-xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="bg-surface-container-highest px-6 py-4 border-b border-outline-variant/30">
          <h3 className="text-lg font-bold font-display text-on-surface">色の選択</h3>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Main Picker */}
          <div className="flex justify-center">
            <style>{`
              .react-colorful {
                width: 100%;
                height: 200px;
              }
              .react-colorful__saturation {
                border-radius: 16px 16px 0 0;
              }
              .react-colorful__hue {
                border-radius: 0 0 16px 16px;
                height: 24px;
                margin-top: -1px;
              }
              .react-colorful__pointer {
                width: 28px;
                height: 28px;
                border: 3px solid #fff;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
            `}</style>
            <HexColorPicker color={color} onChange={handleColorChange} />
          </div>

          {/* Hex Input & Preview */}
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-xl border border-outline/20 shadow-sm shrink-0 transition-colors duration-200"
              style={{ backgroundColor: color }}
            />
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-full h-12 rounded-xl bg-surface-container-highest px-4 font-mono text-base uppercase text-on-surface border-none focus:ring-2 focus:ring-primary outline-none"
                placeholder="#000000"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50 text-xs font-bold pointer-events-none">HEX</span>
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="text-xs font-bold text-on-surface-variant mb-3 block ml-1">プリセット</label>
            <div className="grid grid-cols-5 gap-3">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => handleColorChange(c)}
                  className={`
                    w-full aspect-square rounded-full flex items-center justify-center transition-transform active:scale-95
                    ${color.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface-container-high' : ''}
                  `}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                >
                  {color.toLowerCase() === c.toLowerCase() && (
                    <span className="material-symbols-rounded text-white drop-shadow-md text-lg">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-xl bg-surface-container-highest text-on-surface font-bold hover:bg-surface-variant transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity"
            >
              設定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
