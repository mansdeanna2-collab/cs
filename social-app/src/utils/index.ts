/**
 * 工具函数模块 (Utility Functions Module)
 * ======================================
 * 提供通用的工具函数
 * Provides general utility functions
 */

import { AppError, ErrorCode, ErrorCodeType } from '../types';

// ==================== 格式化函数 (Formatting Functions) ====================

/**
 * 格式化播放次数 (Format play count)
 * @param count - 播放次数 (Play count)
 * @returns 格式化后的字符串 (Formatted string)
 */
export function formatPlayCount(count: number): string {
  if (count >= 100000000) {
    return `${(count / 100000000).toFixed(1)}亿`;
  }
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`;
  }
  return count.toString();
}

/**
 * 格式化时长 (Format duration)
 * @param seconds - 秒数 (Seconds)
 * @returns 格式化后的时长字符串 (Formatted duration string)
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 格式化日期 (Format date)
 * @param dateString - ISO日期字符串 (ISO date string)
 * @returns 格式化后的日期字符串 (Formatted date string)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return date.toLocaleDateString('zh-CN');
}

/**
 * 格式化文件大小 (Format file size)
 * @param bytes - 字节数 (Bytes)
 * @returns 格式化后的文件大小 (Formatted file size)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// ==================== 错误处理函数 (Error Handling Functions) ====================

/**
 * 创建应用错误 (Create application error)
 * @param code - 错误代码 (Error code)
 * @param message - 错误消息 (Error message)
 * @param options - 可选参数 (Optional parameters)
 * @returns 应用错误对象 (Application error object)
 */
export function createAppError(
  code: ErrorCodeType,
  message: string,
  options: { status?: number; url?: string; retryable?: boolean } = {}
): AppError {
  const { status, url, retryable } = options;
  return {
    code,
    message,
    status,
    url,
    retryable: retryable ?? isRetryableError(code),
    timestamp: Date.now(),
  };
}

/**
 * 判断错误是否可重试 (Check if error is retryable)
 * @param code - 错误代码 (Error code)
 * @returns 是否可重试 (Whether retryable)
 */
export function isRetryableError(code: ErrorCodeType): boolean {
  const retryableCodes: ErrorCodeType[] = [
    ErrorCode.NETWORK_ERROR,
    ErrorCode.TIMEOUT_ERROR,
    ErrorCode.SERVER_ERROR,
  ];
  return retryableCodes.includes(code);
}

/**
 * 获取错误消息 (Get error message)
 * 双语消息: 中文 / English
 * @param code - 错误代码 (Error code)
 * @returns 用户友好的错误消息 (User-friendly error message)
 */
export function getErrorMessage(code: ErrorCodeType): string {
  const messages: Record<ErrorCodeType, string> = {
    [ErrorCode.NETWORK_ERROR]: '网络连接失败 / Network connection failed',
    [ErrorCode.TIMEOUT_ERROR]: '请求超时 / Request timeout',
    [ErrorCode.SERVER_ERROR]: '服务器错误 / Server error',
    [ErrorCode.PARSE_ERROR]: '数据解析失败 / Data parse error',
    [ErrorCode.VALIDATION_ERROR]: '数据验证失败 / Validation error',
    [ErrorCode.AUTH_ERROR]: '认证失败 / Authentication failed',
    [ErrorCode.NOT_FOUND]: '资源未找到 / Resource not found',
    [ErrorCode.UNKNOWN_ERROR]: '未知错误 / Unknown error',
  };
  return messages[code] || messages[ErrorCode.UNKNOWN_ERROR];
}

// ==================== 防抖和节流 (Debounce and Throttle) ====================

/**
 * 防抖函数 (Debounce function)
 * @param func - 要防抖的函数 (Function to debounce)
 * @param wait - 等待时间(毫秒) (Wait time in ms)
 * @returns 防抖后的函数 (Debounced function)
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * 节流函数 (Throttle function)
 * @param func - 要节流的函数 (Function to throttle)
 * @param limit - 时间限制(毫秒) (Time limit in ms)
 * @returns 节流后的函数 (Throttled function)
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// ==================== 存储函数 (Storage Functions) ====================

/**
 * 安全地从 localStorage 获取值 (Safely get value from localStorage)
 * @param key - 键名 (Key name)
 * @param defaultValue - 默认值 (Default value)
 * @returns 存储的值或默认值 (Stored value or default value)
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch {
    console.warn(`[Storage] Failed to get item: ${key}`);
    return defaultValue;
  }
}

/**
 * 安全地设置 localStorage 值 (Safely set value to localStorage)
 * @param key - 键名 (Key name)
 * @param value - 值 (Value)
 * @returns 是否成功 (Whether successful)
 */
export function setToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    console.warn(`[Storage] Failed to set item: ${key}`);
    return false;
  }
}

/**
 * 从 localStorage 删除值 (Remove value from localStorage)
 * @param key - 键名 (Key name)
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn(`[Storage] Failed to remove item: ${key}`);
  }
}

// ==================== 验证函数 (Validation Functions) ====================

/**
 * 验证电子邮件格式 (Validate email format)
 * @param email - 电子邮件地址 (Email address)
 * @returns 是否有效 (Whether valid)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证手机号格式 (中国大陆) (Validate phone number - China mainland)
 * @param phone - 手机号 (Phone number)
 * @returns 是否有效 (Whether valid)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * 验证URL格式 (Validate URL format)
 * @param url - URL地址 (URL address)
 * @returns 是否有效 (Whether valid)
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ==================== 其他工具函数 (Other Utility Functions) ====================

/**
 * 生成唯一ID (Generate unique ID)
 * @param prefix - 前缀 (Prefix)
 * @returns 唯一ID (Unique ID)
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * 延迟执行 (Delay execution)
 * @param ms - 毫秒数 (Milliseconds)
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 类名合并 (Merge class names)
 * @param classes - 类名数组 (Class names array)
 * @returns 合并后的类名字符串 (Merged class name string)
 */
export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 深拷贝对象 (Deep clone object)
 * @param obj - 要拷贝的对象 (Object to clone)
 * @returns 深拷贝后的对象 (Deep cloned object)
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 安全地访问嵌套对象属性 (Safely access nested object property)
 * @param obj - 对象 (Object)
 * @param path - 属性路径 (Property path)
 * @param defaultValue - 默认值 (Default value)
 * @returns 属性值或默认值 (Property value or default value)
 */
export function get<T>(
  obj: Record<string, unknown>,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = (result as Record<string, unknown>)[key];
  }

  return (result as T) ?? defaultValue;
}
