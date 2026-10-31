# Todo List — Final (v2.1.0)

React Native (Expo SDK 51) todo app. Single complete project — see
**FINAL_SETUP.md** for the build/link walkthrough (Burmese).

Features: tasks with priority, lists (built-in + your own custom
lists), tags, notes, subtasks, pinning, duplicate, deadlines with
calendar, reminder notifications at a Settings-chosen time of day
(on the due date or the day before, per task), recurring tasks
(daily/weekly/monthly), smart lists (Today / Upcoming / Overdue),
search, list + tag filters, sorting (newest / deadline / priority /
A–Z), statistics with weekly count and day streak, a focus timer,
a Settings page (dark mode, defaults, reminder time, list manager,
backup export + import, delete all), an Android home-screen widget
("Today's Tasks"), a remaining-count badge on the Tasks tab, and
OTA updates via EAS Update after the one-time APK install.

Not included on purpose: cloud sync / accounts (needs a server) —
everything works fully offline, data stays on the device.

Code layout (all UI text in English):
- App.jsx / App.js — entry only
- src/screens/ — HomeScreen, CompletedScreen, StatsScreen, SettingsScreen, AddEditTaskScreen
- src/components/ — Header, TodoItem, SearchBar, FilterBar, SmartFilterBar, CategoryFilterBar, TagFilterBar, SortBar, PrioritySelector, CategorySelector, RecurrenceSelector, CalendarPicker, SubtaskEditor, StatsCard, FocusTimer, EmptyState, BottomTabBar
- src/context/ — SettingsContext (theme + defaults + reminder time + custom lists), TodoContext (tasks + notifications + widget sync)
- src/storage/ — AsyncStorage ('@todos_v1', '@settings_v1')
- src/services/notifications.js — deadline reminders (expo-notifications 0.28.19)
- src/widgets/ — TodayWidget (react-native-android-widget 0.14.1)
- src/hooks/useUpdates.js, src/navigation/AppNavigator.jsx, src/utils/taskUtils.js, src/theme/colors.js, src/constants/priorities.js
