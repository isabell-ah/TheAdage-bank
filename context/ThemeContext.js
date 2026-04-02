import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { F } from '../theme';

const THEME_KEY = 'adage_darkMode';

const light = {
  primary:    '#8B1C3F',
  primaryDim: '#F0DDE4',
  bg:         '#F5F0E8',
  surface:    '#FFFFFF',
  text:       '#1C1410',
  muted:      '#9C8E7E',
  accent:     '#C4955A',
  accentDim:  '#FBF0E0',
  border:     '#E5DDD0',
  inputBg:    '#EDE8DF',
  credit:     '#2E7D52',
  creditDim:  '#E6F4ED',
  debit:      '#9B2335',
  debitDim:   '#F9E8EA',
  statusOk:   '#2E7D52',
  statusWarn: '#C4955A',
  statusBad:  '#9B2335',
  isDark:     false,
};

const dark = {
  primary:    '#C4607A',
  primaryDim: '#3A1520',
  bg:         '#0F0A0C',
  surface:    '#1C1218',
  text:       '#F0E8E0',
  muted:      '#7A6A6E',
  accent:     '#C4955A',
  accentDim:  '#2A1F0E',
  border:     '#2E1E24',
  inputBg:    '#251519',
  credit:     '#5DBF8A',
  creditDim:  '#0E2A1A',
  debit:      '#E07080',
  debitDim:   '#2A0E14',
  statusOk:   '#5DBF8A',
  statusWarn: '#C4955A',
  statusBad:  '#E07080',
  isDark:     true,
};

const ThemeContext = createContext({ C: light, F, isDark: false, toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  // Restore persisted theme on mount
  useEffect(() => {
    SecureStore.getItemAsync(THEME_KEY).then(val => {
      if (val === 'true') setIsDark(true);
    }).catch(() => {});
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    try { await SecureStore.setItemAsync(THEME_KEY, String(next)); } catch (_) {}
  };

  const C = isDark ? dark : light;

  return (
    <ThemeContext.Provider value={{ C, F, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
