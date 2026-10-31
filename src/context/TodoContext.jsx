// src/context/TodoContext.jsx — global todo state for the whole app.
//
// Owns every task change plus the side-effects that must follow it:
// saving to AsyncStorage, reminder notifications (schedule/cancel),
// spawning the next occurrence of a recurring task, and refreshing the
// home-screen widget.
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, AppState } from 'react-native';
import { loadTodos, saveTodos } from '../storage/todoStorage';
import { createId, createTask, getStats, nextDueDate, normalizeTask } from '../utils/taskUtils';
import { scheduleTaskReminder, cancelTaskReminder } from '../services/notifications';
import { syncTodayWidget } from '../widgets/syncTodayWidget';

const TodoContext = createContext(null);

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      setTodos((await loadTodos()).map(normalizeTask));
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveTodos(todos);
    syncTodayWidget(todos);
  }, [todos, loaded]);

  // The home-screen widget can complete tasks while the app is in the
  // background (its checkbox writes straight to storage). Re-read
  // storage whenever the app returns to the foreground so the list
  // never shows stale state.
  useEffect(() => {
    const sub = AppState.addEventListener('change', async (nextState) => {
      if (nextState === 'active' && loaded) {
        setTodos((await loadTodos()).map(normalizeTask));
      }
    });
    return () => sub.remove();
  }, [loaded]);

  // extras: { notes, category, dueDate, remind, remindDayOffset,
  //           reminderTime, tags, recurring, subtasks, pinned }
  const addTodo = async (title, priority, extras = {}) => {
    if (!title?.trim()) return;
    const task = createTask(title, priority, extras);
    task.notificationId = await scheduleTaskReminder(task);
    setTodos((prev) => [task, ...prev]);
  };

  const updateTodo = async (id, title, priority, extras = {}) => {
    if (!title?.trim()) return;
    const existing = todos.find((t) => t.id === id);
    if (!existing) return;
    const updated = {
      ...existing,
      title: title.trim(),
      priority,
      notes: extras.notes ?? existing.notes ?? '',
      category: extras.category ?? existing.category ?? 'general',
      dueDate: extras.dueDate ?? existing.dueDate ?? null,
      remind: extras.remind ?? existing.remind ?? false,
      remindDayOffset: extras.remindDayOffset ?? existing.remindDayOffset ?? 0,
      reminderTime: extras.reminderTime ?? existing.reminderTime ?? '09:00',
      tags: extras.tags ?? existing.tags ?? [],
      recurring: extras.recurring ?? existing.recurring ?? null,
      subtasks: extras.subtasks ?? existing.subtasks ?? [],
    };
    updated.notificationId = await scheduleTaskReminder(updated);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const toggleTodo = async (id) => {
    const existing = todos.find((t) => t.id === id);
    if (!existing) return;
    const updated = {
      ...existing,
      completed: !existing.completed,
      completedAt: !existing.completed ? new Date().toISOString() : null,
    };
    updated.notificationId = updated.completed
      ? (await cancelTaskReminder(existing.notificationId), null)
      : await scheduleTaskReminder(updated);

    let nextOccurrence = null;
    if (updated.completed && existing.recurring) {
      nextOccurrence = createTask(existing.title, existing.priority, {
        notes: existing.notes,
        category: existing.category,
        dueDate: nextDueDate(existing.dueDate, existing.recurring),
        remind: existing.remind,
        remindDayOffset: existing.remindDayOffset || 0,
        reminderTime: existing.reminderTime || '09:00',
        tags: existing.tags || [],
        recurring: existing.recurring,
        subtasks: (existing.subtasks || []).map((s) => ({ ...s, completed: false })),
      });
      nextOccurrence.notificationId = await scheduleTaskReminder(nextOccurrence);
    }

    setTodos((prev) => {
      const replaced = prev.map((t) => (t.id === id ? updated : t));
      return nextOccurrence ? [nextOccurrence, ...replaced] : replaced;
    });
  };

  const togglePin = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)));

  const deleteTodo = (id) => {
    const existing = todos.find((t) => t.id === id);
    Alert.alert('Delete task?', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await cancelTaskReminder(existing?.notificationId);
          setTodos((prev) => prev.filter((t) => t.id !== id));
        },
      },
    ]);
  };

  const clearCompleted = () => setTodos((prev) => prev.filter((t) => !t.completed));

  const deleteAllTodos = async () => {
    for (const t of todos) await cancelTaskReminder(t.notificationId);
    setTodos([]);
  };

  // Copy a task (Todoist-style duplicate): fresh id, not completed,
  // subtasks kept but unchecked, reminder re-scheduled.
  const duplicateTodo = async (id) => {
    const existing = todos.find((t) => t.id === id);
    if (!existing) return;
    const copy = createTask(existing.title, existing.priority, {
      notes: existing.notes,
      category: existing.category,
      dueDate: existing.dueDate,
      remind: existing.remind,
      remindDayOffset: existing.remindDayOffset || 0,
      reminderTime: existing.reminderTime || '09:00',
      tags: existing.tags || [],
      recurring: existing.recurring,
      subtasks: (existing.subtasks || []).map((s) => ({ ...s, id: createId(), completed: false })),
    });
    copy.notificationId = await scheduleTaskReminder(copy);
    setTodos((prev) => [copy, ...prev]);
  };

  // When a custom list is deleted, its tasks fall back to General.
  const reassignCategory = (fromKey) =>
    setTodos((prev) => prev.map((t) => (t.category === fromKey ? { ...t, category: 'general' } : t)));

  const exportJson = () => JSON.stringify(todos, null, 2);

  // Restore a backup made by Export: tasks are APPENDED with fresh
  // ids (nothing is overwritten), reminders re-scheduled.
  const importTodos = async (jsonText) => {
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      return { ok: false, reason: 'That text is not valid JSON.' };
    }
    if (!Array.isArray(parsed)) return { ok: false, reason: 'Expected a JSON list of tasks.' };
    const valid = parsed.filter((t) => t && typeof t.title === 'string' && t.title.trim());
    if (!valid.length) return { ok: false, reason: 'No tasks found in that backup.' };
    const prepared = [];
    for (const raw of valid) {
      const task = normalizeTask({ ...raw, id: createId(), notificationId: null });
      task.notificationId = await scheduleTaskReminder(task);
      prepared.push(task);
    }
    setTodos((prev) => [...prepared, ...prev]);
    return { ok: true, count: prepared.length };
  };

  const stats = useMemo(() => getStats(todos), [todos]);

  const value = {
    todos, loaded, stats,
    addTodo, updateTodo, toggleTodo, togglePin, deleteTodo,
    clearCompleted, deleteAllTodos, exportJson,
    duplicateTodo, reassignCategory, importTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used inside <TodoProvider>');
  return ctx;
}
export default TodoContext;
