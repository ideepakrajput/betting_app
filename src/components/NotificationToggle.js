import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Linking, AppState } from 'react-native';
import { Switch } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';

const NotificationToggle = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotificationState();
        checkNotificationPermissions();
    }, []);

    // Check system notification permissions
    const checkNotificationPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
                const hasPermission = await PermissionsAndroid.check(permission);
                if (!hasPermission) {
                    setIsEnabled(false);
                    await AsyncStorage.setItem('notificationsEnabled', 'false');
                }
            } catch (error) {
                console.error('Error checking permissions:', error);
            }
        }
    };

    // Load notification state from AsyncStorage
    const loadNotificationState = async () => {
        try {
            const savedState = await AsyncStorage.getItem('notificationsEnabled');
            const enabled = savedState === 'true';
            setIsEnabled(enabled);
            setLoading(false);
        } catch (error) {
            console.error('Error loading notification state:', error);
            setLoading(false);
        }
    };

    // Open system notification settings
    const openNotificationSettings = async () => {
        if (Platform.OS === 'android') {
            try {
                if (Platform.Version >= 26) {
                    await Linking.openSettings();
                } else {
                    await Linking.openSettings();
                }
            } catch (error) {
                console.error('Error opening settings:', error);
            }
        }
    };

    // Request notification permissions
    const requestUserPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
                const hasPermission = await PermissionsAndroid.check(permission);

                if (!hasPermission) {
                    const granted = await PermissionsAndroid.request(permission);
                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        // If permission denied, prompt to open settings
                        await openNotificationSettings();
                        return false;
                    }
                }
            }

            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            return enabled;
        } catch (error) {
            console.error('Permission request error:', error);
            return false;
        }
    };

    // Handle toggle switch
    const toggleSwitch = async () => {
        try {
            const newState = !isEnabled;

            if (newState) {
                const hasPermission = await requestUserPermission();
                if (!hasPermission) {
                    console.log('Permission denied, opening settings...');
                    await openNotificationSettings();
                    return;
                }
            }

            // Update local state
            setIsEnabled(newState);

            // Save to AsyncStorage
            await AsyncStorage.setItem('notificationsEnabled', String(newState));

            if (newState) {
                // Get FCM token
                const token = await messaging().getToken();
                console.log('FCM Token:', token);
                // Here you would typically send this token to your backend
            } else {
                // Delete the token when notifications are disabled
                await messaging().deleteToken();
            }

        } catch (error) {
            console.error('Error toggling notifications:', error);
            // Revert the switch if there was an error
            setIsEnabled(isEnabled);
        }
    };

    // Function to check if notifications are enabled at the system level
    const checkSystemNotifications = async () => {
        if (Platform.OS === 'android') {
            try {
                const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
                const hasPermission = await PermissionsAndroid.check(permission);
                if (!hasPermission && isEnabled) {
                    setIsEnabled(false);
                    await AsyncStorage.setItem('notificationsEnabled', 'false');
                    await messaging().deleteToken();
                }
            } catch (error) {
                console.error('Error checking system notifications:', error);
            }
        }
    };

    // Add a listener for when the app comes to the foreground
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                checkSystemNotifications();
            }
        });

        return () => {
            subscription.remove();
        };
    }, [isEnabled]);

    if (loading) {
        return null; // Or a loading spinner
    }

    return (
        <View style={styles.container}>
            <Switch
                value={isEnabled}
                onValueChange={toggleSwitch}
                color="#FFD700"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

export default NotificationToggle;