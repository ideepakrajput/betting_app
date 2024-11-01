import { View, Text, StyleSheet, TouchableOpacity, Dimensions, VirtualizedList } from 'react-native'
import React, { useState, useCallback, memo, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { TextInput } from 'react-native-paper'
import { jantariBets } from '../services/endPoints'
import { updateBalance } from '../redux/slices/userSlice'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')
const CELL_WIDTH = (width - 20) / 11
const ITEMS_PER_ROW = 10
const INPUT_PADDING = 4

const NumberInput = memo(({ number, value, onChangeText }) => {
    const inputStyle = useMemo(() => [
        styles.input,
        { width: CELL_WIDTH }
    ], [])

    return (
        <View style={styles.cell}>
            <Text style={styles.numberText}>{number}</Text>
            <TextInput
                style={inputStyle}
                keyboardType="numeric"
                value={value || ''}
                onChangeText={onChangeText}
                dense
                mode="outlined"
                maxLength={5}
                selectTextOnFocus
                textColor='#FFD700'
                textAlign='center'
                contentStyle={styles.inputContent}
                theme={{
                    colors: {
                        background: 'black',
                        placeholder: '#FFD700',
                        text: '#FFD700',
                        primary: '#FFD700',
                    }
                }}
            />
        </View>
    )
}, (prevProps, nextProps) => prevProps.value === nextProps.value)

const NumberRow = memo(({ startIndex, numbers, betType, onBetChange, betsData }) => {
    const rowNumbers = numbers.slice(startIndex, startIndex + ITEMS_PER_ROW)

    return (
        <View style={styles.row}>
            {rowNumbers.map((number) => (
                <NumberInput
                    key={`${betType}-${number}`}
                    number={number}
                    value={betsData[number]?.toString()}
                    onChangeText={(value) => onBetChange(number, value, betType)}
                />
            ))}
        </View>
    )
})

const NumberSection = memo(({ title, numbers, betType, onBetChange, betsData }) => {
    const getItem = useCallback((data, index) => ({
        id: index,
        startIndex: index * ITEMS_PER_ROW
    }), [])

    const getItemCount = useCallback((data) => Math.ceil(data.length / ITEMS_PER_ROW), [])

    const renderItem = useCallback(({ item }) => (
        <NumberRow
            startIndex={item.startIndex}
            numbers={numbers}
            betType={betType}
            onBetChange={onBetChange}
            betsData={betsData}
        />
    ), [numbers, betType, onBetChange, betsData])

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <VirtualizedList
                data={numbers}
                renderItem={renderItem}
                getItem={getItem}
                getItemCount={getItemCount}
                keyExtractor={item => `${betType}-${item.id}`}
                maxToRenderPerBatch={4}
                updateCellsBatchingPeriod={50}
                windowSize={5}
                initialNumToRender={4}
                scrollEnabled={false} // Disable scrolling for individual lists
            />
        </View>
    )
})

const CombinedSection = memo(({ sections }) => {
    const getItem = useCallback((data, index) => data[index], [])
    const getItemCount = useCallback((data) => data.length, [])

    const renderItem = useCallback(({ item }) => (
        <NumberSection
            title={item.title}
            numbers={item.numbers}
            betType={item.betType}
            onBetChange={item.onBetChange}
            betsData={item.betsData}
        />
    ), [])

    return (
        <VirtualizedList
            data={sections}
            renderItem={renderItem}
            getItem={getItem}
            getItemCount={getItemCount}
            keyExtractor={item => item.betType}
            maxToRenderPerBatch={2}
            updateCellsBatchingPeriod={50}
            windowSize={3}
            initialNumToRender={2}
            style={styles.scrollView}
        />
    )
})

