import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList,
  Dimensions, RefreshControl, Modal, TextInput, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { USER, ACCOUNTS, TRANSACTIONS, CONTACTS, fmt } from '../data';

const { width } = Dimensions.get('window');
const CARD_W = width - 48;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
}

const ACTIONS = [
  { icon: 'paper-plane',      label: 'Send Money',    key: 'send' },
  { icon: 'receipt',          label: 'Pay Bills',     key: 'paybills' },
  { icon: 'leaf',             label: 'Save & Grow',   key: 'savings' },
  { icon: 'cash',             label: 'Loans',         key: 'loans' },
  { icon: 'phone-portrait',   label: 'Top Up',        key: 'topup' },
  { icon: 'phone-landscape',  label: 'Pesa Link',     key: 'pesalink' },
  { icon: 'arrow-down-circle',label: 'Receive',       key: 'receive' },
  { icon: 'swap-horizontal',  label: 'Transfer',      key: 'transfer' },
];

const PRODUCTS = [
  { id: 'p1', icon: 'trending-up',      color: '#8B1C3F', title: 'Fixed Deposit',    sub: 'Earn 9.5% p.a. guaranteed returns' },
  { id: 'p2', icon: 'business',         color: '#C4955A', title: 'Business Loan',    sub: 'Up to KES 2M at 16% p.a.' },
  { id: 'p3', icon: 'shield-checkmark', color: '#5a6e8b', title: 'Insure & Protect', sub: 'Travel, health & life cover' },
];

const BILLERS        = ['Kenya Power', 'Nairobi Water', 'DSTV', 'Safaricom', 'Zuku Fibre', 'KPLC Prepaid'];
const TOPUP_NETWORKS = ['Safaricom', 'Airtel', 'Telkom'];
const RECENT         = TRANSACTIONS.slice(0, 3);

