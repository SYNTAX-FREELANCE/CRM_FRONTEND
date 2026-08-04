import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  mode: "light",
  toggleTheme: () => { },
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("app_theme");
    if (savedMode === "dark" || savedMode === "light") {
      return savedMode;
    }
    return "light";
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("app_theme", nextMode);
      return nextMode;
    });
  };

  useEffect(() => {
    localStorage.setItem("app_theme", mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};