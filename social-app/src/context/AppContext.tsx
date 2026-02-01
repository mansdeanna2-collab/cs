/**
 * AppContext - 应用全局状态上下文 (Application Global State Context)
 * =================================================================
 * 管理应用级别的全局状态，如主题、语言、导航等
 * Manages application-level global state like theme, language, navigation, etc.
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo, ReactNode } from 'react';
import { TabIdType, TabId } from '../types';

// ==================== 状态类型定义 (State Type Definitions) ====================

/**
 * 主题类型 (Theme Type)
 */
export type ThemeType = 'dark' | 'light';

/**
 * 语言类型 (Language Type)
 */
export type LanguageType = 'zh-CN' | 'en-US';

/**
 * 应用状态接口 (App State Interface)
 */
export interface AppState {
  /** 当前主题 (Current theme) */
  theme: ThemeType;
  /** 当前语言 (Current language) */
  language: LanguageType;
  /** 当前导航标签 (Current navigation tab) */
  activeTab: TabIdType;
  /** 是否显示加载遮罩 (Show loading overlay) */
  isGlobalLoading: boolean;
  /** 全局加载消息 (Global loading message) */
  loadingMessage: string;
  /** 网络状态 (Network status) */
  isOnline: boolean;
  /** 侧边栏是否打开 (Sidebar open) */
  isSidebarOpen: boolean;
}

// ==================== Action 类型定义 (Action Type Definitions) ====================

/**
 * 应用 Action 类型 (App Action Types)
 */
export type AppAction =
  | { type: 'SET_THEME'; payload: ThemeType }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LANGUAGE'; payload: LanguageType }
  | { type: 'SET_ACTIVE_TAB'; payload: TabIdType }
  | { type: 'SET_GLOBAL_LOADING'; payload: { isLoading: boolean; message?: string } }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'RESET_STATE' };

// ==================== 初始状态 (Initial State) ====================

const initialState: AppState = {
  theme: 'dark',
  language: 'zh-CN',
  activeTab: TabId.HOME,
  isGlobalLoading: false,
  loadingMessage: '',
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSidebarOpen: false,
};

// ==================== Reducer (Reducer) ====================

/**
 * 应用状态 Reducer (App State Reducer)
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };

    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };

    case 'SET_GLOBAL_LOADING':
      return {
        ...state,
        isGlobalLoading: action.payload.isLoading,
        loadingMessage: action.payload.message || '',
      };

    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };

    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };

    case 'RESET_STATE':
      return { ...initialState, theme: state.theme, language: state.language };

    default:
      return state;
  }
}

// ==================== Context 创建 (Context Creation) ====================

/**
 * 状态 Context (State Context)
 */
const AppStateContext = createContext<AppState | undefined>(undefined);

/**
 * Dispatch Context (Dispatch Context)
 */
const AppDispatchContext = createContext<React.Dispatch<AppAction> | undefined>(undefined);

/**
 * Actions Context (Actions Context)
 */
interface AppActions {
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  setLanguage: (language: LanguageType) => void;
  setActiveTab: (tab: TabIdType) => void;
  showGlobalLoading: (message?: string) => void;
  hideGlobalLoading: () => void;
  setOnlineStatus: (isOnline: boolean) => void;
  toggleSidebar: () => void;
  resetState: () => void;
}

const AppActionsContext = createContext<AppActions | undefined>(undefined);

// ==================== Provider 组件 (Provider Component) ====================

interface AppProviderProps {
  children: ReactNode;
  initialTheme?: ThemeType;
  initialLanguage?: LanguageType;
}

/**
 * AppProvider - 应用状态提供者 (App State Provider)
 */
export function AppProvider({
  children,
  initialTheme,
  initialLanguage,
}: AppProviderProps): React.JSX.Element {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    theme: initialTheme || initialState.theme,
    language: initialLanguage || initialState.language,
  });

  // 封装的 Actions (Wrapped Actions)
  const actions = useMemo<AppActions>(() => ({
    setTheme: (theme: ThemeType) => dispatch({ type: 'SET_THEME', payload: theme }),
    toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
    setLanguage: (language: LanguageType) => dispatch({ type: 'SET_LANGUAGE', payload: language }),
    setActiveTab: (tab: TabIdType) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }),
    showGlobalLoading: (message?: string) =>
      dispatch({ type: 'SET_GLOBAL_LOADING', payload: { isLoading: true, message } }),
    hideGlobalLoading: () =>
      dispatch({ type: 'SET_GLOBAL_LOADING', payload: { isLoading: false } }),
    setOnlineStatus: (isOnline: boolean) =>
      dispatch({ type: 'SET_ONLINE_STATUS', payload: isOnline }),
    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    resetState: () => dispatch({ type: 'RESET_STATE' }),
  }), []);

  // 监听网络状态变化 (Listen for network status changes)
  React.useEffect(() => {
    const handleOnline = () => actions.setOnlineStatus(true);
    const handleOffline = () => actions.setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [actions]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        <AppActionsContext.Provider value={actions}>
          {children}
        </AppActionsContext.Provider>
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// ==================== 自定义 Hooks (Custom Hooks) ====================

/**
 * useAppState - 获取应用状态 (Get app state)
 * @throws 如果不在 AppProvider 内使用会抛出错误 (Throws if not within AppProvider)
 */
export function useAppState(): AppState {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}

/**
 * useAppDispatch - 获取 dispatch 函数 (Get dispatch function)
 * @throws 如果不在 AppProvider 内使用会抛出错误 (Throws if not within AppProvider)
 */
export function useAppDispatch(): React.Dispatch<AppAction> {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
}

/**
 * useAppActions - 获取封装好的 actions (Get wrapped actions)
 * @throws 如果不在 AppProvider 内使用会抛出错误 (Throws if not within AppProvider)
 */
export function useAppActions(): AppActions {
  const context = useContext(AppActionsContext);
  if (context === undefined) {
    throw new Error('useAppActions must be used within an AppProvider');
  }
  return context;
}

/**
 * useApp - 获取状态和 actions 的组合 (Get combined state and actions)
 */
export function useApp(): AppState & AppActions {
  const state = useAppState();
  const actions = useAppActions();
  return { ...state, ...actions };
}

/**
 * useNavigation - 导航相关的便捷 Hook (Navigation convenience hook)
 */
export function useNavigation(): {
  activeTab: TabIdType;
  setActiveTab: (tab: TabIdType) => void;
  navigateTo: (tab: TabIdType) => void;
} {
  const { activeTab } = useAppState();
  const { setActiveTab } = useAppActions();

  const navigateTo = useCallback(
    (tab: TabIdType) => {
      setActiveTab(tab);
    },
    [setActiveTab]
  );

  return { activeTab, setActiveTab, navigateTo };
}

export default AppProvider;
