import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

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
  // Instead of complex transforms, we'll determine "effective placement" (left or right aligned)
  const [effectivePlacement, setEffectivePlacement] = useState<'left' | 'right'>(placement);

  useLayoutEffect(() => {
    if (isVisible && tooltipRef.current && containerRef.current) {
      const tooltip = tooltipRef.current;
      const rect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Reset to default placement first to measure?
      // Actually, if we are 'left' (left-0), we check right overflow.
      // If we are 'right' (right-0), we check left overflow.

      if (placement === 'left') {
        // Aligned to left edge. Check if right edge overflows.
        if (rect.right > viewportWidth - 16) {
          // Overflowing right -> Flip to Right aligned (expands to left)
          setEffectivePlacement('right');
        } else {
          setEffectivePlacement('left');
        }
      } else {
        // Aligned to right edge. Check if left edge overflows (goes off-screen left).
        if (rect.left < 16) {
          // Overflowing left -> Flip to Left aligned (expands to right)
          setEffectivePlacement('left');
        } else {
          setEffectivePlacement('right');
        }
      }
    } else {
      // Reset when hidden
      setEffectivePlacement(placement);
    }
  }, [isVisible, placement]);

  const placementClasses = effectivePlacement === 'left'
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
          className={`absolute top-full mt-2 z-50 w-64 rounded-2xl p-4 shadow-lg ring-1 ring-black/5 animate-in fade-in duration-200 ${placementClasses}`}
          style={{
            backgroundColor: 'var(--error-container)',
            color: 'var(--on-error-container)',
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
