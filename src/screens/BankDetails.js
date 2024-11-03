import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { updateBankDetails } from '../services/endPoints.js'; // Assuming this endpoint exists
import CustomAlert from '../components/CustomAlert.js';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/slices/userSlice.js';

const BankDetailsUpdateScreen = () => {
    const user = useSelector(state => state.user);
    const [beneficiaryName, setBeneficiaryName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const dispatch = useDispatch();

    const [errors, setErrors] = useState({
        beneficiaryName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: ''
    });
    useEffect(() => {
        // Fetch user data and set initial values
        setBeneficiaryName(user.user?.bank_accounts?.beneficiary_name || '');
        setBankName(user.user?.bank_accounts?.bank_name || '');
        setAccountNumber(user.user?.bank_accounts?.account_number || '');
        setIfscCode(user.user?.bank_accounts?.ifsc_code || '');
    }, [user]);

    const validateFields = () => {
        let valid = true;
        const newErrors = {};

        if (!beneficiaryName) {
            newErrors.beneficiaryName = 'Beneficiary Name is required';
            valid = false;
        }

        if (!bankName) {
            newErrors.bankName = 'Bank Name is required';
            valid = false;
        }

        if (!accountNumber) {
            newErrors.accountNumber = 'Account Number is required';
            valid = false;
        }

        if (!ifscCode) {
            newErrors.ifscCode = 'IFSC Code is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleUpdateBankDetails = async () => {
        if (!validateFields()) {
            return;
        }

        const bankDetails = {
            beneficiary_name: beneficiaryName,
            bank_name: bankName,
            account_number: accountNumber,
            ifsc_code: ifscCode
        };

        const updateResponse = await updateBankDetails(bankDetails);

        if (updateResponse.success) {
            setAlertType('success');
            setAlertMessage('Bank details updated successfully.');
            setAlertVisible(true);
            dispatch(setUser(updateResponse.user))
        } else {
            setAlertType('error');
            setAlertMessage(updateResponse.message);
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
                <Text style={styles.title}>Update Bank Details</Text>

                <TextInput
                    label="Beneficiary Name"
                    value={beneficiaryName}
                    textColor='#fff'
                    onChangeText={setBeneficiaryName}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
                />
                {errors.beneficiaryName ? <Text style={styles.errorText}>{errors.beneficiaryName}</Text> : null}

                <TextInput
                    label="Bank Name"
                    value={bankName}
                    textColor='#fff'
                    onChangeText={setBankName}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
                />
                {errors.bankName ? <Text style={styles.errorText}>{errors.bankName}</Text> : null}

                <TextInput
                    label="Account Number"
                    value={accountNumber}
                    textColor='#fff'
                    onChangeText={setAccountNumber}
                    style={styles.input}
                    keyboardType="numeric"
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
                />
                {errors.accountNumber ? <Text style={styles.errorText}>{errors.accountNumber}</Text> : null}

                <TextInput
                    label="IFSC Code"
                    value={ifscCode}
                    textColor='#fff'
                    onChangeText={setIfscCode}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { text: '#000000', primary: '#FFD700', background: '#ffffff' } }}
                />
                {errors.ifscCode ? <Text style={styles.errorText}>{errors.ifscCode}</Text> : null}

                <Button
                    mode="contained"
                    onPress={handleUpdateBankDetails}
                    style={styles.button}
                    labelStyle={styles.buttonText}
                >
                    Update Bank Details
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
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default BankDetailsUpdateScreen;
