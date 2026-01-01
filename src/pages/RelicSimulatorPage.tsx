import React, { useRef } from 'react';
import { RelicSearchInput } from '../components/relics/RelicSearchInput';
import { RelicCard } from '../components/relics/RelicCard';
import { useRelicSearch } from '../hooks/useRelicSearch';

export const RelicSimulatorPage: React.FC = () => {
  const { searchRelics, results, loading, error, isWorldStateError } = useRelicSearch();
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
        <div className="max-w-xl mx-auto mb-8">
          <div className="flex items-start gap-3 rounded-2xl bg-error-container p-4 text-on-error-container">
            <span className="material-symbols-rounded mt-0.5">error</span>
            <div className="flex flex-col text-sm">
              <span className="font-bold text-lg mb-1">API 接続エラー</span>
              <span className="opacity-90">
                データの取得に失敗しました。<br />
                APIサーバーがダウンしている可能性があります。
              </span>
            </div>
          </div>
        </div>
      )}

      {/* WorldState API Error Warning (Partial Outage) */}
      {!error && isWorldStateError && (
        <div className="max-w-xl mx-auto mb-8 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3 rounded-2xl bg-tertiary-container p-4 text-on-tertiary-container">
            <span className="material-symbols-rounded mt-0.5">warning</span>
            <div className="flex flex-col text-sm">
              <span className="font-bold text-lg mb-1">一部データ取得不可</span>
              <span className="opacity-90">
                ワールドステータスAPIへの接続に失敗しました。<br />
                検索機能は利用可能ですが、<strong>Prime Resurgence (Varzia) の在庫状況が反映されない</strong>ため、
                実際には入手可能なレリックが「Vault保管中」と表示される場合があります。
              </span>
            </div>
          </div>
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
