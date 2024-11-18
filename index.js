/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

// Function to subscribe to topic
async function subscribeToTopic() {
    try {
        await messaging().subscribeToTopic('all');
        // console.log('Subscribed to topic: all');
    } catch (error) {
        console.error('Error subscribing to topic:', error);
    }
}

// Function to get FCM token
async function getFCMToken() {
    try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            // console.log('FCM Token:', fcmToken);
            // Subscribe to topic after getting token
            await subscribeToTopic();
            return fcmToken;
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
    }
}

// Listen for token refresh
messaging().onTokenRefresh(async token => {
    // console.log('New token:', token);
    // Resubscribe to topic when token refreshes
    await subscribeToTopic();
});

// Helper function to display notifications
async function displayNotification(message) {
    try {
        if (!message?.notification?.title && !message?.notification?.body) {
            // console.warn('Notification received without title or body');
            return;
        }

        await notifee.displayNotification({
            title: message.notification.title,
            body: message.notification.body,
            android: {
                channelId: 'default',
                pressAction: {
                    id: 'default',
                },
                priority: 'high',
            },
            ios: {
                foregroundPresentationOptions: {
                    alert: true,
                    badge: true,
                    sound: true,
                },
            },
        });
    } catch (error) {
        console.error('Error displaying notification:', error);
    }
}

// Initialize notification channel for Android
async function createNotificationChannel() {
    try {
        await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: 4, // High importance
        });
    } catch (error) {
        console.error('Error creating notification channel:', error);
    }
}

// Create notification channel on app start
createNotificationChannel();

// Handle background messages
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    // console.log('Message handled in the background:', remoteMessage);
    // await displayNotification(remoteMessage);
});

// Handle foreground messages
messaging().onMessage(async (remoteMessage) => {
    // console.log('New FCM message arrived:', remoteMessage);
    await displayNotification(remoteMessage);
});

// Handle notification interaction events
notifee.onBackgroundEvent(async ({ type, detail }) => {
    try {
        // console.log('Notification event:', { type, detail });

        switch (type) {
            case EventType.PRESS:
                // console.log('User pressed notification:', detail);
                // Add your navigation logic here
                break;

            case EventType.ACTION_PRESS:
                // console.log('User pressed action button:', detail.pressAction);
                // Handle specific action button press
                break;

            case EventType.DISMISSED:
                // console.log('User dismissed notification:', detail);
                break;

            default:
            // console.log('Unhandled event type:', type);
        }
    } catch (error) {
        console.error('Error handling notification event:', error);
    }
});

// Request notification permissions
async function requestUserPermission() {
    try {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            // console.log('Authorization status:', authStatus);
            // Get token and subscribe to topic after permission is granted
            const token = await getFCMToken();
            // console.log('Initial FCM token:', token);
        } else {
            console.log('User declined push notifications');
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
    }
}

// Request permissions and get token on app start
requestUserPermission();

// Register the application
AppRegistry.registerComponent(appName, () => App);