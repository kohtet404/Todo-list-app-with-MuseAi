// src/components/SortBar.jsx — sort order chips for the Home list.
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SORTS } from '../constants/priorities';
import { useSettings } from '../context/SettingsContext';

export default function SortBar({ value, onChange }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      <Text style={styles.label}>Sort:</Text>
      {SORTS.map((s) => (
        <TouchableOpacity key={s.key} onPress={() => onChange(s.key)}>
          <Text style={[styles.text, value === s.key && styles.textActive]}>{s.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingTop: 10 },
    label: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
    text: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
    textActive: { color: colors.primary, textDecorationLine: 'underline' },
  });
}
