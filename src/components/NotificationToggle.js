import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch, Text, Surface, useTheme, Caption } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const NotificationToggle = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load saved notification state on component mount
    useEffect(() => {
        loadNotificationState();
    }, []);

    // Load notification state from AsyncStorage
    const loadNotificationState = async () => {
        try {
            const savedState = await AsyncStorage.getItem('notificationsEnabled');
            setIsEnabled(savedState === 'true');
            setLoading(false);
        } catch (error) {
            console.error('Error loading notification state:', error);
            setLoading(false);
        }
    };

    // Request notification permissions
    const requestUserPermission = async () => {
        try {
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
                // If turning on notifications, request permissions
                const hasPermission = await requestUserPermission();
                if (!hasPermission) {
                    throw new Error('Notification permission denied');
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