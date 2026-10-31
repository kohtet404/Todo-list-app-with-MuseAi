// src/hooks/useUpdates.js — OTA update logic, extracted from App.jsx.
// Works only in an installed build (APK/AAB), not in Expo Go / __DEV__.
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Updates from 'expo-updates';

export function useUpdates() {
  const [updateStatus, setUpdateStatus] = useState('');

  // Check automatically once, on app start.
  useEffect(() => {
    (async () => {
      if (__DEV__ || !Updates.isEnabled) return;
      try {
        const result = await Updates.checkForUpdateAsync();
        if (result.isAvailable) {
          setUpdateStatus('Update found, downloading...');
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.log('Update check failed:', e.message);
      }
    })();
  }, []);

  const checkUpdateManually = async () => {
    if (__DEV__ || !Updates.isEnabled) {
      Alert.alert('Updates', 'OTA updates only work in an installed build (APK/AAB), not in Expo Go.');
      return;
    }
    try {
      setUpdateStatus('Checking for updates...');
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert('Update ready', 'The app will restart with the new version.');
        await Updates.reloadAsync();
      } else {
        Alert.alert('Up to date', 'You already have the latest version.');
      }
    } catch (e) {
      Alert.alert('Update failed', e.message);
    } finally {
      setUpdateStatus('');
    }
  };

  return { updateStatus, checkUpdateManually };
}
export default useUpdates;
