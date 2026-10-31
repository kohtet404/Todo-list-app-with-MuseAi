// src/components/FocusTimer.jsx — a small Pomodoro-style focus timer
// (TickTick's signature extra), written in plain JS: pick a length,
// start, and a notification arrives when the session ends.
// Note: the countdown runs while the app is open; if you leave the
// app for a long time, the finish notification is still scheduled
// up front, so it fires on time anyway.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useSettings } from '../context/SettingsContext';
import { ensureNotificationPermission } from '../services/notifications';

const LENGTHS = [15, 25, 50]; // minutes

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
  const notifIdRef = useRef(null);
  const endAtRef = useRef(null);

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
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [running]);

  const pickLength = (m) => {
    setMinutes(m);
    setRemaining(m * 60);
    setRunning(false);
  };

  const handleStart = async () => {
    const granted = await ensureNotificationPermission();
    endAtRef.current = Date.now() + remaining * 1000;
    if (granted) {
      try {
        notifIdRef.current = await Notifications.scheduleNotificationAsync({
          content: {
            title: '🎯 Focus session complete',
            body: 'Nice work — time for a short break.',
          },
          trigger: { seconds: remaining },
        });
      } catch (e) {
        console.log('Focus notification failed:', e.message);
      }
    }
    setRunning(true);
  };

  const handlePause = async () => {
    setRunning(false);
    if (notifIdRef.current) {
      try {
        await Notifications.cancelScheduledNotificationAsync(notifIdRef.current);
      } catch (e) { /* already gone */ }
      notifIdRef.current = null;
    }
  };

  const handleReset = () => {
    handlePause();
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
        <TouchableOpacity style={styles.btn} onPress={handleReset}>
          <Text style={styles.btnText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>
        A notification is scheduled for the end of the session, so it
        still arrives if you switch apps.
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
    chipTextActive: { color: colors.white },
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
