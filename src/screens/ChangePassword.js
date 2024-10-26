import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { changePassword } from '../services/endPoints.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/CustomAlert.js';
import { ScrollView } from 'react-native-gesture-handler';

const ChangePasswordScreen = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');

    const navigation = useNavigation();

    const handleChangePassword = async () => {
        // Reset error messages
        setCurrentPasswordError('');
        setNewPasswordError('');
        setConfirmNewPasswordError('');

        // Validate inputs
        let isValid = true;

        if (!currentPassword) {
            setCurrentPasswordError('Current password is required.');
            isValid = false;
        }
        if (!newPassword) {
            setNewPasswordError('New password is required.');
            isValid = false;
        }
        if (newPassword !== confirmNewPassword) {
            setConfirmNewPasswordError('New passwords do not match!');
            isValid = false;
        }

        if (!isValid) return; // Stop if validation fails

        const userData = { currentPassword, newPassword };
        const result = await changePassword(userData);

        if (result.success) {
            // Password change successful
            setAlertType('success');
            setAlertMessage('Password changed successfully.');
            setAlertVisible(true);

            // Optional: navigate to another screen, like Profile
            setTimeout(() => navigation.navigate('Profile'), 2000);
        } else {
            // Password change failed
            setAlertType('error');
            setAlertMessage(result.message);
            setAlertVisible(true);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Change Password</Text>

            <TextInput
                label="Current Password"
                value={currentPassword}
                textColor='#fff'
                onChangeText={(text) => {
                    setCurrentPassword(text);
                    setCurrentPasswordError(''); // Reset error when user starts typing
                }}
                secureTextEntry={!showCurrentPassword}
                right={<TextInput.Icon icon="eye" onPress={() => setShowCurrentPassword(!showCurrentPassword)} />}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
            />
            {currentPasswordError ? <Text style={styles.errorText}>{currentPasswordError}</Text> : null}

            <TextInput
                label="New Password"
                value={newPassword}
                textColor='#fff'
                onChangeText={(text) => {
                    setNewPassword(text);
                    setNewPasswordError(''); // Reset error when user starts typing
                }}
                secureTextEntry={!showNewPassword}
                right={<TextInput.Icon icon="eye" onPress={() => setShowNewPassword(!showNewPassword)} />}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
            />
            {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}

            <TextInput
                label="Confirm New Password"
                value={confirmNewPassword}
                textColor='#fff'
                onChangeText={(text) => {
                    setConfirmNewPassword(text);
                    setConfirmNewPasswordError(''); // Reset error when user starts typing
                }}
                secureTextEntry={!showConfirmNewPassword}
                right={<TextInput.Icon icon="eye" onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)} />}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
            />
            {confirmNewPasswordError ? <Text style={styles.errorText}>{confirmNewPasswordError}</Text> : null}

            <Button
                mode="contained"
                onPress={handleChangePassword}
                style={styles.button}
                labelStyle={styles.buttonText}
            >
                Change Password
            </Button>

            {/* Show custom alert */}
            {alertVisible && (
                <CustomAlert
                    type={alertType}
                    message={alertMessage}
                    onClose={() => setAlertVisible(false)}
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,

        backgroundColor: '#000000',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffffff',
        marginBottom: 20,
    },
    input: {
        marginBottom: 10, // Adjusted margin for better spacing
        backgroundColor: '#000000',
    },
    button: {
        marginTop: 10,
        paddingVertical: 6,
        backgroundColor: '#FFD700',
    },
    buttonText: {
        fontSize: 16,
        color: '#000000',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default ChangePasswordScreen;
