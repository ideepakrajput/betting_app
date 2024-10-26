import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';

const data = [
    { date: '01', faridabad: '43', gaziyabad: '60', indiaDarbar: '52', gali: '18', ranchi: '29', dubaiBazar: '96', delhiGold: '27', mumbaiCity: '08', indiaBazar: '60', desawar: '24', puneCity: '73' },
    { date: '02', faridabad: '18', gaziyabad: '41', indiaDarbar: '93', gali: '66', ranchi: '07', dubaiBazar: '62', delhiGold: '60', mumbaiCity: '06', indiaBazar: '22', desawar: '76', puneCity: '15' },
    { date: '03', faridabad: '92', gaziyabad: '57', indiaDarbar: '33', gali: '53', ranchi: '81', dubaiBazar: '86', delhiGold: '95', mumbaiCity: '01', indiaBazar: '69', desawar: '89', puneCity: '20' },
    { date: '04', faridabad: '88', gaziyabad: '72', indiaDarbar: '34', gali: '74', ranchi: '59', dubaiBazar: '67', delhiGold: '81', mumbaiCity: '62', indiaBazar: '01', desawar: '30', puneCity: '59' },
    { date: '05', faridabad: '94', gaziyabad: '94', indiaDarbar: '19', gali: '01', ranchi: '40', dubaiBazar: '40', delhiGold: '02', mumbaiCity: '06', indiaBazar: '84', desawar: '75', puneCity: '77' },
    { date: '06', faridabad: '26', gaziyabad: '26', indiaDarbar: '58', gali: '13', ranchi: '22', dubaiBazar: '08', delhiGold: '41', mumbaiCity: '72', indiaBazar: '29', desawar: '47', puneCity: '55' },
    { date: '07', faridabad: '30', gaziyabad: '93', indiaDarbar: '91', gali: '53', ranchi: '24', dubaiBazar: '29', delhiGold: '96', mumbaiCity: '01', indiaBazar: '27', desawar: '65', puneCity: '31' },
    { date: '08', faridabad: '70', gaziyabad: '91', indiaDarbar: '55', gali: '41', ranchi: '61', dubaiBazar: '03', delhiGold: '65', mumbaiCity: '41', indiaBazar: '41', desawar: '30', puneCity: '27' },
    { date: '09', faridabad: '63', gaziyabad: '81', indiaDarbar: '12', gali: '80', ranchi: '05', dubaiBazar: '26', delhiGold: '02', mumbaiCity: '80', indiaBazar: '17', desawar: '80', puneCity: '57' },
    { date: '10', faridabad: '93', gaziyabad: '85', indiaDarbar: '96', gali: '12', ranchi: '49', dubaiBazar: '33', delhiGold: '04', mumbaiCity: '15', indiaBazar: '95', desawar: '43', puneCity: '38' },
    { date: '11', faridabad: '45', gaziyabad: '43', indiaDarbar: '19', gali: '81', ranchi: '14', dubaiBazar: '07', delhiGold: '02', mumbaiCity: '74', indiaBazar: '52', desawar: '06', puneCity: '55' },
    { date: '12', faridabad: '14', gaziyabad: '21', indiaDarbar: '65', gali: '81', ranchi: '72', dubaiBazar: '20', delhiGold: '58', mumbaiCity: '73', indiaBazar: '94', desawar: '50', puneCity: '97' },
    { date: '13', faridabad: '87', gaziyabad: '14', indiaDarbar: '62', gali: '43', ranchi: '84', dubaiBazar: '39', delhiGold: '10', mumbaiCity: '04', indiaBazar: '15', desawar: '81', puneCity: '15' },
    { date: '14', faridabad: '61', gaziyabad: '01', indiaDarbar: '65', gali: '88', ranchi: '04', dubaiBazar: '29', delhiGold: '80', mumbaiCity: '64', indiaBazar: '32', desawar: '60', puneCity: '89' },
    { date: '15', faridabad: '57', gaziyabad: '68', indiaDarbar: '45', gali: '83', ranchi: '03', dubaiBazar: '06', delhiGold: '54', mumbaiCity: '82', indiaBazar: '46', desawar: '36', puneCity: '54' },
    { date: '16', faridabad: '29', gaziyabad: '09', indiaDarbar: '51', gali: '23', ranchi: '94', dubaiBazar: '59', delhiGold: '14', mumbaiCity: '69', indiaBazar: '22', desawar: '08', puneCity: '80' },
    { date: '17', faridabad: '58', gaziyabad: '40', indiaDarbar: '75', gali: '25', ranchi: '43', dubaiBazar: '00', delhiGold: '34', mumbaiCity: '44', indiaBazar: '80', desawar: '52', puneCity: '74' },
    { date: '18', faridabad: '92', gaziyabad: '52', indiaDarbar: '91', gali: '73', ranchi: '26', dubaiBazar: '39', delhiGold: '94', mumbaiCity: '44', indiaBazar: '13', desawar: '38', puneCity: '50' },
    { date: '19', faridabad: '69', gaziyabad: '06', indiaDarbar: '70', gali: '91', ranchi: '41', dubaiBazar: '95', delhiGold: '05', mumbaiCity: '36', indiaBazar: '66', desawar: '79', puneCity: '38' },
    { date: '20', faridabad: '46', gaziyabad: '61', indiaDarbar: '15', gali: '-', ranchi: '-', dubaiBazar: '38', delhiGold: '85', mumbaiCity: '62', indiaBazar: '28', desawar: '-', puneCity: '-' },
];

