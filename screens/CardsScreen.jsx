import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, FlatList, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { CARDS } from '../data';

const { width } = Dimensions.get('window');
const CARD_W = width - 48;

const ACTIONS = [
  { icon: 'card-outline',       label: 'View My Cards',  key: 'view' },
  { icon: 'add-circle-outline', label: 'Apply for Card', key: 'apply' },
  { icon: 'wallet-outline',     label: 'Card Payment',   key: 'payment' },
  { icon: 'gift-outline',       label: 'Exclusive Deals',key: 'deals' },
];

function NetworkBadge({ network }) {
  if (network === 'VISA' || network === 'Visa') {
    return (
      <Text style={badge.visa}>VISA</Text>
    );
  }
  if (network === 'Mastercard' || network === 'MASTERCARD') {
    return (
      <View style={badge.mcWrap}>
        <View style={[badge.mcCircle, { backgroundColor: '#EB001B', marginRight: -9 }]} />
        <View style={[badge.mcCircle, { backgroundColor: '#F79E1B' }]} />
      </View>
    );
  }
  return <Text style={badge.fallback}>{network}</Text>;
}

const badge = StyleSheet.create({
  visa:     { color: '#fff', fontSize: 17, fontFamily: 'Poppins_800ExtraBold', fontStyle: 'italic', letterSpacing: 1 },
  mcWrap:   { flexDirection: 'row', alignItems: 'center' },
  mcCircle: { width: 22, height: 22, borderRadius: 11, opacity: 0.92 },
  fallback: { color: 'rgba(255,255,255,0.85)', fontSize: 12, letterSpacing: 1 },
});

