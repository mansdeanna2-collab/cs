/**
 * useDebounce Hook - 防抖钩子 (Debounce Hook)
 * ==========================================
 * 提供值和函数的防抖功能
 * Provides debouncing for values and functions
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useDebounce Hook - 值防抖 (Value Debounce)
 * @param value - 要防抖的值 (Value to debounce)
 * @param delay - 延迟时间(毫秒) (Delay in ms)
 * @returns 防抖后的值 (Debounced value)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useDebouncedCallback Hook - 函数防抖 (Function Debounce)
 * @param callback - 要防抖的回调函数 (Callback to debounce)
 * @param delay - 延迟时间(毫秒) (Delay in ms)
 * @returns 防抖后的函数 (Debounced function)
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // 保持回调函数引用最新 (Keep callback reference up to date)
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // 清理 (Cleanup)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  return debouncedCallback;
}

/**
 * useThrottle Hook - 值节流 (Value Throttle)
 * @param value - 要节流的值 (Value to throttle)
 * @param limit - 时间限制(毫秒) (Time limit in ms)
 * @returns 节流后的值 (Throttled value)
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();

    if (now - lastRun.current >= limit) {
      lastRun.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastRun.current = Date.now();
        setThrottledValue(value);
      }, limit - (now - lastRun.current));

      return () => clearTimeout(timer);
    }
  }, [value, limit]);

  return throttledValue;
}

export default useDebounce;
