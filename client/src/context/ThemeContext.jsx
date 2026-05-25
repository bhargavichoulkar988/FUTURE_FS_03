// ============================================================
// Elite Dine - Theme Context
// Manages dark/light theme state across the entire app
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ThemeContext = createContext();

// ============================================================
// ThemeProvider Component
// Wrap your app with this to provide theme state everywhere
// ============================================================
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage, defaulting to 'dark'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('elitedine-theme');
    return savedTheme || 'dark';
  });

  // Apply theme to the document body whenever it changes
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('elitedine-theme', theme);
  }, [theme]);

  // Toggle between dark and light
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================================
// Custom hook to use theme context
// Usage: const { theme, toggleTheme, isDark } = useTheme();
// ============================================================
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
