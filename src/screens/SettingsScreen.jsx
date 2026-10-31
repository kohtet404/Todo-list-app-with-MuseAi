// src/screens/SettingsScreen.jsx — PAGE 4: Settings.
// Appearance (theme), new-task defaults, notifications (reminder time),
// lists (built-in + your own), widget help, data (export / import /
// delete all), updates and about.
import React, { useMemo, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Switch, Alert, Share,
  ScrollView, TextInput, Modal,
} from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { useTodos } from '../context/TodoContext';
import { sendTestNotification } from '../services/notifications';
import {
  CATEGORIES, LIST_COLORS, REMINDER_TIMES, formatReminderTime, SORTS,
} from '../constants/priorities';
import { createId } from '../utils/taskUtils';
import PrioritySelector from '../components/PrioritySelector';

export default function SettingsScreen({ updateStatus, onCheckUpdates }) {
  const { settings, updateSetting, colors } = useSettings();
  const {
    todos, stats, deleteAllTodos, exportJson,
    rescheduleAllReminders, reassignCategory, importTodos,
  } = useTodos();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [newListName, setNewListName] = useState('');
  const [newListColor, setNewListColor] = useState(LIST_COLORS[0]);
  const [importVisible, setImportVisible] = useState(false);
  const [importText, setImportText] = useState('');

  const handleTestNotification = async () => {
    const result = await sendTestNotification();
    if (result.ok) {
      Alert.alert('Test scheduled', 'Lock your phone or switch apps — a notification will arrive in about 5 seconds.');
    } else if (result.reason === 'permission') {
      Alert.alert('Permission needed', 'Allow notifications for Todo List in Android Settings > Apps > Todo List > Notifications, then try again.');
    } else {
      Alert.alert('Could not schedule', String(result.reason));
    }
  };

  const handleReminderTime = (time) => {
    updateSetting('reminderTime', time);
    // Re-schedule every active reminder at the new time right away.
    rescheduleAllReminders(time);
  };

  const handleAddList = () => {
    const label = newListName.trim();
    if (!label) return;
    const list = { key: `list_${createId()}`, label, color: newListColor };
    updateSetting('customLists', [...(settings.customLists || []), list]);
    setNewListName('');
  };

  const handleDeleteList = (list) => {
    const count = todos.filter((t) => t.category === list.key).length;
    Alert.alert(
      `Delete list "${list.label}"?`,
      count > 0
        ? `${count} task(s) in this list will be moved to General.`
        : 'This list is empty.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: () => {
            reassignCategory(list.key);
            updateSetting('customLists', settings.customLists.filter((c) => c.key !== list.key));
          },
        },
      ],
    );
  };

  const handleExport = async () => {
    try {
      await Share.share({
        title: 'Todo List backup',
        message: exportJson(),
      });
    } catch (e) {
      Alert.alert('Export failed', e.message);
    }
  };

  const handleImport = async () => {
    const result = await importTodos(importText);
    if (result.ok) {
      setImportVisible(false);
      setImportText('');
      Alert.alert('Import done', `${result.count} task(s) were added from the backup.`);
    } else {
      Alert.alert('Import failed', result.reason);
    }
  };

  const handleDeleteAll = () => {
    Alert.alert('Delete ALL tasks?', `${stats.total} task(s) will be permanently deleted. This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete everything', style: 'destructive',
        onPress: () => {
          deleteAllTodos();
          Alert.alert('Done', 'All tasks have been deleted.');
        },
      },
    ]);
  };

  const themeChip = (key, label) => (
    <TouchableOpacity
      onPress={() => updateSetting('theme', key)}
      style={[styles.chip, settings.theme === key && styles.chipActive]}
    >
      <Text style={[styles.chipText, settings.theme === key && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const listRow = (list, removable) => {
    const count = todos.filter((t) => (t.category || 'general') === list.key).length;
    return (
      <View key={list.key} style={styles.listRow}>
        <View style={[styles.listDot, { backgroundColor: list.color }]} />
        <Text style={styles.listName}>{list.label}</Text>
        <Text style={styles.listCount}>{count} task(s)</Text>
        {removable && (
          <TouchableOpacity onPress={() => handleDeleteList(list)} style={styles.listDelete}>
            <Text style={styles.listDeleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Make the app yours</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Appearance</Text>
        <Text style={styles.label}>Theme</Text>
        <View style={styles.chipRow}>
          {themeChip('light', '☀️ Light')}
          {themeChip('dark', '🌙 Dark')}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>New task defaults</Text>
        <Text style={styles.label}>Default priority</Text>
        <PrioritySelector
          value={settings.defaultPriority}
          onChange={(v) => updateSetting('defaultPriority', v)}
        />
        <Text style={styles.label}>Default sort order</Text>
        <View style={styles.chipRow}>
          {SORTS.map((s) => (
            <TouchableOpacity
              key={s.key}
              onPress={() => updateSetting('sortBy', s.key)}
              style={[styles.chip, settings.sortBy === s.key && styles.chipActive]}
            >
              <Text style={[styles.chipText, settings.sortBy === s.key && styles.chipTextActive]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>Remind by default</Text>
            <Text style={styles.switchSub}>Pre-tick "Remind me" when a new task gets a deadline</Text>
          </View>
          <Switch
            value={settings.remindByDefault}
            onValueChange={(v) => updateSetting('remindByDefault', v)}
            trackColor={{ true: colors.primary }}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notifications</Text>
        <Text style={styles.body}>
          Deadline reminders fire at the time below, on the due date — or
          the day before, if you choose that on a task. Changing the time
          re-schedules all existing reminders. If Android asks, allow
          notifications for this app.
        </Text>
        <Text style={styles.label}>Reminder time</Text>
        <View style={styles.chipRow}>
          {REMINDER_TIMES.map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => handleReminderTime(t.key)}
              style={[styles.chip, settings.reminderTime === t.key && styles.chipActive]}
            >
              <Text style={[styles.chipText, settings.reminderTime === t.key && styles.chipTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.actionBtn} onPress={handleTestNotification}>
          <Text style={styles.actionBtnText}>🔔 Send test notification</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lists</Text>
        <Text style={styles.body}>
          Built-in lists cannot be deleted. Create your own lists
          (projects) below — they appear everywhere lists are used.
        </Text>
        {CATEGORIES.map((c) => listRow(c, false))}
        {(settings.customLists || []).map((c) => listRow(c, true))}
        <Text style={styles.label}>New list</Text>
        <View style={styles.tagInputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="List name, e.g. Farm"
            placeholderTextColor={colors.textMuted}
            value={newListName}
            onChangeText={setNewListName}
            returnKeyType="done"
            onSubmitEditing={handleAddList}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddList}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.chipRow, { marginTop: 10 }]}>
          {LIST_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setNewListColor(c)}
              style={[
                styles.colorDot,
                { backgroundColor: c },
                newListColor === c && styles.colorDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Home-screen widget</Text>
        <Text style={styles.body}>
          Long-press an empty area of your home screen, tap Widgets, find
          "Todo List" and add "Today's Tasks". It shows what is due and
          overdue, and refreshes whenever your tasks change.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Data</Text>
        <Text style={styles.body}>
          {stats.total} task(s) stored on this device ({stats.done} completed).
          Tasks are only on this phone — export a backup before changing phones.
        </Text>
        <TouchableOpacity style={styles.actionBtn} onPress={handleExport}>
          <Text style={styles.actionBtnText}>Export backup (JSON)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setImportVisible(true)}>
          <Text style={styles.actionBtnText}>Import backup (paste JSON)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.dangerBtn]} onPress={handleDeleteAll}>
          <Text style={[styles.actionBtnText, styles.dangerText]}>Delete all tasks</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Updates</Text>
        {!!updateStatus && <Text style={styles.body}>{updateStatus}</Text>}
        <TouchableOpacity style={styles.actionBtn} onPress={onCheckUpdates}>
          <Text style={styles.actionBtnText}>Check for updates</Text>
        </TouchableOpacity>
        <Text style={styles.body}>
          App version 2.1.0. Small fixes and UI changes arrive over-the-air —
          no reinstall needed.
        </Text>
      </View>

      <View style={[styles.card, { marginBottom: 32 }]}>
        <Text style={styles.cardTitle}>About</Text>
        <Text style={styles.body}>
          Todo List — a personal task app built with React Native (Expo).
          Deadlines, reminders at your chosen time, recurring tasks,
          lists, tags, subtasks, smart views, a home-screen widget and
          dark mode. Data stays on your device.
        </Text>
      </View>

      <Modal visible={importVisible} animationType="slide" onRequestClose={() => setImportVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Import backup</Text>
          <Text style={styles.body}>
            Paste the JSON from an exported backup. Tasks are added to
            your current list — nothing is overwritten.
          </Text>
          <TextInput
            style={styles.importInput}
            placeholder='[{"title": "...", ...}]'
            placeholderTextColor={colors.textMuted}
            value={importText}
            onChangeText={setImportText}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={[styles.actionBtn, styles.importBtn]} onPress={handleImport}>
            <Text style={styles.actionBtnText}>Import tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setImportVisible(false)}>
            <Text style={styles.actionBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
      marginHorizontal: 16, marginTop: 16, backgroundColor: colors.card, borderRadius: 16, padding: 16,
      elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
    },
    cardTitle: { fontWeight: '800', color: colors.text, fontSize: 15, marginBottom: 6 },
    label: { fontWeight: '700', color: colors.text, marginBottom: 8, marginTop: 12, fontSize: 13 },
    body: { color: colors.textFaint, fontSize: 13, lineHeight: 19, marginTop: 4 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { fontWeight: '600', color: colors.chipText, fontSize: 13 },
    chipTextActive: { color: colors.white },
    switchRow: {
      flexDirection: 'row', alignItems: 'center', marginTop: 16,
      borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14,
    },
    switchTitle: { fontWeight: '700', color: colors.text },
    switchSub: { color: colors.textFaint, fontSize: 12, marginTop: 2 },
    actionBtn: {
      marginTop: 12, borderWidth: 1, borderColor: colors.primary, borderRadius: 12,
      paddingVertical: 11, alignItems: 'center',
    },
    actionBtnText: { color: colors.primary, fontWeight: '700' },
    dangerBtn: { borderColor: colors.danger },
    dangerText: { color: colors.danger },
    input: {
      borderWidth: 1, borderColor: colors.border, borderRadius: 12,
      padding: 12, fontSize: 14, color: colors.text,
    },
    tagInputRow: { flexDirection: 'row', gap: 8 },
    addBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center' },
    addBtnText: { color: colors.white, fontWeight: '700' },
    listRow: {
      flexDirection: 'row', alignItems: 'center', paddingVertical: 8,
      borderTopWidth: 1, borderTopColor: colors.border, marginTop: 4,
    },
    listDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
    listName: { flex: 1, color: colors.text, fontWeight: '600', fontSize: 14 },
    listCount: { color: colors.textMuted, fontSize: 12, marginRight: 8 },
    listDelete: { paddingVertical: 4, paddingHorizontal: 6 },
    listDeleteText: { color: colors.danger, fontWeight: '700', fontSize: 12 },
    colorDot: { width: 26, height: 26, borderRadius: 13 },
    colorDotActive: { borderWidth: 3, borderColor: colors.text },
    modalContainer: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 56 },
    modalTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 6 },
    importInput: {
      marginTop: 14, borderWidth: 1, borderColor: colors.border, borderRadius: 12,
      padding: 12, minHeight: 180, textAlignVertical: 'top', color: colors.text,
      backgroundColor: colors.card, fontSize: 12,
    },
    importBtn: { backgroundColor: colors.primarySoft },
  });
}
