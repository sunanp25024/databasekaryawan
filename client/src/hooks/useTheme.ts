import { useState, useEffect } from 'react';
import { Theme } from '../components/ThemeSwitcher';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved as Theme) || 'default';
  });

  useEffect(() => {
    // Remove all theme classes
    document.body.classList.remove('theme-default', 'theme-dark', 'theme-vibrant', 'theme-nature', 'theme-luxury');
    
    // Add current theme class
    document.body.classList.add(`theme-${theme}`);
    
    // Save to localStorage
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  return [theme, setTheme] as const;
}