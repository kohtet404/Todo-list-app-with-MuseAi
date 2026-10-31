// src/components/FocusTimer.jsx — a small Pomodoro-style focus timer
// (TickTick's signature extra), written in plain JS: pick a length
// (preset or any custom minutes), start, and a notification arrives
// when the session ends. It is a work timer, NOT an app blocker —
// it never locks you out of other apps. A session can be paused or
// ENDED early at any time, and the session is persisted so closing
// the app does not lose it; the finish notification is scheduled up
// front, so it fires on time even if you never reopen the app.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useSettings } from '../context/SettingsContext';
import { ensureNotificationPermission } from '../services/notifications';

const LENGTHS = [15, 25, 50]; // minutes
// The running/paused session is persisted here, so closing the app
// (even swiping it away) does not lose it: reopen and the timer is
// still counting — and can still be ended early.
const FOCUS_KEY = '@focus_v1';

const saveSession = (obj) => AsyncStorage.setItem(FOCUS_KEY, JSON.stringify(obj)).catch(() => {});
const clearSession = () => AsyncStorage.removeItem(FOCUS_KEY).catch(() => {});

function formatClock(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export default function FocusTimer() {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [minutes, setMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [customText, setCustomText] = useState('');
  const notifIdRef = useRef(null);
  const endAtRef = useRef(null);

  const cancelPending = async () => {
    if (notifIdRef.current) {
      try {
        await Notifications.cancelScheduledNotificationAsync(notifIdRef.current);
      } catch (e) { /* already gone */ }
      notifIdRef.current = null;
    }
  };

  // Restore a session that was in progress when the app was closed.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(FOCUS_KEY);
        if (!raw) return;
        const s = JSON.parse(raw);
        if (s.endAt && s.endAt > Date.now()) {
          setMinutes(s.minutes || 25);
          endAtRef.current = s.endAt;
          notifIdRef.current = s.notifId || null;
          setRemaining(Math.max(0, Math.round((s.endAt - Date.now()) / 1000)));
          setRunning(true);
        } else if (s.pausedRemaining) {
          setMinutes(s.minutes || 25);
          setRemaining(s.pausedRemaining);
        } else {
          clearSession(); // it finished while the app was away
        }
      } catch (e) { /* corrupt state: start fresh */ }
    })();
  }, []);

  // Tick once per second, always deriving the remainder from the
  // target end time so background throttling cannot drift the clock.
  useEffect(() => {
    if (!running) return undefined;
    const tick = () => {
      const left = Math.round((endAtRef.current - Date.now()) / 1000);
      setRemaining(Math.max(0, left));
      if (left <= 0) {
        setRunning(false);
        notifIdRef.current = null;
        clearSession();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [running]);

  const pickLength = (m) => {
    cancelPending();
    clearSession();
    setMinutes(m);
    setRemaining(m * 60);
    setRunning(false);
  };

  // Manual length: any whole number of minutes from 1 to 480.
  const applyCustom = () => {
    const value = parseInt(customText, 10);
    if (!Number.isFinite(value)) return;
    const clamped = Math.min(480, Math.max(1, value));
    setCustomText('');
    pickLength(clamped);
  };

  const handleStart = async () => {
    const startFrom = remaining > 0 ? remaining : minutes * 60;
    if (remaining === 0) setRemaining(startFrom);
    const granted = await ensureNotificationPermission();
    endAtRef.current = Date.now() + startFrom * 1000;
    if (granted) {
      try {
        notifIdRef.current = await Notifications.scheduleNotificationAsync({
          content: {
            title: '🎯 Focus session complete',
            body: 'Nice work — time for a short break.',
          },
          trigger: { seconds: startFrom },
        });
      } catch (e) {
        console.log('Focus notification failed:', e.message);
      }
    }
    saveSession({ endAt: endAtRef.current, minutes, notifId: notifIdRef.current });
    setRunning(true);
  };

  const handlePause = async () => {
    const left = endAtRef.current
      ? Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000))
      : remaining;
    setRemaining(left);
    setRunning(false);
    await cancelPending();
    saveSession({ pausedRemaining: left, minutes });
  };

  // End the session before it finishes: stop the clock, cancel the
  // scheduled finish notification, forget the saved session.
  const handleEnd = async () => {
    setRunning(false);
    await cancelPending();
    clearSession();
    setRemaining(minutes * 60);
  };

  const finished = remaining === 0 && !running;

  return (
    <View>
      <View style={styles.chipRow}>
        {LENGTHS.map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => pickLength(m)}
            style={[styles.chip, minutes === m && styles.chipActive]}
          >
            <Text style={[styles.chipText, minutes === m && styles.chipTextActive]}>{m} min</Text>
          </TouchableOpacity>
        ))}
        {!LENGTHS.includes(minutes) && (
          <View style={[styles.chip, styles.chipActive]}>
            <Text style={styles.chipTextActive}>{minutes} min</Text>
          </View>
        )}
      </View>

      <View style={styles.customRow}>
        <TextInput
          style={styles.customInput}
          placeholder="Custom minutes (1–480)"
          placeholderTextColor={colors.textMuted}
          value={customText}
          onChangeText={setCustomText}
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={applyCustom}
        />
        <TouchableOpacity style={styles.customBtn} onPress={applyCustom}>
          <Text style={styles.customBtnText}>Set</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.clock}>{formatClock(remaining)}</Text>
      {finished && <Text style={styles.doneText}>Session complete 🎉</Text>}

      <View style={styles.btnRow}>
        {!running ? (
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleStart}>
            <Text style={styles.btnPrimaryText}>{remaining < minutes * 60 && remaining > 0 ? 'Resume' : 'Start focus'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={handlePause}>
            <Text style={styles.btnText}>Pause</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.btn} onPress={handleEnd}>
          <Text style={styles.btnText}>⏹ End session</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>
        A notification is scheduled for the end of the session, so it
        still arrives if you switch apps. You can end the session early
        at any time — the session is remembered even if you close the
        app, so Pause / End always work when you come back.
      </Text>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { fontWeight: '600', color: colors.chipText, fontSize: 13 },
    chipTextActive: { color: colors.white, fontWeight: '600', fontSize: 13 },
    customRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
    customInput: {
      flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 10,
      paddingHorizontal: 12, paddingVertical: 9, color: colors.text, fontSize: 14,
    },
    customBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 18, justifyContent: 'center' },
    customBtnText: { color: colors.white, fontWeight: '700' },
    clock: {
      fontSize: 44, fontWeight: '800', color: colors.primary,
      textAlign: 'center', marginTop: 14,
    },
    doneText: { textAlign: 'center', color: colors.success, fontWeight: '700', marginTop: 2 },
    btnRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
    btn: {
      flex: 1, borderWidth: 1, borderColor: colors.primary, borderRadius: 12,
      paddingVertical: 11, alignItems: 'center',
    },
    btnPrimary: { backgroundColor: colors.primary },
    btnText: { color: colors.primary, fontWeight: '700' },
    btnPrimaryText: { color: colors.white, fontWeight: '700' },
    hint: { color: colors.textFaint, fontSize: 12, marginTop: 10, lineHeight: 17 },
  });
}
