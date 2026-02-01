/**
 * 全局类型定义 (Global Type Definitions)
 * =====================================
 * 集中管理应用中使用的类型定义
 * Centralized type definitions for the application
 */

// ==================== 导航相关类型 (Navigation Types) ====================

/**
 * 导航标签ID枚举 (Navigation Tab ID Enum)
 */
export const TabId = {
  HOME: 'home',
  DARKWEB: 'darkweb',
  LIVE: 'live',
  GAMES: 'games',
  PROFILE: 'profile',
} as const;

export type TabIdType = typeof TabId[keyof typeof TabId];

/**
 * 导航项接口 (Navigation Item Interface)
 */
export interface NavItem {
  id: TabIdType;
  icon: string;
  activeIcon: string;
  label: string;
  badge?: number;
}

// ==================== API相关类型 (API Types) ====================

/**
 * API请求状态枚举 (API Request Status Enum)
 */
export const RequestStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type RequestStatusType = typeof RequestStatus[keyof typeof RequestStatus];

/**
 * API响应结果类型 - 使用判别联合类型 (API Result Type - Discriminated Union)
 */
export type ApiResult<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: AppError };

/**
 * 应用错误接口 (Application Error Interface)
 */
export interface AppError {
  code: ErrorCodeType;
  message: string;
  status?: number;
  url?: string;
  retryable: boolean;
  timestamp: number;
}

/**
 * 错误代码枚举 (Error Code Enum)
 */
export const ErrorCode = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];

/**
 * 分页参数接口 (Pagination Parameters Interface)
 */
export interface PaginationParams {
  limit: number;
  offset: number;
}

/**
 * 分页响应接口 (Paginated Response Interface)
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  hasMore: boolean;
  page: number;
  pageSize: number;
}

// ==================== 视频相关类型 (Video Types) ====================

/**
 * 视频接口 (Video Interface)
 */
export interface Video {
  id: number;
  title: string;
  thumbnail: string;
  description?: string;
  category: string;
  play_count: number;
  duration?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * 显示用视频接口 (Display Video Interface)
 */
export interface DisplayVideo {
  id: number;
  title: string;
  thumbnail: string;
  views: string;
  duration: string;
}

/**
 * 视频分类接口 (Video Category Interface)
 */
export interface VideoCategory {
  id: number;
  name: string;
  videos: DisplayVideo[];
}

/**
 * 分类接口 (Category Interface)
 */
export interface Category {
  id: number;
  name: string;
  video_count: number;
}

// ==================== 用户相关类型 (User Types) ====================

/**
 * 用户接口 (User Interface)
 */
export interface User {
  id: number;
  name: string;
  avatar: string;
  level: number;
  vipLevel: number;
  signature: string;
  location: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

/**
 * 用户统计接口 (User Stats Interface)
 */
export interface UserStats {
  following: number;
  followers: number;
  likes: number;
  coins: number;
}

/**
 * 成就接口 (Achievement Interface)
 */
export interface Achievement {
  id: number;
  icon: string;
  name: string;
  desc: string;
  unlocked: boolean;
}

// ==================== 直播相关类型 (Live Stream Types) ====================

/**
 * 直播流接口 (Live Stream Interface)
 */
export interface LiveStream {
  id: number;
  title: string;
  streamer: string;
  avatar: string;
  viewers: string;
  thumbnail: string;
  isLive: boolean;
}

// ==================== 游戏相关类型 (Game Types) ====================

/**
 * 游戏接口 (Game Interface)
 */
export interface Game {
  id: number;
  name: string;
  icon: string;
  players: string;
  category: string;
  isHot?: boolean;
  isNew?: boolean;
}

// ==================== 通用工具类型 (Utility Types) ====================

/**
 * 可选字段 (Partial fields)
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * 异步操作状态 (Async Operation State)
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
}

/**
 * 操作回调 (Action Callback)
 */
export type ActionCallback<T = void> = () => T | Promise<T>;

/**
 * 事件处理器 (Event Handler)
 */
export type EventHandler<E = React.SyntheticEvent> = (event: E) => void;
