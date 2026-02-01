/**
 * useApi Hook - 通用API请求钩子 (Generic API Request Hook)
 * =========================================================
 * 提供类型安全的API请求功能，包含加载状态、错误处理和自动重试
 * Provides type-safe API request functionality with loading state, error handling, and auto-retry
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { AppError, ErrorCode, ApiResult } from '../types';
import { createAppError, getErrorMessage, delay } from '../utils';
import { getApiBaseUrl, getApiTimeout } from '../config/eov';

// ==================== 类型定义 (Type Definitions) ====================

/**
 * API请求选项 (API Request Options)
 */
export interface ApiRequestOptions extends Omit<RequestInit, 'signal' | 'cache'> {
  /** 超时时间(毫秒) (Timeout in ms) */
  timeout?: number;
  /** 最大重试次数 (Max retry count) */
  maxRetries?: number;
  /** 重试延迟基数(毫秒) (Retry delay base in ms) */
  retryDelay?: number;
  /** 是否启用缓存 (Enable cache) */
  enableCache?: boolean;
  /** 缓存时间(毫秒) (Cache duration in ms) */
  cacheDuration?: number;
}

/**
 * API响应格式 (API Response Format)
 */
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * useApi Hook 返回值 (useApi Hook Return Value)
 */
export interface UseApiReturn<T> {
  /** 请求结果 (Request result) */
  result: ApiResult<T>;
  /** 执行请求 (Execute request) */
  execute: (endpoint: string, options?: ApiRequestOptions) => Promise<T | null>;
  /** 重置状态 (Reset state) */
  reset: () => void;
  /** 取消请求 (Cancel request) */
  cancel: () => void;
  /** 是否正在加载 (Is loading) */
  isLoading: boolean;
  /** 是否有错误 (Has error) */
  hasError: boolean;
  /** 数据 (Data) */
  data: T | null;
  /** 错误 (Error) */
  error: AppError | null;
}

// ==================== 缓存管理 (Cache Management) ====================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  duration: number;
}

const apiCache = new Map<string, CacheEntry<unknown>>();

function getCacheKey(url: string, options?: RequestInit): string {
  const method = options?.method || 'GET';
  const body = options?.body ? String(options.body) : '';
  return `${method}:${url}:${body}`;
}

function getFromCache<T>(key: string): T | null {
  const entry = apiCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > entry.duration) {
    apiCache.delete(key);
    return null;
  }

  return entry.data;
}

function setToCache<T>(key: string, data: T, duration: number): void {
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
    duration,
  });
}

// ==================== useApi Hook ====================

/**
 * 通用API请求Hook (Generic API Request Hook)
 * @returns API操作方法和状态 (API operation methods and state)
 */
