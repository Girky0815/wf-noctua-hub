import React, { useEffect, useState } from 'react';

interface StaleDataWarningProps {
  timestamp: string;
}

export const StaleDataWarning: React.FC<StaleDataWarningProps> = ({ timestamp }) => {
  const [diffMinutes, setDiffMinutes] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const calculateDiff = () => {
      if (!timestamp) return;

      const now = Date.now();
      const dataTime = new Date(timestamp).getTime();
      const diff = Math.floor((now - dataTime) / (1000 * 60));
      setDiffMinutes(diff);

      // 次の「10秒区切り」までの時間を計算してセット (時計合わせ)
      // 例: 12:00:03 -> 7秒後に実行 -> 12:00:10
      const delay = 10000 - (now % 10000);
      timeoutId = setTimeout(calculateDiff, delay);
    };

    calculateDiff();

    return () => clearTimeout(timeoutId);
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
        <span className="font-bold text-lg mb-1">APIデータ更新なし ({diffMinutes}分)</span>
        <span className="opacity-90 leading-relaxed">
          Warframe Status API のデータが <strong>{timeString} ({diffMinutes}分前)</strong> 以降更新がありません。<br />
          現在表示されている情報は、その時点でのデータに基づいています。<br />
          現在、ワールドサイクルの一部または全部が自動計算されており、<br />サイクルが正しくない可能性があります(対象のサイクルには <span className="material-symbols-rounded text-[18px] mx-0.5" style={{ verticalAlign: 'text-bottom' }}>calculate</span> が表示されます)。<br />
          APIのデータが更新されるまで、リアルタイムの情報が表示できません。
        </span>
      </div>
    </div>
  );
};
