import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { TRANSACTIONS, fmt } from '../data';
import EmptyState from '../components/EmptyState';

const FILTERS = ['All', 'Income', 'Expenses'];

export default function TransactionsScreen() {
  const { C, F } = useTheme();
  const s = makeStyles(C, F);

  const [filter,     setFilter]     = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const filtered = TRANSACTIONS.filter(tx =>
    filter === 'All' ? true : filter === 'Income' ? tx.amount > 0 : tx.amount < 0
  );

  const totalIncome   = TRANSACTIONS.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpenses = TRANSACTIONS.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      <View style={s.header}>
        <Text style={s.headerTitle}>Transactions</Text>
        <TouchableOpacity style={s.iconBtn}>
          <Ionicons name="options-outline" size={20} color={C.primary} />
        </TouchableOpacity>
      </View>

      {/* Summary cards — theme tokens only */}
      <View style={s.summaryRow}>
        <View style={[s.summaryCard, { backgroundColor: C.primaryDim }]}>
          <Ionicons name="arrow-down-circle" size={18} color={C.primary} />
          <Text style={s.summaryLabel}>Income</Text>
          <Text style={[s.summaryAmt, { color: C.credit }]}>{fmt(totalIncome)}</Text>
        </View>
        <View style={[s.summaryCard, { backgroundColor: C.accentDim }]}>
          <Ionicons name="arrow-up-circle" size={18} color={C.accent} />
          <Text style={s.summaryLabel}>Expenses</Text>
          <Text style={[s.summaryAmt, { color: C.debit }]}>{fmt(totalExpenses)}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={s.tabs}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} style={[s.tab, filter === f && s.tabActive]} onPress={() => setFilter(f)}>
            <Text style={[s.tabText, filter === f && s.tabTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FlatList — pull-to-refresh on the list itself, not a wrapping ScrollView */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : { paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} colors={[C.primary]} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="No Transactions"
            subtitle={`No ${filter === 'All' ? '' : filter.toLowerCase() + ' '}transactions found.`}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={s.txItem} activeOpacity={0.7}>
            <View style={s.txIcon}>
              <Ionicons name={item.icon} size={20} color={C.primary} />
            </View>
            <View style={s.txInfo}>
              <Text style={s.txName}>{item.name}</Text>
              <Text style={s.txMeta}>{item.category} · {item.date}</Text>
            </View>
            <Text style={[s.txAmt, { color: item.amount > 0 ? C.credit : C.debit }]}>
              {item.amount > 0 ? '+' : '-'}{fmt(Math.abs(item.amount))}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  safe:         { flex: 1, backgroundColor: C.bg },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle:  { fontSize: 22, fontFamily: F.bold, color: C.text },
  iconBtn:      { width: 38, height: 38, borderRadius: 12, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center' },

  summaryRow:   { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 16 },
  summaryCard:  { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', gap: 4 },
  summaryLabel: { fontSize: 12, fontFamily: F.medium, color: C.muted },
  summaryAmt:   { fontSize: 15, fontFamily: F.bold },

  tabs:          { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 14, gap: 8 },
  tab:           { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 20, backgroundColor: C.surface },
  tabActive:     { backgroundColor: C.primary },
  tabText:       { fontSize: 13, fontFamily: F.semiBold, color: C.muted },
  tabTextActive: { color: '#fff' },

  txItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 16, padding: 14, marginBottom: 8, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  txIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txName: { fontSize: 14, fontFamily: F.semiBold, color: C.text },
  txMeta: { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  txAmt:  { fontSize: 14, fontFamily: F.bold },
});
