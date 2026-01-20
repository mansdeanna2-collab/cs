import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

/**
 * Custom hook to manage time-based theme switching
 * Light theme: 7:00 AM (hour 7) to 6:59 PM (hour 18)
 * Dark theme: 7:00 PM (hour 19) to 6:59 AM (hour 6)
 */
export const useTheme = () => {
  const getThemeByTime = useCallback((): Theme => {
    const hour = new Date().getHours();
    // Light theme from 7:00 AM (hour >= 7) to 6:59 PM (hour < 19)
    // Dark theme from 7:00 PM (hour >= 19) to 6:59 AM (hour < 7)
    return hour >= 7 && hour < 19 ? 'light' : 'dark';
  }, []);

  const [theme, setTheme] = useState<Theme>(getThemeByTime);

  useEffect(() => {
    // Update theme immediately on mount
    setTheme(getThemeByTime());

    // Check theme every minute to handle transitions
    const intervalId = setInterval(() => {
      const newTheme = getThemeByTime();
      setTheme(prevTheme => {
        if (prevTheme !== newTheme) {
          return newTheme;
        }
        return prevTheme;
      });
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [getThemeByTime]);

  return { theme, setTheme };
};

export default useTheme;
