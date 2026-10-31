// src/constants/priorities.js — shared constants, no UI code here.

export const PRIORITIES = [
  { key: 'low', label: 'Low', color: '#22c55e' },
  { key: 'medium', label: 'Medium', color: '#f59e0b' },
  { key: 'high', label: 'High', color: '#ef4444' },
];

export const PRIORITY_COLOR = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

export const PRIORITY_WEIGHT = { high: 0, medium: 1, low: 2 };

export const DEFAULT_PRIORITY = 'medium';

export const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export const CATEGORIES = [
  { key: 'general', label: 'General', color: '#64748b' },
  { key: 'work', label: 'Work', color: '#0ea5e9' },
  { key: 'personal', label: 'Personal', color: '#a855f7' },
  { key: 'shopping', label: 'Shopping', color: '#22c55e' },
  { key: 'health', label: 'Health', color: '#f97316' },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

// Built-in lists + the user's own lists (Settings → Lists), merged.
// Custom list objects look exactly like built-in ones: { key, label, color }.
export function allCategories(customLists = []) {
  return [...CATEGORIES, ...customLists];
}

export function resolveCategory(key, customLists = []) {
  return (
    CATEGORY_MAP[key] ||
    customLists.find((c) => c.key === key) ||
    CATEGORY_MAP.general
  );
}

// Colours offered when creating a custom list.
export const LIST_COLORS = [
  '#0ea5e9', '#a855f7', '#22c55e', '#f97316',
  '#ec4899', '#eab308', '#14b8a6', '#6366f1',
];

// Preset reminder times for Settings (24h 'HH:MM' values).
export const REMINDER_TIMES = [
  { key: '06:00', label: '6:00 AM' },
  { key: '07:00', label: '7:00 AM' },
  { key: '08:00', label: '8:00 AM' },
  { key: '09:00', label: '9:00 AM' },
  { key: '12:00', label: '12:00 PM' },
  { key: '18:00', label: '6:00 PM' },
  { key: '20:00', label: '8:00 PM' },
];

export function formatReminderTime(hhmm) {
  const found = REMINDER_TIMES.find((t) => t.key === hhmm);
  if (found) return found.label;
  const [h, m] = String(hhmm || '09:00').split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m || 0).padStart(2, '0')} ${suffix}`;
}

// Smart lists (Todoist/TickTick style) shown above the Home task list.
export const SMART_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'today', label: '☀️ Today' },
  { key: 'upcoming', label: '📅 Upcoming' },
  { key: 'overdue', label: '⚠️ Overdue' },
];

export const RECURRENCES = [
  { key: null, label: 'Does not repeat' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

export const SORTS = [
  { key: 'created', label: 'Newest first' },
  { key: 'deadline', label: 'By deadline' },
  { key: 'priority', label: 'By priority' },
  { key: 'name', label: 'Name A–Z' },
];
