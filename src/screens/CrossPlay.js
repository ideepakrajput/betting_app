import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';

const CrossPlay = () => {
    const [inputNumber, setInputNumber] = useState('');
    const [betAmount, setBetAmount] = useState('');
    const [combinations, setCombinations] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const validateAndGenerateCombinations = (number) => {
        // Convert number to array of digits
        const digits = number.split('').map(Number);

        // Check for duplicate digits
        if (new Set(digits).size !== digits.length) {
            Alert.alert('Error', 'Duplicate digits are not allowed!');
            return false;
        }

        // Generate all possible 2-digit combinations
        const newCombinations = [];
        for (let i = 0; i < digits.length; i++) {
            for (let j = 0; j < digits.length; j++) {
                newCombinations.push(`${digits[i]}${digits[j]}`);
            }
        }

        setCombinations(newCombinations);
        return true;
    };

    useEffect(() => {
        // Calculate total amount whenever combinations or betAmount changes
        setTotalAmount(combinations.length * Number(betAmount));
    }, [combinations, betAmount]);

    const handleNumberInput = (text) => {
        // Only allow numbers
        if (/^\d*$/.test(text) && text.length <= 4) {
            setInputNumber(text);
            if (text.length >= 2) {
                validateAndGenerateCombinations(text);
            } else {
                setCombinations([]);
            }
        }
    };

    const removeCombination = (index) => {
        setCombinations(prev => prev.filter((_, i) => i !== index));
    };

    const CombinationRow = ({ number, index }) => (
        <View style={styles.row}>
            <Text style={styles.numberText}>{number}</Text>
            <Text style={styles.equalText}>=</Text>
            <Text style={styles.amountText}>{betAmount}</Text>
            <TouchableOpacity
                onPress={() => removeCombination(index)}
                style={styles.crossButton}
            >
                <Text style={styles.crossText}>X</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Input Section */}
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        value={inputNumber}
                        onChangeText={handleNumberInput}
                        keyboardType="numeric"
                        style={styles.numberInput}
                        placeholder="Enter Number"
                        placeholderTextColor="#666"
                    />
                </View>
                <Text style={styles.equalMainText}>=</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        value={betAmount}
                        onChangeText={setBetAmount}
                        keyboardType="numeric"
                        style={styles.amountInput}
                        placeholder="Amount"
                        placeholderTextColor="#666"
                    />
                </View>
            </View>

            {/* Combinations List */}
            <ScrollView style={styles.combinationsContainer}>
                {combinations.map((combo, index) => (
                    <CombinationRow
                        key={index}
                        number={combo}
                        index={index}
                    />
                ))}
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalAmount}>Rs : ₹ {totalAmount}</Text>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                </View>
                <TouchableOpacity
                    style={styles.placeBetButton}
                    onPress={() => Alert.alert('Success', `Bet placed: Rs ${totalAmount}`)}
                >
                    <Text style={styles.buttonText}>PLACE BET</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#FFD700',
    },
    inputWrapper: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#FFD700',
        borderRadius: 5,
        padding: 2,
    },
    numberInput: {
        color: '#FFD700',
        backgroundColor: '#111',
        fontSize: 18,
        padding: 8,
    },
    equalMainText: {
        color: '#FFD700',
        fontSize: 24,
        marginHorizontal: 10,
    },
    amountInput: {
        color: '#FFD700',
        backgroundColor: '#111',
        fontSize: 18,
        padding: 8,
    },
    combinationsContainer: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#FFD700',
    },
    numberText: {
        color: '#FFD700',
        fontSize: 18,
        flex: 1,
    },
    equalText: {
        color: '#FFD700',
        fontSize: 18,
        marginHorizontal: 10,
    },
    amountText: {
        color: '#FFD700',
        fontSize: 18,
        flex: 1,
        textAlign: 'right',
    },
    crossButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'red',
        borderRadius: 50,
        marginLeft: 16,
    },
    crossText: {
        color: '#fff',
        fontSize: 18,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        // marginTop: 16,
        borderTopColor: '#FFD700',
        backgroundColor: '#000',
    },
    totalContainer: {
        alignItems: 'center',
        // paddingTop: 16,
    },
    totalLabel: {
        color: '#FFD700',
        fontSize: 20,
    },
    totalAmount: {
        color: '#FFD700',
        fontSize: 20,
    },
    placeBetButton: {
        backgroundColor: '#FFD700',
        borderRadius: 4,
        padding: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default CrossPlay;