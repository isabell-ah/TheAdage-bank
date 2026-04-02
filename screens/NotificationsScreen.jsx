import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import EmptyState from '../components/EmptyState';

// All icons use C.primary / C.primaryDim — no stray colors
// Category is communicated through the icon shape, not color
const NOTIFICATIONS = [
  {
    id: '1', read: false,
    icon: 'arrow-down-circle-outline',
    title: 'Salary Credited',
    body: 'KES 85,000.00 has been credited to your Savings Account.',
    time: '2 min ago',
    type: 'credit',
  },
  {
    id: '2', read: false,
    icon: 'swap-horizontal-outline',
    title: 'Transfer Successful',
    body: 'KES 5,000.00 sent to Alice Wanjiru successfully.',
    time: '1 hr ago',
    type: 'transfer',
  },
  {
    id: '3', read: true,
    icon: 'card-outline',
    title: 'Card Payment',
    body: 'KES 1,200.00 charged to your VISA card at Amazon.',
    time: 'Yesterday',
    type: 'card',
  },
  {
    id: '4', read: true,
    icon: 'alert-circle-outline',
    title: 'Low Balance Alert',
    body: 'Your Current Account balance is below KES 1,500.',
    time: 'Yesterday',
    type: 'alert',
  },
  {
    id: '5', read: true,
    icon: 'shield-outline',
    title: 'New Device Login',
    body: 'A new login was detected on your account. Was this you?',
    time: '2 days ago',
    type: 'security',
  },
  {
    id: '6', read: true,
    icon: 'calendar-outline',
    title: 'Loan Repayment Due',
    body: 'Your loan repayment of KES 4,200.00 is due in 3 days.',
    time: '3 days ago',
    type: 'loan',
  },
  {
    id: '7', read: true,
    icon: 'trending-up-outline',
    title: 'Savings Goal Update',
    body: 'Your Emergency Fund is 52% complete. Keep it up!',
    time: '4 days ago',
    type: 'savings',
  },
];

export default function NotificationsScreen({ navigation }) {
  const { C, F } = useTheme();
  const s = makeStyles(C, F);

  const [items, setItems] = useState(NOTIFICATIONS);
  const unread = items.filter(n => !n.read).length;

  const markAllRead = () => setItems(items.map(n => ({ ...n, read: true })));
  const markRead    = (id) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>Notifications</Text>
          {unread > 0 && <Text style={s.unreadCount}>{unread} unread</Text>}
        </View>
        <TouchableOpacity onPress={markAllRead} disabled={unread === 0}>
          <Text style={[s.markAllTxt, unread === 0 && { opacity: 0.4 }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={n => n.id}
        contentContainerStyle={items.length === 0 ? { flex: 1 } : { paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="notifications-off-outline" title="All caught up" subtitle="No notifications right now." />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.card, !item.read && s.cardUnread]}
            onPress={() => markRead(item.id)}
            activeOpacity={0.7}
          >
            {/* Icon — always primaryDim bg + primary icon, consistent across all types */}
            <View style={[s.iconWrap, !item.read && s.iconWrapUnread]}>
              <Ionicons name={item.icon} size={22} color={C.primary} />
            </View>

            <View style={s.body}>
              <View style={s.titleRow}>
                <Text style={s.title}>{item.title}</Text>
                {!item.read && <View style={s.dot} />}
              </View>
              <Text style={s.bodyTxt}>{item.body}</Text>
              <Text style={s.time}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  safe:   { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8 },
  backBtn:{ width: 38, height: 38, borderRadius: 12, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: F.bold, fontSize: 20, color: C.text },
  unreadCount: { fontFamily: F.regular, fontSize: 12, color: C.muted },
  markAllTxt:  { fontFamily: F.semiBold, fontSize: 13, color: C.primary },

  card:       { flexDirection: 'row', backgroundColor: C.surface, borderRadius: 16, padding: 14, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: C.primary },

  // Unread notifications get a slightly deeper primaryDim to stand out
  iconWrap:       { width: 46, height: 46, borderRadius: 14, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconWrapUnread: { backgroundColor: C.primaryDim },

  body:     { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  title:    { fontFamily: F.semiBold, fontSize: 14, color: C.text, flex: 1, marginRight: 8 },
  dot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: C.accent },
  bodyTxt:  { fontFamily: F.regular, fontSize: 13, color: C.muted, lineHeight: 19, marginBottom: 6 },
  time:     { fontFamily: F.regular, fontSize: 11, color: C.muted },
});
