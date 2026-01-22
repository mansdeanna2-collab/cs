import React from 'react';
import './BottomNav.css';

interface NavItem {
  id: string;
  icon: string;
  activeIcon: string;
  label: string;
  badge?: number;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems: NavItem[] = [
  { id: 'home', icon: '🏠', activeIcon: '🏡', label: '首页' },
  { id: 'party', icon: '🎉', activeIcon: '🎊', label: '派对' },
  { id: 'messages', icon: '💬', activeIcon: '💭', label: '消息', badge: 5 },
  { id: 'profile', icon: '👤', activeIcon: '👨', label: '我的' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => onTabChange(item.id)}
        >
          <span className="nav-icon">
            {activeTab === item.id ? item.activeIcon : item.icon}
            {item.badge && item.badge > 0 && (
              <span className="nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
            )}
          </span>
          <span className="nav-label">{item.label}</span>
          {activeTab === item.id && <span className="nav-indicator" />}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
