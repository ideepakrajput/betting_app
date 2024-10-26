import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Dimensions } from 'react-native';
import OpenPlayTab from './OpenPlay';
import CrossPlay from './CrossPlay';

const GamePlay = ({ route }) => {
    const [mainBets, setMainBets] = useState({});
    const [andarBets, setAndarBets] = useState({});
    const [baharBets, setBaharBets] = useState({});
    const screenWidth = Dimensions.get('window').width;
    const cellWidth = screenWidth / 9;
    const [activeTab, setActiveTab] = useState('jantari');
    const name = route?.params.name;

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
    };

    // Generate numbers 0-99 in rows of 10
    const mainNumbers = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));

    const handleBetChange = (number, value, betType) => {
        const amount = value === '' ? 0 : parseInt(value);

        switch (betType) {
            case 'main':
                setMainBets(prev => ({ ...prev, [number]: amount }));
                break;
            case 'andar':
                setAndarBets(prev => ({ ...prev, [number]: amount }));
                break;
            case 'bahar':
                setBaharBets(prev => ({ ...prev, [number]: amount }));
                break;
        }
    };
    const calculateTotal = () => {
        const mainTotal = Object.values(mainBets).reduce((sum, val) => sum + (val || 0), 0);
        const andarTotal = Object.values(andarBets).reduce((sum, val) => sum + (val || 0), 0);
        const baharTotal = Object.values(baharBets).reduce((sum, val) => sum + (val || 0), 0);
        return mainTotal + andarTotal + baharTotal;
    };

    const renderNumberInput = (number, betType) => (
        <View style={styles.cell}>
            <Text style={styles.numberText}>{number}</Text>
            <TextInput
                style={[styles.input, { width: cellWidth - 8 }]}
                keyboardType="numeric"
                value={(betType === 'main' ? mainBets[number] : betType === 'andar' ? andarBets[number] : baharBets[number]) || ''}
                onChangeText={(value) => handleBetChange(number, value, betType)}
                placeholderTextColor="#FFD700"
            />
        </View>
    );

    return (
        <View style={styles.container}>

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    onPress={() => handleTabChange('jantari')}
                    style={[
                        styles.tabButton,
                        activeTab === 'jantari' && styles.activeTabButton
                    ]}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'jantari' && styles.activeTabText
                        ]}
                    >
                        JANTARI
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleTabChange('open_play')}
                    style={[
                        styles.tabButton,
                        activeTab === 'open_play' && styles.activeTabButton
                    ]}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'open_play' && styles.activeTabText
                        ]}
                    >
                        OPEN PLAY
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleTabChange('cross')}
                    style={[
                        styles.tabButton,
                        activeTab === 'cross' && styles.activeTabButton
                    ]}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'cross' && styles.activeTabText
                        ]}
                    >
                        CROSS
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>{name}</Text>
            {activeTab === 'jantari' && (
                <>
                    <Text style={styles.sectionTitle}>Enter Amount Below</Text>
                    <FlatList
                        data={mainNumbers}
                        keyExtractor={(item) => `main-${item}`}
                        numColumns={10}  // Display 10 items per row
                        renderItem={({ item }) => renderNumberInput(item, 'main')}
                        ListFooterComponent={
                            <>
                                {/* Andar and Bahar */}
                                <View style={styles.doubleColumn}>
                                    <View style={styles.column}>
                                        <Text style={styles.sectionTitle}>Andar (A)</Text>
                                        <FlatList
                                            data={Array.from({ length: 10 }, (_, i) => i.toString())}
                                            keyExtractor={(item) => `andar-${item}`}
                                            numColumns={10}  // Single row with 10 items
                                            renderItem={({ item }) => renderNumberInput(item, 'andar')}
                                        />
                                    </View>
                                </View>
                                <View style={styles.doubleColumn}>
                                    <View style={styles.column}>
                                        <Text style={styles.sectionTitle}>Bahar (B)</Text>
                                        <FlatList
                                            data={Array.from({ length: 10 }, (_, i) => i.toString())}
                                            keyExtractor={(item) => `bahar-${item}`}
                                            numColumns={10}  // Single row with 10 items
                                            renderItem={({ item }) => renderNumberInput(item, 'bahar')}
                                        />
                                    </View>
                                </View>
                            </>
                        }
                    />
                    <View style={styles.footer}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalText}>Rs : ₹ {calculateTotal()}</Text>
                            <Text style={styles.totalText}>Total Amount</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => Alert.alert('Bet Placed', `Total Bet: ₹${calculateTotal()} 
                        Main Number Bets: ${JSON.stringify(mainBets)}, Ander Bets: ${JSON.stringify(andarBets)}, Bahar Bets: ${JSON.stringify(baharBets)}
                        `)}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>PLACE BET</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {activeTab === 'open_play' && (
                <OpenPlayTab />
            )}

            {activeTab === 'cross' && (
                <CrossPlay />
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        padding: 16,
    },
    title: {
        fontSize: 20,
        color: '#FFD700',
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        color: '#ffffff',
        marginBottom: 8,
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
    doubleColumn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
    },
    cell: {
        alignItems: 'center',
        marginBottom: 8,
    },
    numberText: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 2,
    },
    input: {
        backgroundColor: 'black',
        color: '#FFD700',
        borderColor: '#FFD700',
        borderWidth: 1,
        textAlign: 'center',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#FFD700',
        paddingTop: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalText: {
        fontSize: 20,
        color: '#FFD700',
    },
    totalContainer: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#FFD700',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black',
    },
});

export default GamePlay;
