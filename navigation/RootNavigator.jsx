import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import NotificationsScreen from '../screens/NotificationsScreen';
import PayBillsScreen from '../screens/PayBillsScreen';
import StatementScreen from '../screens/StatementScreen';
import ScanQRScreen from '../screens/ScanQRScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Root = createNativeStackNavigator();

export default function RootNavigator({ onLogout }) {
  return (
    <Root.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Root.Screen name="MainTabs">
        {(props) => <TabNavigator {...props} onLogout={onLogout} />}
      </Root.Screen>
      <Root.Screen name="Notifications"       component={NotificationsScreen} />
      <Root.Screen name="PayBills"            component={PayBillsScreen} />
      <Root.Screen name="Statement"           component={StatementScreen} />
      <Root.Screen name="ScanQR"              component={ScanQRScreen} />
      <Root.Screen name="Settings"            component={SettingsScreen} />
      <Root.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Root.Navigator>
  );
}
