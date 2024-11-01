import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo1.jpeg')} // Add your app logo
                style={styles.logo}
            />
            <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222222',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    loader: {
        marginTop: 20,
    },
});

export default SplashScreen;
