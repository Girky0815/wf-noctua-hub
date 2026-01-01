import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { OnboardingPage } from './pages/OnboardingPage';
import { FissuresPage } from './pages/FissuresPage';
import { RelicSimulatorPage } from './pages/RelicSimulatorPage';
import { StatusPage } from './components/status/StatusPage';
import { Clock } from './components/Clock';
import { SettingsPage } from './components/settings/SettingsPage';
import { CreditsPage } from './components/CreditsPage';
import { ScrollToTop } from './components/ScrollToTop';

const NavBar = () => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) => `
    flex flex-1 flex-col items-center justify-center py-2 transition-colors
    ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}
  `;

  const getIconClass = ({ isActive }: { isActive: boolean }) => `
    material-symbols-rounded mb-1 text-2xl px-5 py-1 rounded-full transition-colors
    ${isActive ? 'bg-secondary-container text-on-secondary-container' : ''}
  `;

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-outline-variant bg-surface-container-low pb-safe">
      <div className="flex h-16 max-w-2xl mx-auto">
        <NavLink to="/" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <span className={getIconClass({ isActive })}>dashboard</span>
              <span className="text-xs font-medium">ステータス</span>
            </>
          )}
        </NavLink>
        <NavLink to="/fissures" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <span className={getIconClass({ isActive })}>filter_drama</span>
              <span className="text-xs font-medium">亀裂</span>
            </>
          )}
        </NavLink>
        <NavLink to="/relics" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <span className={getIconClass({ isActive })}>change_history</span>
              <span className="text-xs font-medium">レリック</span>
            </>
          )}
        </NavLink>
        <NavLink to="/settings" className={getLinkClass}>
          {({ isActive }) => (
            <>
              <span className={getIconClass({ isActive })}>settings</span>
              <span className="text-xs font-medium">設定</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

const AppContent = () => {
  const { isFirstVisit } = useSettings();

  if (isFirstVisit) {
    return <OnboardingPage />;
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <div className="min-h-screen bg-surface-container text-on-background pb-20">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-secondary-container p-4 shadow-sm">
          <h1 className="text-xl font-display font-medium text-on-secondary-container">Noctua Hub</h1>
          <Clock />
        </header>
        <main className="mx-auto max-w-2xl p-4">
          <Routes>
            <Route path="/" element={<StatusPage />} />
            <Route path="/fissures" element={<FissuresPage />} />
            <Route path="/relics" element={<RelicSimulatorPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/credits" element={<CreditsPage />} />
          </Routes>
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
