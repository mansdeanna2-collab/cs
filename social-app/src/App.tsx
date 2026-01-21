import React, { useState } from 'react';
import './styles/global.css';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import PartyPage from './pages/PartyPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';

const EDITABLE_SELECTOR = '.editable-field';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    const { target } = event;
    if (!(target instanceof Element)) {
      event.preventDefault();
      return;
    }
    if (target.closest(EDITABLE_SELECTOR)) {
      return;
    }
    event.preventDefault();
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'party':
        return <PartyPage />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-container light-theme" onContextMenu={handleContextMenu}>
      {renderPage()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
