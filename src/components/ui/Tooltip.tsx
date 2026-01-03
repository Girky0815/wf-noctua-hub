import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode; // Trigger element
  title: string;
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, title, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div className="relative inline-flex" ref={containerRef}>
      <div
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-pointer"
      >
        {children}
      </div>

      {isVisible && (
        <div
          className="absolute right-0 top-full mt-2 z-50 w-64 rounded-2xl p-4 shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 origin-top-right"
          style={{
            backgroundColor: 'var(--error-container)',
            color: 'var(--on-error-container)'
          }}
        >
          <h3 className="mb-1 text-lg font-bold font-display" style={{ color: 'inherit' }}>
            {title}
          </h3>
          <p className="text-sm opacity-90 leading-relaxed" style={{ color: 'inherit' }}>
            {content.split(/<br\s*\/?>/i).map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>
      )}
    </div>
  );
};
