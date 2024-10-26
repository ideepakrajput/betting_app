import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Card, Title, Paragraph, Button, useTheme, Portal, Dialog, Text, Provider } from 'react-native-paper';
import { useSelector } from 'react-redux';

const WalletDetails = ({ navigation }) => {
    const user = useSelector(state => state.user);
    const [visible, setVisible] = useState(false);
    const [amount, setAmount] = useState('');

    const toggleModal = () => setVisible(!visible);

    return (
        <Provider>
            <View style={[styles.container, { backgroundColor: "#000000" }]}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.cardTitle}>Total Balance</Title>
                        <Paragraph style={styles.cardAmount}>₹ {user?.user?.wallet_balance}</Paragraph>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.cardTitle}>Total Bonus</Title>
                        <Paragraph style={styles.cardAmount}>₹ {user?.user?.bonus_amount}</Paragraph>
                    </Card.Content>
                </Card>

                <View style={styles.row}>
                    <Card style={[styles.cardHalf, { marginRight: 10 }]}>
                        <Card.Content>
                            <Title style={styles.cardTitle}>Deposit</Title>
                            <Paragraph style={styles.cardAmount}>₹ {user?.user?.deposit_amount}</Paragraph>
                            <Button mode="contained" onPress={() => navigation.navigate('Transactions', { activeTab: "addMoney" })} style={styles.addCashButton}>
                                Add Cash
                            </Button>
                        </Card.Content>
                    </Card>
                    <Card style={styles.cardHalf}>
                        <Card.Content>
                            <Title style={styles.cardTitle}>Winning</Title>
                            <Paragraph style={styles.cardAmount}>₹ {user?.user?.winning_amount}</Paragraph>
                            <Button mode="contained" onPress={() => navigation.navigate('Transactions', { activeTab: "withdrawMoney" })} style={styles.withdrawButton}>
                                Withdraw
                            </Button>
                        </Card.Content>
                    </Card>
                </View>

                <Card style={styles.cardFull}>
                    <Card.Content>
                        <Title style={styles.cardTitle}>Winning</Title>
                        <Paragraph style={styles.cardAmount}>₹ {user?.user?.winning_amount}</Paragraph>
                        <Button mode="contained" onPress={() => toggleModal()} style={styles.convertButton}>
                            Convert
                        </Button>
                    </Card.Content>
                </Card>

                <Portal>
                    <Dialog visible={visible} onDismiss={toggleModal} style={{ backgroundColor: "#1E1E1E" }}>
                        <Dialog.Title style={{ color: "#FFD700", borderBottomColor: "#fff", borderBottomWidth: 1, paddingVertical: 5 }}>Convert To Deposit</Dialog.Title>
                        <Dialog.Content>
                            <Text style={styles.infoText}>
                                यदि आप अपना जीता हुआ पैसे को Deposit Balance में बदलते हैं, तो आपको 2% कैशबैक मिलेगा अभी।
                                {"\n"}Convert Your Winnings into Deposits for 2% Cashback
                            </Text>
                            <TextInput
                                placeholder='Enter Amount'
                                value={amount}
                                // placeholderTextColor={"#fff"}
                                cursorColor={"#000000"}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                mode="outlined"
                                style={styles.input}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={toggleModal}>Cancel</Button>
                            <Button onPress={() => console.log("Convert")}>Convert</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    card: {
        marginBottom: 15,
        backgroundColor: '#1E1E1E',
    },
    cardTitle: {
        color: '#FFD700',
    },
    cardAmount: {
        color: '#FFD700',
        fontSize: 22,
        fontWeight: 'bold',
        paddingTop: 10,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardHalf: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    cardFull: {
        backgroundColor: '#1E1E1E',
        marginTop: 15,
    },
    addCashButton: {
        marginTop: 10,
        backgroundColor: '#32CD32',
    },
    withdrawButton: {
        marginTop: 10,
        backgroundColor: '#FF6347',
    },
    convertButton: {
        marginTop: 10,
    },
    infoText: {
        color: '#FF6347',
        paddingVertical: 10,
        fontSize: 18
    },
    input: {
        paddingVertical: 10,
        borderRadius: 15,
        textAlign: 'center',
        fontSize: 16,
        backgroundColor: '#FFD700',
    },
});

export default WalletDetails;