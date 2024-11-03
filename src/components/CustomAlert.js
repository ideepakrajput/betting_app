import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const CustomAlert = ({ type = 'success', message, onClose }) => {
    const isError = type === 'error';

    useEffect(() => {
        if (message) {
            setTimeout(() => {
                onClose();
            }, 5000);
        }
    }, [message, onClose]);

    return (
        <View style={styles.alertWrapper}>
            <View style={[styles.alertContainer, isError ? styles.errorBackground : styles.successBackground]}>
                <MaterialCommunityIcons
                    name={isError ? 'alert-circle' : 'check-circle'}
                    size={30}
                    color={isError ? '#ff4c4c' : '#00ff99'}
                    style={styles.icon}
                />
                <Text style={styles.messageText}>{message}</Text>
                <Button
                    mode="text"
                    onPress={onClose}
                    style={styles.closeButton}
                    labelStyle={styles.closeButtonText}
                >
                    Close
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    alertWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    alertContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: '#cccccc',
        width: width - 40,
    },
    successBackground: {
        backgroundColor: '#1a1a1a',
    },
    errorBackground: {
        backgroundColor: '#1a1a1a',
    },
    messageText: {
        color: '#ffffff',
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
    closeButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
    },
    closeButtonText: {
        color: '#00ffff',
    },
});

export default CustomAlert;