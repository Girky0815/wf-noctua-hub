import useSWR from 'swr';
import { APIClient } from '../api/client';
import type { WorldState } from '../types/warframe';

const REFRESH_INTERVAL = 60 * 1000; // 1 minute

export const useWarframeData = () => {
  const { data, error, isLoading } = useSWR<WorldState>(
    '/', // Root endpoint returns the full world state
    APIClient.fetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  return {
    worldState: data,
    isLoading,
    isError: error,
  };
};

// 特定のデータへのアクセサを増やすことも可能
// 例: export const useAlerts = () => ...
