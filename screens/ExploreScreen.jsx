import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { FOREX_RATES, INTEREST_RATES, BRANCHES, BANKING_NEWS } from '../data';

const TABS = ['Forex', 'Rates', 'Branches', 'News'];

export default function ExploreScreen() {
  const { C, F } = useTheme();
  const s = makeStyles(C, F);
  const [tab, setTab]           = useState('Forex');
  const [fromAmt, setFromAmt]   = useState('1');
  const [selected, setSelected] = useState(FOREX_RATES[0]);
  const [countyQuery, setCountyQuery] = useState('');

  const counties = ['All', ...Array.from(new Set(BRANCHES.map(b => b.county))).sort()];
  const [activeCounty, setActiveCounty] = useState('All');

  const filteredBranches = BRANCHES.filter(b => {
    const matchCounty = activeCounty === 'All' || b.county === activeCounty;
    const q = countyQuery.trim().toLowerCase();
    const matchQuery = !q || b.county.toLowerCase().includes(q) || b.name.toLowerCase().includes(q);
    return matchCounty && matchQuery;
  });

  const converted = fromAmt ? (parseFloat(fromAmt) * selected.buy).toFixed(2) : '0.00';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Explore</Text>
          <Text style={s.headerSub}>Rates updated daily</Text>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabs}>
          {TABS.map(t => (
            <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
              <Text style={[s.tabTxt, tab === t && s.tabTxtActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── FOREX ─────────────────────────────────────────────────────────── */}
        {tab === 'Forex' && (
          <>
            {/* Converter */}
            <View style={s.converterCard}>
              <Text style={s.converterTitle}>Currency Converter</Text>
              <Text style={s.converterSub}>Base currency: KES (Kenyan Shilling)</Text>
              <View style={s.converterRow}>
                <View style={s.converterInput}>
                  <Text style={s.converterCurrency}>{selected.flag} {selected.currency}</Text>
                  <TextInput
                    style={s.converterAmt}
                    value={fromAmt}
                    onChangeText={setFromAmt}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor={C.muted}
                  />
                </View>
                <View style={s.converterArrow}>
                  <Ionicons name="swap-horizontal" size={20} color={C.primary} />
                </View>
                <View style={s.converterResult}>
                  <Text style={s.converterCurrency}>🇰🇪 KES</Text>
                  <Text style={s.converterResultAmt}>{Number(converted).toLocaleString()}</Text>
                </View>
              </View>
              <Text style={s.converterRate}>Buy rate: 1 {selected.currency} = KES {selected.buy} · Sell: KES {selected.sell}</Text>
            </View>

            {/* Rate Table */}
            <View style={s.card}>
              <View style={s.tableHeader}>
                <Text style={[s.tableCol, { flex: 2 }]}>Currency</Text>
                <Text style={s.tableCol}>Buy (KES)</Text>
                <Text style={s.tableCol}>Sell (KES)</Text>
              </View>
              {FOREX_RATES.map((r, i) => (
                <TouchableOpacity
                  key={r.id}
                  style={[s.tableRow, i < FOREX_RATES.length - 1 && s.tableRowBorder, selected.id === r.id && s.tableRowActive]}
                  onPress={() => setSelected(r)}
                >
                  <View style={[s.tableCell, { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
                    <Text style={s.flag}>{r.flag}</Text>
                    <View>
                      <Text style={s.currencyCode}>{r.currency}</Text>
                      <Text style={s.currencyName}>{r.name}</Text>
                    </View>
                  </View>
                  <Text style={[s.tableCell, { color: C.credit, fontFamily: F.semiBold }]}>{r.buy}</Text>
                  <Text style={[s.tableCell, { color: C.debit, fontFamily: F.semiBold }]}>{r.sell}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* ── RATES ─────────────────────────────────────────────────────────── */}
        {tab === 'Rates' && (
          <>
            <Text style={s.sectionTitle}>Deposit Rates</Text>
            <View style={s.card}>
              {INTEREST_RATES.filter(r => r.type === 'deposit').map((r, i, arr) => (
                <View key={r.label} style={[s.rateRow, i < arr.length - 1 && s.tableRowBorder]}>
                  <View style={s.rateIconBg}><Ionicons name="trending-up" size={16} color={C.primary} /></View>
                  <Text style={s.rateLabel}>{r.label}</Text>
                  <Text style={s.rateValue}>{r.rate}</Text>
                </View>
              ))}
            </View>
            <Text style={s.sectionTitle}>Lending Rates</Text>
            <View style={s.card}>
              {INTEREST_RATES.filter(r => r.type === 'loan').map((r, i, arr) => (
                <View key={r.label} style={[s.rateRow, i < arr.length - 1 && s.tableRowBorder]}>
                  <View style={s.rateIconBg}><Ionicons name="cash" size={16} color={C.primary} /></View>
                  <Text style={s.rateLabel}>{r.label}</Text>
                  <Text style={[s.rateValue, { color: C.debit }]}>{r.rate}</Text>
                </View>
              ))}
            </View>
            <View style={s.noteCard}>
              <Ionicons name="information-circle-outline" size={16} color={C.accent} />
              <Text style={s.noteTxt}>Rates are subject to change. CBK base rate: 13.00% p.a. Effective Oct 2024.</Text>
            </View>
          </>
        )}

        {/* ── BRANCHES ──────────────────────────────────────────────────────── */}
        {tab === 'Branches' && (
          <>
            {/* Search input */}
            <View style={s.branchSearch}>
              <Ionicons name="search-outline" size={17} color={C.muted} style={{ marginRight: 8 }} />
              <TextInput
                style={s.branchSearchInput}
                placeholder="Search by county or branch name…"
                placeholderTextColor={C.muted}
                value={countyQuery}
                onChangeText={v => { setCountyQuery(v); setActiveCounty('All'); }}
              />
              {countyQuery.length > 0 && (
                <TouchableOpacity onPress={() => setCountyQuery('')}>
                  <Ionicons name="close-circle" size={17} color={C.muted} />
                </TouchableOpacity>
              )}
            </View>

            {/* County tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.countyTabs}>
              {counties.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[s.countyTab, activeCounty === c && s.countyTabActive]}
                  onPress={() => { setActiveCounty(c); setCountyQuery(''); }}
                >
                  <Text style={[s.countyTabTxt, activeCounty === c && s.countyTabTxtActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Results count */}
            <Text style={s.branchCount}>{filteredBranches.length} branch{filteredBranches.length !== 1 ? 'es' : ''} found</Text>

            {filteredBranches.length === 0 ? (
              <View style={s.emptyState}>
                <Ionicons name="business-outline" size={40} color={C.border} />
                <Text style={s.emptyTxt}>No branches found</Text>
                <Text style={s.emptySub}>Try a different county name</Text>
              </View>
            ) : (
              filteredBranches.map(b => (
                <View key={b.id} style={s.branchCard}>
                  <View style={s.branchHeader}>
                    <View style={s.branchIconBg}><Ionicons name="business" size={20} color={C.primary} /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.branchName}>{b.name}</Text>
                      <Text style={s.branchAddress}>{b.address}</Text>
                    </View>
                    <View style={s.countyBadge}>
                      <Text style={s.countyBadgeTxt}>{b.county}</Text>
                    </View>
                  </View>
                  <View style={s.branchDetails}>
                    <View style={s.branchRow}>
                      <Ionicons name="call-outline" size={14} color={C.muted} />
                      <Text style={s.branchDetailTxt}>{b.phone}</Text>
                    </View>
                    <View style={s.branchRow}>
                      <Ionicons name="time-outline" size={14} color={C.muted} />
                      <Text style={s.branchDetailTxt}>{b.hours}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={s.dirBtn} onPress={() => Alert.alert('Get Directions', `Opening maps for ${b.name}`)}>
                    <Ionicons name="navigate-outline" size={14} color={C.primary} />
                    <Text style={s.dirBtnTxt}>Get Directions</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
        )}

        {/* ── NEWS ──────────────────────────────────────────────────────────── */}
        {tab === 'News' && (
          <>
            <Text style={s.sectionTitle}>Banking & Finance News</Text>
            {BANKING_NEWS.map(n => (
              <TouchableOpacity key={n.id} style={s.newsCard} onPress={() => Alert.alert(n.title, n.summary)}>
                <View style={s.newsIconBg}><Ionicons name="newspaper-outline" size={20} color={C.primary} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.newsTitle}>{n.title}</Text>
                  <Text style={s.newsSummary}>{n.summary}</Text>
                  <Text style={s.newsDate}>{n.date}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={C.muted} />
              </TouchableOpacity>
            ))}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  safe:        { flex: 1, backgroundColor: C.bg },
  header:      { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 },
  headerTitle: { fontSize: 22, fontFamily: F.bold, color: C.text },
  headerSub:   { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 2 },

  tabs:         { paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  tab:          { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 20, backgroundColor: C.surface },
  tabActive:    { backgroundColor: C.primary },
  tabTxt:       { fontSize: 13, fontFamily: F.semiBold, color: C.muted },
  tabTxtActive: { color: '#fff' },

  sectionTitle: { fontSize: 15, fontFamily: F.semiBold, color: C.text, paddingHorizontal: 20, marginBottom: 10, marginTop: 4 },

  converterCard: { backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 20, padding: 18, marginBottom: 16, shadowColor: C.text, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  converterTitle:{ fontSize: 15, fontFamily: F.semiBold, color: C.text, marginBottom: 2 },
  converterSub:  { fontSize: 12, fontFamily: F.regular, color: C.muted, marginBottom: 16 },
  converterRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  converterInput:{ flex: 1, backgroundColor: C.inputBg, borderRadius: 14, padding: 12 },
  converterArrow:{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center' },
  converterResult:{ flex: 1, backgroundColor: C.primaryDim, borderRadius: 14, padding: 12 },
  converterCurrency:{ fontSize: 12, fontFamily: F.medium, color: C.muted, marginBottom: 4 },
  converterAmt:  { fontSize: 20, fontFamily: F.bold, color: C.text },
  converterResultAmt:{ fontSize: 20, fontFamily: F.bold, color: C.primary },
  converterRate: { fontSize: 11, fontFamily: F.regular, color: C.muted },

  card:          { backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 18, overflow: 'hidden', marginBottom: 16, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  tableHeader:   { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.inputBg },
  tableCol:      { flex: 1, fontSize: 11, fontFamily: F.semiBold, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  tableRowBorder:{ borderBottomWidth: 1, borderBottomColor: C.border },
  tableRowActive:{ backgroundColor: C.primaryDim },
  tableCell:     { flex: 1, fontSize: 13, fontFamily: F.regular, color: C.text },
  flag:          { fontSize: 20 },
  currencyCode:  { fontSize: 14, fontFamily: F.semiBold, color: C.text },
  currencyName:  { fontSize: 11, fontFamily: F.regular, color: C.muted },

  rateRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13 },
  rateIconBg: { width: 32, height: 32, borderRadius: 10, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rateLabel:  { flex: 1, fontSize: 14, fontFamily: F.medium, color: C.text },
  rateValue:  { fontSize: 14, fontFamily: F.bold, color: C.credit },

  noteCard:   { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: C.accentDim, marginHorizontal: 16, borderRadius: 14, padding: 14 },
  noteTxt:    { flex: 1, fontSize: 12, fontFamily: F.regular, color: C.muted, lineHeight: 18 },

  branchSearch:      { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  branchSearchInput: { flex: 1, fontSize: 14, fontFamily: F.regular, color: C.text },
  countyTabs:        { paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  countyTab:         { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  countyTabActive:   { backgroundColor: C.primary, borderColor: C.primary },
  countyTabTxt:      { fontSize: 12, fontFamily: F.semiBold, color: C.muted },
  countyTabTxtActive:{ color: '#fff' },
  branchCount:       { fontSize: 12, fontFamily: F.regular, color: C.muted, paddingHorizontal: 20, marginBottom: 10 },
  emptyState:        { alignItems: 'center', paddingVertical: 48 },
  emptyTxt:          { fontSize: 16, fontFamily: F.semiBold, color: C.muted, marginTop: 12 },
  emptySub:          { fontSize: 13, fontFamily: F.regular, color: C.muted, marginTop: 4 },
  branchCard:        { backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  branchHeader:      { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  branchIconBg:      { width: 44, height: 44, borderRadius: 13, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  branchName:        { fontSize: 15, fontFamily: F.semiBold, color: C.text },
  branchAddress:     { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  countyBadge:       { backgroundColor: C.inputBg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  countyBadgeTxt:    { fontSize: 11, fontFamily: F.semiBold, color: C.muted },
  branchDetails:     { gap: 6, marginBottom: 12 },
  branchRow:         { flexDirection: 'row', alignItems: 'center', gap: 8 },
  branchDetailTxt:   { fontSize: 13, fontFamily: F.regular, color: C.muted },
  dirBtn:            { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.primaryDim, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start' },
  dirBtnTxt:         { fontSize: 13, fontFamily: F.semiBold, color: C.primary },

  newsCard:    { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 16, padding: 14, marginBottom: 10, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  newsIconBg:  { width: 42, height: 42, borderRadius: 12, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center' },
  newsTitle:   { fontSize: 14, fontFamily: F.semiBold, color: C.text, marginBottom: 4 },
  newsSummary: { fontSize: 12, fontFamily: F.regular, color: C.muted, lineHeight: 18, marginBottom: 6 },
  newsDate:    { fontSize: 11, fontFamily: F.regular, color: C.accent },
});
