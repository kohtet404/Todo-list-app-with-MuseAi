// src/components/TagFilterBar.jsx — filter the Home list by one tag.
// Renders nothing when no task uses tags yet.
import React, { useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function TagFilterBar({ tags, value, onChange }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  if (!tags.length) return null;
  return (
    // Same fixed-height guard as CategoryFilterBar: horizontal
    // ScrollViews must not be allowed to stretch vertically.
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.row}
      >
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
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    wrap: { height: 40, justifyContent: 'center' },
    scroll: { flexGrow: 0 },
    row: { gap: 8, paddingHorizontal: 16, alignItems: 'center' },
    chip: {
      height: 30, justifyContent: 'center', borderWidth: 1, borderColor: colors.primary,
      borderRadius: 999, paddingHorizontal: 12, backgroundColor: colors.card,
    },
    chipActive: { backgroundColor: colors.primary },
    text: { fontWeight: '700', color: colors.primary, fontSize: 12 },
    textActive: { color: colors.white },
  });
}
