// src/components/CategoryFilterBar.jsx — horizontal category filter for Home.
import React, { useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    // Fixed-height wrapper: a horizontal ScrollView left to size itself
    // inside the Home column can stretch vertically on some devices and
    // the chips turn into tall ovals. The height is pinned here so that
    // can never happen.
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.row}
      >
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
      borderRadius: 999, paddingHorizontal: 12, backgroundColor: colors.card,
    },
    text: { fontWeight: '600', color: colors.chipText, fontSize: 12 },
    textActive: { color: colors.white },
  });
}
