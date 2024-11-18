import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Text } from 'react-native-paper';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { ImageBackground, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getBazaars } from '../services/endPoints';

const HomeScreen = () => {
    const user = useSelector(state => state.user);
    const navigation = useNavigation();
    const [bazaars, setBazaars] = useState([]);
    const [liveResults, setLiveResults] = useState([]);
    const [waiting, setWaiting] = useState(false);
    const [liveGames, setLiveGames] = useState([]);
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [lastResults, setLastResults] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            getBazaarData();
            const intervalId = setInterval(() => {
                getBazaarData();
            }, 1 * 60000);
            return () => clearInterval(intervalId);
        }, [])
    );

    const getBazaarData = async () => {
        try {
            const response = await getBazaars() || [];

            const currentTime = new Date();
            const currentTimeString = new Date();

            // Helper function to create comparable datetime
            const createDateTime = (type, timeStr) => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                const date = new Date(currentTimeString);
                // Handle midnight crossing - if hour is less than 12, assume it's next day
                if (hours < 12) {
                    date.setDate(date.getDate() + 1);
                }
                if (type === "open" && hours >= 23) {
                    date.setDate(date.getDate() + 1);
                }
                date.setHours(hours, minutes, 0, 0);
                return date;
            };

            const categorizedGames = response?.data?.reduce((acc, game) => {
                const openTime = createDateTime("open", game.open_time);
                const closeTime = createDateTime("close", game.close_time);
                const resultTime = createDateTime("result", game.result_time);

                if (openTime <= currentTime && closeTime >= currentTime && resultTime >= currentTime) {
                    acc.liveGames.push({ ...game, closeDateTime: closeTime });
                } else if (currentTime < openTime && closeTime >= currentTime && resultTime >= currentTime) {
                    acc.upcomingGames.push({ ...game, closeDateTime: closeTime });
                } else if (openTime <= currentTime && closeTime <= currentTime) {
                    acc.lastResults.push({ ...game, closeDateTime: closeTime });
                } else if (closeTime < resultTime && resultTime < currentTime) {
                    acc.liveResults.push({ ...game, closeDateTime: closeTime });
                    setWaiting(true);
                }
                return acc;
            }, { liveResults: [], liveGames: [], upcomingGames: [], lastResults: [] });

            // Sort by close time for lastResults
            const sortByCloseTime = (a, b) => b.closeDateTime - a.closeDateTime;

            // Sort by open time for upcoming games
            const sortByOpenTime = (a, b) => {
                const aTime = createDateTime("open", a.open_time);
                const bTime = createDateTime("open", b.open_time);
                return aTime - bTime;
            };

            setLiveResults(categorizedGames?.liveResults?.sort(sortByCloseTime));
            setLiveGames(categorizedGames?.liveGames?.sort(sortByCloseTime));
            setUpcomingGames(categorizedGames?.upcomingGames?.sort(sortByOpenTime));
            setLastResults(categorizedGames?.lastResults?.sort(sortByCloseTime));

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
                    {lastResults.length > 0 &&
                        <View key={lastResults[0]?._id} style={styles.gameCard}>
                            <View>
                                <Text style={styles.gameName}>{lastResults[0]?.name}</Text>
                                {waiting && <Text style={styles.timeInfo}>Betting is closed. Result will announce Soon</Text>}
                            </View>
                            <Text style={styles.gameResult}>{waiting ? "Wait" : lastResults[0]?.result || " - "}</Text>
                        </View>
                    }
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
                    <FlatList
                        data={upcomingGames}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View key={item._id} style={[styles.gameCard, styles.upcomingCard]}>
                                <View>
                                    <Text style={[styles.gameName, { textAlign: 'center' }]}>{item.name}</Text>
                                    <Text style={styles.timeInfo}>Open Time : {item.open_time}</Text>
                                    <Text style={styles.timeInfo}>Close Time : {item.close_time}</Text>
                                    <Text style={styles.timeInfo}>Result Time : {item.result_time}</Text>
                                </View>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        scrollEnabled={false}
                    />

                    {/* Last Results Section */}
                    <Text style={styles.categoryHeader}>Previous Results</Text>
                    {lastResults.map((game) => (
                        <View key={game._id} style={styles.gameCard}>
                            <View>
                                <Text style={styles.gameName}>{game.name}</Text>
                                <Text style={styles.timeInfo}>
                                    Open: {(game.open_time)} |
                                    Close: {(game.close_time)} |
                                    Result: {(game.result_time)}
                                </Text>
                            </View>
                            <Text style={styles.gameResult}>{game.result || " - "}</Text>
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
        // marginBottom: 10,
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
    },
    upcomingCard: {
        flex: 1,
        margin: 5,
        width: '48%', // Adjust width to account for margin
        flexDirection: 'column',
    },
    row: {
        flex: 1,
        justifyContent: 'space-between',
        marginHorizontal: -5, // Compensate for card margins
    }
});
export default HomeScreen