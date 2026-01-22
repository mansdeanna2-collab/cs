import React from 'react';
import './BottomNav.css';

interface NavItem {
  id: string;
  icon: string;
  activeIcon: string;
  label: string;
  badge?: number;
  isPostButton?: boolean;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems: NavItem[] = [
  { id: 'home', icon: '🏠', activeIcon: '🏡', label: '首页' },
  { id: 'party', icon: '🎉', activeIcon: '🎊', label: '派对' },
  { id: 'post', icon: '✏️', activeIcon: '✏️', label: '发帖', isPostButton: true },
  { id: 'messages', icon: '💬', activeIcon: '💭', label: '消息', badge: 3 },
  { id: 'profile', icon: '👤', activeIcon: '👨', label: '我的' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''} ${item.isPostButton ? 'post-button' : ''}`}
          onClick={() => onTabChange(item.id)}
        >
          <span className={`nav-icon ${item.isPostButton ? 'post-icon' : ''}`}>
            {activeTab === item.id ? item.activeIcon : item.icon}
            {item.badge && item.badge > 0 && (
              <span className="nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
            )}
          </span>
          {!item.isPostButton && <span className="nav-label">{item.label}</span>}
          {activeTab === item.id && !item.isPostButton && <span className="nav-indicator" />}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
