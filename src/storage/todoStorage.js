// src/storage/todoStorage.js — the ONLY file that talks to AsyncStorage.
// Key stays '@todos_v1' so data saved by the old single-file version is kept.
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY = '@todos_v1';

export async function loadTodos() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Load failed', e);
    return [];
  }
}

export async function saveTodos(todos) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.warn('Save failed', e);
  }
}
