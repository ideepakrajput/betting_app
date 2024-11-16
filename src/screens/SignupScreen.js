import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import SocialLinks from '../components/ContactDetails';
import { register, verifyEmailOTP } from '../services/endPoints.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/userSlice.js';
import CustomAlert from '../components/CustomAlert.js';

const SignupScreen = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [otp, setOtp] = useState('');
    const [response, setResponse] = useState(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);

    // State for input validation
    const [nameError, setNameError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleVerifyEmail = async () => {
        setEmailError('');

        if (!email) {
            setEmailError('Email is required!');
            return;
        }

        try {
            const response = await verifyEmailOTP(email);
            console.log(response);

            if (response.success) {
                setShowOtpInput(true);
                setAlertType('success');
                setResponse({ otp: response.otp });
                setAlertMessage('OTP sent to your email');
                setAlertVisible(true);
            }
        } catch (error) {
            setAlertType('error');
            setAlertMessage('Failed to send OTP');
            setAlertVisible(true);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            if (otp == response.otp) { // Compare with OTP from API response
                setIsEmailVerified(true);
                setShowOtpInput(false);
                setAlertType('success');
                setAlertMessage('Email verified successfully');
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
    const handleSignup = async () => {
        // Reset error messages
        setNameError('');
        setPhoneNumberError('');
        setPasswordError('');

        if (!isEmailVerified) {
            setAlertType('error');
            setAlertMessage('Please verify your email first');
            setAlertVisible(true);
            return;
        }

        let isValid = true;

        // Validate required fields
        if (!name) {
            setNameError('Name is required!');
            isValid = false;
        }
        if (!phoneNumber) {
            setPhoneNumberError('Phone Number is required!');
            isValid = false;
        }
        if (!password) {
            setPasswordError('Password is required!');
            isValid = false;
        }
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match!');
            isValid = false;
        }

        // Stop if validation fails
        if (!isValid) return;

        const userData = { name, phone: phoneNumber, password, referral_code: referralCode, email };
        const registerUser = await register(userData);

        if (registerUser.success) {
            // Registration successful
            setAlertType('success');
            setAlertMessage('You have successfully registered. Please login to continue.');
            setAlertVisible(true);

            await AsyncStorage.setItem('token', registerUser.token);
            await AsyncStorage.setItem('user', JSON.stringify(registerUser.user));
            dispatch(setUser(registerUser.user));
            navigation.navigate('Login');
        } else {
            // Registration failed
            setAlertType('error');
            setAlertMessage(registerUser.message);
            setAlertVisible(true);
        }
    };

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
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Create an account</Text>

                <TextInput
                    label="Name"
                    textColor='#fff'
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
                />
                {/* Show validation message for Name */}
                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

                <TextInput
                    label="Phone Number"
                    textColor='#fff'
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    style={styles.input}
                    keyboardType="phone-pad"
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
                />
                {/* Show validation message for Phone Number */}
                {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}

                <TextInput
                    label="Email"
                    textColor='#fff'
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <Button
                    mode="contained"
                    onPress={handleVerifyEmail}
                    style={[styles.button, { marginBottom: 15 }]}
                    labelStyle={styles.buttonText}
                    disabled={isEmailVerified}
                >
                    {isEmailVerified ? 'Email Verified' : 'Verify Email'}
                </Button>

                {showOtpInput && (
                    <>
                        <TextInput
                            label="Enter OTP"
                            textColor='#fff'
                            value={otp}
                            onChangeText={setOtp}
                            style={styles.input}
                            mode="outlined"
                            keyboardType="numeric"
                            theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
                        />
                        <Button
                            mode="contained"
                            onPress={handleVerifyOTP}
                            style={[styles.button, { marginBottom: 15 }]}
                            labelStyle={styles.buttonText}
                        >
                            Verify OTP
                        </Button>
                    </>
                )}

                <TextInput
                    label="Password"
                    textColor='#fff'
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setPasswordError(''); // Reset error when user starts typing
                    }}
                    secureTextEntry={!showPassword}
                    right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)} />}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
                />
                {/* Show validation message for Password */}
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <TextInput
                    label="Confirm Password"
                    textColor='#fff'
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        setPasswordError(''); // Reset error when user starts typing
                    }}
                    secureTextEntry={!showConfirmPassword}
                    right={<TextInput.Icon icon="eye" onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
                />

                <TextInput
                    label="Referral Code (Optional)"
                    textColor='#fff'
                    value={referralCode}
                    onChangeText={setReferralCode}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
                />

                <Button
                    mode="contained"
                    onPress={handleSignup}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                >
                    Sign Up
                </Button>

                <Button
                    mode="text"
                    onPress={() => { navigation.navigate('Login'); }}
                    style={styles.signInButton}
                    labelStyle={styles.signInButtonText}
                >
                    Already have an account? Sign In
                </Button>

                <SocialLinks />

            </ScrollView>
            {/* Show custom alert */}
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
        // backgroundColor: '#000000',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffffff',
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
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
    signInButton: {
        marginTop: 20,
    },
    signInButtonText: {
        fontSize: 16,
        color: '#FFD700',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default SignupScreen;
