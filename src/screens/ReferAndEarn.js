import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Linking, Share, Alert, ImageBackground } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const ReferAndEarn = () => {
    const user = useSelector((state) => state.user);
    const navigation = useNavigation();

    const copyToClipboard = () => {
        Clipboard.setString(user?.user?.ref_id);
    };
    const shareContent = `India ka No.1 Trusted App!
                            🕹   Shiva Gold  🕹

                            100% Withdrawal Guaranteed,
                            Personally Tested, 100% Secure 🔐

                            गली, देसावर, फरीदाबाद, इंडिया बाजार,
                            दुबई बाजार और बहुत सारी गेम!
                            Shiva Gold पर खेलें
                            और 100% विड्रॉल गारंटीड पाएं

                            Use My referral code: ${user?.user?.ref_id} 

                            Download Now 👇🏻
                            Link to the App`;

    const shareWithSheet = async () => {
        try {
            const result = await Share.share({
                message: shareContent,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared with activity type of result.activityType
                    console.log('Shared with activity type:', result.activityType);
                } else {
                    // Shared
                    console.log('Shared successfully');
                }
            } else if (result.action === Share.dismissedAction) {
                // Dismissed
                console.log('Share dismissed');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };
    const openWhatsApp = () => {
        const whatsappUrl = `whatsapp://send?text=${shareContent}`;
        Linking.openURL(whatsappUrl).catch(err => console.error('Error opening WhatsApp:', err));
    };
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
                {/* <Text style={styles.title}>Refer & Earn</Text> */}
                <ScrollView>
                    <Card style={styles.card}>
                        <Text style={styles.title}>Share Shiva Gold with Friends, Secure & Trusted</Text>
                        <Text style={styles.subtitle}>1% Commission on Every Deposit, Forever Unlock Exclusive Rewards</Text>

                        <Button
                            mode="contained"
                            color="#ff4d4d"
                            style={styles.shareButton}
                            onPress={shareWithSheet}
                        >
                            Share Now, Earn Always
                        </Button>

                        <Card style={styles.earningsCard}>
                            <Text style={styles.totalEarned}>Total Earned</Text>
                            <Text style={styles.earningsAmount}>₹ {user?.user?.referral_bonus}</Text>
                            <Button
                                mode="outlined"
                                color="#FFB600"
                                style={styles.checkStatusButton}
                                onPress={() => navigation.navigate('ReferralStatus')}
                            >
                                Check Referral Status
                            </Button>
                        </Card>

                        <View style={styles.referralCodeContainer}>
                            <Text style={styles.referralCodeText}>{user?.user?.ref_id}</Text>
                            <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                                <Text style={styles.copyText}>Copy</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.referralNote}>
                            ऊपर दिया गया कोड आपका रेफरल कोड है
                        </Text>

                        <Text style={styles.description}>
                            Shiva Gold शेयर करें और 5% कमीशन पाएं
                            अपने दोस्त के हर डिपॉजिट पर 5% commission
                            लाइफटाइम वैलिडिटी, अनलिमिटेड बेनिफिट्स
                            अब शेयर करें और अपने दोस्तों को Download करवाएं
                        </Text>

                        <Button
                            mode="contained"
                            color="#4CAF50"
                            style={styles.inviteButton}
                            onPress={openWhatsApp}
                        >
                            Invite Via Whatsapp
                        </Button>
                    </Card>
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#000', // Black background
        padding: 20,
    },
    card: {
        backgroundColor: '#1C1C1C', // Dark background for card
        padding: 20,
        borderRadius: 10,
        // borderColor: '#FFD700', // Gold border
        // borderWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF', // White text
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    shareButton: {
        marginBottom: 20,
    },
    earningsCard: {
        backgroundColor: '#FFD700', // Gold color for the card
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    totalEarned: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    earningsAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    checkStatusButton: {
        marginTop: 10,
    },
    referralCodeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1C1C1C',
        padding: 15,
        borderRadius: 10,
        borderColor: '#FFD700',
        borderWidth: 1,
        marginBottom: 10,
    },
    referralCodeText: {
        color: '#FFD700', // Gold text
        fontSize: 16,
    },
    copyButton: {
        backgroundColor: '#00FF00', // Green button
        padding: 10,
        borderRadius: 5,
    },
    copyText: {
        color: '#000',
        fontWeight: 'bold',
    },
    referralNote: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        color: '#00FF00', // Green text
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 20,
    },
    inviteButton: {
        marginTop: 10,
    },
});

export default ReferAndEarn;
