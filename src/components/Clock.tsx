import React, { useEffect, useState } from 'react';
export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(time);

  return (
    <div
      className="font-display text-lg font-bold text-on-secondary-container"
      style={{
        fontVariationSettings: "'ROND' 100, 'wdth' 75",
        fontFeatureSettings: "'tnum'",
        letterSpacing: '0.05em'
      }}
    >
      {timeString}
    </div>
  );
};
