// src/components/CalendarPicker.jsx — a small month calendar written in
// plain React Native (no date-picker library), so it stays OTA-updatable.
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { toDateKey, todayKey } from '../utils/taskUtils';
import { useSettings } from '../context/SettingsContext';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPicker({ value, onChange }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const initial = value
    ? { y: Number(value.slice(0, 4)), m: Number(value.slice(5, 7)) - 1 }
    : { y: new Date().getFullYear(), m: new Date().getMonth() };
  const [view, setView] = useState(initial);
  const today = todayKey();

  const moveMonth = (delta) => {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  const firstDayOffset = (new Date(view.y, view.m, 1).getDay() + 6) % 7; // Monday start
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => moveMonth(-1)} style={styles.navBtn}>
          <Text style={styles.navText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{MONTHS[view.m]} {view.y}</Text>
        <TouchableOpacity onPress={() => moveMonth(1)} style={styles.navBtn}>
          <Text style={styles.navText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((w) => (
          <Text key={w} style={styles.weekday}>{w}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((day, i) => {
          if (!day) return <View key={`empty-${i}`} style={styles.cell} />;
          const key = toDateKey(new Date(view.y, view.m, day));
          const selected = key === value;
          const isToday = key === today;
          const isPast = key < today;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.cell, selected && styles.cellSelected, !selected && isToday && styles.cellToday]}
              onPress={() => onChange(key)}
            >
              <Text style={[
                styles.dayText,
                isPast && !selected && styles.dayPast,
                selected && styles.daySelected,
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    wrap: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 10 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    navBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
    navText: { fontSize: 24, color: colors.primary, fontWeight: '700' },
    monthLabel: { fontWeight: '700', color: colors.text, fontSize: 15 },
    weekRow: { flexDirection: 'row' },
    weekday: { flex: 1, textAlign: 'center', color: colors.textMuted, fontSize: 11, fontWeight: '700', paddingVertical: 4 },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    cell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 999 },
    cellSelected: { backgroundColor: colors.primary },
    cellToday: { borderWidth: 1, borderColor: colors.primary },
    dayText: { color: colors.text, fontSize: 14 },
    dayPast: { color: colors.textMuted },
    daySelected: { color: colors.white, fontWeight: '800' },
  });
}
