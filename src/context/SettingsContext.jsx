// src/context/SettingsContext.jsx — app settings + active theme palette.
// Provided at the very top of the tree (above TodoProvider) because screens,
// components and the navigator all read colours from here.
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from '../storage/settingsStorage';
import { lightColors, darkColors } from '../theme/colors';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      setSettings(await loadSettings());
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) saveSettings(settings);
  }, [settings, loaded]);

  const updateSetting = (key, value) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const value = useMemo(() => {
    const isDark = settings.theme === 'dark';
    return {
      settings,
      updateSetting,
      isDark,
      colors: isDark ? darkColors : lightColors,
    };
  }, [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
export default SettingsContext;
