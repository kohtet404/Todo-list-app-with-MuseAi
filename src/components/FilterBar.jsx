// src/components/FilterBar.jsx — All / Active / Completed pills.
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FILTERS } from '../constants/priorities';
import { useSettings } from '../context/SettingsContext';

export default function FilterBar({ filter, onChange }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      {FILTERS.map((f) => (
        <TouchableOpacity
          key={f.key}
          onPress={() => onChange(f.key)}
          style={[styles.btn, filter === f.key && styles.btnActive]}
        >
          <Text style={[styles.text, filter === f.key && styles.textActive]}>{f.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginTop: 12 },
    btn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.border },
    btnActive: { backgroundColor: colors.primary },
    text: { color: colors.textSecondary, fontWeight: '600' },
    textActive: { color: colors.white },
  });
}
