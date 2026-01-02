import { useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { OnboardingPage } from './pages/OnboardingPage';
import { FissuresPage } from './pages/FissuresPage';
import { RelicSimulatorPage } from './pages/RelicSimulatorPage';
import { SettingsPage } from './pages/SettingsPage';
import { DashboardSettingsPage } from './pages/DashboardSettingsPage';
import { LinksPage } from './pages/LinksPage';
import { StatusPage } from './components/status/StatusPage';
import { Clock } from './components/Clock';
import { CreditsPage } from './components/CreditsPage';
import { ScrollToTop } from './components/ScrollToTop';
import { SideMenu } from './components/navigation/SideMenu'; // Import SideMenu component

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
  const { isFirstVisit } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isFirstVisit) {
    return <OnboardingPage />;
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="min-h-screen bg-surface-container text-on-background pb-20">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-secondary-container p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <HeaderMenuButton isOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />
            <h1 className="text-xl font-display font-medium text-on-secondary-container">Noctua Hub</h1>
          </div>
          <Clock />
        </header>
        <main className="mx-auto max-w-2xl p-4">
          <Routes>
            <Route path="/" element={<StatusPage />} />
            <Route path="/fissures" element={<FissuresPage />} />
            <Route path="/relics" element={<RelicSimulatorPage />} />
            {/* /menu route removed */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/dashboard" element={<DashboardSettingsPage />} />
            <Route path="/links" element={<LinksPage />} />
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
