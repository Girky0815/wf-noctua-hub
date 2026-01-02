import React, { useEffect, useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import packageJson from '../../../package.json';
import { updates } from '../../data/updates';

interface UpdateNotificationModalProps {
  onClose: () => void;
}

export const UpdateNotificationModal: React.FC<UpdateNotificationModalProps> = ({ onClose }) => {
  const [content, setContent] = useState<string>('');
  const { markUpdateSeen } = useSettings();
  const currentVersion = packageJson.version;

  useEffect(() => {
    // Find update log for current version
    const updateLog = updates.find(u => u.version === currentVersion);
    if (updateLog) {
      setContent(updateLog.content);
    } else {
      // Fallback or default message if no log found for this version
      setContent('更新情報が見つかりませんでした。');
    }
  }, [currentVersion]);

  const handleClose = () => {
    markUpdateSeen(currentVersion);
    onClose();
  };

  // Simple Markdown Renderer
  const renderContent = (md: string) => {
    return md.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h2 key={index} className="text-xl font-bold mt-4 mb-2 text-on-secondary-container font-display">{line.replace('# ', '')}</h2>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={index} className="text-lg font-bold mt-3 mb-1 text-on-secondary-container font-display">{line.replace('## ', '')}</h3>;
      }
      if (line.trim().startsWith('- ')) {
        const indentLevel = line.search(/\S/) / 2; // Assuming 2 spaces per level
        const content = line.trim().replace('- ', '');
        const parts = content.split(/(\*\*.*?\*\*)/g);

        // Define styles based on indentation level
        let listStyle = 'list-disc';
        let marginClass = 'ml-4';

        if (indentLevel === 1) { // Level 2
          listStyle = 'list-[circle]';
          marginClass = 'ml-8';
        } else if (indentLevel >= 2) { // Level 3+
          listStyle = 'list-[square]';
          marginClass = 'ml-12';
        }

        return (
          <li key={index} className={`${marginClass} ${listStyle} text-sm text-on-secondary-container/90 leading-relaxed`}>
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-on-secondary-container">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </li>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="text-sm text-on-secondary-container/90 leading-relaxed">{line}</p>;
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity" />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-surface-container-high w-full max-w-md rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="p-6 pb-2">
            <h2 className="text-2xl font-display font-bold text-on-surface">Noctua Hub が更新されました</h2>
            <p className="text-on-surface-variant text-sm mt-1">Version {currentVersion}</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-2">
            <div className="bg-secondary-container rounded-xl p-4">
              {renderContent(content)}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 flex flex-col items-center gap-4">
            <p className="text-on-surface font-display font-medium">よきテンノライフを</p>
            <button
              onClick={handleClose}
              className="w-full bg-primary text-on-primary font-bold py-3 px-6 rounded-full hover:shadow-lg transition-all active:scale-95"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
