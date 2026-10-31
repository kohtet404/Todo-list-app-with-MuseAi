// src/screens/HomeScreen.jsx — PAGE 1: task list.
// Search + status filter + category filter + sorting; pinned tasks float up.
import React, { useMemo, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTodos } from '../context/TodoContext';
import { useSettings } from '../context/SettingsContext';
import { allTags, filterTasks, sortTasks } from '../utils/taskUtils';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import SmartFilterBar from '../components/SmartFilterBar';
import CategoryFilterBar from '../components/CategoryFilterBar';
import TagFilterBar from '../components/TagFilterBar';
import SortBar from '../components/SortBar';
import TodoItem from '../components/TodoItem';
import EmptyState from '../components/EmptyState';

export default function HomeScreen({ onAdd, onEdit, updateStatus, onCheckUpdates }) {
  const { todos, stats, toggleTodo, deleteTodo, togglePin } = useTodos();
  const { settings, colors } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [smart, setSmart] = useState('all');
  const [tag, setTag] = useState(null);
  const [search, setSearch] = useState('');
  const [sortOverride, setSortOverride] = useState(null);
  const sortBy = sortOverride ?? settings.sortBy;

  const tags = useMemo(() => allTags(todos), [todos]);
  const visible = useMemo(
    () => sortTasks(filterTasks(todos, { filter, search, category, tag, smart }), sortBy),
    [todos, filter, search, category, tag, smart, sortBy],
  );

  return (
    <View style={styles.container}>
      <Header stats={stats} updateStatus={updateStatus} onCheckUpdates={onCheckUpdates} />
      <SearchBar value={search} onChangeText={setSearch} />
      <SmartFilterBar value={smart} onChange={setSmart} />
      <FilterBar filter={filter} onChange={setFilter} />
      <CategoryFilterBar value={category} onChange={setCategory} />
      <TagFilterBar tags={tags} value={tag} onChange={setTag} />
      <SortBar value={sortBy} onChange={setSortOverride} />

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
    fab: {
      position: 'absolute', right: 16, bottom: 16, backgroundColor: colors.primary,
      borderRadius: 999, paddingHorizontal: 20, paddingVertical: 13,
      elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8,
    },
    fabText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  });
}
