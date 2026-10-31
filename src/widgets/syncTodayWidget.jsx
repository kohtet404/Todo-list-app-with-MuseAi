// src/widgets/syncTodayWidget.jsx — push the latest task data to any
// home-screen widgets right away (called by TodoContext whenever tasks
// change, so the widget does not have to wait for its periodic update).
import React from 'react';
import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import TodayWidget, { WIDGET_NAME, buildWidgetData } from './TodayWidget';

export async function syncTodayWidget(todos) {
  if (Platform.OS !== 'android') return;
  try {
    await requestWidgetUpdate({
      widgetName: WIDGET_NAME,
      renderWidget: () => <TodayWidget data={buildWidgetData(todos)} />,
      widgetNotFound: () => {},
    });
  } catch (e) {
    // No widget on the home screen, or the native module is missing
    // (old APK) — both are fine, the app must never fail because of this.
  }
}
