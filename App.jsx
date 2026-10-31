// App.jsx — entry point ONLY. All real work lives in src/, split by job:
//   src/screens/    one file per page (Home, Completed, Stats, Settings, AddEdit)
//   src/components/ reusable UI pieces (Header, TodoItem, CalendarPicker, ...)
//   src/context/    SettingsContext (theme + defaults) and TodoContext (tasks)
//   src/storage/    AsyncStorage load/save (tasks + settings)
//   src/services/   local notifications (deadline reminders)
//   src/widgets/    Android home-screen widget (Today's Tasks)
//   src/utils/      pure helpers (filter, search, sort, stats, dates)
//   src/theme/      light + dark palettes     src/constants/ priorities,
//                   categories, recurrences, sort orders
//   src/hooks/      OTA updates    src/navigation/ which page is shown
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { SettingsProvider } from './src/context/SettingsContext';
import { TodoProvider } from './src/context/TodoContext';
import { useUpdates } from './src/hooks/useUpdates';
import { widgetTaskHandler } from './src/widgets/widgetTaskHandler';
import AppNavigator from './src/navigation/AppNavigator';

// Register the widget's headless task at the top level of the entry file:
// Android starts this same JS bundle (without showing the app) whenever
// the home-screen widget needs to draw.
registerWidgetTaskHandler(widgetTaskHandler);

function Root() {
  const { updateStatus, checkUpdateManually } = useUpdates();
  return (
    <TodoProvider>
      {/* Header is indigo in both themes, so status bar icons stay light. */}
      <StatusBar style="light" />
      <AppNavigator updateStatus={updateStatus} onCheckUpdates={checkUpdateManually} />
    </TodoProvider>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <Root />
    </SettingsProvider>
  );
}
