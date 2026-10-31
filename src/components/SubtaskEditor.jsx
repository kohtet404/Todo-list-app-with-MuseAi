// src/components/SubtaskEditor.jsx — checklist editor inside Add/Edit Task.
// Subtasks are plain { id, title, completed } objects on the task.
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createId } from '../utils/taskUtils';
import { useSettings } from '../context/SettingsContext';

export default function SubtaskEditor({ subtasks, onChange }) {
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [draft, setDraft] = useState('');

  const add = () => {
    const title = draft.trim();
    if (!title) return;
    onChange([...subtasks, { id: createId(), title, completed: false }]);
    setDraft('');
  };
  const toggle = (id) =>
    onChange(subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
  const remove = (id) => onChange(subtasks.filter((s) => s.id !== id));

  return (
    <View>
      {subtasks.map((s) => (
        <View key={s.id} style={styles.row}>
          <TouchableOpacity
            style={[styles.box, s.completed && styles.boxDone]}
            onPress={() => toggle(s.id)}
          >
            <Text style={styles.boxText}>{s.completed ? '✓' : ''}</Text>
          </TouchableOpacity>
          <Text style={[styles.title, s.completed && styles.titleDone]}>{s.title}</Text>
          <TouchableOpacity onPress={() => remove(s.id)} style={styles.removeBtn}>
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a subtask..."
          placeholderTextColor={colors.textMuted}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={add}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addBtn} onPress={add}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
    box: {
      width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.primary,
      alignItems: 'center', justifyContent: 'center', marginRight: 10,
    },
    boxDone: { backgroundColor: colors.primary },
    boxText: { color: colors.white, fontWeight: '800', fontSize: 12 },
    title: { flex: 1, color: colors.text, fontSize: 14 },
    titleDone: { textDecorationLine: 'line-through', color: colors.textMuted },
    removeBtn: { padding: 4 },
    removeText: { color: colors.textMuted, fontSize: 14 },
    addRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
    input: {
      flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 10,
      paddingHorizontal: 10, paddingVertical: 8, color: colors.text, fontSize: 14,
    },
    addBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 14, justifyContent: 'center' },
    addBtnText: { color: colors.white, fontWeight: '700' },
  });
}
