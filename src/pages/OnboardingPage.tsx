import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { ThemeSelector } from '../components/ThemeSelector';

export const OnboardingPage: React.FC = () => {
  const { completeOnboarding } = useSettings();
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4 text-on-background">
      <div className="w-full max-w-lg rounded-3xl bg-surface-container p-8 shadow-lg">
        {/* Step Indicator */}
        <div className="mb-8 flex justify-center gap-2">
          <div className={`h-2 w-16 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-surface-variant'}`} />
          <div className={`h-2 w-16 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-surface-variant'}`} />
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="mb-6 text-center font-display text-3xl font-bold text-on-surface">
              Noctua Hub へようこそ
            </h1>
            <p className="mb-8 text-center text-sm text-on-surface">
              テンノのテンノによるテンノのための Warframe 情報アプリ
            </p>

            <div className="mb-8 space-y-4 rounded-xl bg-surface-container-high p-6 text-sm text-on-surface">
              <p className="font-bold text-xl text-error">【免責事項】</p>
              <ul className="list-disc space-y-2 pl-4">
                <li><span className="text-error">本アプリは Warframe 公式アプリではありません</span>。Digital Extremes Ltd. とは提携・関係していません。</li>
                <li>本アプリは完全無料・広告無しでご利用いただけます。</li>
                <li>利用しているAPI の状況により、機能が一時的に利用できなくなる可能性があります<span className="text-error">(APIがダウンすると機能が使えません)</span>。</li>
                <li>本アプリの使用によって生じたいかなる損害についても、作者は責任を負いません。</li>
                <li>本アプリの開発は Gemini 3 Pro + Google Antigravity を用いて開発しています。<br />アプリの動作は作者も一通り確認していますが、予期せぬバグが含まれる可能性があります。</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-on-primary transition-colors hover:bg-primary/90"
              >
                同意して次へ
                <span className="material-symbols-rounded">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="mb-2 text-center font-display text-2xl font-bold text-on-surface">
              テーマの設定
            </h1>
            <p className="mb-8 text-center text-sm text-on-surface-variant">
              後からいつでも設定画面で変更可能です。
            </p>

            <div className="mb-10">
              <ThemeSelector />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-on-surface-variant hover:text-on-surface hover:underline"
              >
                戻る
              </button>
              <button
                onClick={completeOnboarding}
                className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-bold text-on-primary transition-colors hover:bg-primary/90 shadow-md"
              >
                スタート
                <span className="material-symbols-rounded">check</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
