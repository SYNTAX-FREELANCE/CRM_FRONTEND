import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode) {
      setMode(savedMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
