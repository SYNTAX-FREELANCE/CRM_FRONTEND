import React from 'react';
import { ThemeProvider as MaterialThemeProvider, createTheme, THEME_ID as MATERIAL_THEME_ID } from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider, useColorScheme as useJoyColorScheme } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeMode } from './ThemeContext';

const JoyThemeSync = () => {
  const { setMode: setJoyMode } = useJoyColorScheme();
  const { mode } = useThemeMode();

  React.useEffect(() => {
    setJoyMode(mode);
  }, [mode, setJoyMode]);

  return null;
};

const ThemeConfig = ({ children }) => {
  const { mode } = useThemeMode();

  const materialTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#ea580c',
          },
          background: {
            default: mode === 'dark' ? '#0f172a' : '#f8fafc',
            paper: mode === 'dark' ? '#1e293b' : '#ffffff',
          },
        },
      }),
    [mode]
  );

  return (
    <MaterialThemeProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider defaultMode="light">
        <JoyThemeSync />
        <CssBaseline />
        {children}
      </JoyCssVarsProvider>
    </MaterialThemeProvider>
  );
};

export default ThemeConfig;
