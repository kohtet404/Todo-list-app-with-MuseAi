// src/components/BottomTabBar.jsx — simple tab bar, no navigation library:
// a tab state in AppNavigator decides which page renders. JS-only, so it
// never forces a rebuild by itself.
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { useTodos } from '../context/TodoContext';

const TABS = [
  { key: 'home', label: 'Tasks', icon: '📋' },
  { key: 'completed', label: 'Completed', icon: '✅' },
  { key: 'stats', label: 'Stats', icon: '📊' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function BottomTabBar({ activeTab, onChange }) {
  const { colors } = useSettings();
  const { stats } = useTodos();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => (
        <TouchableOpacity key={tab.key} style={styles.tab} onPress={() => onChange(tab.key)}>
          <View style={[styles.iconWrap, activeTab === tab.key && styles.iconWrapActive]}>
            <Text style={styles.icon}>{tab.icon}</Text>
            {tab.key === 'home' && stats.remaining > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{stats.remaining > 99 ? '99+' : stats.remaining}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.label, activeTab === tab.key && styles.labelActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function makeStyles(colors) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row', backgroundColor: colors.card, borderTopWidth: 1,
      borderTopColor: colors.border, paddingTop: 8, paddingBottom: 18,
    },
    tab: { flex: 1, alignItems: 'center' },
    iconWrap: { paddingHorizontal: 14, paddingVertical: 3, borderRadius: 999 },
    iconWrapActive: { backgroundColor: colors.primarySoft },
    icon: { fontSize: 20 },
    badge: {
      position: 'absolute', top: -4, right: -14, minWidth: 18, height: 18,
      borderRadius: 9, backgroundColor: colors.danger, alignItems: 'center',
      justifyContent: 'center', paddingHorizontal: 4,
    },
    badgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
    label: { fontSize: 12, color: colors.textMuted, fontWeight: '600', marginTop: 2 },
    labelActive: { color: colors.primary },
  });
}
