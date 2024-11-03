import { View, Text, FlatList, StyleSheet, ActivityIndicator, Dimensions, ImageBackground } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { getBetHistory } from '../services/endPoints'
import { useFocusEffect } from '@react-navigation/native'

const { width } = Dimensions.get('window')
const COLUMN_WIDTH = (width - 48) / 2

const BidHistory = () => {
    const [betHistory, setBetHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalBidAmount, setTotalBidAmount] = useState(0)

    const betHistoryData = async () => {
        try {
            setLoading(true)
            const response = await getBetHistory()
            if (response.success) {
                setBetHistory(response.data.bets)
                setTotalBidAmount(response.data.totalBidAmount)
            }
        } catch (error) {
            console.error('Error fetching bet history:', error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            betHistoryData()
        }, [])
    )

    const renderBetItem = ({ item }) => (
        <View style={styles.betItem}>
            <Text style={styles.bazaarName}>{item.bazaarName}</Text>
            <Text style={styles.type}>Type: {item.type}</Text>
            {item.type == "Jantari" && <Text style={styles.type}>Type: {item.bidType}</Text>}
            <Text style={styles.bidNumber}>Bid Number: {item.bidNumber}</Text>
            <Text style={styles.bidAmount}>Amount: ₹{item.bidAmount}</Text>
            {/* <Text style={[styles.status, { color: item.status === 'won' ? '#FFD700' : '#ff4444' }]}>
                Status: {item.status}
            </Text> */}
            <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>
        </View>
    )

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        )
    }

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
                <View style={styles.header}>
                    <Text style={styles.headerText}>Bid History</Text>
                    <Text style={styles.totalAmount}>Total Amount: ₹{totalBidAmount}</Text>
                </View>
                <FlatList
                    data={betHistory}
                    renderItem={renderBetItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContainer}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#121212'
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212'
    },
    header: {
        padding: 16,
        backgroundColor: '#1E1E1E',
        borderBottomWidth: 1,
        borderBottomColor: '#FFD700'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFD700'
    },
    totalAmount: {
        fontSize: 16,
        color: '#FFD700',
        textAlign: 'center',
        marginTop: 4
    },
    listContainer: {
        padding: 8
    },
    row: {
        justifyContent: 'space-between',
        paddingHorizontal: 8
    },
    betItem: {
        backgroundColor: '#1E1E1E',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        width: COLUMN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFD700'
    },
    bazaarName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 4
    },
    type: {
        fontSize: 14,
        color: '#ffffff',
    },
    bidNumber: {
        fontSize: 14,
        color: '#ffffff',
        marginTop: 4
    },
    bidAmount: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFD700',
        marginTop: 4
    },
    status: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 4
    },
    date: {
        fontSize: 14,
        color: '#FFD700',
        marginTop: 4
    }
})

export default BidHistory
