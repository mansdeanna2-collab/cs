/**
 * API服务模块 (API Service Module)
 * =================================
 * 提供与后端API服务器通信的功能
 * Provides communication with the backend API server
 * 
 * API地址由 eov 文件统一管理
 * API address is centrally managed by eov file
 */

import { getApiBaseUrl as getEovApiBaseUrl, getApiTimeout } from '../config/eov';

// API响应格式接口 (API Response Format Interface)
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 视频接口 (Video Interface)
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

// 分类接口 (Category Interface)
export interface Category {
  id: number;
  name: string;
  video_count: number;
}

// 统计信息接口 (Statistics Interface)
export interface Statistics {
  total_videos: number;
  total_categories: number;
  total_play_count: number;
}

// API配置 (API Configuration)
// API地址由 eov 文件统一管理，修改 eov 文件即可更新所有API请求地址
// API address is centrally managed by eov file, modify eov file to update all API request addresses
export const API_BASE_URL = getEovApiBaseUrl();

// API超时时间 (API Timeout)
export const API_TIMEOUT = getApiTimeout();

/**
 * 自定义API错误类 (Custom API Error Class)
 * 提供更详细的错误信息用于调试和用户提示
 */
export class ApiError extends Error {
  public code: string;
  public status?: number;
  public url?: string;

  constructor(message: string, code: string, status?: number, url?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.url = url;
  }
}

/**
 * 错误代码常量 (Error Code Constants)
 */
export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * 获取用户友好的错误消息 (Get user-friendly error message)
 * Bilingual messages: Chinese / English
 */
function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    [ErrorCodes.NETWORK_ERROR]: '网络连接失败 / Network connection failed',
    [ErrorCodes.TIMEOUT_ERROR]: '请求超时 / Request timeout',
    [ErrorCodes.SERVER_ERROR]: '服务器错误 / Server error',
    [ErrorCodes.PARSE_ERROR]: '数据解析失败 / Data parse error',
    [ErrorCodes.UNKNOWN_ERROR]: '未知错误 / Unknown error',
  };
  return messages[code] || messages[ErrorCodes.UNKNOWN_ERROR];
}

/**
 * 通用API请求函数 (Generic API Request Function)
 * @param endpoint - API端点路径 (API endpoint path)
 * @param options - fetch选项 (fetch options)
 * @returns API响应数据 (API response data)
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 创建 AbortController 用于超时控制 (Create AbortController for timeout control)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
    // 添加 mode 和 credentials 配置以支持跨域请求
    // Add mode and credentials configuration to support cross-origin requests
    mode: 'cors',
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    console.log(`[API] 请求 (Request): ${url}`);
    const response = await fetch(url, mergedOptions);
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // 无法解析错误响应，使用默认消息 (Cannot parse error response, use default message)
        console.warn('[API] Failed to parse error response:', parseError);
      }
      console.error(`[API] 服务器错误 (Server error): ${response.status} - ${errorMessage}`);
      throw new ApiError(
        errorMessage,
        ErrorCodes.SERVER_ERROR,
        response.status,
        url
      );
    }

    const data = await response.json();
    
    // 验证API响应格式 - 确保返回的是对象或数组
    // Validate API response format - ensure it's an object or array
    if (data === null || (typeof data !== 'object')) {
      throw new ApiError(
        '无效的API响应格式 / Invalid API response format',
        ErrorCodes.PARSE_ERROR,
        response.status,
        url
      );
    }

    console.log(`[API] 成功 (Success): ${url}`);
    return data as ApiResponse<T>;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // 处理不同类型的错误 (Handle different types of errors)
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      // 超时错误 (Timeout error)
      if (error.name === 'AbortError') {
        console.error(`[API] 请求超时 (Request timeout): ${url}`);
        throw new ApiError(
          getErrorMessage(ErrorCodes.TIMEOUT_ERROR),
          ErrorCodes.TIMEOUT_ERROR,
          undefined,
          url
        );
      }
      
      // 网络错误 (Network error) - 包括 CORS 错误、连接拒绝等
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        console.error(`[API] 网络错误 (Network error): ${url}`, error.message);
        throw new ApiError(
          getErrorMessage(ErrorCodes.NETWORK_ERROR),
          ErrorCodes.NETWORK_ERROR,
          undefined,
          url
        );
      }
    }
    
    // 未知错误 (Unknown error)
    console.error(`[API] 未知错误 (Unknown error): ${url}`, error);
    throw new ApiError(
      getErrorMessage(ErrorCodes.UNKNOWN_ERROR),
      ErrorCodes.UNKNOWN_ERROR,
      undefined,
      url
    );
  }
}

// ==================== 视频相关API (Video APIs) ====================

/**
 * 获取视频列表 (Get video list)
 * @param limit - 返回数量 (默认20) (Return count, default 20)
 * @param offset - 偏移量 (默认0) (Offset, default 0)
 */
