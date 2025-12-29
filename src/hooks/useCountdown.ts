import { useState, useEffect } from 'react';

/**
 * 目標時刻までの残り時間を計算し、フォーマットされた文字列を返すフック
 * @param targetDate ISO 8601 形式または Date オブジェクト
 * @returns 残り時間文字列 (例: "1h 23m 45s", "45s", "終了")
 */
export const useCountdown = (targetDate?: string | Date) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft('');
      return;
    }

    const target = new Date(targetDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft('終了');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // 1日以上: "1d 2h" (秒は表示しない)
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
        return;
      }

      // 1時間以上: "1時間23分" (秒を省略して表示ブレを防ぐ)
      if (hours > 0) {
        setTimeLeft(`${hours}時間${minutes.toString().padStart(2, '0')}分`);
        return;
      }

      // 1時間未満: "05分30秒" (パディングありで固定幅)
      setTimeLeft(`${minutes.toString().padStart(2, '0')}分${seconds.toString().padStart(2, '0')}秒`);
    };

    calculate(); // 初回実行
    const timer = setInterval(calculate, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};
