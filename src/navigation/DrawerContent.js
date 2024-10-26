import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const CustomDrawerContent = (props) => {
    return (
        <DrawerContentScrollView {...props}>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Welcome, User!</Text>
            </View>
            <DrawerItem
                label="Home"
                icon={({ color, size }) => (
                    <Icon name="home" color={color} size={size} />
                )}
                onPress={() => props.navigation.navigate('Home')}
            />
            <DrawerItem
                label="Profile"
                icon={({ color, size }) => (
                    <Icon name="person" color={color} size={size} />
                )}
                onPress={() => props.navigation.navigate('Profile')}
            />
            <DrawerItem
                label="Settings"
                icon={({ color, size }) => (
                    <Icon name="settings" color={color} size={size} />
                )}
                onPress={() => props.navigation.navigate('Settings')}
            />
            <DrawerItem
                label="Wallet"
                icon={({ color, size }) => (
                    <Icon name="account-balance-wallet" color={color} size={size} />
                )}
                onPress={() => props.navigation.navigate('Wallet')}
            />
        </DrawerContentScrollView>
    );
};
