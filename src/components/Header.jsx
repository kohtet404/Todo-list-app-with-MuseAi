// src/components/Header.jsx
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function Header({ stats, updateStatus, onCheckUpdates }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.header}>
      <Text style={styles.title}>My Todo List</Text>
      <Text style={styles.subtitle}>
        {stats.total} total • {stats.done} done • {stats.remaining} remaining
      </Text>
      {!!updateStatus && <Text style={styles.updateStatus}>{updateStatus}</Text>}
      {!!onCheckUpdates && (
        <TouchableOpacity onPress={onCheckUpdates}>
          <Text style={styles.updateLink}>Check for updates</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    header: { backgroundColor: colors.primaryDark, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
    title: { fontSize: 28, fontWeight: '800', color: colors.white },
    subtitle: { color: colors.primaryLight, marginTop: 6, fontSize: 14 },
    updateStatus: { color: colors.primarySoft, marginTop: 6, fontSize: 13 },
    updateLink: { color: colors.white, marginTop: 8, fontSize: 13, textDecorationLine: 'underline' },
  });
}
