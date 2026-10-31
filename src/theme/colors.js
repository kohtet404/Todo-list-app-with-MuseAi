// src/theme/colors.js — two palettes with IDENTICAL keys.
// Components never import a palette directly any more; they get the active
// one from SettingsContext (useSettings().colors) so the Settings theme
// switch (Light / Dark) restyles the whole app.
export const lightColors = {
  primary: '#4f46e5',
  primaryDark: '#4f46e5', // header background
  primaryLight: '#c7d2fe',
  primarySoft: '#e0e7ff',
  background: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  textFaint: '#64748b',
  danger: '#ef4444',
  dangerSoft: '#fee2e2',
  success: '#22c55e',
  warning: '#f59e0b',
  white: '#ffffff',
  chipText: '#334155',
};

export const darkColors = {
  primary: '#818cf8',
  primaryDark: '#312e81', // header background (deeper indigo for dark mode)
  primaryLight: '#a5b4fc',
  primarySoft: '#312e81',
  background: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textMuted: '#64748b',
  textFaint: '#94a3b8',
  danger: '#f87171',
  dangerSoft: '#450a0a',
  success: '#4ade80',
  warning: '#fbbf24',
  white: '#ffffff',
  chipText: '#e2e8f0',
};

// Static fallback (light) for any code that runs outside the theme context.
export const colors = lightColors;
export default lightColors;
