import React, { useState, useEffect } from 'react';

interface RelicSearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const RelicSearchInput: React.FC<RelicSearchInputProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  // デバウンス処理
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="レリック名を入力 (例: Lith G1)"
          className="w-full px-4 py-3 bg-surface-container-highest border border-outline/10 rounded-lg 
                   text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary
                   transition-all duration-300"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
