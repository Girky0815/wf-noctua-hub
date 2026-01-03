import { useEffect } from 'react';
import useSWR from 'swr';
import { APIClient } from '../api/client';
import type { WorldState } from '../types/warframe';

const REFRESH_INTERVAL = 30 * 1000; // 30 seconds

export const useWarframeData = () => {
  const { data, error, isLoading, mutate } = useSWR<WorldState>(
    '/', // Root endpoint returns the full world state
    APIClient.fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  // 時計の時刻基準 (00秒, 30秒) で再取得を行う
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextFetch = () => {
      const now = Date.now();
      // 次の「30秒区切り」までの時間を計算
      const delay = REFRESH_INTERVAL - (now % REFRESH_INTERVAL);

      timeoutId = setTimeout(() => {
        mutate();
        scheduleNextFetch();
      }, delay);
    };

    scheduleNextFetch();

    return () => clearTimeout(timeoutId);
  }, [mutate]);

  return {
    worldState: data,
    isLoading,
    isError: error,
  };
};

// 特定のデータへのアクセサを増やすことも可能
// 例: export const useAlerts = () => ...
