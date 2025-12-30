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

      const totalHours = Math.floor(difference / (1000 * 60 * 60));
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // 72時間以上: 日数だけ (d日)
      if (totalHours >= 72) {
        setTimeLeft(`${days}日`);
        return;
      }

      // 24時間以上 72時間未満: 時間だけ (hh時間)
      if (totalHours >= 24) {
        setTimeLeft(`${totalHours}時間`);
        return;
      }

      // 1時間以上 24時間未満: 時間と分 (hh時間mm分)
      if (totalHours >= 1) {
        setTimeLeft(`${totalHours}時間${minutes.toString().padStart(2, '0')}分`);
        return;
      }

      // 1時間未満: 分と秒 (mm分ss秒)
      setTimeLeft(`${minutes.toString().padStart(2, '0')}分${seconds.toString().padStart(2, '0')}秒`);
    };

    calculate(); // 初回実行
    const timer = setInterval(calculate, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};
