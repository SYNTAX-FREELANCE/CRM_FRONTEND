import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext({
  mode: "light",
  toggleTheme: () => { },
});

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  });

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};