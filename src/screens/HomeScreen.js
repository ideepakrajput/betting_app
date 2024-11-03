import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { Button, Text } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { ImageBackground, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { getBazaars } from '../services/endPoints';
const HomeScreen = () => {
    const user = useSelector(state => state.user);
    const navigation = useNavigation();
    const [bazaars, setBazaars] = useState([]);
    const [liveResults, setLiveResults] = useState([]);
    const [liveGames, setLiveGames] = useState([]);
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [lastResults, setLastResults] = useState([]);

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

    useEffect(() => {
        getBazaarData();
    }, []);

    const getBazaarData = async () => {
        try {
            const response = await getBazaars();
            const currentTime = new Date();
            currentTime.setHours(currentTime.getHours() - 1);
            const currentTimeString = new Date();

            const categorizedGames = response.data.reduce((acc, game) => {
                const [openHour, openMinute] = game.open_time.split(':').map(Number);
                const [closeHour, closeMinute] = game.close_time.split(':').map(Number);
                const [resultHour, resultMinute] = game.result_time.split(':').map(Number);
                const openTime = new Date(currentTimeString.setHours(openHour, openMinute, 0, 0));
                const closeTime = new Date(currentTimeString.setHours(closeHour, closeMinute, 0, 0));
                const resultTime = new Date(currentTimeString.setHours(resultHour, resultMinute, 0, 0));

                if (resultTime <= currentTime) {
                    acc.liveResults.push(game);
                } else if (openTime <= currentTime && currentTime <= closeTime) {
                    acc.liveGames.push(game);
                } else if (currentTime < openTime) {
                    acc.liveGames.push(game);
                } else if (currentTime < resultTime) {
                    acc.lastResults.push(game);
                }
                return acc;
            }, { liveResults: [], liveGames: [], upcomingGames: [], lastResults: [] });

            setLiveResults(categorizedGames.liveResults);
            setLiveGames(categorizedGames.liveGames);
            setUpcomingGames(categorizedGames.upcomingGames);
            setLastResults(categorizedGames.lastResults);
        } catch (error) {
            console.error('Error fetching bazaars:', error);
        }
    };



    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/bg.jpg')}
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%'
                }}
                resizeMode="cover"
            >
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
                    {/* Live Results Section */}
                    <Text style={styles.categoryHeader}>Live Results</Text>
                    {/* {liveResults.map((game) => ( */}
                    <View key={liveResults[0]?._id} style={styles.gameCard}>
                        <Text style={styles.gameName}>{liveResults[0]?.name}</Text>
                        <Text style={styles.gameResult}>{liveResults[0]?.result || 77}</Text>
                    </View>
                    {/* ))} */}

                    {/* Live Games Section */}
                    <Text style={styles.categoryHeader}>Live Games</Text>
                    {liveGames.map((game) => (
                        <View key={game._id} style={styles.gameCard}>
                            <View>
                                <Text style={styles.gameName}>{game.name}</Text>
                                <Text style={styles.timeInfo}>
                                    Open: {(game.open_time)} |
                                    Close: {(game.close_time)} |
                                    Result: {(game.result_time)}
                                </Text>
                            </View>
                            <View>
                                <Button
                                    mode="contained"
                                    textColor='black'
                                    style={styles.playButton}
                                    onPress={() => navigation.navigate("GamePlay", { name: game.name, game_id: game._id })}
                                >
                                    Play
                                </Button>
                            </View>
                        </View>
                    ))}

                    {/* Upcoming Games Section */}
                    <Text style={styles.categoryHeader}>Upcoming Games</Text>
                    {upcomingGames.map((game) => (
                        <View key={game._id} style={[styles.gameCard, {}]}>
                            <View>
                                <Text style={styles.gameName}>{game.name}</Text>
                                <Text style={styles.timeInfo}>Open Time : {game.open_time}</Text>
                                <Text style={styles.timeInfo}>Close Time : {game.close_time}</Text>
                                <Text style={styles.timeInfo}>Result Time : {game.result_time}</Text>
                            </View>
                        </View>
                    ))}

                    {/* Last Results Section */}
                    <Text style={styles.categoryHeader}>Previous Results</Text>
                    {lastResults.map((game) => (
                        <View key={game._id} style={styles.gameCard}>
                            <Text style={styles.gameName}>{game.name}</Text>
                            <Text style={styles.gameResult}>{game.result || 77}</Text>
                        </View>
                    ))}
                </ScrollView>
            </ImageBackground>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        fontWeight: "bold"
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
    categoryHeader: {
        fontSize: 20,
        color: '#FFD700',
        fontWeight: 'bold',
        marginVertical: 10,
        paddingLeft: 5,
    },
    gameResult: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'center',
        backgroundColor: '#FFD700',
        marginBottom: 5,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    }
});
export default HomeScreen