const Jantari = ({ game_id, setAlert }) => {
    const [mainBets, setMainBets] = useState({})
    const [andarBets, setAndarBets] = useState({})
    const [baharBets, setBaharBets] = useState({})

    const { user } = useSelector(state => state.user)
    const wallet_balance = user?.wallet_balance
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const mainNumbers = useMemo(() =>
        Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0')),
        []
    )

    const singleDigitNumbers = useMemo(() =>
        Array.from({ length: 10 }, (_, i) => i.toString()),
        []
    )

    const handleBetChange = useCallback((number, value, betType) => {
        const amount = value === '' ? '' : parseInt(value)
        if (isNaN(amount)) return

        const setBets = {
            main: setMainBets,
            andar: setAndarBets,
            bahar: setBaharBets
        }[betType]

        setBets(prev => ({ ...prev, [number]: amount }))
    }, [])

    const calculateTotal = useCallback(() => {
        const sumBets = (bets) => Object.values(bets).reduce((sum, val) => sum + (val || 0), 0)
        return sumBets(mainBets) + sumBets(andarBets) + sumBets(baharBets)
    }, [mainBets, andarBets, baharBets])

    const handlePlaceBet = async () => {
        const totalAmount = calculateTotal()
        if (totalAmount <= 0) {
            setAlert({
                message: 'Please place a valid bet.',
                type: 'error',
            })
            return
        }
        if (totalAmount > wallet_balance) {
            setAlert({
                message: 'Insufficient balance.',
                type: 'error',
            })
            setTimeout(() => navigation.navigate('WalletDetails'), 2000)
            return
        }

        try {
            const response = await jantariBets({
                bazaarId: game_id,
                mainBets,
                andarBets,
                baharBets,
                totalAmount
            })

            if (response.success) {
                dispatch(updateBalance(wallet_balance - totalAmount))
                setAlert({ message: 'Bet placed successfully.', type: 'success' })
                setMainBets({})
                setAndarBets({})
                setBaharBets({})
            } else {
                setAlert({ message: response.error, type: 'error' })
            }
        } catch (error) {
            setAlert({ message: 'Failed to place bet.', type: 'error' })
        }
    }

    const sections = useMemo(() => [
        {
            title: "Enter Amount Below",
            numbers: mainNumbers,
            betType: "main",
            onBetChange: handleBetChange,
            betsData: mainBets
        },
        {
            title: "Andar / A",
            numbers: singleDigitNumbers,
            betType: "andar",
            onBetChange: handleBetChange,
            betsData: andarBets
        },
        {
            title: "Bahar / B",
            numbers: singleDigitNumbers,
            betType: "bahar",
            onBetChange: handleBetChange,
            betsData: baharBets
        }
    ], [mainNumbers, singleDigitNumbers, handleBetChange, mainBets, andarBets, baharBets])

    const total = useMemo(() => calculateTotal(), [calculateTotal])

    return (
        <SafeAreaView style={styles.container}>
            <CombinedSection sections={sections} />
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Rs : ₹ {total}</Text>
                    <Text style={styles.totalSubtext}>Total Amount</Text>
                </View>
                <TouchableOpacity
                    onPress={handlePlaceBet}
                    style={[styles.button]}
                >
                    <Text style={styles.buttonText}>PLACE BET</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    scrollView: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
        paddingHorizontal: INPUT_PADDING,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeaderContainer: {
        paddingVertical: 8,
        backgroundColor: '#1a1a1a',
        borderRadius: 4,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: '600',
    },
    cell: {
        alignItems: 'center',
        width: CELL_WIDTH,
        paddingHorizontal: INPUT_PADDING,
    },
    numberText: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 2,
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'transparent',
        height: 40,
        minHeight: 40,
        textAlign: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 14,
    },
    inputContent: {
        paddingVertical: 4,
        paddingHorizontal: 2,
        height: 36,
        minHeight: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#FFD700',
        flexDirection: 'row',
        paddingTop: 16,
        // paddingHorizontal: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    totalContainer: {
        alignItems: 'center',
    },
    totalText: {
        fontSize: 20,
        color: '#FFD700',
    },
    totalSubtext: {
        fontSize: 20,
        color: '#FFD700',
    },
    button: {
        backgroundColor: '#FFD700',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
        elevation: 3,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black',
    },
})

export default memo(Jantari)