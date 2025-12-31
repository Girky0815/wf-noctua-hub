import React, { useRef } from 'react';
import { RelicSearchInput } from '../components/relics/RelicSearchInput';
import { RelicCard } from '../components/relics/RelicCard';
import { useRelicSearch } from '../hooks/useRelicSearch';

export const RelicSimulatorPage: React.FC = () => {
  const { searchRelics, results, loading, error } = useRelicSearch();
  // 検索実行ごとの結果表示用ラッパーRefが必要かどうかだが、hook内でstate管理されているので不要。

  const handleSearch = (query: string) => {
    searchRelics(query);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary tracking-tight">
          RELIC SIMULATOR
        </h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          レリックの中身とドロップ率を確認し、開封シミュレーションを行うことができます。<br />
          Vault保管中のレリックや、Prime Resurgenceで入手可能なレリックの状態も確認可能です。
        </p>
      </div>

      <RelicSearchInput onSearch={handleSearch} isLoading={loading} />

      {error && (
        <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 max-w-xl mx-auto">
          {error}
        </div>
      )}

      <div className="grid gap-4 max-w-3xl mx-auto">
        {results.length > 0 ? (
          results.map((relic) => (
            <RelicCard key={relic.uniqueName} relic={relic as any} />
            // Type assertion needed because RelicCard expects ExtendedRelicItem which is compatible but TS might complain about optional properties if strict
          ))
        ) : (
          !loading && (
            <div className="text-center text-on-surface-variant/40 py-12">
              検索結果が表示されます
            </div>
          )
        )}
      </div>
    </div>
  );
};
