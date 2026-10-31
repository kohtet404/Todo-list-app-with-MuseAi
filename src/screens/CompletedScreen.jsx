// src/screens/CompletedScreen.jsx — PAGE 2: completed tasks only.
import React, { useMemo } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTodos } from '../context/TodoContext';
import { useSettings } from '../context/SettingsContext';
import { onlyCompleted } from '../utils/taskUtils';
import TodoItem from '../components/TodoItem';
import EmptyState from '../components/EmptyState';

export default function CompletedScreen({ onEdit }) {
  const { todos, toggleTodo, deleteTodo, clearCompleted, togglePin } = useTodos();
  const { colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const completed = useMemo(() => onlyCompleted(todos), [todos]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Completed</Text>
        <Text style={styles.subtitle}>{completed.length} task(s) done</Text>
      </View>

      {completed.length > 0 && (
        <TouchableOpacity onPress={clearCompleted} style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear all completed</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={completed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} onEdit={onEdit} onPin={togglePin} />
        )}
        ListEmptyComponent={<EmptyState emoji="✅" message="Nothing completed yet. Finish a task and it will appear here." />}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      />
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.primaryDark, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
    title: { fontSize: 28, fontWeight: '800', color: colors.white },
    subtitle: { color: colors.primaryLight, marginTop: 6, fontSize: 14 },
    clearBtn: { alignSelf: 'flex-end', margin: 16, marginBottom: 0 },
    clearText: { color: colors.danger, fontWeight: '700' },
  });
}
