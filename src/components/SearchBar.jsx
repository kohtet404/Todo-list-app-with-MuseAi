// src/components/SearchBar.jsx
import React, { useMemo } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function SearchBar({ value, onChangeText }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <TextInput
      style={styles.search}
      placeholder="Search tasks..."
      placeholderTextColor={colors.textMuted}
      value={value}
      onChangeText={onChangeText}
    />
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    search: {
      margin: 16, marginBottom: 0, backgroundColor: colors.card, borderRadius: 12,
      padding: 12, borderWidth: 1, borderColor: colors.border, color: colors.text,
    },
  });
}
