// src/widgets/widgetTaskHandler.jsx — runs in a headless JS context when
// Android asks the widget to draw (added to home screen, resized, or its
// periodic update fires). It reads the same AsyncStorage data the app
// uses and renders the widget from it. Registered in App.jsx.
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import TodayWidget, { buildWidgetData } from './TodayWidget';
import { STORAGE_KEY } from '../storage/todoStorage';

async function loadTodosSafe() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function widgetTaskHandler({ widgetAction, renderWidget }) {
  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      const todos = await loadTodosSafe();
      renderWidget(<TodayWidget data={buildWidgetData(todos)} />);
      break;
    }
    default:
      break;
  }
}
