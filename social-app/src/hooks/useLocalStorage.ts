/**
 * useLocalStorage Hook - 本地存储钩子 (Local Storage Hook)
 * ========================================================
 * 提供与localStorage同步的状态管理，包含类型安全和错误处理
 * Provides state management synced with localStorage with type safety and error handling
 */

import { useState, useCallback, useEffect } from 'react';

/**
 * useLocalStorage Hook 返回值 (useLocalStorage Hook Return Value)
 */
export type UseLocalStorageReturn<T> = [
  /** 当前值 (Current value) */
  T,
  /** 设置值 (Set value) */
  (value: T | ((prev: T) => T)) => void,
  /** 移除值 (Remove value) */
  () => void,
];

/**
 * useLocalStorage Hook
 * @param key - 存储键名 (Storage key)
 * @param initialValue - 初始值 (Initial value)
 * @returns [值, 设置函数, 移除函数] ([value, setter, remover])
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  // 初始化状态 - 从localStorage读取或使用初始值
  // Initialize state - read from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] 读取失败 (Read failed): ${key}`, error);
      return initialValue;
    }
  });

  /**
   * 设置值 (Set value)
   */
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // 允许函数式更新 (Allow functional updates)
        setStoredValue((prevValue) => {
          const valueToStore = value instanceof Function ? value(prevValue) : value;
          
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          
          return valueToStore;
        });
      } catch (error) {
        console.warn(`[useLocalStorage] 写入失败 (Write failed): ${key}`, error);
      }
    },
    [key]
  );

  /**
   * 移除值 (Remove value)
   */
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`[useLocalStorage] 删除失败 (Remove failed): ${key}`, error);
    }
  }, [key, initialValue]);

  // 监听其他标签页的存储变化 (Listen for storage changes from other tabs)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T);
        } catch {
          // 忽略解析错误 (Ignore parse errors)
        }
      } else if (event.key === key && event.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
