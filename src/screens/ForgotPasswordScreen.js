import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import CustomAlert from '../components/CustomAlert';
import { resetPassword, sentOTP } from '../services/endPoints';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [response, setResponse] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const theme = useTheme();
    const navigation = useNavigation();

    const handleSendOTP = async () => {
        // Basic phone number validation (10 digits)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setError('Please enter a valid phone number.');
            return;
        }
        try {
            const response = await sentOTP(phoneNumber);
            console.log(response);

            if (response.success) {
                setStep(2);
                setError('');
                setAlertType('success');
                setEmail(response.email);
                setResponse({ otp: response.otp });
                setAlertMessage('OTP sent to your email : ' + response.email);
                setAlertVisible(true);
            }
        } catch (error) {
            setAlertType('error');
            setAlertMessage('Failed to send OTP');
            setAlertVisible(true);
        }
    };

    const handleVerifyOTP = () => {
        // Basic OTP validation (4 digits)
        if (otp.length !== 4) {
            setError('Please enter the 4-digit OTP.');
            return;
        }
        try {
            if (otp == response.otp) { // Compare with OTP from API response
                setError('');
                setStep(3);
                setAlertType('success');
                setAlertMessage('OTP verified successfully');
                setAlertVisible(true);
            } else {
                setAlertType('error');
                setAlertMessage('Invalid OTP');
                setAlertVisible(true);
            }
        } catch (error) {
            setAlertType('error');
            setAlertMessage('OTP verification failed');
            setAlertVisible(true);
        }
    };

    const handleResetPassword = async () => {
        // Validate new password and confirmation
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        try {
            const response = await resetPassword(newPassword, phoneNumber);
            console.log(response);

            if (response.success) {
                setAlertType('success');
                setAlertMessage('Reset password successfully');
                setAlertVisible(true);
                setTimeout(() => navigation.navigate('Login'), 2000);
            }
        } catch (error) {
            setAlertType('error');
            setAlertMessage('Failed to reset password');
            setAlertVisible(true);
            setTimeout(() => navigation.navigate('Login'), 2000);
        }
    };

    const renderStep1 = () => (
        <>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>Enter your phone number to receive a verification code to registered email</Text>
            <TextInput
                label="Phone Number"
                value={phoneNumber}
                textColor='#fff'
                onChangeText={setPhoneNumber}
                style={styles.input}
                mode="outlined"
                keyboardType="phone-pad"
                theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }} // Black text, golden border, white input
            />
            <Button
                mode="contained"
                onPress={handleSendOTP}
                style={styles.button}
                labelStyle={styles.buttonText}
            >
                Send Verification Code
            </Button>
        </>
    );

    const renderStep2 = () => (
        <>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>Enter the 4-digit code sent to {email}</Text>
            <TextInput
                label="Verification Code"
                value={otp}
                textColor='#fff'
                onChangeText={setOtp}
                style={styles.input}
                mode="outlined"
                keyboardType="number-pad"
                maxLength={4}
                theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }} // Black text, golden border, white input
            />
            <Button
                mode="contained"
                onPress={handleVerifyOTP}
                style={styles.button}
                labelStyle={styles.buttonText}
            >
                Verify Code
            </Button>
        </>
    );

    const renderStep3 = () => (
        <>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your new password</Text>
            <TextInput
                label="New Password"
                value={newPassword}
                textColor='#fff'
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)} />}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }} // Black text, golden border, white input
            />
            <TextInput
                label="Confirm New Password"
                value={confirmPassword}
                textColor='#fff'
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)} />}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }} // Black text, golden border, white input
            />
            <Button
                mode="contained"
                onPress={handleResetPassword}
                style={styles.button}
                labelStyle={styles.buttonText}
            >
                Reset Password
            </Button>
        </>
    );

    return (
        <ImageBackground
            source={require('../assets/bg.jpg')}
            style={{
                flex: 1,
                width: '100%',
                height: '100%'
            }}
            resizeMode="cover"
        >
            <View style={styles.container}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
            {alertVisible && (
                <CustomAlert
                    type={alertType}
                    message={alertMessage}
                    onClose={() => setAlertVisible(false)}
                />
            )}
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
        // backgroundColor: '#000000', // Black background
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff', // White title text
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#cccccc', // Light gray subtitle text
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#000000', // White input background
    },
    button: {
        marginTop: 10,
        paddingVertical: 6,
        backgroundColor: '#FFD700', // Golden button
    },
    buttonText: {
        fontSize: 16,
        color: '#000000', // Black text on button
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default ForgotPasswordScreen;
