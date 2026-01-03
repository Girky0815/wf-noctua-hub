import React, { useEffect, useState } from 'react';

interface StaleDataWarningProps {
  timestamp: string;
}

export const StaleDataWarning: React.FC<StaleDataWarningProps> = ({ timestamp }) => {
  const [diffMinutes, setDiffMinutes] = useState(0);

  useEffect(() => {
    const calculateDiff = () => {
      if (!timestamp) return;
      const dataTime = new Date(timestamp).getTime();
      const now = Date.now();
      const diff = Math.floor((now - dataTime) / (1000 * 60));
      setDiffMinutes(diff);
    };

    calculateDiff();
    const interval = setInterval(calculateDiff, 60000); // 1分ごとに更新

    return () => clearInterval(interval);
  }, [timestamp]);

  const isStale = diffMinutes > 30;

  if (!isStale) return null;

  const dataDate = new Date(timestamp);
  const hours = dataDate.getHours().toString().padStart(2, '0');
  const minutes = dataDate.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  return (
    <div className="flex items-start gap-3 rounded-2xl bg-error-container p-4 text-on-error-container animate-fade-in mb-6">
      <span className="material-symbols-rounded mt-0.5">warning</span>
      <div className="flex flex-col text-sm">
        <span className="font-bold text-lg mb-1">APIデータが更新されていません</span>
        <span className="opacity-90 leading-relaxed">
          Warframe Status API からのデータが <strong>{timeString} ({diffMinutes}分前)</strong> 以降更新がありません。<br />
          現在表示されている情報は、その時点でのデータに基づいています(ワールドサイクルは自動計算されています)。<br />
          APIのデータが更新されるまで、リアルタイムの情報は反映されません。
        </span>
      </div>
    </div>
  );
};
