// src/components/TagFilterBar.jsx — filter the Home list by one tag.
// Renders nothing when no task uses tags yet.
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function TagFilterBar({ tags, value, onChange }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  if (!tags.length) return null;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {tags.map((tag) => {
        const active = value === tag;
        return (
          <TouchableOpacity
            key={tag}
            onPress={() => onChange(active ? null : tag)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>#{tag}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    row: { gap: 8, paddingHorizontal: 16, paddingTop: 10 },
    chip: {
      borderWidth: 1, borderColor: colors.primary, borderRadius: 999,
      paddingHorizontal: 12, paddingVertical: 5, backgroundColor: colors.card,
    },
    chipActive: { backgroundColor: colors.primary },
    text: { fontWeight: '700', color: colors.primary, fontSize: 12 },
    textActive: { color: colors.white },
  });
}
