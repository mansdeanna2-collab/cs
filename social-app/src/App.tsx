import React, { useCallback, useMemo } from 'react';
import './styles/global.css';
import { AppProvider, useApp, ErrorBoundary } from './context';
import { TabId, TabIdType } from './types';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import DarkWebPage from './pages/DarkWebPage';
import LivePage from './pages/LivePage';
import GamesPage from './pages/GamesPage';
import ProfilePage from './pages/ProfilePage';

/**
 * 可编辑元素选择器 (Editable elements selector)
 */
const EDITABLE_SELECTOR = 'input, textarea, [contenteditable="true"]';

/**
 * 页面组件映射 (Page component mapping)
 */
const PAGE_COMPONENTS: Record<TabIdType, React.ComponentType> = {
  [TabId.HOME]: HomePage,
  [TabId.DARKWEB]: DarkWebPage,
  [TabId.LIVE]: LivePage,
  [TabId.GAMES]: GamesPage,
  [TabId.PROFILE]: ProfilePage,
};

/**
 * AppContent - 应用内容组件 (App Content Component)
 * 使用 Context 管理导航状态
 */
function AppContent(): React.JSX.Element {
  const { activeTab, setActiveTab, theme } = useApp();

  /**
   * 处理右键菜单 (Handle context menu)
   */
  const handleContextMenu = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as Element | null;
    if (!target || target.closest(EDITABLE_SELECTOR)) {
      return;
    }
    event.preventDefault();
  }, []);

  /**
   * 渲染当前页面 (Render current page)
   */
  const CurrentPage = useMemo(() => {
    return PAGE_COMPONENTS[activeTab] || HomePage;
  }, [activeTab]);

  /**
   * 容器类名 (Container class name)
   */
  const containerClassName = useMemo(() => {
    return `app-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`;
  }, [theme]);

  return (
    <div className={containerClassName} onContextMenu={handleContextMenu}>
      <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
        <CurrentPage />
      </ErrorBoundary>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

/**
 * App - 应用根组件 (App Root Component)
 * 提供全局 Context 和错误边界
 */
function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <AppProvider initialTheme="dark" initialLanguage="zh-CN">
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
