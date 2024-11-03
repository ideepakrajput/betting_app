import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import CustomAlert from '../components/CustomAlert';
import { AddMoney, getUPIDetails, withdrawMoney } from '../services/endPoints';
import { setUser } from '../redux/slices/userSlice';
import { API_URL } from '../services/apiClient';

const Transactions = ({ navigation, route }) => {
    const user = useSelector((state) => state.user);
    const [amount, setAmount] = useState('');
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [activeTab, setActiveTab] = useState('addMoney');
    const [step, setStep] = useState(1);
    const [transactionId, setTransactionId] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [UPIDetails, setUPIDetails] = useState({ upi_id: '', upi_image: '' });
    const dispatch = useDispatch();

    useEffect(() => {
        setActiveTab(route?.params?.activeTab)
    }, [navigation])

    const UPIData = async () => {
        try {
            const response = await getUPIDetails();
            if (response.success) {
                setUPIDetails({
                    upi_id: response.admin.upi_id,
                    upi_image: response.admin.upi_image,
                })
            } else {
                setAlertType('error');
                setAlertMessage(response.message);
                setAlertVisible(true);
                return
            }
        }
        catch (error) {
            console.error('Error verifying transaction:', error);
        }
    }

    useEffect(() => {
        UPIData()
    }, [step])

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
    };

    const handleNextStep = () => {
        if (!amount) {
            setAlertVisible(true);
            setAlertType('error');
            setAlertMessage('Please enter an amount.');
            return;
        }
        setStep(step + 1);
    };

    const calculateBonus = (amount) => {
        if (amount >= 2000 && amount < 5000) {
            return (Number(100)).toFixed(2);
        }
        if (amount >= 5000 && amount < 10000) {
            return (Number(500)).toFixed(2);
        }
        if (amount >= 10000) {
            return (Number(1000)).toFixed(2);
        }
        return '0.00';
    };

    const handleAddMoney = async () => {
        try {
            const response = await AddMoney(transactionId, amount);
            if (response.success) {
                setAlertVisible(true);
                setAlertType('success');
                setAlertMessage('Money added request sent successfully.');
                setAmount('');
                setTransactionId('');
                setStep(1);
                navigation.navigate("WalletTab");
                dispatch(setUser(response.user));
            } else {
                setAlertVisible(true);
                setAlertType('error');
                setAlertMessage(response.message);
            }
        }
        catch (error) {
            console.error('Error verifying transaction:', error);
        }
    }

    const handleWithdrawMoney = async () => {
        try {
            const response = await withdrawMoney(withdrawalAmount);
            if (response.success) {
                setAlertVisible(true);
                setAlertType('success');
                setAlertMessage('Money Withdraw requested sent successfully.');
                setAmount('');
                setTransactionId('');
                setStep(1);
                navigation.navigate("WalletTab");
                dispatch(setUser(response.user));
            } else {
                setAlertVisible(true);
                setAlertType('error');
                setAlertMessage(response.message);
            }
        }
        catch (error) {
            console.error('Error verifying transaction:', error);
        }
    }

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

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        onPress={() => handleTabChange('addMoney')}
                        style={[
                            styles.tabButton,
                            activeTab === 'addMoney' && styles.activeTabButton
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'addMoney' && styles.activeTabText
                            ]}
                        >
                            ADD MONEY
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleTabChange('withdrawMoney')}
                        style={[
                            styles.tabButton,
                            activeTab === 'withdrawMoney' && styles.activeTabButton
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'withdrawMoney' && styles.activeTabText
                            ]}
                        >
                            WITHDRAW MONEY
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                {activeTab === 'addMoney' ? (
                    <>{step === 1 ?
                        (<ScrollView>
                            <View style={styles.addMoneyContainer}>
                                <View style={styles.moneySection}>
                                    <Icon name="cash-multiple" size={80} color="#FFD700" />
                                    <Text style={styles.sectionTitle}>ADD AMOUNT</Text>
                                    <Text style={styles.noteText}>Note: Minimum add amount INR 200</Text>
                                </View>

                                <TextInput
                                    placeholder="Amount"
                                    placeholderTextColor="#888"
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={setAmount}
                                />

                                <View style={styles.buttonRow}>
                                    {[500, 2000, 5000, 10000].map((value) => (
                                        <Button
                                            mode="contained"
                                            key={value}
                                            style={styles.amountButton}
                                            onPress={() => setAmount(String(value))}
                                        >
                                            ₹{value}
                                        </Button>
                                    ))}
                                </View>

                                <Button
                                    textColor='#111111'
                                    mode="contained"
                                    onPress={() => handleNextStep()}
                                    style={styles.payButton}
                                >
                                    + PAY NOW
                                </Button>

                                {/* Bonus Section */}
                                {amount >= 2000 && (
                                    <Text style={styles.bonusText}>
                                        Bonus Amount: ₹{calculateBonus(amount)}
                                    </Text>
                                )}
                            </View>

                            {/* Offer Section */}
                            <View style={styles.offerContainer}>
                                <Text style={[styles.offerHeading, { color: "#32CD32" }]}>
                                    ₹2000 से ₹5000 ऐड करें MONEY
                                </Text>
                                <Text style={styles.offerHeading}>
                                    और ₹100 एक्स्ट्रा कैशबैक पाएं!
                                </Text>
                                <Text style={[styles.offerHeading, { color: "#32CD32", marginTop: 20 }]}>
                                    ₹5000 से ₹10000 ऐड करें MONEY
                                </Text>
                                <Text style={styles.offerHeading}>
                                    और ₹500 एक्स्ट्रा कैशबैक पाएं!
                                </Text>
                                <Text style={[styles.offerHeading, { color: "#32CD32", marginTop: 20 }]}>
                                    अभी ऑफर का लाभ उठाएं!
                                </Text>
                                <Text style={styles.offerHeading}>
                                    अतिरिक्त कैशबैक का आनंद लें!
                                </Text>
                                {/* <Text style={[styles.offerText, { color: "#32CD32", marginTop: 10 }]}>
                                Add above ₹2000, get 1% extra cashback!
                            </Text> */}
                                <Text style={[styles.offerText, { color: "#4169E1", marginTop: 10 }]}>
                                    Grab the offer now!
                                </Text>
                                <Text style={[styles.offerText, { color: "#32CD32", marginTop: 20 }]}>Enjoy extra cashback!</Text>
                                <Text style={[styles.offerText, { color: "#006BFF", marginVertical: 20 }]}>UPI Payments Options :</Text>
                                <Text style={[styles.offerText, { color: "#32CD32" }]}>Google Pay (GPay) Paytm PhonePe!</Text>
                                <Text style={[styles.offerText, { color: "#32CD32" }]}>BHIM UPI Multiple Apps Supported!</Text>
                            </View>
                        </ScrollView>
                        ) : (
                            <ScrollView>
                                <View style={styles.addMoneyContainer}>
                                    <Text style={[styles.heading, { textAlign: 'center', fontWeight: 'bold', borderBottomColor: '#fff', borderBottomWidth: 1, alignSelf: 'center', marginBottom: 10 }]}>PAY TO BELOW UPI</Text>
                                    <Text style={[styles.heading, { textAlign: 'center', color: "#fff", fontWeight: 'bold' }]}>{UPIDetails.upi_id}</Text>
                                    <Image src={`${API_URL}${UPIDetails.upi_image}`} style={styles.upiImage} />
                                    <Text style={[styles.heading, { textAlign: 'center', fontWeight: 'bold' }]}>ENTER TRANSACTION DETAILS</Text>
                                    <TextInput
                                        placeholder="Transaction ID"
                                        placeholderTextColor="#888"
                                        style={styles.input}
                                        value={transactionId}
                                        onChangeText={setTransactionId}
                                    />
                                    <Button
                                        mode="contained"
                                        onPress={() => handleAddMoney()}
                                        style={styles.payButton}
                                    >
                                        VERIFY TRANSACTION
                                    </Button>
                                </View>
                            </ScrollView>
                        )
                    }
                    </>
                ) : (
                    <View style={styles.withdrawContainer}>
                        <View style={styles.moneySection}>
                            <Icon name="cash-multiple" size={80} color="#FFD700" />
                            <Text style={styles.sectionTitle}>WITHDRAWAL AMOUNT</Text>
                            <Text style={styles.noteText}>Note: Minimum withdrawal amount INR 900</Text>
                        </View>
                        <TextInput
                            placeholder="Withdrawal Amount"
                            placeholderTextColor="#888"
                            style={styles.input}
                            keyboardType="numeric"
                            value={withdrawalAmount}
                            onChangeText={setWithdrawalAmount}
                        />

                        {/* Available Amount & Withdrawal Time */}
                        <View style={styles.withdrawInfo}>
                            <Text style={styles.availableText}>Available For Withdrawal: ₹ {user?.user?.winning_amount}</Text>
                            <Text style={styles.timeText}>Withdrawal Time is 10 AM to 4 PM</Text>
                        </View>

                        {/* Add and Withdraw Money Buttons */}
                        <View style={styles.buttonSection}>
                            <Button
                                mode="contained"
                                onPress={handleWithdrawMoney}
                                style={styles.withdrawButton}
                                labelStyle={styles.buttonText}
                            >
                                WITHDRAW MONEY
                            </Button>
                        </View>
                    </View>
                )
                }

                {alertVisible && (
                    <CustomAlert
                        type={alertType}
                        message={alertMessage}
                        onClose={() => setAlertVisible(false)}
                    />
                )}
            </View >
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#000000',
        padding: 10,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#111111',
        padding: 10,
    },
    activeTabButton: {
        backgroundColor: '#FFD700',
    },
    tabText: {
        color: '#FFD700',
    },
    activeTabText: {
        color: '#111111',
    },
    addMoneyContainer: {
        padding: 20,
        backgroundColor: '#111111',
        borderRadius: 10,
    },
    heading: {
        color: '#FFD700',
        fontSize: 18,
    },
    subText: {
        color: 'gray',
    },
    input: {
        borderBottomColor: '#FFD700',
        borderBottomWidth: 1,
        color: '#FFF',
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 18,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    amountButton: {
        backgroundColor: '#222222',
    },
    payButton: {
        backgroundColor: '#FFD700',
        fontWeight: 'bold',
        fontSize: 20,
    },
    bonusText: {
        color: '#32CD32',
        fontSize: 16,
        marginTop: 20,
    },
    offerContainer: {
        padding: 20,
        marginVertical: 20,
        backgroundColor: '#222222',
        borderRadius: 10,
    },
    offerHeading: {
        color: '#FFD700',
        textAlign: 'center',
        fontSize: 16,
    },
    offerText: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
    },
    withdrawContainer: {
        padding: 20,
        backgroundColor: '#111111',
        borderRadius: 10,
    },
    moneySection: {
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        marginVertical: 10,
    },
    noteText: {
        color: '#ffffff',
        marginBottom: 20,
        fontSize: 16,
    },
    withdrawInfo: {
        fontSize: 16,
        marginVertical: 20,
        alignItems: 'center',
    },
    availableText: {
        fontSize: 16,
        color: '#00FF00',
    },
    timeText: {
        fontSize: 16,
        color: '#FF0000',
        marginTop: 10,
    },
    buttonSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    addButton: {
        backgroundColor: '#FFD700',
        flex: 1,
        marginRight: 10,
    },
    withdrawButton: {
        backgroundColor: '#FFD700',
        flex: 1,
        marginLeft: 10,
    },
    buttonText: {
        color: '#000000',
    },
    upiImage: {
        width: 300,
        height: 300,
        marginVertical: 20,
        alignSelf: 'center',
    }
});

export default Transactions;