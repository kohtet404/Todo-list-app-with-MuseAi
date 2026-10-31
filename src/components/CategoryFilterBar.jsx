// src/components/CategoryFilterBar.jsx — horizontal category filter for Home.
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { allCategories } from '../constants/priorities';
import { useSettings } from '../context/SettingsContext';

export default function CategoryFilterBar({ value, onChange }) {
  const { settings, colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const options = [
    { key: 'all', label: 'All categories', color: colors.primary },
    ...allCategories(settings.customLists),
  ];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((c) => {
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
    </ScrollView>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    row: { gap: 8, paddingHorizontal: 16, paddingTop: 10 },
    chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.card },
    text: { fontWeight: '600', color: colors.chipText, fontSize: 12 },
    textActive: { color: colors.white },
  });
}