export async function getVideos(
  limit: number = 20,
  offset: number = 0
): Promise<Video[]> {
  const response = await apiRequest<Video[]>(
    `/api/videos?limit=${limit}&offset=${offset}`
  );
  return response.data;
}

/**
 * 获取单个视频详情 (Get single video details)
 * @param videoId - 视频ID (Video ID)
 */
export async function getVideo(videoId: number): Promise<Video | null> {
  try {
    const response = await apiRequest<Video>(`/api/videos/${videoId}`);
    return response.data;
  } catch {
    return null;
  }
}

/**
 * 搜索视频 (Search videos)
 * @param keyword - 搜索关键词 (Search keyword)
 * @param limit - 返回数量 (默认20) (Return count, default 20)
 * @param offset - 偏移量 (默认0) (Offset, default 0)
 */
export async function searchVideos(
  keyword: string,
  limit: number = 20,
  offset: number = 0
): Promise<Video[]> {
  const response = await apiRequest<Video[]>(
    `/api/videos/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}&offset=${offset}`
  );
  return response.data;
}

/**
 * 按分类获取视频 (Get videos by category)
 * @param category - 分类名称 (Category name)
 * @param limit - 返回数量 (默认20) (Return count, default 20)
 * @param offset - 偏移量 (默认0) (Offset, default 0)
 */
export async function getVideosByCategory(
  category: string,
  limit: number = 20,
  offset: number = 0
): Promise<Video[]> {
  const response = await apiRequest<Video[]>(
    `/api/videos/category?category=${encodeURIComponent(category)}&limit=${limit}&offset=${offset}`
  );
  return response.data;
}

/**
 * 获取热门视频 (Get top videos)
 * @param limit - 返回数量 (默认10) (Return count, default 10)
 */
export async function getTopVideos(limit: number = 10): Promise<Video[]> {
  const response = await apiRequest<Video[]>(`/api/videos/top?limit=${limit}`);
  return response.data;
}

/**
 * 增加视频播放次数 (Increment video play count)
 * @param videoId - 视频ID (Video ID)
 */
export async function updatePlayCount(videoId: number): Promise<boolean> {
  try {
    await apiRequest<null>(`/api/videos/${videoId}/play`, {
      method: 'POST',
    });
    return true;
  } catch {
    return false;
  }
}

// ==================== 分类相关API (Category APIs) ====================

/**
 * 获取所有分类 (Get all categories)
 */
export async function getCategories(): Promise<Category[]> {
  const response = await apiRequest<Category[]>('/api/categories');
  return response.data;
}

// ==================== 统计相关API (Statistics APIs) ====================

/**
 * 获取统计信息 (Get statistics)
 */
export async function getStatistics(): Promise<Statistics> {
  const response = await apiRequest<Statistics>('/api/statistics');
  return response.data;
}

// ==================== 健康检查API (Health Check API) ====================

/**
 * 健康检查 (Health check)
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await apiRequest<{ status: string }>('/api/health');
    return response.data.status === 'healthy';
  } catch {
    return false;
  }
}
