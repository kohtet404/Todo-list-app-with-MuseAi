// src/components/StatsCard.jsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export default function StatsCard({ stats }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.card}>
      <Text style={styles.progress}>{stats.progress}%</Text>
      <Text style={styles.label}>completed</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${stats.progress}%` }]} />
      </View>
      <View style={styles.row}>
        <View style={styles.cell}><Text style={styles.num}>{stats.total}</Text><Text style={styles.cellLabel}>Total</Text></View>
        <View style={styles.cell}><Text style={styles.num}>{stats.done}</Text><Text style={styles.cellLabel}>Done</Text></View>
        <View style={styles.cell}><Text style={styles.num}>{stats.remaining}</Text><Text style={styles.cellLabel}>Remaining</Text></View>
      </View>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    card: {
      margin: 16, backgroundColor: colors.card, borderRadius: 16, padding: 20,
      elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, alignItems: 'center',
    },
    progress: { fontSize: 40, fontWeight: '800', color: colors.primary },
    label: { color: colors.textFaint, marginBottom: 12 },
    barBg: { width: '100%', height: 10, borderRadius: 999, backgroundColor: colors.border, overflow: 'hidden' },
    barFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 999 },
    row: { flexDirection: 'row', width: '100%', marginTop: 18 },
    cell: { flex: 1, alignItems: 'center' },
    num: { fontSize: 20, fontWeight: '800', color: colors.text },
    cellLabel: { color: colors.textFaint, fontSize: 12, marginTop: 2 },
  });
}
