// src/services/notifications.js — local reminder notifications.
// Uses expo-notifications (a NATIVE library): this only works in an
// installed EAS build that includes it, not in the previous APK and
// not fully in Expo Go. All calls are wrapped so a failure here can
// never break saving a task.
//
// WHEN a reminder fires: at the time of day chosen in Settings
// (settings.reminderTime, 'HH:MM', default 09:00) on the due date —
// or on the day BEFORE the due date when the task's remindDayOffset
// is 1. The service reads the saved settings itself on every call,
// so callers never have to pass the time around.
import * as Notifications from 'expo-notifications';
import { parseDateKey, toDateKey } from '../utils/taskUtils';
import { loadSettings } from '../storage/settingsStorage';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  console.log('Notification handler setup failed:', e.message);
}

export async function ensureNotificationPermission() {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.status === 'granted') return true;
    const requested = await Notifications.requestPermissionsAsync();
    return requested.status === 'granted';
  } catch (e) {
    console.log('Notification permission failed:', e.message);
    return false;
  }
}

function timeParts(hhmm) {
  const [h, m] = String(hhmm || '09:00').split(':').map(Number);
  return { h: Number.isFinite(h) ? h : 9, m: Number.isFinite(m) ? m : 0 };
}

// Compute the fire moment for a task's reminder.
// If that moment has already passed but the reminder day is TODAY,
// fire one minute from now instead — otherwise an evening-created
// task due today/tomorrow would silently never remind. If the
// reminder day is already past, there is nothing sensible to schedule.
export function reminderDateFor(dueDateKey, dayOffset = 0, time = '09:00', now = new Date()) {
  if (!dueDateKey) return null;
  const { h, m } = timeParts(time);
  const fireDay = parseDateKey(dueDateKey);
  fireDay.setDate(fireDay.getDate() - (dayOffset || 0));
  fireDay.setHours(h, m, 0, 0);
  if (fireDay > now) return fireDay;
  if (toDateKey(fireDay) === toDateKey(now)) return new Date(now.getTime() + 60 * 1000);
  return null;
}

// Schedule (or re-schedule) the reminder for a task.
// timeOverride lets Settings reschedule everything with the new time
// immediately, before the settings save has flushed to storage.
// Returns the notification id, or null when nothing was scheduled.
export async function scheduleTaskReminder(task, timeOverride) {
  try {
    await cancelTaskReminder(task?.notificationId);
    if (!task || task.completed || !task.remind || !task.dueDate) return null;
    const time = timeOverride || (await loadSettings()).reminderTime || '09:00';
    const when = reminderDateFor(task.dueDate, task.remindDayOffset || 0, time);
    if (!when) return null;
    const granted = await ensureNotificationPermission();
    if (!granted) return null;
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Task deadline',
        body: task.title,
        data: { taskId: task.id },
      },
      trigger: { date: when },
    });
  } catch (e) {
    console.log('Schedule reminder failed:', e.message);
    return null;
  }
}

export async function cancelTaskReminder(notificationId) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (e) {
    console.log('Cancel reminder failed:', e.message);
  }
}

// For the "Send test notification" button in Settings: fires in 5
// seconds so the user can lock the phone and see it arrive.
export async function sendTestNotification() {
  const granted = await ensureNotificationPermission();
  if (!granted) return { ok: false, reason: 'permission' };
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Todo List',
        body: 'Test notification — reminders are working.',
      },
      trigger: { seconds: 5 },
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

// Fired by the focus timer (Stats) when a session finishes.
export async function sendFocusDoneNotification() {
  const granted = await ensureNotificationPermission();
  if (!granted) return { ok: false, reason: 'permission' };
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Focus session complete',
        body: 'Nice work — time for a short break.',
      },
      trigger: { seconds: 1 },
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}