export function useApi<T>(): UseApiReturn<T> {
  const [result, setResult] = useState<ApiResult<T>>({ status: 'idle' });
  const abortControllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // 组件卸载时取消请求 (Cancel request on unmount)
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  /**
   * 执行单次请求 (Execute single request)
   */
  const executeRequest = useCallback(
    async (
      url: string,
      options: RequestInit,
      timeout: number
    ): Promise<ApiResponse<T>> => {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          mode: 'cors',
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // 无法解析错误响应 (Cannot parse error response)
          }

          const errorCode =
            response.status === 404
              ? ErrorCode.NOT_FOUND
              : response.status === 401
              ? ErrorCode.AUTH_ERROR
              : ErrorCode.SERVER_ERROR;

          throw createAppError(errorCode, errorMessage, {
            status: response.status,
            url,
          });
        }

        const data = await response.json();

        if (data === null || typeof data !== 'object') {
          throw createAppError(ErrorCode.PARSE_ERROR, getErrorMessage(ErrorCode.PARSE_ERROR), {
            status: response.status,
            url,
          });
        }

        return data as ApiResponse<T>;
      } catch (error) {
        clearTimeout(timeoutId);

        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw createAppError(ErrorCode.TIMEOUT_ERROR, getErrorMessage(ErrorCode.TIMEOUT_ERROR), {
              url,
            });
          }

          if (error.name === 'TypeError' || error.message.includes('fetch')) {
            throw createAppError(ErrorCode.NETWORK_ERROR, getErrorMessage(ErrorCode.NETWORK_ERROR), {
              url,
            });
          }
        }

        throw createAppError(ErrorCode.UNKNOWN_ERROR, getErrorMessage(ErrorCode.UNKNOWN_ERROR), {
          url,
        });
      }
    },
    []
  );

  /**
   * 执行带重试的请求 (Execute request with retry)
   */
  const execute = useCallback(
    async (endpoint: string, options: ApiRequestOptions = {}): Promise<T | null> => {
      const {
        timeout = getApiTimeout(),
        maxRetries = 3,
        retryDelay = 1000,
        enableCache = false,
        cacheDuration = 60000, // 1分钟默认缓存 (1 minute default cache)
        ...fetchOptions
      } = options;

      const url = `${getApiBaseUrl()}${endpoint}`;
      const cacheKey = getCacheKey(url, fetchOptions);
      
      // 可缓存的HTTP方法 (Cacheable HTTP methods)
      const method = (fetchOptions.method || 'GET').toUpperCase();
      const isCacheableMethod = method === 'GET' || method === 'HEAD';

      // 检查缓存 (Check cache)
      if (enableCache && isCacheableMethod) {
        const cachedData = getFromCache<T>(cacheKey);
        if (cachedData !== null) {
          if (mountedRef.current) {
            setResult({ status: 'success', data: cachedData });
          }
          return cachedData;
        }
      }

      if (mountedRef.current) {
        setResult({ status: 'loading' });
      }

      let lastError: AppError | null = null;
      let attempts = 0;

      while (attempts <= maxRetries) {
        try {
          console.log(`[API] 请求 (Request): ${url}${attempts > 0 ? ` (重试 ${attempts})` : ''}`);

          const response = await executeRequest(url, fetchOptions, timeout);
          const data = response.data;

          // 缓存成功响应 (Cache successful response)
          if (enableCache && isCacheableMethod) {
            setToCache(cacheKey, data, cacheDuration);
          }

          if (mountedRef.current) {
            setResult({ status: 'success', data });
          }

          console.log(`[API] 成功 (Success): ${url}`);
          return data;
        } catch (error) {
          lastError = error as AppError;
          attempts++;

          // 如果错误不可重试或已达到最大重试次数，则退出 (Exit if error not retryable or max retries reached)
          if (!lastError.retryable || attempts > maxRetries) {
            break;
          }

          // 指数退避延迟 (Exponential backoff delay)
          const backoffDelay = retryDelay * Math.pow(2, attempts - 1);
          console.log(`[API] 将在 ${backoffDelay}ms 后重试 (Retrying in ${backoffDelay}ms)`);
          await delay(backoffDelay);
        }
      }

      console.error(`[API] 失败 (Failed): ${url}`, lastError);

      if (mountedRef.current && lastError) {
        setResult({ status: 'error', error: lastError });
      }

      return null;
    },
    [executeRequest]
  );

  /**
   * 重置状态 (Reset state)
   */
  const reset = useCallback(() => {
    if (mountedRef.current) {
      setResult({ status: 'idle' });
    }
  }, []);

  /**
   * 取消请求 (Cancel request)
   */
  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    if (mountedRef.current) {
      setResult({ status: 'idle' });
    }
  }, []);

  // 派生状态 (Derived state)
  const isLoading = result.status === 'loading';
  const hasError = result.status === 'error';
  const data = result.status === 'success' ? result.data : null;
  const error = result.status === 'error' ? result.error : null;

  return {
    result,
    execute,
    reset,
    cancel,
    isLoading,
    hasError,
    data,
    error,
  };
}

export default useApi;
