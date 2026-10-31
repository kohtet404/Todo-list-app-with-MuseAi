// src/screens/AddEditTaskScreen.jsx — PAGE: add a new task, or edit one.
// Fields: title, notes, priority, category, deadline (+calendar),
// reminder switch, repeat, subtasks. New-task defaults come from Settings.
import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Switch,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { useTodos } from '../context/TodoContext';
import { formatReminderTime } from '../constants/priorities';
import { addDaysKey, allTags, formatDueLabel, todayKey } from '../utils/taskUtils';
import PrioritySelector from '../components/PrioritySelector';
import CategorySelector from '../components/CategorySelector';
import RecurrenceSelector from '../components/RecurrenceSelector';
import CalendarPicker from '../components/CalendarPicker';
import SubtaskEditor from '../components/SubtaskEditor';

export default function AddEditTaskScreen({ task, onSave, onCancel, onDuplicate }) {
  const { settings, colors } = useSettings();
  const { todos } = useTodos();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const isEditing = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [priority, setPriority] = useState(task?.priority || settings.defaultPriority);
  const [category, setCategory] = useState(task?.category || 'general');
  const [dueDate, setDueDate] = useState(task?.dueDate || null);
  const [remind, setRemind] = useState(task?.remind ?? settings.remindByDefault);
  const [remindDayOffset, setRemindDayOffset] = useState(task?.remindDayOffset || 0);
  const [tags, setTags] = useState(task?.tags || []);
  const [tagDraft, setTagDraft] = useState('');
  const [recurring, setRecurring] = useState(task?.recurring || null);
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);
  const [showCalendar, setShowCalendar] = useState(false);

  const suggestions = useMemo(
    () => allTags(todos).filter((t) => !tags.includes(t)),
    [todos, tags],
  );

  const addTag = (raw) => {
    const tag = (raw || '').trim().toLowerCase().replace(/\s+/g, '-').replace(/^#+/, '');
    if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag]);
    setTagDraft('');
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: task?.id,
      title,
      priority,
      extras: {
        notes: notes.trim(),
        category,
        dueDate,
        remind: dueDate ? remind : false,
        remindDayOffset,
        tags,
        recurring,
        subtasks,
      },
    });
  };

  const pickQuick = (key) => {
    setShowCalendar(false);
    if (key === 'none') { setDueDate(null); setRemind(false); }
    if (key === 'today') setDueDate(todayKey());
    if (key === 'tomorrow') setDueDate(addDaysKey(1));
    if (key === 'week') setDueDate(addDaysKey(7));
  };

  const chip = (key, label, active) => (
    <TouchableOpacity
      key={key}
      onPress={() => (key === 'pick' ? setShowCalendar((s) => !s) : pickQuick(key))}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const isCustomDate = dueDate && ![todayKey(), addDaysKey(1), addDaysKey(7)].includes(dueDate);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Task' : 'New Task'}</Text>
      </View>

      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.label}>Task</Text>
          <TextInput
            style={styles.input}
            placeholder="What do you need to do?"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            returnKeyType="done"
            autoFocus
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Add details... (optional)"
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <Text style={styles.label}>Priority</Text>
          <PrioritySelector value={priority} onChange={setPriority} />

          <Text style={styles.label}>Category</Text>
          <CategorySelector value={category} onChange={setCategory} />

          <Text style={styles.label}>Deadline</Text>
          <View style={styles.chipRow}>
            {chip('none', 'No deadline', !dueDate)}
            {chip('today', 'Today', dueDate === todayKey())}
            {chip('tomorrow', 'Tomorrow', dueDate === addDaysKey(1))}
            {chip('week', 'In 1 week', dueDate === addDaysKey(7))}
            {chip('pick', 'Pick a date…', !!isCustomDate || showCalendar)}
          </View>

          {showCalendar && (
            <View style={{ marginTop: 10 }}>
              <CalendarPicker
                value={dueDate}
                onChange={(key) => { setDueDate(key); setShowCalendar(false); }}
              />
            </View>
          )}

          {!!dueDate && (
            <Text style={styles.dueSummary}>
              Due: {formatDueLabel({ dueDate, completed: false })}
            </Text>
          )}

          {!!dueDate && (
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Remind me</Text>
                <Text style={styles.switchSub}>
                  Notification at {formatReminderTime(settings.reminderTime)}
                  {remindDayOffset === 1 ? ', the day before' : ' on the due date'}
                  {' '}(time is set in Settings)
                </Text>
              </View>
              <Switch value={remind} onValueChange={setRemind} trackColor={{ true: colors.primary }} />
            </View>
          )}

          {!!dueDate && remind && (
            <View style={[styles.chipRow, { marginTop: 10 }]}>
              <TouchableOpacity
                onPress={() => setRemindDayOffset(0)}
                style={[styles.chip, remindDayOffset === 0 && styles.chipActive]}
              >
                <Text style={[styles.chipText, remindDayOffset === 0 && styles.chipTextActive]}>On the due date</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRemindDayOffset(1)}
                style={[styles.chip, remindDayOffset === 1 && styles.chipActive]}
              >
                <Text style={[styles.chipText, remindDayOffset === 1 && styles.chipTextActive]}>1 day before</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>Tags</Text>
          {tags.length > 0 && (
            <View style={styles.chipRow}>
              {tags.map((tag) => (
                <TouchableOpacity key={tag} style={[styles.chip, styles.chipActive]} onPress={() => setTags(tags.filter((t) => t !== tag))}>
                  <Text style={styles.chipTextActive}>#{tag} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={styles.tagInputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Add a tag, e.g. urgent"
              placeholderTextColor={colors.textMuted}
              value={tagDraft}
              onChangeText={setTagDraft}
              onSubmitEditing={() => addTag(tagDraft)}
              returnKeyType="done"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.tagAddBtn} onPress={() => addTag(tagDraft)}>
              <Text style={styles.saveBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
          {suggestions.length > 0 && (
            <View style={[styles.chipRow, { marginTop: 8 }]}>
              {suggestions.slice(0, 8).map((tag) => (
                <TouchableOpacity key={tag} style={styles.chip} onPress={() => addTag(tag)}>
                  <Text style={styles.chipText}>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Repeat</Text>
          <RecurrenceSelector value={recurring} onChange={setRecurring} />
          {!!recurring && (
            <Text style={styles.hint}>
              When you complete this task, the next one is created automatically.
            </Text>
          )}

          <Text style={styles.label}>Subtasks</Text>
          <SubtaskEditor subtasks={subtasks} onChange={setSubtasks} />

          <TouchableOpacity
            style={[styles.saveBtn, !title.trim() && styles.saveBtnDisabled]}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>{isEditing ? 'Save changes' : '+ Add task'}</Text>
          </TouchableOpacity>

          {isEditing && !!onDuplicate && (
            <TouchableOpacity
              onPress={() => onDuplicate(task)}
              style={[styles.saveBtn, styles.duplicateBtn]}
            >
              <Text style={styles.duplicateText}>⧉ Duplicate this task</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.primaryDark, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: colors.white },
    card: {
      margin: 16, backgroundColor: colors.card, borderRadius: 16, padding: 16,
      elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8,
    },
    label: { fontWeight: '700', color: colors.text, marginBottom: 8, marginTop: 14 },
    input: {
      borderWidth: 1, borderColor: colors.border, borderRadius: 12,
      padding: 12, fontSize: 16, color: colors.text,
    },
    notesInput: { minHeight: 64, textAlignVertical: 'top', fontSize: 14 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
    chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { fontWeight: '600', color: colors.chipText, fontSize: 13 },
    chipTextActive: { color: colors.white },
    dueSummary: { marginTop: 10, color: colors.primary, fontWeight: '700' },
    switchRow: {
      flexDirection: 'row', alignItems: 'center', marginTop: 16,
      borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14,
    },
    switchTitle: { fontWeight: '700', color: colors.text },
    switchSub: { color: colors.textFaint, fontSize: 12, marginTop: 2 },
    hint: { color: colors.textFaint, fontSize: 12, marginTop: 8, lineHeight: 17 },
    tagInputRow: { flexDirection: 'row', gap: 8 },
    tagAddBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center' },
    duplicateBtn: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.primary, marginTop: 10 },
    duplicateText: { color: colors.primary, fontWeight: '700', fontSize: 15 },
    saveBtn: { backgroundColor: colors.primary, marginTop: 18, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
    saveBtnDisabled: { opacity: 0.5 },
    saveBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
    cancelBtn: { alignItems: 'center', marginTop: 12 },
    cancelText: { color: colors.textFaint },
  });
}
