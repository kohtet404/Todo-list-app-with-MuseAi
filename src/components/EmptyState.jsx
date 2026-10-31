// src/components/EmptyState.jsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function EmptyState({ emoji = '📋', message }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.empty}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 32 },
    emoji: { fontSize: 44 },
    text: { textAlign: 'center', color: colors.textFaint, marginTop: 12, lineHeight: 22 },
  });
}
