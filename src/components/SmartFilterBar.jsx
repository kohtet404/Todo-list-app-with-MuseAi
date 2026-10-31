// src/components/SmartFilterBar.jsx — smart lists (All / Today /
// Upcoming / Overdue), the Todoist/TickTick-style quick views.
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SMART_FILTERS } from '../constants/priorities';
import { useSettings } from '../context/SettingsContext';

export default function SmartFilterBar({ value, onChange }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      {SMART_FILTERS.map((f) => {
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
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingTop: 10 },
    chip: {
      borderWidth: 1, borderColor: colors.border, borderRadius: 999,
      paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.card,
    },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    text: { fontWeight: '600', color: colors.chipText, fontSize: 12 },
    textActive: { color: colors.white },
  });
}
