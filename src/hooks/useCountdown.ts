import { useState, useEffect } from 'react';

/**
 * 目標時刻までの残り時間を計算し、フォーマットされた文字列を返すフック
 * @param targetDate ISO 8601 形式または Date オブジェクト
 * @returns 残り時間文字列 (例: "1h 23m 45s", "45s", "終了")
 */
export const useCountdown = (targetDate?: string | Date) => {
  const calculateTimeLeft = (target?: string | Date) => {
    if (!target) return '';
    const nowLocal = new Date().getTime();
    const targetLocal = new Date(target).getTime();
    const difference = targetLocal - nowLocal;

    if (difference <= 0) return '終了';

    const totalHours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    // const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    // const minutes = (difference % (1000 * 60 * 60)) / (1000 * 60); // need floor inside format
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // 72時間以上: 日数だけ (d日)
    if (totalHours >= 72) return `${days}日`;

    // 24時間以上 72時間未満: 時間だけ (hh時間)
    if (totalHours >= 24) return `${totalHours}時間`;

    // 1時間以上 24時間未満: 時間と分 (hh時間mm分)
    if (totalHours >= 1) return `${totalHours}時間${minutes.toString().padStart(2, '0')}分`;

    // 1時間未満: 分と秒 (mm分ss秒)
    return `${minutes.toString().padStart(2, '0')}分${seconds.toString().padStart(2, '0')}秒`;
  };

  const [timeLeft, setTimeLeft] = useState<string>(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    // Immediate update on changes
    setTimeLeft(calculateTimeLeft(targetDate));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};
