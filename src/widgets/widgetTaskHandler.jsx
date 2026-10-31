// src/widgets/widgetTaskHandler.jsx — runs in a headless JS context
// when Android needs the widget drawn (added, resized, periodic
// update) and when a widget element with a custom clickAction is
// tapped. It reads/writes the same AsyncStorage data the app uses.
// Registered in App.jsx.
//
// WIDGET_CLICK with action TOGGLE_TASK = the row's checkbox was
// tapped: complete that task in storage (spawning the next
// occurrence for a recurring task, fixing up reminders best-effort)
// and redraw. The app itself re-reads storage when it comes back to
// the foreground, so both sides stay in sync.
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import TodayWidget, { buildWidgetData, TOGGLE_TASK_ACTION } from './TodayWidget';
import { STORAGE_KEY } from '../storage/todoStorage';
import { createTask, nextDueDate, normalizeTask } from '../utils/taskUtils';
import { cancelTaskReminder, scheduleTaskReminder } from '../services/notifications';

async function loadTodosSafe() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

async function saveTodosSafe(todos) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.log('Widget save failed:', e.message);
  }
}

async function completeTask(taskId) {
  const todos = (await loadTodosSafe()).map(normalizeTask);
  const existing = todos.find((t) => t.id === taskId);
  if (!existing || existing.completed) return todos;

  const updated = {
    ...existing,
    completed: true,
    completedAt: new Date().toISOString(),
    notificationId: null,
  };
  await cancelTaskReminder(existing.notificationId);

  let next = todos.map((t) => (t.id === taskId ? updated : t));

  if (existing.recurring) {
    const occurrence = createTask(existing.title, existing.priority, {
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
    occurrence.notificationId = await scheduleTaskReminder(occurrence);
    next = [occurrence, ...next];
  }

  await saveTodosSafe(next);
  return next;
}

export async function widgetTaskHandler({ widgetAction, clickAction, clickActionData, renderWidget }) {
  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      const todos = await loadTodosSafe();
      renderWidget(<TodayWidget data={buildWidgetData(todos)} />);
      break;
    }
    case 'WIDGET_CLICK': {
      if (clickAction === TOGGLE_TASK_ACTION && clickActionData?.taskId) {
        const todos = await completeTask(clickActionData.taskId);
        renderWidget(<TodayWidget data={buildWidgetData(todos)} />);
      } else {
        const todos = await loadTodosSafe();
        renderWidget(<TodayWidget data={buildWidgetData(todos)} />);
      }
      break;
    }
    default:
      break;
  }
}
