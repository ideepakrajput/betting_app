import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text } from 'react-native-paper';
import { PHONE, TELEGRAM } from '../constants';

const SocialLinks = () => {
    const openTelegram = () => {
        Linking.openURL(TELEGRAM).catch(err => console.error('Error opening Telegram:', err));
    };

    const openWhatsApp = () => {
        const whatsappUrl = `https://wa.me/${PHONE}`;
        Linking.openURL(whatsappUrl).catch(err => console.error('Error opening WhatsApp:', err));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connect with us:</Text>
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={openTelegram} style={styles.iconWrapper}>
                    <Icon name="telegram" size={40} color="#0088cc" />
                    <Text style={styles.iconText}>Telegram</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={openWhatsApp} style={styles.iconWrapper}>
                    <Icon name="whatsapp" size={40} color="#25D366" />
                    <Text style={styles.iconText}>WhatsApp</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        // backgroundColor: '#000000', // Black background
    },
    title: {
        fontSize: 24,
        color: '#ffffff', // White text for title
        marginBottom: 20,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
    },
    iconWrapper: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    iconText: {
        marginTop: 10,
        fontSize: 16,
        color: '#ffffff', // White text for icon labels
    },
});

export default SocialLinks;
