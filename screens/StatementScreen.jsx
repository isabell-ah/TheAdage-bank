import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { TRANSACTIONS, BANK, fmt } from '../data';

// Build month tabs from real transaction dates
const now   = new Date();
const MONTHS = [0, 1, 2].map(offset => {
  const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
  return {
    key:   `${d.getFullYear()}-${d.getMonth()}`,
    label: d.toLocaleString('en-GB', { month: 'short', year: 'numeric' }),
    month: d.toLocaleString('en-GB', { month: 'short' }),
    year:  d.getFullYear(),
  };
});

export default function StatementScreen({ navigation }) {
  const { C, F } = useTheme();
  const s = makeStyles(C, F);

  const [selectedKey, setSelectedKey] = useState(MONTHS[0].key);
  const selected = MONTHS.find(m => m.key === selectedKey);

  // Filter transactions that match the selected month label
  const filtered  = TRANSACTIONS.filter(tx => tx.date.startsWith(selected.month));
  const income    = filtered.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const expenses  = filtered.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const net       = income - expenses;

  const handleShare = async () => {
    const lines = filtered.map(t =>
      `${t.date.padEnd(12)} ${t.name.padEnd(22)} ${t.amount > 0 ? '+' : '-'}${fmt(Math.abs(t.amount))}`
    ).join('\n');
    const text = `${BANK.name} — Statement (${selected.label})\n${'─'.repeat(46)}\n${lines}\n${'─'.repeat(46)}\nIncome:   ${fmt(income)}\nExpenses: ${fmt(expenses)}\nNet:      ${net >= 0 ? '+' : ''}${fmt(net)}`;
    try { await Share.share({ message: text }); } catch (_) {}
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Account Statement</Text>
        <TouchableOpacity onPress={handleShare} style={s.downloadBtn}>
          <Ionicons name="share-outline" size={20} color={C.primary} />
        </TouchableOpacity>
      </View>

      {/* Month Tabs */}
      <View style={s.monthTabs}>
        {MONTHS.map(m => (
          <TouchableOpacity
            key={m.key}
            style={[s.monthTab, selectedKey === m.key && s.monthTabActive]}
            onPress={() => setSelectedKey(m.key)}
          >
            <Text style={[s.monthTxt, selectedKey === m.key && s.monthTxtActive]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary — all theme colors, no stray green/red backgrounds */}
      <View style={s.summaryRow}>
        <View style={[s.summaryCard, { backgroundColor: C.primaryDim }]}>
          <Ionicons name="arrow-down-circle" size={16} color={C.primary} />
          <Text style={s.summaryLabel}>Income</Text>
          <Text style={[s.summaryAmt, { color: C.credit }]}>{fmt(income)}</Text>
        </View>
        <View style={[s.summaryCard, { backgroundColor: C.accentDim }]}>
          <Ionicons name="arrow-up-circle" size={16} color={C.accent} />
          <Text style={s.summaryLabel}>Expenses</Text>
          <Text style={[s.summaryAmt, { color: C.debit }]}>{fmt(expenses)}</Text>
        </View>
        <View style={[s.summaryCard, { backgroundColor: C.inputBg }]}>
          <Ionicons name="wallet" size={16} color={C.primary} />
          <Text style={s.summaryLabel}>Net</Text>
          <Text style={[s.summaryAmt, { color: net >= 0 ? C.credit : C.debit }]}>{fmt(Math.abs(net))}</Text>
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="document-outline" size={48} color={C.muted} style={{ marginBottom: 10 }} />
            <Text style={s.emptyTitle}>No Transactions</Text>
            <Text style={s.emptySub}>No transactions found for {selected.label}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.txItem}>
            {/* All icons use primaryDim/primary — no stray colors */}
            <View style={s.txIcon}>
              <Ionicons name={item.icon} size={18} color={C.primary} />
            </View>
            <View style={s.txInfo}>
              <Text style={s.txName}>{item.name}</Text>
              <Text style={s.txMeta}>{item.category} · {item.date}</Text>
            </View>
            <Text style={[s.txAmt, { color: item.amount > 0 ? C.credit : C.debit }]}>
              {item.amount > 0 ? '+' : '-'}{fmt(Math.abs(item.amount))}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  safe:           { flex: 1, backgroundColor: C.bg },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  backBtn:        { width: 38, height: 38, borderRadius: 12, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  downloadBtn:    { width: 38, height: 38, borderRadius: 12, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center' },
  headerTitle:    { fontSize: 18, fontFamily: F.bold, color: C.text },

  monthTabs:      { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  monthTab:       { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  monthTabActive: { backgroundColor: C.primary, borderColor: C.primary },
  monthTxt:       { fontFamily: F.semiBold, fontSize: 12, color: C.muted },
  monthTxtActive: { color: '#fff' },

  summaryRow:   { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 14 },
  summaryCard:  { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 3 },
  summaryLabel: { fontFamily: F.medium, fontSize: 11, color: C.muted },
  summaryAmt:   { fontFamily: F.bold, fontSize: 12 },

  txItem:  { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 14, padding: 13, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  txIcon:  { width: 42, height: 42, borderRadius: 12, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txInfo:  { flex: 1 },
  txName:  { fontFamily: F.semiBold, fontSize: 14, color: C.text },
  txMeta:  { fontFamily: F.regular, fontSize: 12, color: C.muted, marginTop: 2 },
  txAmt:   { fontFamily: F.bold, fontSize: 13 },

  empty:      { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontFamily: F.bold, fontSize: 17, color: C.text, marginBottom: 6 },
  emptySub:   { fontFamily: F.regular, fontSize: 14, color: C.muted },
});
