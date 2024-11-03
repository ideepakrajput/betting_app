import React from 'react';
import { View, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';

const users = [
    { id: 1, name: 'AMIT SHARMA', amount: '₹ 72000', icon: 'trophy', color: 'gold' },
    { id: 2, name: 'DHEERAJ', amount: '₹ 27900', icon: 'trophy', color: 'silver' },
    { id: 3, name: 'NARINDER KUMAR', amount: '₹ 27000', icon: 'trophy', color: '#cd7f32' }, // Bronze color
    { id: 4, name: 'DHARMENDER', amount: '₹ 21600', icon: 'trophy-outline', color: 'gold' },
    { id: 5, name: 'WASEEM', amount: '₹ 19800', icon: 'trophy-outline', color: 'gold' },
    { id: 6, name: 'RAM SEWAK', amount: '₹ 18000', icon: 'trophy-outline', color: 'gold' },
];

const TopWinner = () => {
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
                <Text style={styles.title}>Top Winners</Text>
                <ScrollView>
                    {users.map((user) => (
                        <Card key={user.id} style={styles.card}>
                            <View style={styles.row}>
                                <Avatar.Icon size={50} icon={user.icon} color={user.color} style={styles.icon} />
                                <View style={styles.info}>
                                    <Text style={styles.name}>{user.name}</Text>
                                </View>
                                <Text style={styles.amount}>{user.amount}</Text>
                            </View>
                        </Card>
                    ))}
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#000000',
        padding: 10,

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffffff',
        marginBottom: 20,
    },
    card: {
        marginBottom: 10,
        backgroundColor: '#1C1C1C',
        borderWidth: 1,
        borderColor: '#FFD700', // Gold border
        borderRadius: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    icon: {
        backgroundColor: 'transparent',
    },
    info: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        color: '#FFD700', // Gold text
        fontSize: 18,
        fontWeight: 'bold',
    },
    amount: {
        color: '#FFD700', // Gold text
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TopWinner;
