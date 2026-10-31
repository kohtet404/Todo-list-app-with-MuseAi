// src/screens/StatsScreen.jsx — PAGE 3: progress + insights.
// (Notifications testing and update checking live in Settings now.)
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTodos } from '../context/TodoContext';
import { useSettings } from '../context/SettingsContext';
import { allCategories } from '../constants/priorities';
import {
  completedThisWeek, completionStreak, getDueStatus, isOverdue,
} from '../utils/taskUtils';
import StatsCard from '../components/StatsCard';
import FocusTimer from '../components/FocusTimer';

export default function StatsScreen() {
  const { todos, stats } = useTodos();
  const { settings, colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const insights = useMemo(() => ({
    overdue: todos.filter((t) => isOverdue(t)).length,
    dueToday: todos.filter((t) => !t.completed && getDueStatus(t) === 'today').length,
    pinned: todos.filter((t) => t.pinned && !t.completed).length,
    recurring: todos.filter((t) => t.recurring && !t.completed).length,
  }), [todos]);

  const momentum = useMemo(() => ({
    week: completedThisWeek(todos),
    streak: completionStreak(todos),
  }), [todos]);

  const byCategory = useMemo(
    () => allCategories(settings.customLists).map((c) => ({
      ...c,
      count: todos.filter((t) => (t.category || 'general') === c.key && !t.completed).length,
    })).filter((c) => c.count > 0),
    [todos, settings.customLists],
  );

  const row = (label, value, color) => (
    <View key={label} style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, color && { color }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Your progress at a glance</Text>
      </View>

      <StatsCard stats={stats} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Needs attention</Text>
        {row('Overdue', insights.overdue, insights.overdue > 0 ? colors.danger : undefined)}
        {row('Due today', insights.dueToday)}
        {row('Pinned', insights.pinned)}
        {row('Repeating', insights.recurring)}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Momentum</Text>
        {row('Completed this week', momentum.week)}
        {row('Day streak 🔥', momentum.streak)}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Focus timer</Text>
        <FocusTimer />
      </View>

      {byCategory.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Open tasks by category</Text>
          {byCategory.map((c) => row(c.label, c.count, c.color))}
        </View>
      )}
    </ScrollView>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.primaryDark, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
    title: { fontSize: 28, fontWeight: '800', color: colors.white },
    subtitle: { color: colors.primaryLight, marginTop: 6, fontSize: 14 },
    card: {
      marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.card, borderRadius: 16, padding: 16,
      elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
    },
    cardTitle: { fontWeight: '800', color: colors.text, fontSize: 15, marginBottom: 8 },
    row: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingVertical: 7, borderTopWidth: 1, borderTopColor: colors.border,
    },
    rowLabel: { color: colors.textSecondary, fontSize: 14 },
    rowValue: { color: colors.text, fontWeight: '800', fontSize: 15 },
  });
}
