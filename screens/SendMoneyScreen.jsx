import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { CONTACTS, USER, BANK, fmt } from '../data';
import PinModal from '../components/PinModal';

const QUICK_AMOUNTS = ['500', '1000', '2500', '5000'];
const STEPS = ['Recipient', 'Amount', 'Confirm'];

export default function SendMoneyScreen({ navigation }) {
  const { C, F } = useTheme();
  const s = makeStyles(C, F);

  const [step,       setStep]       = useState(0);
  const [contact,    setContact]    = useState(null);
  const [amount,     setAmount]     = useState('');
  const [note,       setNote]       = useState('');
  const [amountErr,  setAmountErr]  = useState('');
  const [success,    setSuccess]    = useState(false);
  const [pinVisible, setPinVisible] = useState(false);

  const validateAmount = (val) => {
    const n = Number(val.replace(/,/g, ''));
    if (!val)          return 'Enter an amount';
    if (isNaN(n))      return 'Amount must be a number';
    if (n <= 0)        return 'Amount must be greater than 0';
    if (n > 500000)    return 'Exceeds daily limit of KES 500,000';
    return '';
  };

  const goNext = () => {
    if (step === 0) {
      if (!contact) return Alert.alert('Select a recipient to continue');
      setStep(1);
    } else if (step === 1) {
      const err = validateAmount(amount);
      if (err) { setAmountErr(err); return; }
      setAmountErr('');
      setStep(2);
    } else {
      // Step 2 — show PIN before completing transfer
      setPinVisible(true);
    }
  };

  const reset = () => { setStep(0); setContact(null); setAmount(''); setNote(''); setSuccess(false); };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.successContainer}>
          <View style={s.successCircle}>
            <Ionicons name="checkmark" size={48} color="#fff" />
          </View>
          <Text style={s.successTitle}>Transfer Successful!</Text>
          <Text style={s.successSub}>
            {fmt(Number(amount.replace(/,/g, '')))} sent to {contact?.name}
          </Text>
          <View style={s.successDetails}>
            <View style={s.successRow}><Text style={s.successKey}>From</Text><Text style={s.successVal}>{USER.name}</Text></View>
            <View style={s.successRow}><Text style={s.successKey}>To</Text><Text style={s.successVal}>{contact?.name}</Text></View>
            <View style={s.successRow}><Text style={s.successKey}>Amount</Text><Text style={s.successVal}>{fmt(Number(amount.replace(/,/g, '')))}</Text></View>
            <View style={s.successRow}><Text style={s.successKey}>Note</Text><Text style={s.successVal}>{note || '—'}</Text></View>
            <View style={s.successRow}><Text style={s.successKey}>Date</Text><Text style={s.successVal}>{new Date().toLocaleString('en-GB')}</Text></View>
          </View>
          <TouchableOpacity style={s.doneBtn} onPress={() => { reset(); navigation.goBack(); }}>
            <Text style={s.doneBtnTxt}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.newTransferBtn} onPress={reset}>
            <Text style={s.newTransferTxt}>New Transfer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : navigation.goBack()} style={s.backBtn}>
              <Ionicons name="arrow-back" size={22} color={C.text} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>Send Money</Text>
            <View style={{ width: 38 }} />
          </View>

          {/* Step indicator */}
          <View style={s.stepRow}>
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                <View style={s.stepItem}>
                  <View style={[s.stepDot, i <= step && s.stepDotActive]}>
                    {i < step
                      ? <Ionicons name="checkmark" size={12} color="#fff" />
                      : <Text style={[s.stepNum, i === step && { color: '#fff' }]}>{i + 1}</Text>
                    }
                  </View>
                  <Text style={[s.stepLabel, i === step && { color: C.primary, fontFamily: F.semiBold }]}>{label}</Text>
                </View>
                {i < STEPS.length - 1 && <View style={[s.stepLine, i < step && s.stepLineActive]} />}
              </React.Fragment>
            ))}
          </View>

          {/* ── STEP 0: Pick recipient ─────────────────────────────────────── */}
          {step === 0 && (
            <View style={s.section}>
              <Text style={s.sectionLabel}>Recent Contacts</Text>
              {CONTACTS.map(c => (
                <TouchableOpacity key={c.id} style={[s.contactRow, contact?.id === c.id && s.contactRowActive]} onPress={() => setContact(c)}>
                  <View style={[s.contactAvatar, { backgroundColor: c.color }]}>
                    <Text style={s.contactInitials}>{c.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.contactName}>{c.name}</Text>
                    <Text style={s.contactBank}>{BANK.name} · •••• 4291</Text>
                  </View>
                  {contact?.id === c.id && <Ionicons name="checkmark-circle" size={22} color={C.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── STEP 1: Enter amount ───────────────────────────────────────── */}
          {step === 1 && (
            <View style={s.section}>
              <View style={s.recipientBanner}>
                <View style={[s.contactAvatar, { backgroundColor: contact?.color }]}>
                  <Text style={s.contactInitials}>{contact?.initials}</Text>
                </View>
                <View>
                  <Text style={s.recipientName}>Sending to {contact?.name}</Text>
                  <Text style={s.recipientBank}>{BANK.name}</Text>
                </View>
              </View>

              <Text style={s.sectionLabel}>Amount (KES)</Text>
              <View style={[s.amountBox, amountErr && s.amountBoxErr]}>
                <Text style={s.amountCurrency}>KES</Text>
                <TextInput
                  style={s.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={C.muted}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={v => { setAmount(v); setAmountErr(''); }}
                />
              </View>
              {amountErr ? <Text style={s.errTxt}>{amountErr}</Text> : null}

              <View style={s.quickRow}>
                {QUICK_AMOUNTS.map(q => (
                  <TouchableOpacity key={q} style={s.quickBtn} onPress={() => { setAmount(q); setAmountErr(''); }}>
                    <Text style={s.quickBtnTxt}>{Number(q).toLocaleString()}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.sectionLabel}>Note (optional)</Text>
              <TextInput
                style={s.noteInput}
                placeholder="What's this for?"
                placeholderTextColor={C.muted}
                value={note}
                onChangeText={setNote}
              />
            </View>
          )}

          {/* ── STEP 2: Confirm ────────────────────────────────────────────── */}
          {step === 2 && (
            <View style={s.section}>
              <Text style={s.sectionLabel}>Review Transfer</Text>
              <View style={s.confirmCard}>
                {[
                  { label: 'From',      value: USER.name },
                  { label: 'To',        value: contact?.name },
                  { label: 'Bank',      value: BANK.name },
                  { label: 'Amount',    value: fmt(Number(amount.replace(/,/g, ''))) },
                  { label: 'Note',      value: note || '—' },
                  { label: 'Date',      value: new Date().toLocaleDateString('en-GB') },
                ].map((row, i, arr) => (
                  <View key={row.label} style={[s.confirmRow, i < arr.length - 1 && s.confirmRowBorder]}>
                    <Text style={s.confirmKey}>{row.label}</Text>
                    <Text style={s.confirmVal}>{row.value}</Text>
                  </View>
                ))}
              </View>
              <View style={s.warningBox}>
                <Ionicons name="information-circle-outline" size={16} color={C.accent} />
                <Text style={s.warningTxt}>Please confirm the recipient details. Transfers cannot be reversed once sent.</Text>
              </View>
            </View>
          )}

          {/* Next / Send button */}
          <TouchableOpacity style={s.nextBtn} onPress={goNext}>
            <Text style={s.nextBtnTxt}>{step === 2 ? 'Confirm & Send' : 'Continue'}</Text>
            <Ionicons name={step === 2 ? 'send' : 'arrow-forward'} size={18} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      <PinModal
        visible={pinVisible}
        title="Authorise Transfer"
        subtitle="Enter your PIN to confirm this transfer"
        onSuccess={() => { setPinVisible(false); setSuccess(true); }}
        onCancel={() => setPinVisible(false)}
      />

    </SafeAreaView>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  safe:    { flex: 1, backgroundColor: C.bg },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: F.bold, color: C.text },

  stepRow:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 24 },
  stepItem:      { alignItems: 'center' },
  stepDot:       { width: 28, height: 28, borderRadius: 14, backgroundColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stepDotActive: { backgroundColor: C.primary },
  stepNum:       { fontSize: 12, fontFamily: F.semiBold, color: C.muted },
  stepLabel:     { fontSize: 11, fontFamily: F.regular, color: C.muted },
  stepLine:      { flex: 1, height: 2, backgroundColor: C.border, marginBottom: 18 },
  stepLineActive:{ backgroundColor: C.primary },

  section:      { paddingHorizontal: 16 },
  sectionLabel: { fontSize: 13, fontFamily: F.semiBold, color: C.text, marginBottom: 12, marginTop: 4 },

  contactRow:       { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 16, padding: 14, marginBottom: 10, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  contactRowActive: { borderWidth: 1.5, borderColor: C.primary },
  contactAvatar:    { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  contactInitials:  { color: '#fff', fontFamily: F.bold, fontSize: 15 },
  contactName:      { fontSize: 14, fontFamily: F.semiBold, color: C.text },
  contactBank:      { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 2 },

  recipientBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primaryDim, borderRadius: 16, padding: 14, marginBottom: 20 },
  recipientName:   { fontSize: 14, fontFamily: F.semiBold, color: C.primary },
  recipientBank:   { fontSize: 12, fontFamily: F.regular, color: C.muted, marginTop: 2 },

  amountBox:    { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 18, paddingHorizontal: 20, paddingVertical: 4, marginBottom: 6, borderWidth: 1.5, borderColor: C.border },
  amountBoxErr: { borderColor: C.debit },
  amountCurrency: { fontSize: 20, fontFamily: F.bold, color: C.accent, marginRight: 10 },
  amountInput:  { flex: 1, fontSize: 32, fontFamily: F.bold, color: C.text, paddingVertical: 12 },
  errTxt:       { fontSize: 12, fontFamily: F.regular, color: C.debit, marginBottom: 10 },

  quickRow:    { flexDirection: 'row', gap: 8, marginBottom: 20 },
  quickBtn:    { flex: 1, backgroundColor: C.primaryDim, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  quickBtnTxt: { fontSize: 13, fontFamily: F.semiBold, color: C.primary },

  noteInput: { backgroundColor: C.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, fontFamily: F.regular, color: C.text, borderWidth: 1, borderColor: C.border },

  confirmCard:       { backgroundColor: C.surface, borderRadius: 18, overflow: 'hidden', marginBottom: 16, shadowColor: C.text, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  confirmRow:        { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14 },
  confirmRowBorder:  { borderBottomWidth: 1, borderBottomColor: C.border },
  confirmKey:        { fontSize: 13, fontFamily: F.regular, color: C.muted },
  confirmVal:        { fontSize: 13, fontFamily: F.semiBold, color: C.text },

  warningBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: C.accentDim, borderRadius: 14, padding: 14, marginBottom: 8 },
  warningTxt: { flex: 1, fontSize: 12, fontFamily: F.regular, color: C.muted, lineHeight: 18 },

  nextBtn:    { flexDirection: 'row', backgroundColor: C.primary, marginHorizontal: 16, marginTop: 24, borderRadius: 30, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 },
  nextBtnTxt: { color: '#fff', fontSize: 16, fontFamily: F.bold },

  // Success screen
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  successCircle:    { width: 88, height: 88, borderRadius: 44, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8 },
  successTitle:     { fontSize: 22, fontFamily: F.bold, color: C.text, marginBottom: 6 },
  successSub:       { fontSize: 14, fontFamily: F.regular, color: C.muted, marginBottom: 28, textAlign: 'center' },
  successDetails:   { width: '100%', backgroundColor: C.surface, borderRadius: 18, overflow: 'hidden', marginBottom: 24, shadowColor: C.text, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  successRow:       { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.border },
  successKey:       { fontSize: 13, fontFamily: F.regular, color: C.muted },
  successVal:       { fontSize: 13, fontFamily: F.semiBold, color: C.text },
  doneBtn:          { width: '100%', backgroundColor: C.primary, borderRadius: 30, paddingVertical: 15, alignItems: 'center', marginBottom: 12, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  doneBtnTxt:       { color: '#fff', fontSize: 15, fontFamily: F.bold },
  newTransferBtn:   { paddingVertical: 10 },
  newTransferTxt:   { fontSize: 14, fontFamily: F.semiBold, color: C.accent },
});
