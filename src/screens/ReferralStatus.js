import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'

const ReferralStatus = () => {
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
                <Text style={styles.header}>Referral Status</Text>
            </View>
        </ImageBackground>
    )
}

export default ReferralStatus

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#121212',
        paddingTop: 20,
    },
    header: {
        color: '#FFD700',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})