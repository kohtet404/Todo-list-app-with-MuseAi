// src/components/TodoItem.jsx — one task row.
// Circle = complete, body tap = edit, 📌 = pin to top, 🗑 = delete.
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PRIORITY_COLOR, resolveCategory } from '../constants/priorities';
import { formatDate, formatDueLabel, getDueStatus, subtaskProgress } from '../utils/taskUtils';
import { useSettings } from '../context/SettingsContext';

export default function TodoItem({ todo, onToggle, onDelete, onEdit, onPin }) {
  const { settings, colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const dueStatus = getDueStatus(todo);
  const subs = subtaskProgress(todo);
  const category = resolveCategory(todo.category, settings.customLists);

  return (
    <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: PRIORITY_COLOR[todo.priority] || PRIORITY_COLOR.medium }]}>
      <TouchableOpacity
        style={[styles.checkbox, todo.completed && styles.checkboxDone]}
        onPress={() => onToggle(todo.id)}
      >
        <Text style={styles.checkText}>{todo.completed ? '✓' : ''}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.body} onPress={() => onEdit(todo)} activeOpacity={0.7}>
        <Text style={[styles.title, todo.completed && styles.titleDone]}>
          {todo.pinned ? '📌 ' : ''}{todo.title}
        </Text>
        {!!todo.notes && (
          <Text style={styles.notes} numberOfLines={1}>{todo.notes}</Text>
        )}
        <View style={styles.meta}>
          <View style={[styles.badge, { backgroundColor: PRIORITY_COLOR[todo.priority] || PRIORITY_COLOR.medium }]}>
            <Text style={styles.badgeText}>{(todo.priority || 'medium').toUpperCase()}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: category.color }]}>
            <Text style={styles.badgeText}>{category.label.toUpperCase()}</Text>
          </View>
          {!!todo.dueDate && (
            <View style={[
              styles.badge, styles.dueBadge,
              dueStatus === 'overdue' && !todo.completed && styles.dueBadgeOverdue,
              dueStatus === 'today' && !todo.completed && styles.dueBadgeToday,
            ]}>
              <Text style={[
                styles.dueText,
                dueStatus === 'overdue' && !todo.completed && styles.dueTextAlert,
                dueStatus === 'today' && !todo.completed && styles.dueTextToday,
              ]}>
                📅 {formatDueLabel(todo)}
                {todo.remind && !todo.completed ? (todo.remindDayOffset === 1 ? ' 🔔−1d' : ' 🔔') : ''}
              </Text>
            </View>
          )}
          {(todo.tags || []).map((tag) => (
            <Text key={tag} style={styles.tagText}>#{tag}</Text>
          ))}
          {subs.total > 0 && (
            <Text style={styles.subText}>☑ {subs.done}/{subs.total}</Text>
          )}
          {!!todo.recurring && <Text style={styles.subText}>🔁 {todo.recurring}</Text>}
          <Text style={styles.date}>{formatDate(todo.createdAt)}</Text>
        </View>
      </TouchableOpacity>

      {!!onPin && (
        <TouchableOpacity onPress={() => onPin(todo.id)} style={styles.iconBtn}>
          <Text style={[styles.pinText, todo.pinned && styles.pinTextActive]}>📌</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => onDelete(todo.id)} style={styles.iconBtn}>
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
      marginHorizontal: 16, marginBottom: 10, borderRadius: 14, padding: 14,
      elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6,
    },
    checkbox: {
      width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.primary,
      alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    checkboxDone: { backgroundColor: colors.primary },
    checkText: { color: colors.white, fontWeight: '800' },
    body: { flex: 1 },
    title: { fontSize: 16, fontWeight: '600', color: colors.text },
    titleDone: { textDecorationLine: 'line-through', color: colors.textMuted },
    notes: { color: colors.textFaint, fontSize: 13, marginTop: 2 },
    meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 6 },
    badge: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
    badgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
    dueBadge: { backgroundColor: colors.border },
    dueBadgeOverdue: { backgroundColor: colors.dangerSoft },
    dueBadgeToday: { backgroundColor: colors.primarySoft },
    dueText: { fontSize: 10, fontWeight: '700', color: colors.textFaint },
    dueTextAlert: { color: colors.danger },
    dueTextToday: { color: colors.primary },
    subText: { color: colors.textFaint, fontSize: 11, fontWeight: '600' },
    tagText: { color: colors.primary, fontSize: 11, fontWeight: '700' },
    date: { color: colors.textMuted, fontSize: 12 },
    iconBtn: { padding: 5 },
    pinText: { fontSize: 15, opacity: 0.35 },
    pinTextActive: { opacity: 1 },
    deleteText: { fontSize: 17 },
  });
}
