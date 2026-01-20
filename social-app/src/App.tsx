import React, { useState } from 'react';
import './styles/global.css';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import PartyPage from './pages/PartyPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import useTheme from './hooks/useTheme';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { theme } = useTheme();

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
    <div className={`app-container ${theme === 'light' ? 'light-theme' : 'dark-theme'}`}>
      {renderPage()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
