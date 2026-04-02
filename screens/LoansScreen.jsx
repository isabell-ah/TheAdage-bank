import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LOANS, LOAN_PRODUCTS, fmt, pct } from '../data';

export default function LoansScreen({ navigation }) {
  const { C, F } = useTheme();
  const s = makeStyles(C, F);
  const [tab, setTab] = useState('Active');

  const activeLoans  = LOANS.filter(l => l.status === 'Active');
  const clearedLoans = LOANS.filter(l => l.status === 'Cleared');

  const handleApply = (product) => {
    Alert.alert(
      `Apply for ${product.name}`,
      `Max: ${fmt(product.maxAmount)}\nRate: ${product.rate}% p.a.\nTenure: ${product.tenure}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Proceed', onPress: () => Alert.alert('Application Submitted!', 'We will review your application within 24 hours.') },
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={C.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Loans</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={s.banner}>
          <View>
            <Text style={s.bannerLabel}>Total Outstanding</Text>
            <Text style={s.bannerAmount}>{fmt(activeLoans.reduce((sum, l) => sum + l.balance, 0))}</Text>
            <Text style={s.bannerSub}>{activeLoans.length} active loan{activeLoans.length !== 1 ? 's' : ''}</Text>
          </View>
          <View style={s.goldOrb} />
          <Ionicons name="trending-up" size={48} color="rgba(255,255,255,0.15)" style={{ position: 'absolute', right: 20, bottom: 16 }} />
        </View>

        <View style={s.tabs}>
          {['Active', 'Cleared', 'Apply'].map(t => (
            <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'Active' && (
          activeLoans.length === 0
            ? <Text style={s.emptyTxt}>No active loans</Text>
            : activeLoans.map(loan => {
                const progress = pct(loan.paid, loan.principal);
                return (
                  <View key={loan.id} style={s.loanCard}>
                    <View style={s.loanHeader}>
                      <View style={s.loanIconBg}>
                        <Ionicons name="trending-up" size={20} color={C.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.loanName}>{loan.name}</Text>
                        <Text style={s.loanSub}>Since {loan.startDate}</Text>
                      </View>
                      <View style={s.activeBadge}>
                        <Text style={s.activeTxt}>Active</Text>
                      </View>
                    </View>
                    <View style={s.divider} />
                    <View style={s.loanAmtRow}>
                      <View style={s.loanAmtItem}>
                        <Text style={s.loanAmtLabel}>Principal</Text>
                        <Text style={s.loanAmtVal}>{fmt(loan.principal)}</Text>
                      </View>
                      <View style={s.loanAmtItem}>
                        <Text style={s.loanAmtLabel}>Balance</Text>
                        <Text style={[s.loanAmtVal, { color: C.debit }]}>{fmt(loan.balance)}</Text>
                      </View>
                      <View style={s.loanAmtItem}>
                        <Text style={s.loanAmtLabel}>Rate</Text>
                        <Text style={s.loanAmtVal}>{loan.interestRate}% p.a.</Text>
                      </View>
                    </View>
                    <Text style={s.progressLabel}>Repayment Progress — {progress}%</Text>
                    <View style={s.progressBg}>
                      <View style={[s.progressFill, { width: `${progress}%` }]} />
                    </View>
                    <View style={s.nextDueRow}>
                      <Ionicons name="calendar-outline" size={14} color={C.muted} />
                      <Text style={s.nextDueTxt}>Next payment: {fmt(loan.monthlyPayment)} due {loan.nextDue}</Text>
                    </View>
                    <Text style={s.historyTitle}>Recent Repayments</Text>
                    {loan.repayments.map((r, i) => (
                      <View key={i} style={s.repayRow}>
                        <Text style={s.repayMonth}>{r.month}</Text>
                        <Text style={s.repayAmt}>{fmt(r.amount)}</Text>
                        <View style={[s.repayBadge, { backgroundColor: r.status === 'Paid' ? C.creditDim : C.accentDim }]}>
                          <Text style={[s.repayStatus, { color: r.status === 'Paid' ? C.credit : C.accent }]}>{r.status}</Text>
                        </View>
                      </View>
                    ))}
                    <TouchableOpacity style={s.payBtn}>
                      <Text style={s.payBtnTxt}>Make a Payment</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
        )}

        {tab === 'Cleared' && (
          clearedLoans.length === 0
            ? <Text style={s.emptyTxt}>No cleared loans</Text>
            : clearedLoans.map(loan => (
                <View key={loan.id} style={s.loanCard}>
                  <View style={s.loanHeader}>
                    <View style={s.loanIconBg}>
                      <Ionicons name="checkmark-circle" size={20} color={C.credit} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.loanName}>{loan.name}</Text>
                      <Text style={s.loanSub}>Cleared · {fmt(loan.principal)}</Text>
                    </View>
                    <View style={[s.activeBadge, { backgroundColor: C.creditDim }]}>
                      <Text style={[s.activeTxt, { color: C.credit }]}>Cleared</Text>
                    </View>
                  </View>
                  <View style={s.progressBg}>
                    <View style={[s.progressFill, { width: '100%' }]} />
                  </View>
                </View>
              ))
        )}

        {tab === 'Apply' && (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={s.applyIntro}>Choose a loan product that suits your needs</Text>
            {LOAN_PRODUCTS.map(p => (
              <TouchableOpacity key={p.id} style={s.productCard} onPress={() => handleApply(p)}>
                <View style={s.productLeft}>
                  <View style={s.productIcon}>
                    <Ionicons name={p.icon} size={22} color={C.primary} />
                  </View>
                  <View>
                    <Text style={s.productName}>{p.name}</Text>
                    <Text style={s.productSub}>Up to {fmt(p.maxAmount)} · {p.rate}% p.a.</Text>
                    <Text style={s.productTenure}>{p.tenure}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={C.muted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  safe:         { flex: 1, backgroundColor: C.bg },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  backBtn:      { width: 38, height: 38, borderRadius: 12, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  headerTitle:  { fontSize: 18, fontFamily: F.bold, color: C.text },
  banner:       { backgroundColor: C.primary, marginHorizontal: 16, borderRadius: 24, padding: 22, marginBottom: 20, overflow: 'hidden', shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
  bannerLabel:  { color: 'rgba(255,255,255,0.65)', fontSize: 13, fontFamily: F.regular, marginBottom: 4 },
  bannerAmount: { color: '#fff', fontSize: 32, fontFamily: F.bold, marginBottom: 4 },
  bannerSub:    { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontFamily: F.regular },
  goldOrb:      { position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: C.accent, opacity: 0.2 },
  tabs:         { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 8 },
  tab:          { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 20, backgroundColor: C.surface },
  tabActive:    { backgroundColor: C.primary },
  tabText:      { fontSize: 13, fontFamily: F.semiBold, color: C.muted },
  tabTextActive:{ color: '#fff' },
  emptyTxt:     { textAlign: 'center', color: C.muted, fontFamily: F.regular, marginTop: 40 },
  loanCard:     { backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: C.text, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  loanHeader:   { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  loanIconBg:   { width: 46, height: 46, borderRadius: 14, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  loanName:     { fontSize: 15, fontFamily: F.semiBold, color: C.text },
  loanSub:      { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  activeBadge:  { backgroundColor: C.accentDim, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  activeTxt:    { color: C.accent, fontSize: 12, fontFamily: F.semiBold },
  divider:      { height: 1, backgroundColor: C.border, marginBottom: 14 },
  loanAmtRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  loanAmtItem:  { alignItems: 'center' },
  loanAmtLabel: { fontSize: 11, fontFamily: F.regular, color: C.muted, marginBottom: 4 },
  loanAmtVal:   { fontSize: 14, fontFamily: F.bold, color: C.text },
  progressLabel:{ fontSize: 11, fontFamily: F.regular, color: C.muted, marginBottom: 6 },
  progressBg:   { height: 8, backgroundColor: C.inputBg, borderRadius: 4, marginBottom: 12 },
  progressFill: { height: 8, backgroundColor: C.accent, borderRadius: 4 },
  nextDueRow:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  nextDueTxt:   { fontSize: 12, fontFamily: F.medium, color: C.muted },
  historyTitle: { fontSize: 13, fontFamily: F.semiBold, color: C.text, marginBottom: 10 },
  repayRow:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  repayMonth:   { flex: 1, fontSize: 13, fontFamily: F.regular, color: C.text },
  repayAmt:     { fontSize: 13, fontFamily: F.semiBold, color: C.text, marginRight: 10 },
  repayBadge:   { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  repayStatus:  { fontSize: 11, fontFamily: F.semiBold },
  payBtn:       { backgroundColor: C.primary, borderRadius: 30, paddingVertical: 13, alignItems: 'center', marginTop: 16, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  payBtnTxt:    { color: '#fff', fontSize: 15, fontFamily: F.bold },
  applyIntro:   { fontSize: 13, fontFamily: F.regular, color: C.muted, marginBottom: 16 },
  productCard:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surface, borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  productLeft:  { flexDirection: 'row', alignItems: 'center' },
  productIcon:  { width: 48, height: 48, borderRadius: 14, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  productName:  { fontSize: 15, fontFamily: F.semiBold, color: C.text },
  productSub:   { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  productTenure:{ fontSize: 11, fontFamily: F.regular, color: C.accent, marginTop: 2 },
});
