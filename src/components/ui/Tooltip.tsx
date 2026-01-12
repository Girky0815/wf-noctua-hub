import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode; // Trigger element
  title: string;
  content: string;
  placement?: 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ children, title, content, placement = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

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

  // Adjust position to prevent overflow
  const [adjustedStyle, setAdjustedStyle] = useState<React.CSSProperties>({});

  React.useLayoutEffect(() => {
    if (isVisible && tooltipRef.current && containerRef.current) {
      const tooltip = tooltipRef.current;
      const rect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const styles: React.CSSProperties = {};

      // Reset transforms first to get accurate measurements if needed, 
      // but here we just check current rect vs viewport

      let offsetX = 0;

      // Check right overflow
      if (rect.right > viewportWidth - 16) { // 16px buffer
        offsetX = (viewportWidth - 16) - rect.right;
      }

      // Check left overflow
      if (rect.left < 16) { // 16px buffer
        offsetX = 16 - rect.left;
      }

      if (offsetX !== 0) {
        // Apply correction respecting the original placement
        // Since we can't easily change the class-based transform, we use margin-left
        // or specifically transform
        styles.transform = `translateX(${offsetX}px)`;
      }

      setAdjustedStyle(styles);
    } else {
      setAdjustedStyle({});
    }
  }, [isVisible]);

  const placementClasses = placement === 'left'
    ? 'left-0 origin-top-left'
    : 'right-0 origin-top-right';

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
          ref={tooltipRef}
          className={`absolute top-full mt-2 z-50 w-64 rounded-2xl p-4 shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 ${placementClasses}`}
          style={{
            backgroundColor: 'var(--error-container)',
            color: 'var(--on-error-container)',
            ...adjustedStyle
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
