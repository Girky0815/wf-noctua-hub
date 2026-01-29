import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Global Error Boundary to prevent white screens on crash.
 * Provides a UI to reset application settings in case of corrupted local state.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-surface-container-high p-4 text-on-surface">
          <div className="w-full max-w-md rounded-2xl bg-surface-bright p-6 shadow-md border border-outline-variant">
            <h1 className="mb-4 text-2xl font-bold text-error">エラーが発生しました</h1>
            <p className="mb-6 text-sm text-on-surface-variant">
              予期せぬエラーによりアプリケーションをロードできませんでした。
              設定データの破損が原因の可能性があります。
            </p>
            <div className="mb-6 rounded bg-surface-container p-3 font-mono text-xs text-error">
              {this.state.error?.message}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full rounded-full bg-error px-4 py-3 text-sm font-bold text-on-error hover:shadow-lg active:scale-95 transition-all"
            >
              設定をリセットして再読み込み
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
