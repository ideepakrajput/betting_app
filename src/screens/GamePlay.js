import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import OpenPlayTab from './OpenPlay';
import CrossPlay from './CrossPlay';
import Jantari from '../components/Jantari';
import CustomAlert from '../components/CustomAlert';

const GamePlay = ({ route }) => {
    const [alert, setAlert] = useState(null);
    const [activeTab, setActiveTab] = useState('jantari');
    const name = route?.params.name;
    const game_id = route?.params.game_id;

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
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
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        onPress={() => handleTabChange('jantari')}
                        style={[
                            styles.tabButton,
                            activeTab === 'jantari' && styles.activeTabButton
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'jantari' && styles.activeTabText
                            ]}
                        >
                            JANTARI
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleTabChange('open_play')}
                        style={[
                            styles.tabButton,
                            activeTab === 'open_play' && styles.activeTabButton
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'open_play' && styles.activeTabText
                            ]}
                        >
                            OPEN PLAY
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleTabChange('cross')}
                        style={[
                            styles.tabButton,
                            activeTab === 'cross' && styles.activeTabButton
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === 'cross' && styles.activeTabText
                            ]}
                        >
                            CROSS
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>{name}</Text>

                {activeTab === 'jantari' && (
                    <Jantari game_id={game_id} alert={alert} setAlert={setAlert} />
                )}

                {activeTab === 'open_play' && (
                    <OpenPlayTab game_id={game_id} alert={alert} setAlert={setAlert} />
                )}

                {activeTab === 'cross' && (
                    <CrossPlay game_id={game_id} alert={alert} setAlert={setAlert} />
                )}

                {alert && <CustomAlert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'black',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    title: {
        fontSize: 20,
        color: '#FFD700',
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#111111',
        padding: 10,
    },
    activeTabButton: {
        backgroundColor: '#FFD700',
    },
    tabText: {
        color: '#FFD700',
    },
    activeTabText: {
        color: '#111111',
    },
});

export default GamePlay;
