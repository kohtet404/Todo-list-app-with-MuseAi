// src/utils/taskUtils.js — pure functions only (no React, no storage).

export function createId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function createTask(title, priority, extras = {}) {
  return {
    id: createId(),
    title: title.trim(),
    notes: extras.notes || '',
    completed: false,
    priority: priority || 'medium',
    category: extras.category || 'general',
    pinned: !!extras.pinned,
    createdAt: new Date().toISOString(),
    completedAt: null,
    dueDate: extras.dueDate || null, // 'YYYY-MM-DD' or null
    remind: !!extras.remind,
    remindDayOffset: extras.remindDayOffset || 0, // 0 = on due date, 1 = day before
    tags: Array.isArray(extras.tags) ? extras.tags : [],
    recurring: extras.recurring || null, // null | 'daily' | 'weekly' | 'monthly'
    subtasks: Array.isArray(extras.subtasks) ? extras.subtasks : [],
    notificationId: null,
  };
}

// Fill in defaults for tasks saved by older versions of the app, so every
// field above always exists in memory even for old data.
export function normalizeTask(t) {
  return {
    notes: '',
    category: 'general',
    pinned: false,
    recurring: null,
    subtasks: [],
    dueDate: null,
    remind: false,
    remindDayOffset: 0,
    tags: [],
    notificationId: null,
    completedAt: null,
    ...t,
  };
}

// Every distinct tag in use across all tasks (for filter chips and
// editor suggestions), in first-seen order.
export function allTags(todos) {
  const seen = [];
  for (const t of todos) {
    for (const tag of t.tags || []) {
      if (!seen.includes(tag)) seen.push(tag);
    }
  }
  return seen;
}

export function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString();
}

export function getStats(todos) {
  const total = todos.length;
  const done = todos.filter((t) => t.completed).length;
  return {
    total,
    done,
    remaining: total - done,
    progress: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

export function filterTasks(todos, { filter = 'all', search = '', category = 'all', tag = null, smart = 'all' } = {}) {
  let list = todos;
  if (filter === 'active') list = list.filter((t) => !t.completed);
  if (filter === 'completed') list = list.filter((t) => t.completed);
  if (category !== 'all') list = list.filter((t) => (t.category || 'general') === category);
  if (tag) list = list.filter((t) => (t.tags || []).includes(tag));
  if (smart === 'today') {
    const today = todayKey();
    list = list.filter((t) => !t.completed && t.dueDate && t.dueDate <= today);
  } else if (smart === 'upcoming') {
    const today = todayKey();
    list = list.filter((t) => !t.completed && t.dueDate && t.dueDate > today);
  } else if (smart === 'overdue') {
    list = list.filter((t) => isOverdue(t));
  }
  const q = search.trim().toLowerCase();
  if (q) {
    list = list.filter((t) =>
      t.title.toLowerCase().includes(q) || (t.notes || '').toLowerCase().includes(q));
  }
  return list;
}

export function onlyCompleted(todos) {
  return todos.filter((t) => t.completed);
}

export function onlyActive(todos) {
  return todos.filter((t) => !t.completed);
}

// Pinned tasks always float to the top; inside each group the chosen
// sort order applies.
export function sortTasks(list, sortBy = 'created') {
  const weight = { high: 0, medium: 1, low: 2 };
  const byCreatedDesc = (a, b) => (a.createdAt < b.createdAt ? 1 : -1);
  return [...list].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    if (sortBy === 'deadline') {
      if (a.dueDate && b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return byCreatedDesc(a, b);
    }
    if (sortBy === 'priority') {
      const w = (weight[a.priority] ?? 1) - (weight[b.priority] ?? 1);
      return w !== 0 ? w : byCreatedDesc(a, b);
    }
    if (sortBy === 'name') {
      return a.title.toLowerCase() < b.title.toLowerCase()
        ? -1
        : a.title.toLowerCase() > b.title.toLowerCase()
          ? 1
          : byCreatedDesc(a, b);
    }
    return byCreatedDesc(a, b);
  });
}

export function subtaskProgress(task) {
  const subs = task.subtasks || [];
  return { done: subs.filter((s) => s.completed).length, total: subs.length };
}

// ---------- Deadline helpers (dates are local 'YYYY-MM-DD' strings) ----------

export function toDateKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayKey() {
  return toDateKey(new Date());
}

export function addDaysKey(days, fromKey) {
  const base = fromKey ? parseDateKey(fromKey) : new Date();
  base.setDate(base.getDate() + days);
  return toDateKey(base);
}

export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// 'overdue' | 'today' | 'tomorrow' | 'upcoming' | null
export function getDueStatus(task, now = new Date()) {
  if (!task.dueDate) return null;
  const today = toDateKey(now);
  if (task.dueDate < today) return 'overdue';
  if (task.dueDate === today) return 'today';
  if (task.dueDate === addDaysKey(1, today)) return 'tomorrow';
  return 'upcoming';
}

export function isOverdue(task, now = new Date()) {
  return !task.completed && getDueStatus(task, now) === 'overdue';
}

export function formatDueLabel(task, now = new Date()) {
  const status = getDueStatus(task, now);
  if (!status) return '';
  if (status === 'today') return 'Today';
  if (status === 'tomorrow') return 'Tomorrow';
  const d = parseDateKey(task.dueDate);
  const text = d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  return status === 'overdue' ? `Overdue · ${text}` : text;
}

// ---------- Stats helpers (Stats page insights) ----------

// Tasks completed in the last 7 days (inclusive of today).
export function completedThisWeek(todos, now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);
  return todos.filter((t) => t.completedAt && new Date(t.completedAt) >= start).length;
}

// Current streak: consecutive days with at least one completion,
// ending today or yesterday (a streak is not broken until a full
// day passes with nothing completed).
export function completionStreak(todos, now = new Date()) {
  const days = new Set(
    todos.filter((t) => t.completedAt).map((t) => toDateKey(new Date(t.completedAt))),
  );
  let streak = 0;
  const cursor = new Date(now);
  if (!days.has(toDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Next occurrence of a recurring task, counted from its current due date
// (or from today when it has no due date).
export function nextDueDate(dueDateKey, recurring) {
  const base = dueDateKey ? parseDateKey(dueDateKey) : new Date();
  if (recurring === 'daily') base.setDate(base.getDate() + 1);
  else if (recurring === 'weekly') base.setDate(base.getDate() + 7);
  else if (recurring === 'monthly') base.setMonth(base.getMonth() + 1);
  else return null;
  return toDateKey(base);
}
