import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SAVINGS_GOALS, FIXED_DEPOSITS, fmt, pct } from '../data';
import PinModal from '../components/PinModal';

export default function SavingsScreen({ navigation }) {
  const { C, F } = useTheme();
  const s = makeStyles(C, F);

  const [goals,     setGoals]     = useState(SAVINGS_GOALS);
  const [tab,       setTab]       = useState('Goals');
  const [showModal, setShowModal] = useState(false);
  const [newGoal,   setNewGoal]   = useState({ name: '', target: '', monthly: '' });
  const [pinVisible,  setPinVisible]  = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { type: 'topup'|'newgoal', payload }

  const totalSaved  = goals.reduce((sum, g) => sum + g.saved, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);

  const handleTopUp = (goal) => {
    // Ask for PIN first, then show amount options
    setPendingAction({ type: 'topup', payload: goal });
    setPinVisible(true);
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target) return Alert.alert('Fill in goal name and target amount');
    // Ask for PIN before creating goal
    setPendingAction({ type: 'newgoal' });
    setPinVisible(true);
  };

  const onPinSuccess = () => {
    setPinVisible(false);
    if (!pendingAction) return;

    if (pendingAction.type === 'topup') {
      const goal = pendingAction.payload;
      Alert.alert(`Top Up — ${goal.name}`, 'How much would you like to add?', [
        { text: 'KES 1,000', onPress: () => setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, saved: g.saved + 1000 } : g)) },
        { text: 'KES 5,000', onPress: () => setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, saved: Math.min(g.saved + 5000, g.target) } : g)) },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }

    if (pendingAction.type === 'newgoal') {
      setGoals(prev => [...prev, {
        id: `s${Date.now()}`, name: newGoal.name, target: Number(newGoal.target),
        saved: 0, monthlyContrib: Number(newGoal.monthly) || 0,
        icon: 'star', color: C.primary, deadline: 'TBD',
      }]);
      setNewGoal({ name: '', target: '', monthly: '' });
      setShowModal(false);
    }

    setPendingAction(null);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={C.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Savings</Text>
          <TouchableOpacity style={s.addBtn} onPress={() => setShowModal(true)}>
            <Ionicons name="add" size={20} color={C.primary} />
          </TouchableOpacity>
        </View>

        <View style={s.banner}>
          <Text style={s.bannerLabel}>TOTAL SAVED</Text>
          <Text style={s.bannerAmount}>{fmt(totalSaved)}</Text>
          <Text style={s.bannerSub}>of {fmt(totalTarget)} target · {pct(totalSaved, totalTarget)}% achieved</Text>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${pct(totalSaved, totalTarget)}%` }]} />
          </View>
          <View style={s.goldOrb} />
        </View>

        <View style={s.tabs}>
          {['Goals', 'Fixed Deposits'].map(t => (
            <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'Goals' && goals.map(goal => {
          const progress = pct(goal.saved, goal.target);
          const done = goal.saved >= goal.target;
          return (
            <View key={goal.id} style={s.goalCard}>
              <View style={s.goalHeader}>
                <View style={[s.goalIconBg, { backgroundColor: done ? C.creditDim : C.primaryDim }]}>
                  <Ionicons name={done ? 'checkmark-circle' : goal.icon} size={22} color={done ? C.credit : C.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.goalName}>{goal.name}</Text>
                  <Text style={s.goalSub}>Target by {goal.deadline}</Text>
                </View>
                {done && (
                  <View style={[s.badge, { backgroundColor: C.creditDim }]}>
                    <Text style={[s.badgeTxt, { color: C.credit }]}>Complete</Text>
                  </View>
                )}
              </View>
              <View style={s.goalAmtRow}>
                <View>
                  <Text style={s.goalAmtLabel}>Saved</Text>
                  <Text style={s.goalSaved}>{fmt(goal.saved)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={s.goalAmtLabel}>Target</Text>
                  <Text style={s.goalTarget}>{fmt(goal.target)}</Text>
                </View>
              </View>
              <View style={s.progressBgGoal}>
                <View style={[s.progressFillGoal, { width: `${progress}%`, backgroundColor: done ? C.credit : C.accent }]} />
              </View>
              <Text style={s.progressPct}>{progress}% · Monthly: {fmt(goal.monthlyContrib)}</Text>
              {!done && (
                <TouchableOpacity style={s.topUpBtn} onPress={() => handleTopUp(goal)}>
                  <Ionicons name="add-circle-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={s.topUpTxt}>Top Up</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {tab === 'Fixed Deposits' && FIXED_DEPOSITS.map(fd => (
          <View key={fd.id} style={s.fdCard}>
            <View style={s.goalHeader}>
              <View style={s.goalIconBg}>
                <Ionicons name="lock-closed" size={22} color={C.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.goalName}>{fd.name}</Text>
                <Text style={s.goalSub}>Matures {fd.maturity}</Text>
              </View>
              <View style={[s.badge, { backgroundColor: C.accentDim }]}>
                <Text style={[s.badgeTxt, { color: C.accent }]}>{fd.rate}% p.a.</Text>
              </View>
            </View>
            <View style={s.divider} />
            <View style={s.fdRow}>
              <View>
                <Text style={s.goalAmtLabel}>Principal</Text>
                <Text style={s.goalSaved}>{fmt(fd.amount)}</Text>
              </View>
              <View>
                <Text style={s.goalAmtLabel}>Interest Earned</Text>
                <Text style={[s.goalSaved, { color: C.credit }]}>{fmt(fd.interest)}</Text>
              </View>
              <View>
                <Text style={s.goalAmtLabel}>At Maturity</Text>
                <Text style={s.goalSaved}>{fmt(fd.amount + fd.interest)}</Text>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>

      <PinModal
        visible={pinVisible}
        title="Confirm Action"
        subtitle="Enter your PIN to authorise this savings transaction"
        onSuccess={onPinSuccess}
        onCancel={() => { setPinVisible(false); setPendingAction(null); }}
      />

      <Modal visible={showModal} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>New Savings Goal</Text>
            <TextInput style={s.modalInput} placeholder="Goal name" placeholderTextColor={C.muted} value={newGoal.name} onChangeText={v => setNewGoal(p => ({ ...p, name: v }))} />
            <TextInput style={s.modalInput} placeholder="Target amount (KES)" placeholderTextColor={C.muted} keyboardType="numeric" value={newGoal.target} onChangeText={v => setNewGoal(p => ({ ...p, target: v }))} />
            <TextInput style={s.modalInput} placeholder="Monthly contribution (KES)" placeholderTextColor={C.muted} keyboardType="numeric" value={newGoal.monthly} onChangeText={v => setNewGoal(p => ({ ...p, monthly: v }))} />
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.modalCancel} onPress={() => setShowModal(false)}>
                <Text style={s.modalCancelTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalConfirm} onPress={handleAddGoal}>
                <Text style={s.modalConfirmTxt}>Create Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  safe:       { flex: 1, backgroundColor: C.bg },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  backBtn:    { width: 38, height: 38, borderRadius: 12, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  headerTitle:{ fontSize: 18, fontFamily: F.bold, color: C.text },
  addBtn:     { width: 38, height: 38, borderRadius: 12, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center' },
  banner:     { backgroundColor: C.primary, marginHorizontal: 16, borderRadius: 24, padding: 22, marginBottom: 20, overflow: 'hidden', shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
  bannerLabel:{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: F.semiBold, letterSpacing: 2, marginBottom: 4 },
  bannerAmount:{ color: '#fff', fontSize: 32, fontFamily: F.bold, marginBottom: 4 },
  bannerSub:  { color: 'rgba(255,255,255,0.55)', fontSize: 12, fontFamily: F.regular, marginBottom: 14 },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
  progressFill:{ height: 6, backgroundColor: C.accent, borderRadius: 3 },
  goldOrb:    { position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: C.accent, opacity: 0.2 },
  tabs:       { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 8 },
  tab:        { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 20, backgroundColor: C.surface },
  tabActive:  { backgroundColor: C.primary },
  tabText:    { fontSize: 13, fontFamily: F.semiBold, color: C.muted },
  tabTextActive:{ color: '#fff' },
  goalCard:   { backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: C.text, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  goalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  goalIconBg: { width: 46, height: 46, borderRadius: 14, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  goalName:   { fontSize: 15, fontFamily: F.semiBold, color: C.text },
  goalSub:    { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 2 },
  badge:      { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  badgeTxt:   { fontSize: 12, fontFamily: F.semiBold },
  goalAmtRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  goalAmtLabel:{ fontSize: 11, fontFamily: F.regular, color: C.muted, marginBottom: 3 },
  goalSaved:  { fontSize: 16, fontFamily: F.bold, color: C.text },
  goalTarget: { fontSize: 16, fontFamily: F.bold, color: C.muted },
  progressBgGoal:  { height: 8, backgroundColor: C.inputBg, borderRadius: 4, marginBottom: 6 },
  progressFillGoal:{ height: 8, borderRadius: 4 },
  progressPct:{ fontSize: 11, fontFamily: F.regular, color: C.muted, marginBottom: 14 },
  topUpBtn:   { flexDirection: 'row', backgroundColor: C.primary, borderRadius: 30, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  topUpTxt:   { color: '#fff', fontSize: 14, fontFamily: F.semiBold },
  fdCard:     { backgroundColor: C.surface, marginHorizontal: 16, borderRadius: 20, padding: 18, marginBottom: 14, shadowColor: C.text, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  divider:    { height: 1, backgroundColor: C.border, marginBottom: 14 },
  fdRow:      { flexDirection: 'row', justifyContent: 'space-between' },
  modalOverlay:{ flex: 1, backgroundColor: 'rgba(28,20,16,0.5)', justifyContent: 'flex-end' },
  modalCard:  { backgroundColor: C.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 },
  modalTitle: { fontSize: 18, fontFamily: F.bold, color: C.text, marginBottom: 20 },
  modalInput: { backgroundColor: C.inputBg, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, fontFamily: F.regular, color: C.text, marginBottom: 12 },
  modalBtns:  { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalCancel:{ flex: 1, borderWidth: 1.5, borderColor: C.border, borderRadius: 30, paddingVertical: 14, alignItems: 'center' },
  modalCancelTxt:{ color: C.muted, fontFamily: F.semiBold, fontSize: 14 },
  modalConfirm:{ flex: 1, backgroundColor: C.primary, borderRadius: 30, paddingVertical: 14, alignItems: 'center' },
  modalConfirmTxt:{ color: '#fff', fontFamily: F.bold, fontSize: 14 },
});
