import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

const Rules = () => {
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
                <Text style={styles.title}>Game and Payment Guidelines</Text>
                <ScrollView>
                    <Card style={styles.card}>
                        <Text style={styles.header}>SK Matka Payment Rules</Text>

                        <Text style={styles.bulletPoint}>• <Text style={styles.greenText}>Minimum Deposit: ₹200 (Automatic)</Text></Text>

                        <Text style={styles.bulletPoint}>• <Text style={styles.greenText}>Minimum Withdrawal: ₹900</Text></Text>
                        <Text style={styles.bulletPoint}>• <Text style={styles.greenText}>Maximum Withdrawal per Day: ₹10 Lakhs</Text></Text>
                        <Text style={styles.bulletPoint}>• <Text style={styles.greenText}>Withdrawal Timing: 10:00 AM to 04:00 PM</Text></Text>

                        <Text style={styles.noteText}>NOTE: Only winnings amount can be withdrawn.</Text>

                        <Text style={styles.header}>Game Rates</Text>

                        <Text style={styles.bulletPoint}>• <Text style={styles.greenText}>Jodi Rate: ₹100 for ₹9,000</Text></Text>
                        <Text style={styles.bulletPoint}>• <Text style={styles.greenText}>Harup Rate: ₹100 for ₹900</Text></Text>

                        <Text style={styles.footerText}>SK DREAM</Text>
                        <Text style={styles.footerText}>SK MATKA</Text>
                        <Text style={styles.footerText}>SK MATKA</Text>
                    </Card>
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#000000', // Black background
        padding: 10,

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF', // White text
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#1C1C1C', // Dark background for card
        padding: 20,
        borderRadius: 10,
        borderColor: '#FFD700', // Gold border
        borderWidth: 1,
    },
    header: {
        color: '#FF0000', // Red text for header
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    bulletPoint: {
        fontSize: 16,
        color: '#FFFFFF', // White for regular text
        marginBottom: 10,
    },
    greenText: {
        color: '#00FF00', // Green text
    },
    noteText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#FFD700', // Gold text
        fontWeight: 'bold',
        marginBottom: 10,
    },
    footerText: {
        fontSize: 16,
        color: '#00FF00', // Green for footer text
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default Rules;
