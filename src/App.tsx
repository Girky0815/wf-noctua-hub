import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy loading components
// 各ページコンポーネントをオンデマンドで読み込むように変更
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then(module => ({ default: module.OnboardingPage })));
const FissuresPage = lazy(() => import('./pages/FissuresPage').then(module => ({ default: module.FissuresPage })));
const RelicSimulatorPage = lazy(() => import('./pages/RelicSimulatorPage').then(module => ({ default: module.RelicSimulatorPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const DashboardSettingsPage = lazy(() => import('./pages/DashboardSettingsPage').then(module => ({ default: module.DashboardSettingsPage })));
const WorldCycleCalibrationPage = lazy(() => import('./pages/WorldCycleCalibrationPage').then(module => ({ default: module.WorldCycleCalibrationPage })));
const LinksPage = lazy(() => import('./pages/LinksPage').then(module => ({ default: module.LinksPage })));
const ArchimedeaPage = lazy(() => import('./pages/ArchimedeaPage').then(module => ({ default: module.ArchimedeaPage })));
const ArchonHuntPage = lazy(() => import('./pages/ArchonHuntPage').then(module => ({ default: module.ArchonHuntPage })));
const CircuitPage = lazy(() => import('./pages/CircuitPage').then(module => ({ default: module.CircuitPage })));
// StatusPage (Dashboard) もLazy Load化して初期バンドルを削減
const StatusPage = lazy(() => import('./components/status/StatusPage').then(module => ({ default: module.StatusPage })));
const CreditsPage = lazy(() => import('./components/CreditsPage').then(module => ({ default: module.CreditsPage })));

import { Clock } from './components/Clock';
import { ScrollToTop } from './components/ScrollToTop';
import { SideMenu } from './components/navigation/SideMenu'; // シェルの一部として常駐するためEager Loadのまま
import { useWarframeData } from './hooks/useWarframeData';
import { UpdateNotificationModal } from './components/ui/UpdateNotificationModal';
import packageJson from '../package.json';

// ローディングインジケーター
const LoadingSpinner = () => (
  <div className="flex h-full min-h-[50vh] items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-surface-variant border-t-primary"></div>
  </div>
);

const NavBar = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) => `
    flex flex-1 flex-col items-center justify-center py-2 transition-colors gap-1
    ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}
  `;

  // Icon container style (Pill)
  const getIconContainerClass = ({ isActive }: { isActive: boolean }) => `
    flex items-center justify-center px-5 h-8 rounded-full transition-colors
    ${isActive ? 'bg-primary-container' : 'bg-transparent'}
  `;

  // Icon style
  const getIconStyle = ({ isActive }: { isActive: boolean }) => ({
    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-transparent bg-surface-container-highest pb-safe z-20">
      <div className="flex h-auto py-2 max-w-2xl mx-auto items-center">
        <NavLink to="/" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <div className={getIconContainerClass({ isActive })}>
                <span className="material-symbols-rounded text-2xl" style={getIconStyle({ isActive })}>dashboard</span>
              </div>
              <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>ダッシュボード</span>
            </>
          )}
        </NavLink>
        <NavLink to="/fissures" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <div className={getIconContainerClass({ isActive })}>
                <span className="material-symbols-rounded text-2xl" style={getIconStyle({ isActive })}>filter_drama</span>
              </div>
              <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>亀裂</span>
            </>
          )}
        </NavLink>
        <NavLink to="/relics" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <div className={getIconContainerClass({ isActive })}>
                <span className="material-symbols-rounded text-2xl" style={getIconStyle({ isActive })}>change_history</span>
              </div>
              <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>レリック</span>
            </>
          )}
        </NavLink>
        <NavLink to="/settings" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <div className={getIconContainerClass({ isActive })}>
                <span className="material-symbols-rounded text-2xl" style={getIconStyle({ isActive })}>settings</span>
              </div>
              <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>設定</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

// Hamburger Menu Button Component
// メニューが開いているときは 'menu_open' (閉じるようなアイコン)、閉じているときは 'menu' を表示
const HeaderMenuButton: React.FC<{ isOpen: boolean; toggle: () => void }> = ({ isOpen, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="p-2 -ml-2 rounded-full hover:bg-on-surface/10 transition-colors text-on-secondary-container z-50 relative" // z-50 to ensure clickable over drawer if needed (though drawer covers header usually, but button logic might vary)
      aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
    >
      <span className="material-symbols-rounded text-2xl">
        {isOpen ? 'menu_open' : 'menu'}
      </span>
    </button>
  );
};

const AppContent = () => {
  console.log('AppContent Rendered. Setup routes.');
  const { isFirstVisit, lastSeenVersion } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { worldState } = useWarframeData(); // Fetch worldState
  // Lazy initialize showUpdateModal based on current settings
  const [showUpdateModal, setShowUpdateModal] = useState(() => !isFirstVisit && lastSeenVersion !== packageJson.version);

  if (isFirstVisit) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <OnboardingPage />
      </Suspense>
    );
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      {showUpdateModal && (
        <UpdateNotificationModal onClose={() => setShowUpdateModal(false)} />
      )}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="min-h-screen bg-surface-container text-on-background pb-20">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-secondary-container p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <HeaderMenuButton isOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />
            <h1 className="text-xl font-display font-medium text-on-secondary-container">Noctua Hub</h1>
          </div>
          <Clock lastUpdated={worldState?.timestamp} />
        </header>
        <main className="mx-auto max-w-2xl p-4">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* PWA Direct Launch Redirect */}
              <Route path="index.html" element={<Navigate to="/" replace />} />
              <Route path="/" element={<StatusPage />} />
              <Route path="/fissures" element={<FissuresPage />} />
              <Route path="/relics" element={<RelicSimulatorPage />} />
              <Route path="/archimedea" element={<ArchimedeaPage />} />
              <Route path="/archon-hunt" element={<ArchonHuntPage />} />
              <Route path="/circuit" element={<CircuitPage />} />
              {/* /menu route removed */}
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/settings/dashboard" element={<DashboardSettingsPage />} />
              <Route path="/settings/calibration" element={<WorldCycleCalibrationPage />} />
              <Route path="/links" element={<LinksPage />} />
              <Route path="/credits" element={<CreditsPage />} />
            </Routes>
          </Suspense>
        </main>
        <NavBar />
      </div>
    </BrowserRouter>
  );
};

function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SettingsProvider>
  );
}

export default App;