export default function HomeScreen({ navigation }) {
  const { C, F } = useTheme();
  const s = makeStyles(C, F);

  const [balVisible,  setBalVisible]  = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [activeCard,  setActiveCard]  = useState(0);
  const [modal,       setModal]       = useState(null);

  // Send
  const [sendContact, setSendContact] = useState(null);
  const [sendAmount,  setSendAmount]  = useState('');
  const [sendNote,    setSendNote]    = useState('');
  // Receive
  const [receiveAmount, setReceiveAmount] = useState('');
  // Pay Bills
  const [selectedBiller, setSelectedBiller] = useState(null);
  const [billAmount,     setBillAmount]     = useState('');
  const [billRef,        setBillRef]        = useState('');
  // Top Up
  const [topupNetwork, setTopupNetwork] = useState(null);
  const [topupPhone,   setTopupPhone]   = useState('');
  const [topupAmount,  setTopupAmount]  = useState('');

  const onRefresh  = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };
  const closeModal = () => {
    setModal(null);
    setSendContact(null); setSendAmount(''); setSendNote('');
    setReceiveAmount('');
    setSelectedBiller(null); setBillAmount(''); setBillRef('');
    setTopupNetwork(null); setTopupPhone(''); setTopupAmount('');
  };

  const handleAction = (key) => {
    if (key === 'loans')    { navigation.navigate('Loans');   return; }
    if (key === 'savings')  { navigation.navigate('Savings'); return; }
    if (key === 'transfer') { navigation.navigate('SendMoney'); return; }
    if (key === 'pesalink') { Alert.alert('Pesa Link', 'Send to any mobile money wallet instantly.'); return; }
    setModal(key);
  };

  const handleSend = () => {
    if (!sendContact) return Alert.alert('Select a recipient');
    if (!sendAmount)  return Alert.alert('Enter an amount');
    closeModal();
    setTimeout(() => Alert.alert('Transfer Successful 🎉', `${fmt(Number(sendAmount.replace(/,/g,'')))} sent to ${sendContact.name}`), 300);
  };

  const handleBill = () => {
    if (!selectedBiller) return Alert.alert('Select a biller');
    if (!billAmount)     return Alert.alert('Enter amount');
    closeModal();
    setTimeout(() => Alert.alert('Payment Successful ✅', `${fmt(Number(billAmount))} paid to ${selectedBiller}`), 300);
  };

  const handleTopUp = () => {
    if (!topupNetwork) return Alert.alert('Select a network');
    if (!topupPhone)   return Alert.alert('Enter phone number');
    if (!topupAmount)  return Alert.alert('Enter amount');
    closeModal();
    setTimeout(() => Alert.alert('Top Up Successful 📱', `${fmt(Number(topupAmount))} sent to ${topupPhone} (${topupNetwork})`), 300);
  };

  const copyAccNumber = (number) => {
    Alert.alert('Account Number', number, [{ text: 'Copy', onPress: () => {} }, { text: 'OK' }]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} colors={[C.primary]} />}
      >

        {/* ── Top Bar ──────────────────────────────────────────────────────── */}
        <View style={s.topBar}>
          <View>
            <Text style={s.greeting}>{getGreeting()},</Text>
            <Text style={s.userName}>{USER.name.split(' ')[0]} 👋</Text>
          </View>
          <TouchableOpacity style={s.notifBtn} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color={C.text} />
            <View style={s.notifDot} />
          </TouchableOpacity>
        </View>

        {/* ── Account Cards (horizontal) ───────────────────────────────────── */}
        <FlatList
          data={ACCOUNTS}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={a => a.id}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          snapToInterval={CARD_W + 16}
          decelerationRate="fast"
          onMomentumScrollEnd={e => setActiveCard(Math.round(e.nativeEvent.contentOffset.x / (CARD_W + 16)))}
          renderItem={({ item }) => (
            <View style={[s.accountCard, { width: CARD_W, marginRight: 16 }]}>
              {/* Card top row */}
              <View style={s.cardTopRow}>
                <Text style={s.cardTypeLabel}>{item.name}</Text>
                <TouchableOpacity onPress={() => setBalVisible(!balVisible)}>
                  <Ionicons name={balVisible ? 'eye-outline' : 'eye-off-outline'} size={17} color="rgba(255,255,255,0.65)" />
                </TouchableOpacity>
              </View>

              {/* Balance */}
              <Text style={s.cardBalLabel}>Available Balance</Text>
              <Text style={s.cardBalance}>
                {balVisible ? fmt(item.balance) : 'KES ••••••'}
              </Text>

              {/* Divider */}
              <View style={s.cardDivider} />

              {/* Name + account number */}
              <View style={s.cardBottom}>
                <Text style={s.cardHolderName}>{USER.name.toUpperCase()}</Text>
                <TouchableOpacity style={s.cardAccRow} onPress={() => copyAccNumber(`ACC${item.number}`)}>
                  <Text style={s.cardAccNum}>ACC •••• {item.number}</Text>
                  <Ionicons name="copy-outline" size={13} color="rgba(255,255,255,0.55)" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Pagination dots */}
        <View style={s.dots}>
          {ACCOUNTS.map((_, i) => (
            <View key={i} style={[s.dot, i === activeCard && s.dotActive]} />
          ))}
        </View>

        {/* ── Quick Actions ─────────────────────────────────────────────────── */}
        <View style={s.actionsSection}>
          <Text style={s.sectionTitle}>What would you like to do?</Text>
          <View style={s.actionsGrid}>
            {ACTIONS.map(a => (
              <TouchableOpacity key={a.key} style={s.actionItem} onPress={() => handleAction(a.key)} activeOpacity={0.75}>
                <View style={s.actionIcon}>
                  <Ionicons name={a.icon} size={20} color={C.primary} />
                </View>
                <Text style={s.actionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Discover Products ─────────────────────────────────────────────── */}
        <View style={s.discoverHeader}>
          <Text style={s.sectionTitle}>Designed for you</Text>
          <Text style={s.discoverSub}>Products tailored to your goals</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.productsRow}>
          {PRODUCTS.map(p => (
            <TouchableOpacity key={p.id} style={[s.productCard, { borderTopColor: p.color }]}>
              <View style={[s.productIconBg, { backgroundColor: p.color + '18' }]}>
                <Ionicons name={p.icon} size={22} color={p.color} />
              </View>
              <Text style={s.productTitle}>{p.title}</Text>
              <Text style={s.productSub}>{p.sub}</Text>
              <View style={s.productLearnMore}>
                <Text style={[s.productLearnTxt, { color: p.color }]}>Learn more</Text>
                <Ionicons name="arrow-forward" size={12} color={p.color} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Recent Transactions ───────────────────────────────────────────── */}
        <View style={[s.section, { marginBottom: 8 }]}>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Recent Activity</Text>
          </View>
          {RECENT.map(tx => (
            <TouchableOpacity
              key={tx.id}
              style={s.txItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('TransactionDetail', { transaction: tx })}
            >
              <View style={s.txIcon}>
                <Ionicons name={tx.icon} size={19} color={C.primary} />
              </View>
              <View style={s.txInfo}>
                <Text style={s.txName}>{tx.name}</Text>
                <Text style={s.txSub}>{tx.date}</Text>
              </View>
              <Text style={[s.txAmt, { color: tx.amount > 0 ? C.credit : C.debit }]}>
                {tx.amount > 0 ? '+' : '-'}{fmt(Math.abs(tx.amount))}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* View All button */}
        <TouchableOpacity style={s.viewAllBtn} onPress={() => navigation.navigate('Transactions')}>
          <Ionicons name="infinite" size={18} color={C.primary} />
          <Text style={s.viewAllTxt}>View All Transactions</Text>
          <Ionicons name="arrow-forward" size={15} color={C.primary} />
        </TouchableOpacity>

      </ScrollView>

      {/* ── SEND MODAL ───────────────────────────────────────────────────────── */}
      <Modal visible={modal === 'send'} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.sheetHandle} />
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Send Money</Text>
              <TouchableOpacity onPress={closeModal}><Ionicons name="close" size={22} color={C.muted} /></TouchableOpacity>
            </View>
            <Text style={s.sheetLabel}>Select Recipient</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {CONTACTS.map(c => (
                <TouchableOpacity key={c.id} style={s.contactItem} onPress={() => setSendContact(c)}>
                  <View style={[s.contactAvatar, { backgroundColor: c.color }, sendContact?.id === c.id && { borderWidth: 2.5, borderColor: C.accent }]}>
                    <Text style={s.contactInitials}>{c.initials}</Text>
                  </View>
                  <Text style={[s.contactName, sendContact?.id === c.id && { color: C.primary, fontFamily: F.semiBold }]}>{c.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={s.sheetLabel}>Amount (KES)</Text>
            <TextInput style={s.sheetInput} placeholder="0.00" placeholderTextColor={C.muted} keyboardType="numeric" value={sendAmount} onChangeText={setSendAmount} />
            <Text style={s.sheetLabel}>Note (optional)</Text>
            <TextInput style={s.sheetInput} placeholder="What's this for?" placeholderTextColor={C.muted} value={sendNote} onChangeText={setSendNote} />
            <TouchableOpacity style={[s.sheetBtn, (!sendContact || !sendAmount) && { opacity: 0.5 }]} onPress={handleSend}>
              <Text style={s.sheetBtnTxt}>Send Money</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── RECEIVE MODAL ────────────────────────────────────────────────────── */}
      <Modal visible={modal === 'receive'} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.sheetHandle} />
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Receive Money</Text>
              <TouchableOpacity onPress={closeModal}><Ionicons name="close" size={22} color={C.muted} /></TouchableOpacity>
            </View>
            <View style={s.receiveInfo}>
              <View style={s.qrBox}><Ionicons name="qr-code" size={80} color={C.primary} /></View>
              <Text style={s.receiveLabel}>Your Account Details</Text>
              <View style={s.receiveRow}><Text style={s.receiveKey}>Account Name</Text><Text style={s.receiveVal}>{USER.name}</Text></View>
              <View style={s.receiveRow}><Text style={s.receiveKey}>Account No.</Text><Text style={s.receiveVal}>ACC •••• 6789</Text></View>
              <View style={s.receiveRow}><Text style={s.receiveKey}>Bank</Text><Text style={s.receiveVal}>TheAdage Bank</Text></View>
              <View style={s.receiveRow}><Text style={s.receiveKey}>Branch</Text><Text style={s.receiveVal}>{USER.branch}</Text></View>
            </View>
            <TextInput style={s.sheetInput} placeholder="Request specific amount (optional)" placeholderTextColor={C.muted} keyboardType="numeric" value={receiveAmount} onChangeText={setReceiveAmount} />
            <TouchableOpacity style={s.sheetBtn} onPress={() => { closeModal(); Alert.alert('Details Shared', receiveAmount ? `Request for ${fmt(Number(receiveAmount))} sent.` : 'Your account details have been shared.'); }}>
              <Text style={s.sheetBtnTxt}>Share Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── PAY BILLS MODAL ──────────────────────────────────────────────────── */}
      <Modal visible={modal === 'paybills'} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.sheetHandle} />
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Pay Bills</Text>
              <TouchableOpacity onPress={closeModal}><Ionicons name="close" size={22} color={C.muted} /></TouchableOpacity>
            </View>
            <Text style={s.sheetLabel}>Select Biller</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {BILLERS.map(b => (
                <TouchableOpacity key={b} style={[s.chip, selectedBiller === b && s.chipActive]} onPress={() => setSelectedBiller(b)}>
                  <Text style={[s.chipTxt, selectedBiller === b && s.chipTxtActive]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={s.sheetLabel}>Account / Reference No.</Text>
            <TextInput style={s.sheetInput} placeholder="e.g. 0712345678" placeholderTextColor={C.muted} value={billRef} onChangeText={setBillRef} />
            <Text style={s.sheetLabel}>Amount (KES)</Text>
            <TextInput style={s.sheetInput} placeholder="0.00" placeholderTextColor={C.muted} keyboardType="numeric" value={billAmount} onChangeText={setBillAmount} />
            <TouchableOpacity style={[s.sheetBtn, (!selectedBiller || !billAmount) && { opacity: 0.5 }]} onPress={handleBill}>
              <Text style={s.sheetBtnTxt}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── TOP UP MODAL ─────────────────────────────────────────────────────── */}
      <Modal visible={modal === 'topup'} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.sheetHandle} />
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Airtime Top Up</Text>
              <TouchableOpacity onPress={closeModal}><Ionicons name="close" size={22} color={C.muted} /></TouchableOpacity>
            </View>
            <Text style={s.sheetLabel}>Network</Text>
            <View style={s.networkRow}>
              {TOPUP_NETWORKS.map(n => (
                <TouchableOpacity key={n} style={[s.networkChip, topupNetwork === n && s.networkChipActive]} onPress={() => setTopupNetwork(n)}>
                  <Text style={[s.networkChipTxt, topupNetwork === n && s.networkChipTxtActive]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.sheetLabel}>Phone Number</Text>
            <TextInput style={s.sheetInput} placeholder="07XX XXX XXX" placeholderTextColor={C.muted} keyboardType="phone-pad" value={topupPhone} onChangeText={setTopupPhone} />
            <Text style={s.sheetLabel}>Amount (KES)</Text>
            <View style={s.quickRow}>
              {['50', '100', '200', '500'].map(q => (
                <TouchableOpacity key={q} style={[s.quickBtn, topupAmount === q && s.quickBtnActive]} onPress={() => setTopupAmount(q)}>
                  <Text style={[s.quickBtnTxt, topupAmount === q && { color: '#fff' }]}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={s.sheetInput} placeholder="Or enter amount" placeholderTextColor={C.muted} keyboardType="numeric" value={topupAmount} onChangeText={setTopupAmount} />
            <TouchableOpacity style={[s.sheetBtn, (!topupNetwork || !topupPhone || !topupAmount) && { opacity: 0.5 }]} onPress={handleTopUp}>
              <Text style={s.sheetBtnTxt}>Buy Airtime</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  safe:      { flex: 1, backgroundColor: C.bg },
  topBar:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  greeting:  { fontSize: 12, fontFamily: F.regular, color: C.muted },
  userName:  { fontSize: 18, fontFamily: F.bold, color: C.text },
  notifBtn:  { position: 'relative', padding: 4 },
  notifDot:  { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: C.accent },

  // Account card
  accountCard:   { backgroundColor: C.primary, borderRadius: 22, padding: 20, shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 10 },
  cardTopRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTypeLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: F.semiBold, letterSpacing: 1.5, textTransform: 'uppercase' },
  cardBalLabel:  { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: F.regular, marginBottom: 4 },
  cardBalance:   { color: '#fff', fontSize: 28, fontFamily: F.bold, letterSpacing: 0.3, marginBottom: 16 },
  cardDivider:   { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 14 },
  cardBottom:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardHolderName:{ color: 'rgba(255,255,255,0.55)', fontSize: 11, fontFamily: F.medium, letterSpacing: 1 },
  cardAccRow:    { flexDirection: 'row', alignItems: 'center' },
  cardAccNum:    { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontFamily: F.regular, letterSpacing: 1 },

  dots:      { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12, marginBottom: 20 },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: C.border },
  dotActive: { width: 18, backgroundColor: C.accent },

  section:      { paddingHorizontal: 16, marginBottom: 16 },
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontFamily: F.semiBold, color: C.text, marginBottom: 14 },

  // Quick actions — card container with shadow + top accent border
  actionsSection: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: C.surface,
    borderRadius: 22,
    padding: 18,
    paddingBottom: 14,
    borderTopWidth: 3,
    borderTopColor: C.primary,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionItem:  { width: (width - 32 - 24 - 36) / 4, alignItems: 'center' },
  actionIcon:  {
    width: 48, height: 48, borderRadius: 15,
    backgroundColor: C.primaryDim,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionLabel: { fontSize: 10, fontFamily: F.medium, color: C.text, textAlign: 'center', lineHeight: 14 },

  // Discover
  discoverHeader: { paddingHorizontal: 16, marginBottom: 8 },
  discoverSub:    { fontSize: 11, fontFamily: F.regular, color: C.muted, marginTop: -8, marginBottom: 4 },
  productsRow:    { paddingHorizontal: 16, gap: 12, paddingBottom: 4, marginBottom: 20 },
  productCard:    { width: 160, backgroundColor: C.surface, padding: 16, borderTopWidth: 3 },
  productIconBg:  { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  productTitle:   { fontSize: 13, fontFamily: F.semiBold, color: C.text, marginBottom: 4 },
  productSub:     { fontSize: 11, fontFamily: F.regular, color: C.muted, lineHeight: 16, marginBottom: 12 },
  productLearnMore:{ flexDirection: 'row', alignItems: 'center', gap: 4 },
  productLearnTxt: { fontSize: 12, fontFamily: F.semiBold },

  // Recent transactions
  txItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 14, padding: 12, marginBottom: 8, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  txIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txName: { fontSize: 13, fontFamily: F.semiBold, color: C.text },
  txSub:  { fontSize: 11, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  txAmt:  { fontSize: 13, fontFamily: F.bold },

  // View All button
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginBottom: 8, borderWidth: 1.5, borderColor: C.primary, borderRadius: 30, paddingVertical: 13 },
  viewAllTxt: { fontSize: 14, fontFamily: F.semiBold, color: C.primary },

  // Modals
  overlay:     { flex: 1, backgroundColor: 'rgba(28,20,16,0.55)', justifyContent: 'flex-end' },
  sheet:       { backgroundColor: C.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 16 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle:  { fontSize: 18, fontFamily: F.bold, color: C.text },
  sheetLabel:  { fontSize: 13, fontFamily: F.semiBold, color: C.text, marginBottom: 8 },
  sheetInput:  { backgroundColor: C.inputBg, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontSize: 14, fontFamily: F.regular, color: C.text, marginBottom: 14 },
  sheetBtn:    { backgroundColor: C.primary, borderRadius: 30, paddingVertical: 15, alignItems: 'center', marginTop: 4, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  sheetBtnTxt: { color: '#fff', fontSize: 15, fontFamily: F.bold },

  contactItem:    { alignItems: 'center', marginRight: 16, width: 58 },
  contactAvatar:  { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  contactInitials:{ color: '#fff', fontFamily: F.bold, fontSize: 15 },
  contactName:    { fontSize: 11, fontFamily: F.regular, color: C.muted, textAlign: 'center' },

  receiveInfo:  { backgroundColor: C.bg, borderRadius: 16, padding: 16, marginBottom: 16 },
  qrBox:        { alignItems: 'center', marginBottom: 16 },
  receiveLabel: { fontSize: 13, fontFamily: F.semiBold, color: C.text, marginBottom: 10 },
  receiveRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.border },
  receiveKey:   { fontSize: 13, fontFamily: F.regular, color: C.muted },
  receiveVal:   { fontSize: 13, fontFamily: F.semiBold, color: C.text },

  chip:          { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, backgroundColor: C.inputBg, marginRight: 8 },
  chipActive:    { backgroundColor: C.primary },
  chipTxt:       { fontSize: 13, fontFamily: F.medium, color: C.muted },
  chipTxtActive: { color: '#fff' },

  networkRow:           { flexDirection: 'row', gap: 10, marginBottom: 14 },
  networkChip:          { flex: 1, paddingVertical: 10, borderRadius: 14, backgroundColor: C.inputBg, alignItems: 'center' },
  networkChipActive:    { backgroundColor: C.primary },
  networkChipTxt:       { fontSize: 13, fontFamily: F.medium, color: C.muted },
  networkChipTxtActive: { color: '#fff' },

  quickRow:      { flexDirection: 'row', gap: 8, marginBottom: 10 },
  quickBtn:      { flex: 1, backgroundColor: C.inputBg, borderRadius: 12, paddingVertical: 9, alignItems: 'center' },
  quickBtnActive:{ backgroundColor: C.primary },
  quickBtnTxt:   { fontSize: 13, fontFamily: F.semiBold, color: C.primary },
});
