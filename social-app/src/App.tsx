import React, { useState } from 'react';
import './styles/global.css';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import DarkWebPage from './pages/DarkWebPage';
import LivePage from './pages/LivePage';
import GamesPage from './pages/GamesPage';
import ProfilePage from './pages/ProfilePage';

const EDITABLE_SELECTOR = 'input, textarea, [contenteditable="true"]';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as Element | null;
    if (!target || target.closest(EDITABLE_SELECTOR)) {
      return;
    }
    event.preventDefault();
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'darkweb':
        return <DarkWebPage />;
      case 'live':
        return <LivePage />;
      case 'games':
        return <GamesPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-container dark-theme" onContextMenu={handleContextMenu}>
      {renderPage()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
