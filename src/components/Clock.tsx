import React, { useEffect, useState } from 'react';
interface ClockProps {
  lastUpdated?: string;
}

export const Clock: React.FC<ClockProps> = ({ lastUpdated }) => {
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

  const formattedLastUpdated = lastUpdated
    ? new Intl.DateTimeFormat('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date(lastUpdated))
    : null;

  return (
    <div className="flex flex-col items-end">
      <div
        className="font-display text-2xl font-bold text-on-secondary-container"
        style={{
          fontVariationSettings: "'ROND' 100, 'wdth' 75",
          fontFeatureSettings: "'tnum'",
          letterSpacing: '0.05em'
        }}
      >
        {timeString}
      </div>
      {formattedLastUpdated && (
        <div className="text-xs text-on-surface-variant font-medium opacity-80 mt-[-2px]">
          APIデータ更新時刻: {formattedLastUpdated}
        </div>
      )}
    </div>
  );
};
