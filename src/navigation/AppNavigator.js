import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Share, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from "react-native-vector-icons/AntDesign";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your screens here
import HomeScreen from '../screens/HomeScreen';
import BankDetailsUpdateScreen from '../screens/BankDetails';
import UpiDetailsUpdateScreen from '../screens/UpiDetails';
import TopWinner from '../screens/TopWinner';
import Rules from '../screens/Rules';
import ReferAndEarn from '../screens/ReferAndEarn';
import WalletScreen from '../screens/WalletScreen';
import SupportScreen from '../screens/Supports';
import Chart from '../screens/Chart';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ChangePasswordScreen from '../screens/ChangePassword';
import ReferralStatus from '../screens/ReferralStatus';
import WalletDetails from '../screens/WalletDetails';
import Transactions from '../screens/Transactions';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser } from '../redux/slices/userSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import NotificationToggle from '../components/NotificationToggle';
import { me } from '../services/endPoints';
import GamePlay from '../screens/GamePlay';
import SplashScreen from '../screens/SplashScreen';
import BetHistory from '../screens/BetHistory';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const CustomHeader = ({ navigation }) => {
    const user = useSelector((state) => state.user);

    return (
        <View style={[styles.header, { backgroundColor: '#222222' }]}>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <AntIcon name="menu-fold" size={24} color="#FFD700" />
            </TouchableOpacity>
            <Image
                source={require('../assets/logo-bg-remove.png')}
                style={styles.logo}
            />
            <TouchableOpacity onPress={() => navigation.navigate('WalletDetails')}>
                <View style={styles.walletContainer}>
                    <Icon name="account-balance-wallet" size={24} color="#FFD700" />
                    <Text style={styles.balanceText}>₹ {user?.user?.wallet_balance}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const CustomTabBar = ({ state, descriptors, navigation }) => (
    <View style={[styles.tabBar, { backgroundColor: '#222222' }]}>
        {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            let label = options.tabBarLabel ?? options.title ?? route.name;
            const isFocused = state.index === index;

            const onPress = () => {
                const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                });

                if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                }
            };
            if (route.name === 'HomeTab') {
                return null;
            }

            let iconName;
            if (route.name === 'Game Play') {
                iconName = 'home';
            } else if (route.name === 'WalletTab') {
                iconName = 'account-balance-wallet';
                label = 'Wallet';
            } else if (route.name === 'BidHistoryTab') {
                iconName = 'history';
                label = 'Bid History';
            } else if (route.name === 'ChartsTab') {
                iconName = 'bar-chart';
                label = 'Charts';
            } else if (route.name === 'ReferTab') {
                iconName = 'share';
                label = 'Refer & Earn';
            }

            return (
                <TouchableOpacity
                    key={index}
                    onPress={onPress}
                    style={styles.tabItem}
                >
                    <Icon name={iconName} size={24} color={isFocused ? '#FFD700' : '#888'} />
                    <Text style={[styles.tabLabel, { color: isFocused ? '#FFD700' : '#888' }]}>{label}</Text>
                </TouchableOpacity>
            );
        })}
    </View>
);

const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="BankDetails" component={BankDetailsUpdateScreen} />
        <Stack.Screen name="UPIDetails" component={UpiDetailsUpdateScreen} />
        <Stack.Screen name="WalletDetails" component={WalletDetails} />
        <Stack.Screen name="TopWinner" component={TopWinner} />
        <Stack.Screen name="Rules" component={Rules} />
        <Stack.Screen name="GamePlay" component={GamePlay} />
        <Stack.Screen name="ReferralStatus" component={ReferralStatus} />
        <Stack.Screen name="Transactions" component={Transactions} />
        <Stack.Screen name="Support" component={SupportScreen} />
    </Stack.Navigator>
);

const WalletStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WalletScreen" component={WalletScreen} />
    </Stack.Navigator>
);

const BidHistoryStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BetHistoryScreen" component={BetHistory} />
    </Stack.Navigator>
);

const ChartStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ChartScreen" component={Chart} />
    </Stack.Navigator>
);

const ReferStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ReferScreen" component={ReferAndEarn} />
    </Stack.Navigator>
);

const MainTabNavigator = () => (
    <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
            header: (props) => <CustomHeader {...props} />,
        }}
    >
        <Tab.Screen name="HomeTab" component={HomeStack} />
        <Tab.Screen name="Game Play" component={HomeStack} />
        <Tab.Screen name="WalletTab" component={WalletStack} />
        <Tab.Screen name="BidHistoryTab" component={BidHistoryStack} />
        <Tab.Screen name="ChartsTab" component={ChartStack} />
        <Tab.Screen name="ReferTab" component={ReferStack} />
    </Tab.Navigator>
);

