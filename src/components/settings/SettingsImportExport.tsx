import React, { useState, useEffect } from 'react';

// LocalStorage Keys
const SETTINGS_KEY = 'noctua-hub-settings';
const THEME_MODE_KEY = 'theme-mode';
const THEME_COLOR_MODE_KEY = 'theme-color-mode';
const THEME_CUSTOM_COLOR_KEY = 'theme-custom-color';

interface ExportData {
  version: number;
  timestamp: string;
  settings: any;
  theme: {
    mode: string | null;
    colorMode: string | null;
    customColor: string | null;
  };
}

export const SettingsImportExport: React.FC = () => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  // Load current settings into text area
  const loadSettings = () => {
    try {
      const settingsRaw = localStorage.getItem(SETTINGS_KEY);
      const settings = settingsRaw ? JSON.parse(settingsRaw) : null;

      const exportData: ExportData = {
        version: 1,
        timestamp: new Date().toISOString(),
        settings: settings,
        theme: {
          mode: localStorage.getItem(THEME_MODE_KEY),
          colorMode: localStorage.getItem(THEME_COLOR_MODE_KEY),
          customColor: localStorage.getItem(THEME_CUSTOM_COLOR_KEY),
        },
      };

      setJsonText(JSON.stringify(exportData, null, 2));
      setError(null);
    } catch (e) {
      console.error(e);
      setError('設定データの読み込みに失敗しました');
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setSuccess('クリップボードにコピーしました。メモ帳等に貼り付けて保存してください。');
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError('コピーに失敗しました');
    }
  };

  const handleImport = () => {
    if (!window.confirm('現在の設定を上書きします。よろしいですか？\nアプリは再読み込みされます。')) {
      return;
    }

    try {
      const data: ExportData = JSON.parse(jsonText);

      // Validate basic structure
      if (!data.settings && !data.theme) {
        throw new Error('有効な設定データではありません');
      }

      // Restore Settings
      if (data.settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
      }

      // Restore Theme
      if (data.theme) {
        if (data.theme.mode) localStorage.setItem(THEME_MODE_KEY, data.theme.mode);
        if (data.theme.colorMode) localStorage.setItem(THEME_COLOR_MODE_KEY, data.theme.colorMode);
        if (data.theme.customColor) localStorage.setItem(THEME_CUSTOM_COLOR_KEY, data.theme.customColor);
      }

      setSuccess('設定を復元しました。再読み込みします...');

      // Short delay to show success message
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (e) {
      console.error(e);
      setError('データの形式が正しくありません (JSON parse error)');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <textarea
          value={jsonText}
          onChange={(e) => {
            setJsonText(e.target.value);
            setMode('edit');
            setError(null);
            setSuccess(null);
          }}
          className="w-full h-64 rounded-xl bg-surface-container-highest p-4 font-mono text-xs text-on-surface border border-transparent focus:border-primary focus:outline-none resize-none"
          spellCheck={false}
          placeholder='ここにJSONを貼り付けてください...'
        />
        {mode === 'edit' && (
          <div className="absolute top-2 right-6 px-2 py-1 bg-primary text-on-primary text-xs font-bold rounded shadow-sm pointer-events-none opacity-80">
            編集モード
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-error-container text-on-error-container text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-rounded">error</span>
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-primary-container text-on-primary-container text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-rounded">check_circle</span>
          {success}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-surface-container-highest text-on-surface font-bold hover:bg-surface-variant transition-colors"
        >
          <span className="material-symbols-rounded">content_copy</span>
          コピー(エクスポート)
        </button>
        <button
          onClick={handleImport}
          disabled={mode !== 'edit'}
          className={`
            flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold transition-all
            ${mode === 'edit'
              ? 'bg-primary text-on-primary hover:opacity-90 shadow-md'
              : 'bg-surface-container-highest text-on-surface opacity-50'
            }
          `}
        >
          <span className="material-symbols-rounded">download</span>
          設定を適用(インポート)
        </button>
      </div>
    </div>
  );
};
