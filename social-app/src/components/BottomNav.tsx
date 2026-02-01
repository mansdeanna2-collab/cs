import React, { memo, useCallback } from 'react';
import { TabIdType, TabId, NavItem } from '../types';
import './BottomNav.css';

/**
 * BottomNav Props
 */
interface BottomNavProps {
  activeTab: TabIdType;
  onTabChange: (tab: TabIdType) => void;
}

/**
 * 导航项配置 (Navigation items configuration)
 */
const navItems: NavItem[] = [
  { id: TabId.HOME, icon: '🏠', activeIcon: '🏡', label: '首页' },
  { id: TabId.DARKWEB, icon: '🌐', activeIcon: '🌍', label: '暗网' },
  { id: TabId.LIVE, icon: '📺', activeIcon: '📡', label: '直播' },
  { id: TabId.GAMES, icon: '🎮', activeIcon: '🕹️', label: '游戏' },
  { id: TabId.PROFILE, icon: '👤', activeIcon: '👨', label: '我的' },
];

/**
 * BottomNav - 底部导航组件 (Bottom Navigation Component)
 * 使用 memo 优化渲染性能
 */
const BottomNav = memo<BottomNavProps>(({ activeTab, onTabChange }) => {
  /**
   * 处理导航项点击 (Handle nav item click)
   */
  const handleNavClick = useCallback(
    (itemId: TabIdType) => {
      onTabChange(itemId);
    },
    [onTabChange]
  );

  return (
    <nav className="bottom-nav" role="navigation" aria-label="主导航">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.label}
          >
            <span className="nav-icon">
              {isActive ? item.activeIcon : item.icon}
              {item.badge && item.badge > 0 && (
                <span className="nav-badge" aria-label={`${item.badge} 条通知`}>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </span>
            <span className="nav-label">{item.label}</span>
            {isActive && <span className="nav-indicator" aria-hidden="true" />}
          </button>
        );
      })}
    </nav>
  );
});

BottomNav.displayName = 'BottomNav';

export default BottomNav;
