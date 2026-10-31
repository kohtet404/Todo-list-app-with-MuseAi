// src/storage/settingsStorage.js — persistence for the Settings page values.
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SETTINGS_KEY = '@settings_v1';

export const DEFAULT_SETTINGS = {
  theme: 'light', // 'light' | 'dark'
  defaultPriority: 'medium', // 'low' | 'medium' | 'high'
  sortBy: 'created', // 'created' | 'deadline' | 'priority' | 'name'
  remindByDefault: false, // pre-tick "Remind me" when a deadline is chosen
  // (Reminder TIME is not a setting any more — each task carries its
  // own reminderTime, editable on the task itself.)
  customLists: [], // user-created lists: [{ key, label, color }]
};

export async function loadSettings() {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch (e) {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Settings save failed', e);
  }
}
