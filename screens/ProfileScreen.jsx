import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { USER, TRANSACTIONS, ACCOUNTS, CARDS } from '../data';

const MENU = [
  { icon: 'person-outline',           label: 'Personal Information', screen: 'Settings' },
  { icon: 'shield-checkmark-outline', label: 'Security Settings',    screen: 'Settings' },
  { icon: 'notifications-outline',    label: 'Notifications',        screen: 'Settings' },
  { icon: 'settings-outline',         label: 'App Settings',         screen: 'Settings' },
  { icon: 'help-circle-outline',      label: 'Help & Support',       screen: 'Settings' },
  { icon: 'document-text-outline',    label: 'Terms & Privacy',      screen: 'Settings' },
];

export default function ProfileScreen({ navigation, onLogout }) {
  const { C, F } = useTheme();
  const s = makeStyles(C, F);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        <View style={s.header}>
          <Text style={s.headerTitle}>Profile</Text>
          <TouchableOpacity style={s.iconBtn} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={20} color={C.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={s.profileCard}>
          <View style={s.avatarCircle}>
            <Text style={s.avatarText}>{USER.initials}</Text>
          </View>
          <Text style={s.profileName}>{USER.name}</Text>
          <Text style={s.profileEmail}>{USER.email}</Text>
          <View style={s.memberBadge}>
            <Ionicons name="star" size={12} color={C.accent} />
            <Text style={s.memberTxt}>{USER.memberType}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[{ label: 'Accounts', value: String(ACCOUNTS.length) }, { label: 'Cards', value: String(CARDS.length) }, { label: 'Transactions', value: String(TRANSACTIONS.length) }].map((stat, i, arr) => (
            <React.Fragment key={stat.label}>
              <View style={s.statItem}>
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={s.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Menu */}
        <View style={s.menuCard}>
          {MENU.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[s.menuItem, i < MENU.length - 1 && s.menuBorder]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={s.menuLeft}>
                <View style={s.menuIconBg}>
                  <Ionicons name={item.icon} size={18} color={C.primary} />
                </View>
                <Text style={s.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={C.muted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={s.logoutBtn} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={s.logoutTxt}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  safe:        { flex: 1, backgroundColor: C.bg },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle: { fontSize: 22, fontFamily: F.bold, color: C.text },
  iconBtn:     { width: 38, height: 38, borderRadius: 12, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center' },

  profileCard: { backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 14, shadowColor: C.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  avatarCircle:{ width: 82, height: 82, borderRadius: 41, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  avatarText:  { color: '#fff', fontSize: 28, fontFamily: F.bold },
  profileName: { fontSize: 20, fontFamily: F.bold, color: C.text, marginBottom: 4 },
  profileEmail:{ fontSize: 13, fontFamily: F.regular, color: C.muted, marginBottom: 10 },
  memberBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.accentDim, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  memberTxt:   { color: C.accent, fontSize: 12, fontFamily: F.semiBold },

  statsRow:    { flexDirection: 'row', backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 18, padding: 16, marginBottom: 14, justifyContent: 'space-around', alignItems: 'center', shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statItem:    { alignItems: 'center' },
  statValue:   { fontSize: 22, fontFamily: F.bold, color: C.primary },
  statLabel:   { fontSize: 11, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: C.border },

  menuCard:    { backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 20, marginBottom: 16, overflow: 'hidden', shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  menuItem:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 16 },
  menuBorder:  { borderBottomWidth: 1, borderBottomColor: C.border },
  menuLeft:    { flexDirection: 'row', alignItems: 'center' },
  menuIconBg:  { width: 38, height: 38, borderRadius: 11, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuLabel:   { fontSize: 14, fontFamily: F.medium, color: C.text },

  logoutBtn:   { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-end', backgroundColor: C.primary, marginLeft: 40, paddingVertical: 10, paddingLeft: 16, paddingRight: 20, borderTopLeftRadius: 30, borderBottomLeftRadius: 30, borderTopRightRadius: 0, borderBottomRightRadius: 0, shadowColor: C.primary, shadowOffset: { width: -3, height: 3 }, shadowOpacity: 0.28, shadowRadius: 8, elevation: 5 },
  logoutTxt:   { color: '#fff', fontSize: 12, fontFamily: F.semiBold },
});
