import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import SocialLinks from '../components/ContactDetails';
import { checkUserWithPhone, getContacts, login } from '../services/endPoints';
import { useDispatch } from 'react-redux';
import CustomAlert from '../components/CustomAlert';  // Import CustomAlert component
import { setUser } from '../redux/slices/userSlice';  // Assuming this is the correct action
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [contacts, setContacts] = useState([]);
    // const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (alertVisible) {
            const timer = setTimeout(() => {
                setAlertVisible(false);
            }, 5000); // Auto-dismiss after 5 seconds

            return () => clearTimeout(timer);  // Clean up timeout if component unmounts or changes
        }
    }, [alertVisible]);
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const { contacts } = await getContacts();
                if (contacts) {
                    setContacts(contacts);
                }
            } catch (error) {
                console.log('Error fetching contacts:', error);
            }
        };

        fetchContacts();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            setPhoneNumber('');
            setPassword('');
            setStep(1);
        }, [])
    );

    const handleContinue = async () => {
        try {
            if (step === 1) {
                if (!phoneNumber) {
                    setAlertType('error');
                    setAlertMessage('Phone number is required.');
                    setAlertVisible(true);
                    return;
                }
                const response = await checkUserWithPhone({ phone: phoneNumber });

                if (response.success) {
                    setAlertType('success');
                    setAlertMessage('Phone number verified. Please enter your password.');
                    setAlertVisible(true);
                    setStep(2);
                } else {
                    setAlertType('error');
                    setAlertMessage(response.message);
                    setAlertVisible(true);
                    setStep(1);
                }
            } else {
                if (!password) {
                    setAlertType('error');
                    setAlertMessage('Password is required.');
                    setAlertVisible(true);
                    return;
                }
                const response = await login({ phone: phoneNumber, password });

                if (response.success) {
                    // Successful login
                    await AsyncStorage.setItem('token', response.token);
                    await AsyncStorage.setItem('user', JSON.stringify(response.user));
                    dispatch(setUser(response.user));
                    console.log('Login successful:', response);

                    setAlertType('success');
                    setAlertMessage('Login successful. Redirecting to Home.');
                    setAlertVisible(true);

                    // navigation.dispatch(
                    //     CommonActions.reset({
                    //         index: 0,
                    //         routes: [{ name: 'MainTabs' }],
                    //     })
                    // );
                    navigation.navigate('MainTabs');
                } else {
                    // Login failed
                    setAlertType('error');
                    setAlertMessage(response.message || 'Login failed. Please check your credentials.');
                    setAlertVisible(true);
                }
            }
        } catch (error) {
            // Handle different types of errors
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setAlertMessage('Bad request. Please check your input.');
                        break;
                    case 401:
                        setAlertMessage('Unauthorized. Please log in again.');
                        // You might want to redirect to login or refresh token here
                        break;
                    case 403:
                        setAlertMessage('Forbidden. You do not have permission to perform this action.');
                        break;
                    case 404:
                        setAlertMessage('Resource not found. Please try again later.');
                        break;
                    case 500:
                        setAlertMessage('Server error. Please try again later.');
                        break;
                    default:
                        setAlertMessage('An error occurred. Please try again.');
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.log('Error request:', error.request);
                setAlertMessage('No response received from server. Please check your internet connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error message:', error.message);
                setAlertMessage('An error occurred while setting up the request.');
            }

            setAlertType('error');
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
            <View style={styles.container}>
                <Text style={styles.title}>Welcome Back</Text>

                {step === 1 ? (
                    <View>
                        <TextInput
                            label="Phone Number"
                            value={phoneNumber}
                            textColor='#fff'
                            onChangeText={setPhoneNumber}
                            style={styles.input}
                            keyboardType="phone-pad"
                            mode="outlined"
                            theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }} // Black text on white background
                        />
                    </View>
                ) : (
                    <TextInput
                        label="Password"
                        value={password}
                        textColor='#fff'
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)} />}
                        style={styles.input}
                        mode="outlined"
                        theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }} // Black text on white background
                    />
                )}

                <Button
                    mode="contained"
                    onPress={handleContinue}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                >
                    {step === 1 ? 'Continue' : 'Sign In'}
                </Button>

                <Button
                    mode="text"
                    onPress={() => { navigation.navigate("Signup") }}
                    style={styles.signUpButton}
                    labelStyle={styles.signUpButtonText}
                >
                    Don't have an account? Sign Up
                </Button>

                <Button
                    mode="text"
                    onPress={() => { navigation.navigate("ForgotPassword") }}
                    style={styles.forgotPasswordButton}
                    labelStyle={styles.forgotPasswordButtonText}
                >
                    Forgot password?
                </Button>

                <SocialLinks contacts={contacts} />

                {/* Custom Alert */}
                {alertVisible && (
                    <CustomAlert
                        type={alertType}
                        message={alertMessage}
                        onClose={() => setAlertVisible(false)}
                    />
                )}
            </View>
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
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#ffffff', // White text
        marginBottom: 20,
    },
    input: {
        flexDirection: 'row',
        marginBottom: 15,
        backgroundColor: '#000000', // White background for input box
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
    signUpButton: {
        marginTop: 20,
    },
    signUpButtonText: {
        fontSize: 16,
        color: '#FFD700', // Golden text for sign up button
    },
    forgotPasswordButton: {
        marginTop: 10,
    },
    forgotPasswordButtonText: {
        fontSize: 16,
        color: '#FFD700', // Golden text for forgot password button
    },
});

export default LoginScreen;