const columns = [
    { key: 'date', title: 'Date', width: 50 },
    { key: 'faridabad', title: 'Faridabad', width: 100 },
    { key: 'gaziyabad', title: 'Gaziyabad', width: 100 },
    { key: 'indiaDarbar', title: 'India Darbar', width: 120 },
    { key: 'gali', title: 'Gali', width: 80 },
    { key: 'ranchi', title: 'Ranchi', width: 80 },
    { key: 'dubaiBazar', title: 'Dubai Bazar', width: 120 },
    { key: 'delhiGold', title: 'Delhi Gold', width: 100 },
    { key: 'mumbaiCity', title: 'Mumbai City', width: 120 },
    { key: 'indiaBazar', title: 'India Bazar', width: 120 },
    { key: 'desawar', title: 'Desawar', width: 100 },
    { key: 'puneCity', title: 'Pune City', width: 100 },
];

const ScrollableTable = () => {
    const headerScrollViewRef = useRef(null);
    const dataScrollViewRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = (event) => {
        const newScrollPosition = event.nativeEvent.contentOffset.x;
        setScrollPosition(newScrollPosition);

        if (headerScrollViewRef.current) {
            headerScrollViewRef.current.scrollTo({ x: newScrollPosition, animated: false });
        }
        if (dataScrollViewRef.current) {
            dataScrollViewRef.current.scrollTo({ x: newScrollPosition, animated: false });
        }
    };

    const renderHeader = () => (
        <ScrollView
            ref={headerScrollViewRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
        >
            {columns.map((column) => (
                <View key={column.key} style={[styles.headerCell, { width: column.width }]}>
                    <Text style={styles.headerText}>{column.title}</Text>
                </View>
            ))}
        </ScrollView>
    );

    const renderRow = (rowData, index) => (
        <View key={index} style={styles.row}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
            >
                {columns.map((column) => (
                    <View key={column.key} style={[styles.cell, { width: column.width }]}>
                        <Text style={styles.cellText}>{rowData[column.key]}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>{renderHeader()}</View>
            <ScrollView
                ref={dataScrollViewRef}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <ScrollView>
                    {data.map((rowData, index) => renderRow(rowData, index))}
                </ScrollView>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    headerContainer: {
        backgroundColor: '#2C2C2C',
    },
    headerCell: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#3D3D3D',
    },
    headerText: {
        color: '#FFD700',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#3D3D3D',
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
    },
    cellText: {
        color: '#FFFFFF',
    },
});

export default ScrollableTable;