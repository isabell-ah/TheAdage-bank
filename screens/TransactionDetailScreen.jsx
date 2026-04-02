import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from '../theme';
import { fmtAmt } from '../utils/format';
import { hapticLight, hapticMedium } from '../utils/haptics';

export default function TransactionDetailScreen({ navigation, route }) {
  const tx = route.params?.transaction ?? {};
  const isCredit = tx.amount > 0;

  const handleShare = async () => {
    hapticMedium();
    try {
      await Share.share({
        message: `Demo Bank Receipt\n${tx.name}\nAmount: ${fmtAmt(tx.amount)}\nDate: ${tx.date}\nRef: ${tx.reference ?? 'N/A'}\nStatus: ${tx.status ?? 'Completed'}`,
      });
    } catch (_) {}
  };

  const DETAILS = [
    { label: 'Date',      value: tx.date ?? '—' },
    { label: 'Time',      value: tx.time ?? '09:32 AM' },
    { label: 'Category',  value: tx.category ?? '—' },
    { label: 'Account',   value: tx.account ?? 'Savings Account' },
    { label: 'Reference', value: tx.reference ?? 'TXN000000' },
    { label: 'Status',    value: tx.status ?? 'Completed', isStatus: true },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { hapticLight(); navigation.goBack(); }} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={C.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction Details</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
            <Ionicons name="share-outline" size={20} color={C.primary} />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={[styles.txIconBig, { backgroundColor: (tx.iconColor ?? '#888') + '22' }]}>
            <Ionicons name={tx.icon ?? 'swap-horizontal'} size={38} color={tx.iconColor ?? C.primary} />
          </View>
          <Text style={styles.txName}>{tx.name ?? 'Transaction'}</Text>
          <Text style={[styles.txAmt, { color: isCredit ? C.green : C.red }]}>
            {isCredit ? '+' : '-'}{fmtAmt(tx.amount ?? 0)}
          </Text>
          <View style={[styles.statusPill, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="checkmark-circle" size={13} color={C.green} style={{ marginRight: 4 }} />
            <Text style={[styles.statusTxt, { color: C.green }]}>{tx.status ?? 'Completed'}</Text>
          </View>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          {DETAILS.map((d, i) => (
            <View key={d.label}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={[styles.detailValue, d.isStatus && { color: C.green, fontFamily: F.bold }]}>
                  {d.value}
                </Text>
              </View>
              {i < DETAILS.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => { hapticMedium(); navigation.navigate('SendMoney'); }}>
            <Ionicons name="arrow-redo-outline" size={18} color={C.primary} style={{ marginRight: 6 }} />
            <Text style={styles.actionTxt}>Repeat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={handleShare}>
            <Ionicons name="download-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={[styles.actionTxt, { color: '#fff' }]}>Receipt</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  shareBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F0DDE4', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: F.bold, fontSize: 18, color: C.text },
  heroCard: {
    backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 20, padding: 28,
    alignItems: 'center', marginBottom: 16,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4,
  },
  txIconBig: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  txName: { fontFamily: F.semiBold, fontSize: 18, color: C.text, marginBottom: 8 },
  txAmt: { fontFamily: F.extraBold, fontSize: 32, marginBottom: 14 },
  statusPill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  statusTxt: { fontFamily: F.semiBold, fontSize: 13 },
  detailsCard: {
    backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 18, padding: 6,
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14 },
  rowDivider: { height: 1, backgroundColor: C.border, marginHorizontal: 14 },
  detailLabel: { fontFamily: F.regular, fontSize: 13, color: C.muted },
  detailValue: { fontFamily: F.semiBold, fontSize: 13, color: C.text, maxWidth: '55%', textAlign: 'right' },
  actionsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: C.primary, borderRadius: 30, paddingVertical: 14,
  },
  actionBtnPrimary: { backgroundColor: C.primary, borderColor: C.primary },
  actionTxt: { fontFamily: F.bold, fontSize: 14, color: C.primary },
});
