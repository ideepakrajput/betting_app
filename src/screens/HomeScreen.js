import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { Button, Text } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const user = useSelector(state => state.user);
    const navigation = useNavigation();
    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    }

    useEffect(() => {
        requestUserPermission();
        getToken();
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('A new FCM message arrived!', remoteMessage);
        });
        return unsubscribe;
    }, []);

    const getToken = async () => {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (true) {
            fcmToken = await messaging().getToken();
            if (fcmToken) {
                await AsyncStorage.setItem('fcmToken', fcmToken);
                console.log('FCM Token:', fcmToken);
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Top Header Section */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerText}>{user?.user?.name || "Test User"}</Text>
                    <Text style={styles.balance}>₹ {user?.user?.wallet_balance || 0}</Text>
                </View>
                <View>
                    <Button
                        mode="contained"
                        style={styles.addButton}
                        icon={() => <Icon name="wallet-plus" size={20} color="#fff" />}
                        onPress={() => { navigation.navigate('Transactions', { activeTab: 'addMoney' }) }}
                    >
                        Add Money
                    </Button>
                </View>
            </View>

            <View style={styles.content}>
                <Button
                    mode="contained"
                    // style={styles.addButton}
                    labelStyle={styles.buttonLabel}
                    icon={() => <Icon name="trophy" size={20} color="#fff" />}
                    onPress={() => { navigation.navigate('TopWinner') }}
                >
                    Top Winners
                </Button>
                <Button
                    mode="contained"
                    // style={styles.addButton}
                    labelStyle={styles.buttonLabel}
                    icon={() => <MaterialIcons name="support-agent" size={20} color="#fff" />}
                    onPress={() => { navigation.navigate('Support') }}
                >
                    Help
                </Button>
                <Button
                    mode="contained"
                    // style={styles.addButton}
                    labelStyle={styles.buttonLabel}
                    icon={() => <Icon name="cash-minus" size={20} color="#fff" />}
                    onPress={() => { navigation.navigate('WalletDetails') }}
                >
                    Withdraw
                </Button>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.gameCard}>
                    <View>
                        <Text style={styles.gameName}>GAZIYABAD</Text>
                        <Text style={styles.gameStatus}>Betting Is Closed. Result Will Announce Soon</Text>
                    </View>
                    <View>
                        <Button mode="contained" disabled style={styles.waitButton}>Wait</Button>
                    </View>
                </View>

                <View style={styles.gameCard}>
                    <Text style={styles.gameName}>DUBAI BAZAR</Text>
                    <Text style={styles.timeInfo}>Close Time: 22:45 | Result Time: 23:00</Text>
                    <Button mode="contained" style={styles.playButton} onPress={() => navigation.navigate("GamePlay", { name: `DUBAI BAZAR` })}>Play</Button>
                </View>

                <View style={styles.gameCard}>
                    <Text style={styles.gameName}>PUNE CITY</Text>
                    <Text style={styles.timeInfo}>Close Time: 00:25 | Result Time: 00:30</Text>
                    <Button mode="contained" style={styles.playButton} onPress={() => navigation.navigate("GamePlay", { name: "PUNE CITY" })}>Play</Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFD700',
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    balance: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    buttonLabel: {
        color: '#ffffff', // White text on buttons
        fontSize: 12,
    },
    addMoneyButton: {
        backgroundColor: '#FFD700',
    },
    scrollView: {
        flex: 1,
    },
    gameCard: {
        backgroundColor: '#333333',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    gameName: {
        fontSize: 18,
        color: '#FFD700',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    gameStatus: {
        fontSize: 14,
        color: '#FFD700',
        marginBottom: 10,
    },
    timeInfo: {
        fontSize: 14,
        color: '#ffffff',
        marginBottom: 10,
    },
    playButton: {
        backgroundColor: '#FFD700',
    },
    waitButton: {
        backgroundColor: '#FFD700',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#333333',
        padding: 10,
        borderRadius: 10,
    },
    navButton: {
        color: '#FFD700',
    },
});

export default HomeScreen