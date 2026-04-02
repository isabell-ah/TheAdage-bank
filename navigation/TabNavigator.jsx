import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen         from '../screens/HomeScreen';
import CardsScreen        from '../screens/CardsScreen';
import ExploreScreen      from '../screens/ExploreScreen';
import AccountsScreen     from '../screens/AccountsScreen';
import ProfileScreen      from '../screens/ProfileScreen';
import SendMoneyScreen    from '../screens/SendMoneyScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import LoansScreen        from '../screens/LoansScreen';
import SavingsScreen      from '../screens/SavingsScreen';
import CustomTabBar       from '../components/CustomTabBar';

const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain"     component={HomeScreen} />
      <Stack.Screen name="SendMoney"    component={SendMoneyScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen name="Loans"        component={LoansScreen} />
      <Stack.Screen name="Savings"      component={SavingsScreen} />
    </Stack.Navigator>
  );
}

export default function TabNavigator({ onLogout }) {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home"     component={HomeStack} />
      <Tab.Screen name="Cards"    component={CardsScreen} />
      <Tab.Screen name="Explore"  component={ExploreScreen} />
      <Tab.Screen name="Accounts" component={AccountsScreen} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
