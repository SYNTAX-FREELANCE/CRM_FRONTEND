import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext({
  mode: "light",
  toggleTheme: () => { },
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("theme-mode");

    if (savedMode) return savedMode;

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("theme-mode", newMode);
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};