export default function CardsScreen({ navigation }) {
  const { C, F } = useTheme();
  const s = makeStyles(C, F);

  const [activeCard, setActiveCard] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); }, []);

  const handleAction = (key) => {
    if (key === 'view')    Alert.alert('My Cards', 'Manage all your cards here.');
    if (key === 'apply')   Alert.alert('Apply for Card', 'Card application coming soon.');
    if (key === 'payment') Alert.alert('Card Payment', 'Pay your card balance.');
    if (key === 'deals')   Alert.alert('Exclusive Deals', 'Special offers for cardholders.');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} colors={[C.primary]} />}
      >

        <View style={s.header}>
          <Text style={s.headerTitle}>My Cards</Text>
          <TouchableOpacity style={s.addCardBtn}>
            <Ionicons name="add" size={18} color={C.primary} />
            <Text style={s.addCardTxt}>Add Card</Text>
          </TouchableOpacity>
        </View>

        {/* Card carousel */}
        <FlatList
          data={CARDS}
          horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          keyExtractor={c => c.id}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          snapToInterval={CARD_W + 16}
          decelerationRate="fast"
          onMomentumScrollEnd={e => setActiveCard(Math.round(e.nativeEvent.contentOffset.x / (CARD_W + 16)))}
          renderItem={({ item }) => (
            <View style={[s.bankCard, { width: CARD_W, marginRight: 16 }]}>
              {/* Decorative orbs */}
              <View style={s.orb1} />
              <View style={s.orb2} />

              {/* Top row: bank name + network badge */}
              <View style={s.cardTopRow}>
                <Text style={s.cardBankName}>TheAdage Bank</Text>
                <NetworkBadge network={item.network} />
              </View>

              {/* Card number */}
              <Text style={s.cardNumber}>•••• •••• •••• {item.last4}</Text>

              {/* Card type chip */}
              <View style={s.cardTypeChip}>
                <Ionicons name="card-outline" size={12} color="rgba(255,255,255,0.6)" />
                <Text style={s.cardTypeLabel}>{item.cardType}</Text>
              </View>

              {/* Bottom row: holder + expiry */}
              <View style={s.cardBottomRow}>
                <View>
                  <Text style={s.cardExpLabel}>CARD HOLDER</Text>
                  <Text style={s.cardHolder}>{item.holder}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={s.cardExpLabel}>VALID THRU</Text>
                  <Text style={s.cardExpVal}>{item.expiry}</Text>
                </View>
              </View>

              {/* Linked account — small footer label */}
              <View style={s.linkedAccRow}>
                <Ionicons name="link-outline" size={11} color="rgba(255,255,255,0.4)" />
                <Text style={s.linkedAccTxt}>Linked to {item.accountName}</Text>
              </View>
            </View>
          )}
        />

        {/* Pagination dots */}
        <View style={s.dots}>
          {CARDS.map((_, i) => <View key={i} style={[s.dot, i === activeCard && s.dotActive]} />)}
        </View>

        {/* Card status strip */}
        <View style={s.statusStrip}>
          <View style={s.statusItem}>
            <View style={[s.statusDot, { backgroundColor: C.credit }]} />
            <Text style={s.statusTxt}>Active</Text>
          </View>
          <View style={s.statusDivider} />
          <View style={s.statusItem}>
            <Ionicons name="wifi-outline" size={14} color={C.muted} />
            <Text style={s.statusTxt}>Contactless ON</Text>
          </View>
          <View style={s.statusDivider} />
          <View style={s.statusItem}>
            <Ionicons name="globe-outline" size={14} color={C.muted} />
            <Text style={s.statusTxt}>Online Enabled</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={s.actionsRow}>
          {ACTIONS.map(a => (
            <TouchableOpacity key={a.key} style={s.actionItem} onPress={() => handleAction(a.key)}>
              <View style={s.actionIcon}>
                <Ionicons name={a.icon} size={20} color={C.primary} />
              </View>
              <Text style={s.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card perks banner */}
        <View style={s.perksCard}>
          <View style={s.perksLeft}>
            <Ionicons name="star" size={18} color={C.accent} />
            <View style={{ marginLeft: 12 }}>
              <Text style={s.perksTitle}>Premium Cardholder</Text>
              <Text style={s.perksSub}>Earn 2x rewards on every purchase</Text>
            </View>
          </View>
          <TouchableOpacity style={s.perksBtn}>
            <Text style={s.perksBtnTxt}>Explore</Text>
          </TouchableOpacity>
        </View>

        {/* Card security controls */}
        <Text style={s.sectionTitle}>Card Controls</Text>
        <View style={s.controlsCard}>
          {[
            { icon: 'globe-outline',          label: 'Online Purchases',   value: true },
            { icon: 'phone-portrait-outline', label: 'Contactless Payments',value: true },
            { icon: 'airplane-outline',       label: 'International Usage', value: false },
            { icon: 'cash-outline',           label: 'ATM Withdrawals',    value: true },
          ].map((ctrl, i, arr) => (
            <View key={ctrl.label} style={[s.controlRow, i < arr.length - 1 && s.controlBorder]}>
              <View style={s.controlLeft}>
                <View style={s.controlIconBg}>
                  <Ionicons name={ctrl.icon} size={16} color={C.primary} />
                </View>
                <Text style={s.controlLabel}>{ctrl.label}</Text>
              </View>
              <View style={[s.toggle, { backgroundColor: ctrl.value ? C.primary : C.inputBg }]}>
                <View style={[s.toggleThumb, { alignSelf: ctrl.value ? 'flex-end' : 'flex-start' }]} />
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  safe:        { flex: 1, backgroundColor: C.bg },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle: { fontSize: 22, fontFamily: F.bold, color: C.text },
  addCardBtn:  { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.primaryDim, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  addCardTxt:  { color: C.primary, fontFamily: F.semiBold, fontSize: 13 },

  // Card
  // Card — reduced padding and tighter spacing throughout
  bankCard:      { backgroundColor: C.primary, borderRadius: 20, padding: 16, shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8, overflow: 'hidden' },
  orb1:          { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.06)', top: -24, right: -16 },
  orb2:          { position: 'absolute', width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -16, left: 16 },
  cardTopRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardBankName:  { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontFamily: F.semiBold, letterSpacing: 1.5, textTransform: 'uppercase' },
  cardNumber:    { color: 'rgba(255,255,255,0.85)', fontSize: 15, fontFamily: F.medium, letterSpacing: 3, marginBottom: 6 },
  cardTypeChip:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  cardTypeLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: F.semiBold, letterSpacing: 1, textTransform: 'uppercase' },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 },
  cardExpLabel:  { color: 'rgba(255,255,255,0.45)', fontSize: 8, fontFamily: F.semiBold, letterSpacing: 1.5, marginBottom: 2 },
  cardHolder:    { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontFamily: F.medium, letterSpacing: 0.8 },
  cardExpVal:    { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: F.medium, letterSpacing: 2 },
  linkedAccRow:  { flexDirection: 'row', alignItems: 'center', gap: 5, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 8 },
  linkedAccTxt:  { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: F.regular, letterSpacing: 0.3 },

  dots:      { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14, marginBottom: 16 },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: C.border },
  dotActive: { width: 18, backgroundColor: C.accent },

  // Status strip
  statusStrip:   { flexDirection: 'row', backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 16, justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  statusItem:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot:     { width: 7, height: 7, borderRadius: 4 },
  statusTxt:     { fontSize: 11, fontFamily: F.medium, color: C.muted },
  statusDivider: { width: 1, height: 18, backgroundColor: C.border },

  // Actions
  actionsRow:  { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 20, paddingVertical: 18, marginBottom: 16, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  actionItem:  { alignItems: 'center', gap: 6, flex: 1 },
  actionIcon:  { width: 48, height: 48, borderRadius: 15, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 10, fontFamily: F.medium, color: C.text, textAlign: 'center' },

  // Perks banner
  perksCard:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 18, padding: 16, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: C.accent, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  perksLeft:  { flexDirection: 'row', alignItems: 'center', flex: 1 },
  perksTitle: { fontSize: 13, fontFamily: F.semiBold, color: C.text },
  perksSub:   { fontSize: 11, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  perksBtn:   { backgroundColor: C.primaryDim, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  perksBtnTxt:{ fontSize: 12, fontFamily: F.semiBold, color: C.primary },

  // Card controls
  sectionTitle:  { fontSize: 15, fontFamily: F.semiBold, color: C.text, paddingHorizontal: 20, marginBottom: 10 },
  controlsCard:  { backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 18, overflow: 'hidden', shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  controlRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  controlBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  controlLeft:   { flexDirection: 'row', alignItems: 'center' },
  controlIconBg: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  controlLabel:  { fontSize: 13, fontFamily: F.medium, color: C.text },
  toggle:        { width: 40, height: 22, borderRadius: 11, padding: 2, justifyContent: 'center' },
  toggleThumb:   { width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff' },
});
