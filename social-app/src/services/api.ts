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
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API请求失败 (API request failed):', error);
    throw error;
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
