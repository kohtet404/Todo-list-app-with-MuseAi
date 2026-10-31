// src/components/RecurrenceSelector.jsx — Does not repeat / Daily / Weekly / Monthly.
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RECURRENCES } from '../constants/priorities';
import { useSettings } from '../context/SettingsContext';

export default function RecurrenceSelector({ value, onChange }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      {RECURRENCES.map((r) => {
        const active = value === r.key;
        return (
          <TouchableOpacity
            key={r.label}
            onPress={() => onChange(r.key)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{r.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    text: { fontWeight: '600', color: colors.chipText, fontSize: 13 },
    textActive: { color: colors.white },
  });
}
