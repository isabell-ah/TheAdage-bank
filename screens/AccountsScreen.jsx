import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ACCOUNTS, LOANS, SAVINGS_GOALS, FIXED_DEPOSITS, TOTAL_BALANCE, BANK, fmt, pct } from '../data';

export default function AccountsScreen({ navigation }) {
  const { C, F } = useTheme();
  const s = makeStyles(C, F);

  const [visibleBal,  setVisibleBal]  = useState({});
  const [expandedAcc, setExpandedAcc] = useState({});
  const [refreshing,  setRefreshing]  = useState(false);
  const [totalHidden, setTotalHidden] = useState(false);

  const toggleBal     = (id) => setVisibleBal(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand  = (id) => setExpandedAcc(prev => ({ ...prev, [id]: !prev[id] }));
  const onRefresh     = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };

  const copyToClipboard = (text, label) => {
    Clipboard.setString(text);
    Alert.alert('Copied', `${label} copied to clipboard`);
  };

  const activeLoan = LOANS.find(l => l.status === 'Active');
  const totalSaved = SAVINGS_GOALS.reduce((sum, g) => sum + g.saved, 0);

  const PORTFOLIO = [
    { label: 'Total Balance', value: fmt(TOTAL_BALANCE),                            icon: 'wallet' },
    { label: 'Loan Balance',  value: activeLoan ? fmt(activeLoan.balance) : 'None', icon: 'trending-up' },
    { label: 'Total Savings', value: fmt(totalSaved),                               icon: 'shield-checkmark' },
    { label: 'Fixed Deposit', value: fmt(FIXED_DEPOSITS[0].amount),                 icon: 'lock-closed' },
  ];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} colors={[C.primary]} />}
      >
        <View style={s.header}>
          <Text style={s.headerTitle}>My Accounts</Text>
          <TouchableOpacity style={s.iconBtn}>
            <Ionicons name="add" size={20} color={C.primary} />
          </TouchableOpacity>
        </View>

        {/* Total Banner */}
        <View style={s.totalCard}>
          <View style={s.totalTopRow}>
            <Text style={s.totalLabel}>TOTAL BALANCE</Text>
            <TouchableOpacity onPress={() => setTotalHidden(h => !h)}>
              <Ionicons name={totalHidden ? 'eye-outline' : 'eye-off-outline'} size={16} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>
          <Text style={s.totalAmount}>{totalHidden ? 'KES ••••••' : fmt(TOTAL_BALANCE)}</Text>
          <Text style={s.totalSub}>Across {ACCOUNTS.length} active accounts</Text>
          <View style={s.goldOrb} />
        </View>

        {/* Account Cards */}
        {ACCOUNTS.map((acct) => {
          const hidden    = visibleBal[acct.id];
          const expanded  = expandedAcc[acct.id];
          const spent     = pct(acct.monthSpend, acct.monthLimit);
          const overSpend = spent > 70;
          const fullAccNo = `${BANK.shortName}${acct.number.padStart(10, '0')}`;

          return (
            <View key={acct.id} style={s.acctCard}>

              {/* ── Header row ─────────────────────────────────────────── */}
              <View style={s.acctHeader}>
                <View style={s.acctIconBg}>
                  <Ionicons name={acct.icon} size={20} color={C.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.acctName}>{acct.name}</Text>
                  <Text style={s.acctNum}>ACC •••• {acct.number}</Text>
                </View>
                <View style={s.activeBadge}>
                  <Text style={s.activeTxt}>Active</Text>
                </View>
              </View>

              <View style={s.divider} />

              {/* ── Balance row ────────────────────────────────────────── */}
              <View style={s.acctBalRow}>
                <View>
                  <Text style={s.acctBalLabel}>Available Balance</Text>
                  <Text style={s.acctBalance}>{hidden ? 'KES ••••••' : fmt(acct.balance)}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleBal(acct.id)} style={s.eyeBtn}>
                  <Ionicons name={hidden ? 'eye-off' : 'eye'} size={17} color={C.muted} />
                </TouchableOpacity>
              </View>

              {/* ── Monthly spend bar ──────────────────────────────────── */}
              <Text style={s.spendLabel}>Monthly Spend: {fmt(acct.monthSpend)} / {fmt(acct.monthLimit)} ({spent}%)</Text>
              <View style={s.progressBg}>
                <View style={[s.progressFill, { width: `${spent}%`, backgroundColor: overSpend ? C.debit : C.accent }]} />
              </View>

              {/* ── Action buttons ─────────────────────────────────────── */}
              {/*
                Transfer  — move money between accounts or to another person
                Statement — view/download this account's transaction history
                Details   — expand full account info (acc no, sort code, SWIFT)
                           replaces the old "Card" button which was redundant
                           since Cards has its own dedicated tab
              */}
              <View style={s.acctActions}>
                <TouchableOpacity
                  style={s.actionBtn}
                  onPress={() => navigation.navigate('SendMoney')}
                >
                  <Ionicons name="swap-horizontal" size={14} color="#fff" />
                  <Text style={s.actionBtnTxt}>Transfer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[s.actionBtn, s.actionBtnOutline]}
                  onPress={() => navigation.navigate('Statement')}
                >
                  <Ionicons name="document-text-outline" size={14} color={C.primary} />
                  <Text style={[s.actionBtnTxt, { color: C.primary }]}>Statement</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[s.actionBtn, s.actionBtnOutline]}
                  onPress={() => toggleExpand(acct.id)}
                >
                  <Ionicons name={expanded ? 'chevron-up' : 'information-circle-outline'} size={14} color={C.primary} />
                  <Text style={[s.actionBtnTxt, { color: C.primary }]}>Details</Text>
                </TouchableOpacity>
              </View>

              {/* ── Expandable account details ─────────────────────────── */}
              {expanded && (
                <View style={s.detailsBox}>
                  <Text style={s.detailsTitle}>Account Details</Text>

                  {[
                    { label: 'Account Name',   value: 'Sharon Bellah' },
                    { label: 'Account Number', value: fullAccNo, copy: true },
                    { label: 'Bank',           value: BANK.name },
                    { label: 'Branch',         value: 'Westlands Branch' },
                    { label: 'Sort Code',      value: '00-11-22', copy: true },
                    { label: 'SWIFT / BIC',    value: 'ADAGEKENA', copy: true },
                  ].map((row, i, arr) => (
                    <View key={row.label} style={[s.detailRow, i < arr.length - 1 && s.detailRowBorder]}>
                      <Text style={s.detailKey}>{row.label}</Text>
                      <View style={s.detailValRow}>
                        <Text style={s.detailVal}>{row.value}</Text>
                        {row.copy && (
                          <TouchableOpacity onPress={() => copyToClipboard(row.value, row.label)} style={s.copyBtn}>
                            <Ionicons name="copy-outline" size={14} color={C.primary} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}

            </View>
          );
        })}

        {/* Portfolio Overview */}
        <Text style={s.sectionTitle}>Portfolio Overview</Text>
        <View style={s.grid}>
          {PORTFOLIO.map((item) => (
            <View key={item.label} style={s.gridItem}>
              <View style={s.gridIconBg}>
                <Ionicons name={item.icon} size={16} color={C.primary} />
              </View>
              <Text style={s.gridValue}>{item.value}</Text>
              <Text style={s.gridLabel}>{item.label}</Text>
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
  iconBtn:     { width: 36, height: 36, borderRadius: 11, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center' },

  totalCard:   { backgroundColor: C.primary, marginHorizontal: 16, borderRadius: 22, padding: 20, marginBottom: 16, overflow: 'hidden', shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 8 },
  totalTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  totalLabel:  { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: F.semiBold, letterSpacing: 2 },
  totalAmount: { color: '#fff', fontSize: 30, fontFamily: F.bold, marginBottom: 4 },
  totalSub:    { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontFamily: F.regular },
  goldOrb:     { position: 'absolute', right: -20, top: -20, width: 90, height: 90, borderRadius: 45, backgroundColor: C.accent, opacity: 0.15 },

  acctCard:    { backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: C.text, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  acctHeader:  { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  acctIconBg:  { width: 40, height: 40, borderRadius: 12, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  acctName:    { fontSize: 14, fontFamily: F.semiBold, color: C.text },
  acctNum:     { fontSize: 11, fontFamily: F.regular, color: C.muted, marginTop: 1 },
  activeBadge: { backgroundColor: C.creditDim, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  activeTxt:   { color: C.credit, fontSize: 11, fontFamily: F.semiBold },
  divider:     { height: 1, backgroundColor: C.border, marginBottom: 12 },

  acctBalRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  acctBalLabel: { fontSize: 11, fontFamily: F.regular, color: C.muted, marginBottom: 3 },
  acctBalance:  { fontSize: 20, fontFamily: F.bold, color: C.text },
  eyeBtn:       { width: 32, height: 32, borderRadius: 9, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },

  spendLabel:   { fontSize: 11, fontFamily: F.regular, color: C.muted, marginBottom: 5 },
  progressBg:   { height: 5, backgroundColor: C.inputBg, borderRadius: 3, marginBottom: 14 },
  progressFill: { height: 5, borderRadius: 3 },

  acctActions:      { flexDirection: 'row', gap: 8 },
  actionBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: C.primary, borderRadius: 20, paddingVertical: 9 },
  actionBtnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.primary },
  actionBtnTxt:     { color: '#fff', fontSize: 12, fontFamily: F.semiBold },

  // Expandable details panel
  detailsBox:      { backgroundColor: C.bg, borderRadius: 14, padding: 14, marginTop: 12 },
  detailsTitle:    { fontSize: 12, fontFamily: F.semiBold, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  detailRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 9 },
  detailRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  detailKey:       { fontSize: 12, fontFamily: F.regular, color: C.muted },
  detailValRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailVal:       { fontSize: 13, fontFamily: F.semiBold, color: C.text },
  copyBtn:         { width: 28, height: 28, borderRadius: 8, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center' },

  sectionTitle: { fontSize: 15, fontFamily: F.semiBold, color: C.text, paddingHorizontal: 20, marginBottom: 10, marginTop: 6 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  gridItem:     { width: '48%', backgroundColor: C.surface, borderRadius: 16, padding: 14, margin: '1%', shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  gridIconBg:   { width: 34, height: 34, borderRadius: 10, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  gridValue:    { fontSize: 14, fontFamily: F.bold, color: C.text, marginBottom: 3 },
  gridLabel:    { fontSize: 11, fontFamily: F.regular, color: C.muted },
});
