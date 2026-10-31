// src/components/CategorySelector.jsx — category chips for the task editor.
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { allCategories } from '../constants/priorities';
import { useSettings } from '../context/SettingsContext';

export default function CategorySelector({ value, onChange }) {
  const { settings, colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      {allCategories(settings.customLists).map((c) => {
        const active = value === c.key;
        return (
          <TouchableOpacity
            key={c.key}
            onPress={() => onChange(c.key)}
            style={[styles.chip, active && { backgroundColor: c.color, borderColor: c.color }]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{c.label}</Text>
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
    text: { fontWeight: '600', color: colors.chipText, fontSize: 13 },
    textActive: { color: colors.white },
  });
}
