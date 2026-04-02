import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from '../theme';
import { hapticLight, hapticMedium, hapticSuccess } from '../utils/haptics';

const CATEGORIES = [
  { id: '1', icon: 'flash',          label: 'Electricity', color: '#f59e0b', bg: '#FEF3C7' },
  { id: '2', icon: 'water',          label: 'Water',       color: '#2563eb', bg: '#DBEAFE' },
  { id: '3', icon: 'wifi',           label: 'Internet',    color: '#7c3aed', bg: '#EDE9FE' },
  { id: '4', icon: 'tv',             label: 'TV',          color: '#ef4444', bg: '#FEE2E2' },
  { id: '5', icon: 'home',           label: 'Rent',        color: '#16a34a', bg: '#DCFCE7' },
  { id: '6', icon: 'phone-portrait', label: 'Airtime',     color: '#0891b2', bg: '#CFFAFE' },
  { id: '7', icon: 'school',         label: 'School',      color: '#d97706', bg: '#FEF3C7' },
  { id: '8', icon: 'medical',        label: 'Insurance',   color: '#ec4899', bg: '#FCE7F3' },
];

const BILLERS = {
  Electricity: ['Kenya Power', 'REA', 'KPLC Prepaid'],
  Water:       ['Nairobi Water', 'NCWSC', 'County Water'],
  Internet:    ['Safaricom Home', 'Zuku', 'Faiba', 'Telkom'],
  TV:          ['DSTV', 'Zuku TV', 'StarTimes', 'GOtv'],
  Rent:        ['Enter Account No.'],
  Airtime:     ['Safaricom', 'Airtel', 'Telkom'],
  School:      ['Enter School Code'],
  Insurance:   ['Jubilee', 'AAR', 'Britam', 'CIC'],
};

