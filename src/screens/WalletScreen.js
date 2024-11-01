import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { me } from '../services/endPoints';
import { setUser } from '../redux/slices/userSlice';

const WalletScreen = () => {
    const navigation = useNavigation();
    const { user } = useSelector((state) => state.user);
    const [transactions, setTransactions] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setTransactions(user?.transactions);
    }, [user?.transactions])

    const handleRefresh = async () => {
        const userResponse = await me();

        dispatch(setUser(userResponse?.user));
        setTransactions(userResponse?.user?.transactions);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Wallet Statement</Text>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    style={styles.addButton}
                    labelStyle={styles.buttonLabel}
                    icon={() => <Icon name="wallet-plus" size={20} color="#fff" />}
                    onPress={() => { navigation.navigate('Transactions', { activeTab: "addMoney" }) }}
                >
                    Add Money
                </Button>
                <Button
                    mode="contained"
                    style={styles.withdrawButton}
                    labelStyle={styles.buttonLabel}
                    icon={() => <Icon name="cash-minus" size={20} color="#fff" />}
                    onPress={() => { navigation.navigate("WalletDetails") }}
                >
                    Withdraw Money
                </Button>
            </View>

            <ScrollView style={styles.walletHistory}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 15
                }}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    <Icon onPress={handleRefresh} name="refresh" size={25} color="#FFD700" />
                </View>


                {/* Dummy data for wallet history */}
                {transactions?.map((transaction, index) => (
                    <View key={index} style={styles.transactionItem}>
                        <Icon name={transaction.type === 'credit' ? 'wallet-plus' : 'cash-minus'} size={25} color="#FFD700" />
                        <View style={styles.transactionDetails}>
                            <Text style={styles.transactionText}>{transaction.description}</Text>
                            <Text style={styles.transactionDate}>{new Date(transaction.createdAt).toLocaleDateString()}</Text>
                        </View>
                        <View style={styles.transactionDetails}>
                            <Text style={styles.transactionAmount}>{transaction.type === 'credit' ? '+' : '-'} ₹{transaction.amount}</Text>
                            <Text
                                style={[
                                    styles.transactionDate,
                                    {
                                        color:
                                            transaction.status === "completed"
                                                ? "green"
                                                : transaction.status === "pending"
                                                    ? "orange"
                                                    : transaction.status === "failed"
                                                        ? "red"
                                                        : "black"
                                    },
                                ]}
                            >
                                {transaction.status}
                            </Text>

                        </View>
                    </View>
                ))}

                {/* <View style={styles.transactionItem}>
                    <Icon name="cash-minus" size={25} color="#FFD700" />
                    <View style={styles.transactionDetails}>
                        <Text style={styles.transactionText}>Withdrawn ₹200 from wallet</Text>
                        <Text style={styles.transactionDate}>Oct 17, 2024</Text>
                    </View>
                    <Text style={styles.transactionAmount}>-₹200</Text>
                </View> */}

                {/* Add more dummy transactions as needed */}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', // Dark background
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff', // Gold text
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    addButton: {
        flex: 1,
        marginRight: 10,
        paddingVertical: 10,
        backgroundColor: '#32CD32', // Green for Add Money
    },
    withdrawButton: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 10,
        backgroundColor: '#FF6347', // Red for Withdraw Money
    },
    buttonLabel: {
        color: '#ffffff', // White text on buttons
        fontSize: 16,
    },
    walletHistory: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFD700', // Gold text for section title
        marginBottom: 15,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1E1E1E', // Dark card background
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    transactionDetails: {
        // flex: 1,
        marginLeft: 15,
    },
    transactionText: {
        color: '#ffffff', // White text for transaction details
        fontSize: 16,
    },
    transactionDate: {
        color: '#A9A9A9', // Light grey for date
        fontSize: 14,
    },
    transactionAmount: {
        color: '#FFD700', // Gold for transaction amount
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default WalletScreen;
