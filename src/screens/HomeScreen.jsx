// src/screens/HomeScreen.jsx — PAGE 1: task list.
// Search + status filter + category filter + sorting; pinned tasks float up.
import React, { useMemo, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTodos } from '../context/TodoContext';
import { useSettings } from '../context/SettingsContext';
import { allTags, filterTasks, sortTasks } from '../utils/taskUtils';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import SmartFilterBar, { VIEW_TO_FILTER } from '../components/SmartFilterBar';
import CategoryFilterBar from '../components/CategoryFilterBar';
import TagFilterBar from '../components/TagFilterBar';
import SortBar from '../components/SortBar';

const SORT_SHORT = { created: 'Newest', deadline: 'Deadline', priority: 'Priority', name: 'A–Z' };
import TodoItem from '../components/TodoItem';
import EmptyState from '../components/EmptyState';

export default function HomeScreen({ onAdd, onEdit, updateStatus, onCheckUpdates }) {
  const { todos, stats, toggleTodo, deleteTodo, togglePin } = useTodos();
  const { settings, colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [view, setView] = useState('all'); // unified: smart lists + status
  const [category, setCategory] = useState('all');
  const [tag, setTag] = useState(null);
  const [search, setSearch] = useState('');
  const [showSort, setShowSort] = useState(false);
  const [sortOverride, setSortOverride] = useState(null);
  const sortBy = sortOverride ?? settings.sortBy;

  const tags = useMemo(() => allTags(todos), [todos]);
  const visible = useMemo(() => {
    const { filter, smart } = VIEW_TO_FILTER[view] || VIEW_TO_FILTER.all;
    return sortTasks(filterTasks(todos, { filter, search, category, tag, smart }), sortBy);
  }, [todos, view, search, category, tag, sortBy]);

  return (
    <View style={styles.container}>
      <Header stats={stats} updateStatus={updateStatus} onCheckUpdates={onCheckUpdates} />

      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
        <TouchableOpacity
          style={[styles.sortBtn, showSort && styles.sortBtnActive]}
          onPress={() => setShowSort((s) => !s)}
        >
          <Text style={[styles.sortBtnText, showSort && styles.sortBtnTextActive]}>
            ⇅ {SORT_SHORT[sortBy] || 'Sort'}
          </Text>
        </TouchableOpacity>
      </View>
      {showSort && (
        <View style={styles.sortPanel}>
          <SortBar value={sortBy} onChange={(key) => { setSortOverride(key); setShowSort(false); }} />
        </View>
      )}

      <SmartFilterBar value={view} onChange={setView} />
      <CategoryFilterBar value={category} onChange={setCategory} />
      <TagFilterBar tags={tags} value={tag} onChange={setTag} />

      <FlatList
        style={{ marginTop: 12 }}
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={onEdit}
            onPin={togglePin}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            message={todos.length === 0
              ? 'No tasks yet. Tap "+ New Task" to add your first task.'
              : 'No tasks match this filter or search.'}
          />
        }
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <TouchableOpacity style={styles.fab} onPress={onAdd}>
        <Text style={styles.fabText}>+ New Task</Text>
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    searchRow: { flexDirection: 'row', alignItems: 'flex-start' },
    sortBtn: {
      marginTop: 16, marginRight: 16, height: 47, justifyContent: 'center',
      backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
      borderRadius: 12, paddingHorizontal: 12,
    },
    sortBtnActive: { borderColor: colors.primary },
    sortBtnText: { color: colors.textSecondary, fontWeight: '700', fontSize: 13 },
    sortBtnTextActive: { color: colors.primary },
    sortPanel: {
      marginHorizontal: 16, marginTop: 10, backgroundColor: colors.card,
      borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingBottom: 10,
    },
    fab: {
      position: 'absolute', right: 16, bottom: 16, backgroundColor: colors.primary,
      borderRadius: 999, paddingHorizontal: 20, paddingVertical: 13,
      elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8,
    },
    fabText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  });
}
