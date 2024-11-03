import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { updateUpiDetails } from '../services/endPoints.js'; // Assuming this endpoint exists
import CustomAlert from '../components/CustomAlert.js';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/slices/userSlice.js';

const UpiDetailsUpdateScreen = () => {
    const user = useSelector(state => state.user);
    const [upiName, setUpiName] = useState('');
    const [upiId, setUpiId] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    // State for input validation
    const [upiNameError, setUpiNameError] = useState('');
    const [upiIdError, setUpiIdError] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch user data and set initial values
        setUpiName(user?.user?.upi_details?.upi_name || '');
        setUpiId(user?.user?.upi_details?.upi_id || '');
    }, [user]);

    const handleUpdateUpiDetails = async () => {
        // Reset error messages
        setUpiNameError('');
        setUpiIdError('');

        // Input validation
        let isValid = true;

        if (!upiName) {
            setUpiNameError('UPI Name is required.');
            isValid = false;
        }
        if (!upiId) {
            setUpiIdError('UPI ID is required.');
            isValid = false;
        }

        if (!isValid) return; // Stop if validation fails

        setLoading(true);
        const upiDetails = { upi_name: upiName, upi_id: upiId };

        try {
            const updateResponse = await updateUpiDetails(upiDetails);
            if (updateResponse.success) {
                setAlertType('success');
                setAlertMessage('UPI details updated successfully.');
                setAlertVisible(true);
                // Optional: Reset fields or navigate
                // navigation.goBack(); // Uncomment if you want to navigate back
            } else {
                setAlertType('error');
                setAlertMessage(updateResponse.message);
                setAlertVisible(true);
                dispatch(setUser(updateResponse.user));
            }
        } catch (error) {
            setAlertType('error');
            setAlertMessage('An error occurred. Please try again later.');
            setAlertVisible(true);
        } finally {
            setLoading(false);
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
                <Text style={styles.title}>Update UPI Details</Text>

                <TextInput
                    label="UPI Name"
                    value={upiName}
                    textColor='#fff'
                    onChangeText={setUpiName}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
                />
                {/* Show validation message for UPI Name */}
                {upiNameError ? <Text style={styles.errorText}>{upiNameError}</Text> : null}

                <TextInput
                    label="UPI ID"
                    value={upiId}
                    textColor='#fff'
                    onChangeText={setUpiId}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
                />
                {/* Show validation message for UPI ID */}
                {upiIdError ? <Text style={styles.errorText}>{upiIdError}</Text> : null}

                <Button
                    mode="contained"
                    onPress={handleUpdateUpiDetails}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? 'Updating...' : 'Update UPI Details'}
                </Button>

                {/* Show custom alert */}
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
        textColor: "#fff",
        marginBottom: 5, // Adjusted margin for better spacing
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
        marginBottom: 15,
    },
});

export default UpiDetailsUpdateScreen;
