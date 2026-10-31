// src/components/SmartFilterBar.jsx — ONE slim rail for all Home views:
// smart lists (Today / Upcoming / Overdue) and status views (Active /
// Completed) live in a single horizontally scrollable row, instead of
// two stacked rows of pills. Value is a "view" key; HomeScreen maps it
// to the filterTasks() arguments.
import React, { useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export const HOME_VIEWS = [
  { key: 'all', label: 'All' },
  { key: 'today', label: '☀️ Today' },
  { key: 'upcoming', label: '📅 Upcoming' },
  { key: 'overdue', label: '⚠️ Overdue' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

// view key -> filterTasks({ filter, smart })
export const VIEW_TO_FILTER = {
  all: { filter: 'all', smart: 'all' },
  today: { filter: 'all', smart: 'today' },
  upcoming: { filter: 'all', smart: 'upcoming' },
  overdue: { filter: 'all', smart: 'overdue' },
  active: { filter: 'active', smart: 'all' },
  completed: { filter: 'completed', smart: 'all' },
};

export default function SmartFilterBar({ value, onChange }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.row}
      >
        {HOME_VIEWS.map((f) => {
          const active = value === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => onChange(f.key)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.text, active && styles.textActive]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    wrap: { height: 44, justifyContent: 'center' },
    scroll: { flexGrow: 0 },
    row: { gap: 8, paddingHorizontal: 16, alignItems: 'center' },
    chip: {
      height: 32, justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
      borderRadius: 999, paddingHorizontal: 13, backgroundColor: colors.card,
    },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    text: { fontWeight: '600', color: colors.chipText, fontSize: 12.5 },
    textActive: { color: colors.white },
  });
}
