// src/navigation/AppNavigator.jsx — decides WHICH page is on screen.
// No navigation library: a tab state + an editor state is enough, so page
// switching itself never needs a native rebuild.
import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTodos } from '../context/TodoContext';
import { useSettings } from '../context/SettingsContext';
import BottomTabBar from '../components/BottomTabBar';
import HomeScreen from '../screens/HomeScreen';
import CompletedScreen from '../screens/CompletedScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddEditTaskScreen from '../screens/AddEditTaskScreen';

export default function AppNavigator({ updateStatus, onCheckUpdates }) {
  const { addTodo, updateTodo, duplicateTodo } = useTodos();
  const { colors } = useSettings();
  const styles = useMemo(
    () => StyleSheet.create({
      container: { flex: 1, backgroundColor: colors.background },
      body: { flex: 1 },
    }),
    [colors],
  );
  const [activeTab, setActiveTab] = useState('home'); // home | completed | stats | settings
  const [editor, setEditor] = useState(null); // null = closed, { task: null | todo }

  const openAdd = () => setEditor({ task: null });
  const openEdit = (task) => setEditor({ task });
  const closeEditor = () => setEditor(null);

  const handleSave = ({ id, title, priority, extras }) => {
    if (id) updateTodo(id, title, priority, extras);
    else addTodo(title, priority, extras);
    closeEditor();
  };

  const handleDuplicate = (task) => {
    duplicateTodo(task.id);
    closeEditor();
  };

  // The editor is a full page that replaces the tabs while it is open.
  if (editor) {
    return (
      <AddEditTaskScreen
        task={editor.task}
        onSave={handleSave}
        onCancel={closeEditor}
        onDuplicate={handleDuplicate}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        {activeTab === 'home' && (
          <HomeScreen
            onAdd={openAdd}
            onEdit={openEdit}
            updateStatus={updateStatus}
            onCheckUpdates={onCheckUpdates}
          />
        )}
        {activeTab === 'completed' && <CompletedScreen onEdit={openEdit} />}
        {activeTab === 'stats' && <StatsScreen />}
        {activeTab === 'settings' && (
          <SettingsScreen updateStatus={updateStatus} onCheckUpdates={onCheckUpdates} />
        )}
      </View>
      <BottomTabBar activeTab={activeTab} onChange={setActiveTab} />
    </View>
  );
}
