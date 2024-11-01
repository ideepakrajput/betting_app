import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { OpenPlayBets } from '../services/endPoints';
import { updateBalance } from '../redux/slices/userSlice';

const OpenPlayTab = ({ game_id, setAlert }) => {
    const [regularNumbers, setRegularNumbers] = useState('');
    const [harupNumbers, setHarupNumbers] = useState('');
    const [regularAmount, setRegularAmount] = useState('');
    const [harupAmount, setHarupAmount] = useState('');
    const [withPalti, setWithPalti] = useState(false);
    const [andarSelected, setAndarSelected] = useState(false);
    const [baharSelected, setBaharSelected] = useState(false);
    const [combinations, setCombinations] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [activeInput, setActiveInput] = useState('regular');
    const { user } = useSelector(state => state.user);
    const wallet_balance = user?.wallet_balance;
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const reversePair = pair => pair.split('').reverse().join('');

    const removeCombination = index => {
        const newCombinations = [...combinations];
        const removedAmount = newCombinations[index].amount;
        newCombinations.splice(index, 1);
        setCombinations(newCombinations);
        setTotalAmount(prev => prev - removedAmount);
    };

    const generateCombinations = () => {
        let newCombinations = [];
        let total = 0;

        if (activeInput === 'harup' && harupNumbers && harupAmount) {
            const digits = harupNumbers.split('');
            if (andarSelected) {
                digits.forEach(digit => {
                    newCombinations.push({
                        number: digit,
                        suffix: 'A',
                        amount: parseInt(harupAmount),
                    });
                });
            }
            if (baharSelected) {
                digits.forEach(digit => {
                    newCombinations.push({
                        number: digit,
                        suffix: 'B',
                        amount: parseInt(harupAmount),
                    });
                });
            }
            total = newCombinations.length * parseInt(harupAmount);
        } else if (activeInput === 'regular' && regularNumbers && regularAmount) {
            for (let i = 0; i < regularNumbers.length; i += 2) {
                const pair = regularNumbers.substr(i, 2);
                if (pair.length === 2) {
                    newCombinations.push({ number: pair, amount: parseInt(regularAmount) });
                    total += parseInt(regularAmount);

                    if (withPalti) {
                        const reversed = reversePair(pair);
                        if (reversed !== pair) {
                            newCombinations.push({
                                number: reversed,
                                amount: parseInt(regularAmount),
                            });
                            total += parseInt(regularAmount);
                        }
                    }
                }
            }
        }

        setCombinations(newCombinations);
        setTotalAmount(total);
    };

    useEffect(() => {
        generateCombinations();
    }, [
        regularNumbers,
        regularAmount,
        harupNumbers,
        harupAmount,
        withPalti,
        andarSelected,
        baharSelected,
        activeInput,
    ]);

    const renderInputSection = type => {
        const isActive = activeInput === type;
        const inputStyle = [
            styles.inputContainer,
            !isActive && styles.inactiveInput,
        ];

        if (type === 'regular') {
            return (
                <View style={inputStyle}>
                    <TextInput
                        style={styles.numberInput}
                        placeholder="ENTER NUMBERS"
                        placeholderTextColor="#666"
                        value={regularNumbers}
                        onChangeText={setRegularNumbers}
                        keyboardType="numeric"
                        onFocus={() => setActiveInput('regular')}
                    />
                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity
                            style={styles.paltiCheckbox}
                            onPress={() => isActive && setWithPalti(!withPalti)}>
                            <Text style={styles.checkboxLabel}>With Palti</Text>
                            <View style={[styles.checkbox, withPalti && styles.checked]} />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="ENTER AMOUNT"
                        placeholderTextColor="#666"
                        value={regularAmount}
                        onChangeText={setRegularAmount}
                        keyboardType="numeric"
                        onFocus={() => setActiveInput('regular')}
                    />
                </View>
            );
        } else {
            return (
                <View style={inputStyle}>
                    <TextInput
                        style={styles.numberInput}
                        placeholder="ENTER HARUP"
                        placeholderTextColor="#666"
                        value={harupNumbers}
                        onChangeText={setHarupNumbers}
                        keyboardType="numeric"
                        onFocus={() => setActiveInput('harup')}
                    />
                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity
                            style={styles.abCheckbox}
                            onPress={() => isActive && setAndarSelected(!andarSelected)}>
                            <Text style={styles.abLabel}>A</Text>
                            <View
                                style={[styles.checkbox, andarSelected && styles.checked]}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.abCheckbox}
                            onPress={() => isActive && setBaharSelected(!baharSelected)}>
                            <Text style={styles.abLabel}>B</Text>
                            <View
                                style={[styles.checkbox, baharSelected && styles.checked]}
                            />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="ENTER AMOUNT"
                        placeholderTextColor="#666"
                        value={harupAmount}
                        onChangeText={setHarupAmount}
                        keyboardType="numeric"
                        onFocus={() => setActiveInput('harup')}
                    />
                </View>
            );
        }
    };

    const handlePlaceBet = async () => {
        const updatedBalance = wallet_balance - totalAmount;
        if (totalAmount <= 0) {
            setAlert({
                message: 'Please place a valid bet.',
                type: 'error',
            });
            return;
        }
        if (totalAmount > wallet_balance) {
            setAlert({
                message: 'You do not have enough balance to place this bet.',
                type: 'error',
            });
            setTimeout(() => {
                navigation.navigate('WalletDetails');
            }, 2000);
            return;
        }
        else {
            console.log(combinations);
            const response = await OpenPlayBets({ bazaarId: game_id, withPalti, harupA: andarSelected, harupB: baharSelected, data: combinations });
            if (response.success) {
                dispatch(updateBalance(updatedBalance));
                setAlert({
                    message: 'Bet placed successfully.',
                    type: 'success',
                });
            } else {
                setAlert({
                    message: response.message,
                    type: 'error',
                });
            }
            setCombinations([]);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputSection}>
                {renderInputSection('regular')}
                {renderInputSection('harup')}
            </View>

            <ScrollView style={styles.combinationsContainer}>
                {combinations.map((item, index) => (
                    <View key={index} style={styles.combinationRow}>
                        <Text style={styles.combinationText}>
                            {item.number}
                            {item.suffix || ''} = {item.amount}
                        </Text>
                        <TouchableOpacity
                            onPress={() => removeCombination(index)}
                            style={styles.removeButton}>
                            <Text size={24} style={{ color: "#fff" }}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalAmount}>Rs : ₹ {totalAmount}</Text>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                </View>
                <TouchableOpacity
                    style={styles.placeBetButton}
                    onPress={handlePlaceBet}>
                    <Text style={styles.placeBetText}>PLACE BET</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    // inputSection: { padding: 16, backgroundColor: '#111' },
    inputContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
    },
    inactiveInput: { opacity: 0.5 },
    numberInput: {
        flex: 1,
        backgroundColor: '#111',
        color: '#FFD700',
        borderWidth: 1,
        borderColor: '#FFD700',
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
    },
    checkboxContainer: {
        flexDirection: 'row',
        backgroundColor: '#C5A052',
        padding: 8,
        borderRadius: 5,
        marginRight: 8,
    },
    paltiCheckbox: { alignItems: 'center' },
    abCheckbox: { alignItems: 'center', marginHorizontal: 4 },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: '#fff',
        marginTop: 4,
    },
    checked: { backgroundColor: '#FFD700' },
    checkboxLabel: { color: '#000', fontSize: 14, fontWeight: "bold", textAlign: 'center' },
    abLabel: { color: '#000', fontSize: 14, fontWeight: 'bold' },
    amountInput: {
        flex: 1,
        backgroundColor: '#111',
        color: '#FFD700',
        borderWidth: 1,
        borderColor: '#FFD700',
        borderRadius: 5,
        padding: 8,
    },
    combinationsContainer: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderTopWidth: 2,
        marginTop: 16,
        borderTopColor: '#FFD700',
    },
    combinationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingVertical: 8,
    },
    combinationText: { color: '#FFD700', fontSize: 16, flex: 1 },
    removeButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'red',
        borderRadius: 50,
    },
    footer: {
        paddingTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 2,
        borderTopColor: '#FFD700',
    },
    totalContainer: { alignItems: 'center' },
    totalLabel: { color: '#FFD700', fontSize: 20 },
    totalAmount: { color: '#FFD700', fontSize: 20 },
    placeBetButton: {
        backgroundColor: '#FFD700',
        padding: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
        alignItems: 'center',
    },
    placeBetText: { color: '#000', fontSize: 20, fontWeight: 'bold' },
});

export default OpenPlayTab;
