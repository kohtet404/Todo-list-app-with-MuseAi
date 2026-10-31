// src/widgets/TodayWidget.jsx — the home-screen widget UI.
// IMPORTANT: these are NOT normal React Native components. FlexWidget /
// TextWidget come from react-native-android-widget and are converted to
// real Android widget views — regular RN <View>/<Text> will not work here.
//
// Each task row has a real CHECKBOX: tapping it fires a WIDGET_CLICK
// action (handled in widgetTaskHandler.jsx) which completes the task
// in storage and redraws the widget. Tapping anywhere else on the
// widget opens the app (OPEN_APP).
import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { getDueStatus, formatDueLabel } from '../utils/taskUtils';

export const WIDGET_NAME = 'TodoToday';
export const TOGGLE_TASK_ACTION = 'TOGGLE_TASK';

// Pick what the widget shows from the full task list: active tasks,
// overdue first, then due today / upcoming by date, then the rest.
export function buildWidgetData(todos, now = new Date()) {
  const active = todos.filter((t) => !t.completed);
  const weight = (t) => {
    const s = getDueStatus(t, now);
    if (s === 'overdue') return 0;
    if (s === 'today') return 1;
    if (s === 'tomorrow') return 2;
    if (t.dueDate) return 3;
    return 4;
  };
  const sorted = [...active].sort((a, b) => {
    const w = weight(a) - weight(b);
    if (w !== 0) return w;
    if (a.dueDate && b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
    return 0;
  });
  return {
    remaining: active.length,
    overdueCount: active.filter((t) => getDueStatus(t, now) === 'overdue').length,
    items: sorted.slice(0, 4).map((t) => ({
      id: t.id,
      title: t.title,
      label: formatDueLabel(t, now),
      overdue: getDueStatus(t, now) === 'overdue',
      today: getDueStatus(t, now) === 'today',
    })),
  };
}

export default function TodayWidget({ data }) {
  const { remaining, overdueCount, items } = data;
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 16,
      }}
    >
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextWidget text="✓ Todo List" style={{ fontSize: 16, fontWeight: '700', color: '#4f46e5' }} />
        <TextWidget
          text={remaining === 1 ? '1 to do' : `${remaining} to do`}
          style={{ fontSize: 13, color: '#64748b' }}
        />
      </FlexWidget>

      {overdueCount > 0 && (
        <TextWidget
          text={overdueCount === 1 ? '1 task overdue' : `${overdueCount} tasks overdue`}
          style={{ fontSize: 12, color: '#ef4444', fontWeight: '700' }}
        />
      )}

      {items.length === 0 ? (
        <TextWidget
          text="All done 🎉 Tap to add a task."
          style={{ fontSize: 13, color: '#94a3b8' }}
        />
      ) : (
        items.map((item) => (
          <FlexWidget
            key={item.id}
            style={{
              width: 'match_parent',
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 5,
              paddingBottom: 5,
            }}
          >
            {/* The checkbox: its own click action completes the task
                without opening the app. */}
            <FlexWidget
              clickAction={TOGGLE_TASK_ACTION}
              clickActionData={{ taskId: item.id }}
              style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                borderWidth: 2,
                borderColor: '#4f46e5',
                backgroundColor: '#eef2ff',
                marginRight: 10,
              }}
            />
            <TextWidget
              text={item.title}
              truncate="END"
              maxLines={1}
              style={{ fontSize: 14, color: '#0f172a' }}
            />
            {!!item.label && (
              <TextWidget
                text={`   ${item.label}`}
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: item.overdue ? '#ef4444' : item.today ? '#4f46e5' : '#94a3b8',
                }}
              />
            )}
          </FlexWidget>
        ))
      )}
    </FlexWidget>
  );
}
