import React, { useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import YoutubePlayer from 'react-native-youtube-iframe';
import { PHONE, TELEGRAM, WHATSAPP, YOUTUBE } from '../constants';

const SupportScreen = () => {
    const playerRef = useRef(null);

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            console.log("Video has ended");
        }
    }, []);
    const openTelegram = () => {
        Linking.openURL(TELEGRAM).catch(err => console.error('Error opening Telegram:', err));
    };

    const openWhatsApp = () => {
        const whatsappUrl = `https://wa.me/${WHATSAPP}`;
        Linking.openURL(whatsappUrl).catch(err => console.error('Error opening WhatsApp:', err));
    };

    const openPhone = () => {
        const phoneUrl = `tel:${PHONE}`;
        Linking.openURL(phoneUrl).catch(err => console.error('Error opening phone:', err));
    };
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>Support in Messengers</Text>
                </View>

                <View style={styles.supportContainer}>
                    {/* WhatsApp Support */}
                    <TouchableOpacity style={styles.supportButton} onPress={openWhatsApp}>
                        <Icon name="whatsapp" size={30} color="#25D366" />
                        <Text style={styles.supportText}>{WHATSAPP}</Text>
                        <Icon name="hand-pointing-left" size={30} color="#FFD700" />
                    </TouchableOpacity>

                    {/* Telegram Support */}
                    <TouchableOpacity style={styles.supportButton} onPress={openTelegram}>
                        <FontAwesome name="telegram" size={30} color="#0088cc" />
                        <Text style={styles.supportText}>Telegram</Text>
                        <Icon name="hand-pointing-left" size={30} color="#FFD700" />
                    </TouchableOpacity>

                    {/* Call Support */}
                    <TouchableOpacity style={styles.supportButton} onPress={openPhone}>
                        <Icon name="phone" size={30} color="#32CD32" />
                        <Text style={styles.supportText}>{PHONE}</Text>
                        <Icon name="hand-pointing-left" size={30} color="#FFD700" />
                    </TouchableOpacity>
                </View>

                {/* YouTube Video */}
                <View>
                    <YoutubePlayer
                        ref={playerRef}
                        height={300}
                        play={true}
                        videoId={YOUTUBE}
                        onChangeState={onStateChange}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', // Dark background
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff', // Gold text
    },
    supportButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#FFD700', // Gold border color
        borderWidth: 2,         // Thicker border to make it prominent
        backgroundColor: '#1E1E1E', // Dark button background
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    supportText: {
        flex: 1,
        fontSize: 18,
        color: '#ffffff', // White text
        marginLeft: 20,
    },
    videoContainer: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFD700', // Gold text
        marginBottom: 15,
    },
    video: {
        height: 200,
        borderRadius: 10,
    },
});

export default SupportScreen;