const DrawerContent = (props) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const navigation = useNavigation();
    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        dispatch(setUser(null));
        dispatch(logout());
        navigation.navigate('Login');
        console.log("TEsat");

    };
    const copyToClipboard = () => {
        Clipboard.setString(user?.user?.ref_id);
    };
    const shareContent = `India ka No.1 Trusted App!
                            🕹   Shiva Gold  🕹

                            100% Withdrawal Guaranteed,
                            Personally Tested, 100% Secure 🔐

                            गली, देसावर, फरीदाबाद, इंडिया बाजार,
                            दुबई बाजार और बहुत सारी गेम!
                            Shiva Gold पर खेलें
                            और 100% विड्रॉल गारंटीड पाएं

                            Use My referral code: ${user?.user?.ref_id} 

                            Download Now 👇🏻
                            Link to the App`;

    const shareWithSheet = async () => {
        try {
            const result = await Share.share({
                message: shareContent,
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared with activity type of result.activityType
                    console.log('Shared with activity type:', result.activityType);
                } else {
                    // Shared
                    console.log('Shared successfully');
                }
            } else if (result.action === Share.dismissedAction) {
                // Dismissed
                console.log('Share dismissed');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };
    return (
        <View style={styles.drawerContent}>
            <View style={[styles.drawerHeader, { paddingVertical: 15 }]}>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#FFD700" }}>Profile</Text>
                </View>
                <View>
                    <AntIcon name="menu-unfold" size={24} color="#FFD700" onPress={() => props.navigation.toggleDrawer()} />
                </View>
            </View>
            <View style={[styles.drawerHeader, { backgroundColor: "#101010" }]}>
                <View>
                    <Image
                        source={require('../assets/logo-bg-remove.png')}
                        style={[styles.logo, {
                            width: 100,
                            height: 100,
                        }]}
                    />
                </View>
                <View>
                    <Text style={styles.drawerHeaderText}>{user?.user?.name || "Test User"}</Text>
                    <Text style={styles.drawerHeaderText}>{user?.user?.phone || "+91 99999 99999"}</Text>
                    <Text style={styles.drawerHeaderText}>{user?.user?.ref_id || "--------- "}{" "} <Ionicons onPress={copyToClipboard} color="#FFD700" name="copy" size={18} /></Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => props.navigation.navigate('HomeTab', { screen: 'ChangePassword' })}
            >
                <Icon name="password" size={24} color="#FFD700" />
                <Text style={styles.drawerItemText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => props.navigation.navigate('HomeTab', { screen: 'BankDetails' })}
            >
                <Icon name="account-balance" size={24} color="#FFD700" />
                <Text style={styles.drawerItemText}>Bank Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => props.navigation.navigate('HomeTab', { screen: 'UPIDetails' })}
            >
                <Icon name="payment" size={24} color="#FFD700" />
                <Text style={styles.drawerItemText}>UPI Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => props.navigation.navigate('HomeTab', { screen: 'Rules' })}
            >
                <Icon name="gavel" size={24} color="#FFD700" />
                <Text style={styles.drawerItemText}>Rules</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => props.navigation.navigate('HomeTab', { screen: 'TopWinner' })}
            >
                <Icon name="emoji-events" size={24} color="#FFD700" />
                <Text style={styles.drawerItemText}>Top Winners</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => shareWithSheet()}
            >
                <Icon name="share" size={24} color="#FFD700" />
                <Text style={styles.drawerItemText}>Share</Text>
            </TouchableOpacity>
            <View style={[styles.drawerItem, { justifyContent: "space-between" }]}>
                <View style={[styles.drawerItem, { padding: 0 }]}>
                    <Icon name="notifications" size={24} color="#FFD700" />
                    <Text style={styles.drawerItemText}>Notification </Text>
                </View>
                <View>
                    <NotificationToggle />
                </View>
            </View>

            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => props.navigation.navigate('HomeTab', { screen: 'Support' })}
            >
                <Icon name="support-agent" size={24} color="#FFD700" />
                <Text style={styles.drawerItemText}>Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={handleLogout}
            >
                <Icon name="logout" size={24} color="#FF6347" />
                <Text style={[styles.drawerItemText, { color: "#FF6347" }]}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
};

const MainDrawerNavigator = () => (
    <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
            headerShown: false,
            drawerStyle: {
                backgroundColor: '#000000',
            }
        }}
    >
        <Drawer.Screen name="MainTabs" component={MainTabNavigator} />
    </Drawer.Navigator>
);

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
);

const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    return token;
};
const AppNavigator = () => {
    const user = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user.isLoggedIn) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [dispatch, user]);

    useEffect(() => {
        const initialize = async () => {
            try {
                const token = await getToken();
                if (token) {
                    const response = await me();
                    if (response.success) {
                        dispatch(setUser(response.user));
                        setIsLoggedIn(true);
                    }
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.log('Initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initialize();
    }, [dispatch]);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer>
            {isLoggedIn ? <MainDrawerNavigator /> : <AuthStack />}
        </NavigationContainer>
    );
};
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#000000',
    },
    walletContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: '#fff',
        borderWidth: 1,
    },
    balanceText: {
        color: '#FFD700',
        marginLeft: 5,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#000000',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#222',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    drawerContent: {
        flex: 1,
        backgroundColor: '#222222',
        zIndex: -100
    },
    drawerHeader: {
        padding: 15,
        backgroundColor: '#222222',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    drawerHeaderText: {
        color: '#ffffff',
        borderBottomColor: '#FFD700',
        borderBottomWidth: 1,
        fontSize: 18,
        justifyContent: 'center',
        alignContent: 'center',
        paddingVertical: 5,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#222',
    },
    drawerItemText: {
        color: '#FFD700',
        fontSize: 16,
        marginLeft: 10,
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
});

export default AppNavigator;