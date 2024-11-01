import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const ReferralStatus = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Referral Status</Text>
        </View>
    )
}

export default ReferralStatus

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 20,
    },
    header: {
        color: '#FFD700',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})