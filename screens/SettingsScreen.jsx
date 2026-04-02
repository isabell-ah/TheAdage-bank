import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { USER } from '../data';

export default function SettingsScreen({ navigation }) {
  const { C, F, isDark, toggleTheme } = useTheme();
  const [notifTx,    setNotifTx]    = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);
  const [biometrics, setBiometrics] = useState(true);
  const [twoFA,      setTwoFA]      = useState(false);

  const s = makeStyles(C, F);

  const confirm = (title, msg, onYes) =>
    Alert.alert(title, msg, [{ text: 'Cancel', style: 'cancel' }, { text: 'Confirm', onPress: onYes }]);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={C.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Settings</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Appearance */}
        <Text style={s.sectionLabel}>Appearance</Text>
        <View style={s.card}>
          <View style={s.row}>
            <View style={s.rowLeft}>
              <View style={s.iconBg}><Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={C.primary} /></View>
              <View>
                <Text style={s.rowTitle}>Dark Mode</Text>
                <Text style={s.rowSub}>{isDark ? 'Dark theme active' : 'Light theme active'}</Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: C.border, true: C.primary }}
              thumbColor={C.surface}
            />
          </View>
        </View>

        {/* Notifications */}
        <Text style={s.sectionLabel}>Notifications</Text>
        <View style={s.card}>
          {[
            { label: 'Transaction Alerts', sub: 'Get notified on every transaction', val: notifTx, set: setNotifTx },
            { label: 'Promotions & Offers', sub: 'News and special offers', val: notifPromo, set: setNotifPromo },
          ].map((item, i, arr) => (
            <View key={item.label} style={[s.row, i < arr.length - 1 && s.rowBorder]}>
              <View style={s.rowLeft}>
                <View style={s.iconBg}><Ionicons name="notifications-outline" size={18} color={C.primary} /></View>
                <View>
                  <Text style={s.rowTitle}>{item.label}</Text>
                  <Text style={s.rowSub}>{item.sub}</Text>
                </View>
              </View>
              <Switch
                value={item.val}
                onValueChange={item.set}
                trackColor={{ false: C.border, true: C.primary }}
                thumbColor={C.surface}
              />
            </View>
          ))}
        </View>

        {/* Security */}
        <Text style={s.sectionLabel}>Security</Text>
        <View style={s.card}>
          <View style={[s.row, s.rowBorder]}>
            <View style={s.rowLeft}>
              <View style={s.iconBg}><Ionicons name="finger-print" size={18} color={C.primary} /></View>
              <View>
                <Text style={s.rowTitle}>Biometric Login</Text>
                <Text style={s.rowSub}>Fingerprint / Face ID</Text>
              </View>
            </View>
            <Switch value={biometrics} onValueChange={setBiometrics} trackColor={{ false: C.border, true: C.primary }} thumbColor={C.surface} />
          </View>
          <View style={[s.row, s.rowBorder]}>
            <View style={s.rowLeft}>
              <View style={s.iconBg}><Ionicons name="shield-checkmark-outline" size={18} color={C.primary} /></View>
              <View>
                <Text style={s.rowTitle}>Two-Factor Auth</Text>
                <Text style={s.rowSub}>SMS verification on login</Text>
              </View>
            </View>
            <Switch value={twoFA} onValueChange={setTwoFA} trackColor={{ false: C.border, true: C.primary }} thumbColor={C.surface} />
          </View>
          <TouchableOpacity style={s.row} onPress={() => Alert.alert('Change PIN', 'A PIN reset link has been sent to your registered phone number.')}>
            <View style={s.rowLeft}>
              <View style={s.iconBg}><Ionicons name="keypad-outline" size={18} color={C.primary} /></View>
              <View>
                <Text style={s.rowTitle}>Change PIN</Text>
                <Text style={s.rowSub}>Update your transaction PIN</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.muted} />
          </TouchableOpacity>
        </View>

        {/* Account */}
        <Text style={s.sectionLabel}>Account</Text>
        <View style={s.card}>
          {[
            { icon: 'person-outline',        label: 'Personal Information', sub: 'Name, phone, address',    action: () => Alert.alert('Personal Information', `Name: ${USER.name}\nPhone: ${USER.phone}\nEmail: ${USER.email}\nID: ${USER.idNumber}\nAddress: ${USER.address}\nCustomer Since: ${USER.customerSince}`) },
            { icon: 'business-outline',       label: 'My Branch',            sub: USER.branch,               action: () => Alert.alert('Branch Details', `${USER.branch}\n${USER.branchAddress}\n${USER.branchPhone}\nHours: Mon–Fri 8am–5pm, Sat 9am–1pm\n\n${USER.relationship}`) },
            { icon: 'language-outline',      label: 'Language',             sub: 'English (Default)',       action: () => Alert.alert('Language', 'English is the only supported language currently.') },
            { icon: 'document-text-outline', label: 'Terms & Privacy',      sub: 'Read our policies',       action: () => Alert.alert('Terms & Privacy', 'Full terms available at demobank.co/terms') },
            { icon: 'help-circle-outline',   label: 'Help & Support',       sub: 'Chat, call or email us',  action: () => Alert.alert('Support', 'Call: 0800 723 456\nEmail: support@demobank.co') },
          ].map((item, i, arr) => (
            <TouchableOpacity key={item.label} style={[s.row, i < arr.length - 1 && s.rowBorder]} onPress={item.action}>
              <View style={s.rowLeft}>
                <View style={s.iconBg}><Ionicons name={item.icon} size={18} color={C.primary} /></View>
                <View>
                  <Text style={s.rowTitle}>{item.label}</Text>
                  <Text style={s.rowSub}>{item.sub}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={C.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Danger Zone */}
        <Text style={s.sectionLabel}>Danger Zone</Text>
        <View style={s.card}>
          <TouchableOpacity style={s.row} onPress={() => confirm('Deactivate Account', 'This will temporarily suspend your account. Continue?', () => Alert.alert('Account deactivated'))}>
            <View style={s.rowLeft}>
              <View style={[s.iconBg, { backgroundColor: C.debitDim }]}><Ionicons name="pause-circle-outline" size={18} color={C.debit} /></View>
              <View>
                <Text style={[s.rowTitle, { color: C.debit }]}>Deactivate Account</Text>
                <Text style={s.rowSub}>Temporarily suspend access</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.muted} />
          </TouchableOpacity>
        </View>

        <Text style={s.version}>Demo Bank v1.0.0 · SDK 55</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: F.bold, color: C.text },
  sectionLabel: { fontSize: 12, fontFamily: F.semiBold, color: C.muted, paddingHorizontal: 20, marginBottom: 8, marginTop: 20, textTransform: 'uppercase', letterSpacing: 0.8 },
  card: { backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 18, overflow: 'hidden', shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBg: { width: 38, height: 38, borderRadius: 11, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowTitle: { fontSize: 14, fontFamily: F.medium, color: C.text },
  rowSub: { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 1 },
  version: { textAlign: 'center', fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 24 },
});