export default function PayBillsScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1=category, 2=biller+amount, 3=success
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedBiller, setSelectedBiller] = useState(null);
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');

  const handlePay = () => {
    if (!accountNo || !amount) {
      Alert.alert('Missing Info', 'Please enter account number and amount.');
      return;
    }
    hapticSuccess();
    setStep(3);
  };

  if (step === 3) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={44} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Bill Paid!</Text>
          <Text style={styles.successSub}>{selectedBiller} · KES {amount}</Text>
          <View style={styles.receiptCard}>
            {[
              ['Biller', selectedBiller],
              ['Account', accountNo],
              ['Amount', `KES ${amount}`],
              ['From', 'Savings Account'],
              ['Status', 'Successful'],
            ].map(([label, value], i, arr) => (
              <View key={label}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>{label}</Text>
                  <Text style={[styles.receiptValue, label === 'Status' && { color: C.green, fontFamily: F.bold }]}>
                    {value}
                  </Text>
                </View>
                {i < arr.length - 1 && <View style={styles.receiptDivider} />}
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.doneBtn} onPress={() => { hapticLight(); navigation.goBack(); }}>
            <Text style={styles.doneBtnTxt}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => { hapticLight(); step === 2 ? setStep(1) : navigation.goBack(); }}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color={C.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pay Bills</Text>
          <View style={{ width: 38 }} />
        </View>

        {step === 1 && (
          <>
            <Text style={styles.sectionLabel}>Select Category</Text>
            <View style={styles.grid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catItem, selectedCat?.id === cat.id && styles.catItemActive]}
                  onPress={() => { hapticLight(); setSelectedCat(cat); setStep(2); setSelectedBiller(null); }}
                >
                  <View style={[styles.catIcon, { backgroundColor: cat.bg }]}>
                    <Ionicons name={cat.icon} size={26} color={cat.color} />
                  </View>
                  <Text style={styles.catLabel}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {step === 2 && selectedCat && (
          <>
            <View style={styles.selectedCatBanner}>
              <View style={[styles.catIcon, { backgroundColor: selectedCat.bg }]}>
                <Ionicons name={selectedCat.icon} size={22} color={selectedCat.color} />
              </View>
              <Text style={styles.selectedCatName}>{selectedCat.label}</Text>
            </View>

            <Text style={styles.sectionLabel}>Select Biller</Text>
            <View style={styles.billersRow}>
              {(BILLERS[selectedCat.label] || []).map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[styles.billerChip, selectedBiller === b && styles.billerChipActive]}
                  onPress={() => { hapticLight(); setSelectedBiller(b); }}
                >
                  <Text style={[styles.billerTxt, selectedBiller === b && styles.billerTxtActive]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account / Reference Number</Text>
              <View style={styles.inputBox}>
                <Ionicons name="document-text-outline" size={18} color={C.muted} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter account number"
                  placeholderTextColor={C.muted}
                  value={accountNo}
                  onChangeText={setAccountNo}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount (KES)</Text>
              <View style={styles.amountBox}>
                <Text style={styles.currencyTxt}>KES</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor={C.muted}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.payBtn, (!selectedBiller || !accountNo || !amount) && { opacity: 0.5 }]}
              onPress={handlePay}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.payBtnTxt}>Pay Now</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: F.bold, fontSize: 18, color: C.text },
  sectionLabel: { fontFamily: F.bold, fontSize: 15, color: C.text, paddingHorizontal: 20, marginBottom: 14, marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  catItem: {
    width: '23%', alignItems: 'center', backgroundColor: C.surface,
    borderRadius: 16, padding: 12, margin: '1%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  catItemActive: { borderWidth: 2, borderColor: C.primary },
  catIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  catLabel: { fontFamily: F.medium, fontSize: 11, color: C.text, textAlign: 'center' },
  selectedCatBanner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16, gap: 10 },
  selectedCatName: { fontFamily: F.bold, fontSize: 18, color: C.text },
  billersRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8, marginBottom: 20 },
  billerChip: { borderWidth: 1.5, borderColor: C.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 9 },
  billerChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  billerTxt: { fontFamily: F.semiBold, fontSize: 13, color: C.muted },
  billerTxtActive: { color: '#fff' },
  inputGroup: { paddingHorizontal: 16, marginBottom: 16 },
  inputLabel: { fontFamily: F.semiBold, fontSize: 13, color: C.text, marginBottom: 8 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  input: { flex: 1, fontFamily: F.regular, fontSize: 14, color: C.text, paddingVertical: 13 },
  amountBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface,
    borderRadius: 14, paddingHorizontal: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  currencyTxt: { fontFamily: F.bold, fontSize: 16, color: C.muted, marginRight: 10 },
  amountInput: { flex: 1, fontFamily: F.extraBold, fontSize: 28, color: C.text, paddingVertical: 12 },
  payBtn: {
    flexDirection: 'row', backgroundColor: C.primary, marginHorizontal: 16,
    borderRadius: 30, paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  payBtnTxt: { fontFamily: F.bold, fontSize: 16, color: '#fff' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successIcon: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: C.green,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    shadowColor: C.green, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8,
  },
  successTitle: { fontFamily: F.extraBold, fontSize: 26, color: C.text, marginBottom: 8 },
  successSub: { fontFamily: F.regular, fontSize: 14, color: C.muted, marginBottom: 28 },
  receiptCard: {
    backgroundColor: C.surface, borderRadius: 18, padding: 6, width: '100%', marginBottom: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 13 },
  receiptLabel: { fontFamily: F.regular, fontSize: 13, color: C.muted },
  receiptValue: { fontFamily: F.semiBold, fontSize: 13, color: C.text },
  receiptDivider: { height: 1, backgroundColor: C.border, marginHorizontal: 14 },
  doneBtn: { backgroundColor: C.primary, borderRadius: 30, paddingVertical: 16, paddingHorizontal: 48, alignItems: 'center' },
  doneBtnTxt: { fontFamily: F.bold, fontSize: 16, color: '#fff' },
});
