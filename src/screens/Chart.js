import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, ImageBackground } from 'react-native';
import { getResultHistory } from '../services/endPoints';
import { useFocusEffect } from '@react-navigation/native';

const ScrollableTable = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const headerScrollViewRef = useRef(null);
    const dataScrollViewRef = useRef(null);

    const getColumns = (data) => {
        if (data.length === 0) return [];
        const firstRow = data[0];
        return Object.keys(firstRow).map(key => ({
            key: key,
            title: key.charAt(0).toUpperCase() + key.slice(1),
            width: key === 'date' ? 60 : 120
        }));
    };

    const fetchData = async () => {
        try {
            const responseData = await getResultHistory();
            setData(responseData?.results);
            const generatedColumns = getColumns(responseData?.results);
            setColumns(generatedColumns);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );
    const renderHeader = () => (
        <View style={styles.headerRow}>
            <View style={[styles.stickyHeaderCell, { width: columns[0]?.width }]}>
                <Text style={styles.headerText}>{columns[0]?.title}</Text>
            </View>
            <ScrollView
                ref={headerScrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
            >
                {columns.slice(1).map((column) => (
                    <View key={column.key} style={[styles.headerCell, { width: column?.width }]}>
                        <Text style={styles.headerText}>{column?.title}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );

    const handleScroll = (event) => {
        const newScrollPosition = event.nativeEvent.contentOffset.x;
        headerScrollViewRef.current?.scrollTo({ x: newScrollPosition, animated: false });
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
                {renderHeader()}
                <ScrollView>
                    <View style={styles.tableContainer}>
                        <View style={styles.stickyColumn}>
                            {data.map((rowData, index) => (
                                <View key={index} style={[styles.stickyCell, { width: columns[0]?.width }]}>
                                    <Text style={[styles.cellText, { color: "#FFFFFF" }]}>{rowData[columns[0]?.key] || " - "}</Text>
                                </View>
                            ))}
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                        >
                            <View>
                                {data.map((rowData, index) => (
                                    <View key={index} style={styles.row}>
                                        {columns.slice(1).map((column) => (
                                            <View key={column.key} style={[styles.cell, { width: column?.width }]}>
                                                <Text style={styles.cellText}>{rowData[column?.key] || " - "}</Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#1E1E1E',
    },
    tableContainer: {
        flexDirection: 'row',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#3D3D3D',
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2C',
    },
    stickyColumn: {
        backgroundColor: '#1E1E1E',
        borderRightWidth: 1,
        borderRightColor: '#3D3D3D',
        zIndex: 1,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2C',
    },
    headerCell: {
        padding: 10,
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#3D3D3D',
        backgroundColor: '#2C2C2C',
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
    },
    stickyHeaderCell: {
        padding: 10,
        backgroundColor: '#2C2C2C',
        borderRightWidth: 1,
        borderRightColor: '#3D3D3D',
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
        zIndex: 2,
    },
    cell: {
        padding: 10,
        borderRightWidth: 1,
        borderRightColor: '#2C2C2C',
        justifyContent: 'center',
    },
    stickyCell: {
        padding: 10,
        backgroundColor: '#2C2C2C',
        borderRightWidth: 1,
        borderRightColor: '#3D3D3D',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
    },
    headerText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    cellText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFD700',
    },
});
export default ScrollableTable;
