// src/components/PrioritySelector.jsx
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PRIORITIES } from '../constants/priorities';
import { useSettings } from '../context/SettingsContext';

export default function PrioritySelector({ value, onChange }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      {PRIORITIES.map((p) => (
        <TouchableOpacity
          key={p.key}
          onPress={() => onChange(p.key)}
          style={[styles.btn, value === p.key && { backgroundColor: p.color, borderColor: p.color }]}
        >
          <Text style={[styles.text, value === p.key && { color: colors.white }]}>{p.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', gap: 8 },
    btn: {
      flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 999,
      paddingVertical: 8, alignItems: 'center',
    },
    text: { fontWeight: '600', color: colors.chipText },
  });
}
