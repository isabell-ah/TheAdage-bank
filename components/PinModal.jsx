import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  Animated, Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const CORRECT_PIN = '1234'; // In production: fetched from secure storage / verified server-side
const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;

export default function PinModal({ visible, onSuccess, onCancel, title = 'Enter PIN', subtitle = 'Confirm your transaction PIN to proceed' }) {
  const { C, F } = useTheme();
  const s = makeStyles(C, F);

  const [pin,        setPin]        = useState('');
  const [attempts,   setAttempts]   = useState(0);
  const [locked,     setLocked]     = useState(false);
  const [countdown,  setCountdown]  = useState(0);
  const [error,      setError]      = useState('');

  const shakeAnim  = useRef(new Animated.Value(0)).current;
  const timerRef   = useRef(null);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setPin('');
      setError('');
    }
  }, [visible]);

  // Countdown timer when locked
  useEffect(() => {
    if (locked) {
      setCountdown(LOCKOUT_SECONDS);
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setLocked(false);
            setAttempts(0);
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [locked]);

  const shake = () => {
    Vibration.vibrate(400);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60,  useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60,  useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,   duration: 60,  useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8,  duration: 60,  useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60,  useNativeDriver: true }),
    ]).start();
  };

  const handlePress = (digit) => {
    if (locked || pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError('');

    if (newPin.length === 4) {
      setTimeout(() => verifyPin(newPin), 150);
    }
  };

  const handleDelete = () => {
    if (locked) return;
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const verifyPin = (enteredPin) => {
    if (enteredPin === CORRECT_PIN) {
      setPin('');
      setAttempts(0);
      setError('');
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');
      shake();

      if (newAttempts >= MAX_ATTEMPTS) {
        setLocked(true);
        setError(`Too many attempts. Try again in ${LOCKOUT_SECONDS}s`);
      } else {
        setError(`Incorrect PIN. ${MAX_ATTEMPTS - newAttempts} attempt${MAX_ATTEMPTS - newAttempts !== 1 ? 's' : ''} remaining`);
      }
    }
  };

  const KEYS = [
    ['1','2','3'],
    ['4','5','6'],
    ['7','8','9'],
    [null,'0','del'],
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.handle} />

          {/* Header */}
          <View style={s.header}>
            <View style={s.lockIconBg}>
              <Ionicons name="lock-closed" size={22} color={C.primary} />
            </View>
            <Text style={s.title}>{title}</Text>
            <Text style={s.subtitle}>{subtitle}</Text>
          </View>

          {/* PIN dots */}
          <Animated.View style={[s.dotsRow, { transform: [{ translateX: shakeAnim }] }]}>
            {[0,1,2,3].map(i => (
              <View key={i} style={[s.dot, pin.length > i && s.dotFilled]} />
            ))}
          </Animated.View>

          {/* Error / lockout message */}
          {error ? (
            <View style={s.errorRow}>
              <Ionicons name="alert-circle-outline" size={14} color={C.debit} />
              <Text style={s.errorTxt}>
                {locked ? `Account locked. Try again in ${countdown}s` : error}
              </Text>
            </View>
          ) : null}

          {/* Hint */}
          {!error && !locked && (
            <Text style={s.hint}>Demo PIN: 1234</Text>
          )}

          {/* Keypad */}
          <View style={s.keypad}>
            {KEYS.map((row, ri) => (
              <View key={ri} style={s.keyRow}>
                {row.map((key, ki) => {
                  if (key === null) return <View key={ki} style={s.keyEmpty} />;
                  if (key === 'del') return (
                    <TouchableOpacity key={ki} style={s.keyBtn} onPress={handleDelete} activeOpacity={0.6}>
                      <Ionicons name="backspace-outline" size={22} color={C.text} />
                    </TouchableOpacity>
                  );
                  return (
                    <TouchableOpacity
                      key={ki}
                      style={[s.keyBtn, locked && s.keyDisabled]}
                      onPress={() => handlePress(key)}
                      activeOpacity={0.6}
                      disabled={locked}
                    >
                      <Text style={s.keyTxt}>{key}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Cancel */}
          <TouchableOpacity style={s.cancelBtn} onPress={() => { setPin(''); setError(''); onCancel(); }}>
            <Text style={s.cancelTxt}>Cancel</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(28,20,16,0.6)', justifyContent: 'flex-end' },
  sheet:   { backgroundColor: C.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingBottom: 36, paddingTop: 12 },
  handle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 20 },

  header:     { alignItems: 'center', marginBottom: 28 },
  lockIconBg: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title:      { fontSize: 18, fontFamily: F.bold, color: C.text, marginBottom: 6 },
  subtitle:   { fontSize: 13, fontFamily: F.regular, color: C.muted, textAlign: 'center' },

  dotsRow:   { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 12 },
  dot:       { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: C.border, backgroundColor: 'transparent' },
  dotFilled: { backgroundColor: C.primary, borderColor: C.primary },

  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 8 },
  errorTxt: { fontSize: 12, fontFamily: F.medium, color: C.debit, textAlign: 'center' },
  hint:     { fontSize: 12, fontFamily: F.regular, color: C.muted, textAlign: 'center', marginBottom: 8 },

  keypad:      { marginTop: 16 },
  keyRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  keyBtn:      { flex: 1, height: 58, marginHorizontal: 6, borderRadius: 16, backgroundColor: C.inputBg, alignItems: 'center', justifyContent: 'center' },
  keyDisabled: { opacity: 0.35 },
  keyEmpty:    { flex: 1, marginHorizontal: 6 },
  keyTxt:      { fontSize: 22, fontFamily: F.semiBold, color: C.text },

  cancelBtn: { marginTop: 16, alignItems: 'center', paddingVertical: 10 },
  cancelTxt: { fontSize: 14, fontFamily: F.semiBold, color: C.muted },
});
