import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';

const SplashScreen = () => {
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
                <Image
                    source={require('../assets/logo-bg-remove.png')} // Add your app logo
                    style={styles.logo}
                />
                <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#222222',
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
