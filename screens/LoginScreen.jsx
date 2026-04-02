import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Animated,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { BANK, USER } from '../data';

export default function LoginScreen({ onLogin }) {
  const { C, F } = useTheme();
  const s = makeStyles(C, F);

  const [username,   setUsername]   = useState('');
  const [password,   setPassword]   = useState('');
  const [showPwd,    setShowPwd]    = useState(false);
  const [errors,     setErrors]     = useState({});
  const [loading,    setLoading]    = useState(false);
  const [showHint,   setShowHint]   = useState(false);

  const spinAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 2600, useNativeDriver: true })
    ).start();
  }, []);
  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const validate = () => {
    const e = {};
    if (!username.trim()) e.username = 'Username is required';
    if (!password)        e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (username.trim() === USER.username && password === USER.password) {
        onLogin();
      } else {
        setErrors({ general: 'Invalid username or password. Please try again.' });
      }
    }, 900);
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={s.logoArea}>
            <View style={s.logoWrapper}>
              <Animated.View style={[s.arcRing, { transform: [{ rotate: spin }] }]} />
              <Animated.View style={[s.arcRingFaint, { transform: [{ rotate: spin }] }]} />
              <View style={s.logoCircle}>
                <Text style={s.logoLetters}>{BANK.shortName}</Text>
              </View>
            </View>
            <Text style={s.brandName}>{BANK.name}</Text>
            <Text style={s.brandTagline}>{BANK.tagline}</Text>
          </View>

          <Text style={s.welcomeTitle}>Welcome Back</Text>
          <Text style={s.welcomeSub}>Sign in to continue</Text>

          {/* Form card */}
          <View style={s.card}>
            {errors.general ? (
              <View style={s.errorBanner}>
                <Ionicons name="alert-circle-outline" size={16} color={C.debit} />
                <Text style={s.errorBannerTxt}>{errors.general}</Text>
              </View>
            ) : null}

            <Text style={s.label}>Username</Text>
            <TextInput
              style={[s.input, errors.username && s.inputError]}
              placeholder="Enter your username"
              placeholderTextColor={C.muted}
              value={username}
              onChangeText={v => { setUsername(v); setErrors(e => ({ ...e, username: null, general: null })); }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.username ? <Text style={s.fieldErr}>{errors.username}</Text> : null}

            <View style={s.pwdLabelRow}>
              <Text style={s.label}>Password</Text>
              <TouchableOpacity>
                <Text style={s.forgotTxt}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={[s.pwdRow, errors.password && s.inputError]}>
              <TextInput
                style={s.pwdInput}
                placeholder="Enter your password"
                placeholderTextColor={C.muted}
                value={password}
                onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: null, general: null })); }}
                secureTextEntry={!showPwd}
              />
              <TouchableOpacity onPress={() => setShowPwd(!showPwd)} style={s.eyeBtn}>
                <Ionicons name={showPwd ? 'eye' : 'eye-off'} size={20} color={C.muted} />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={s.fieldErr}>{errors.password}</Text> : null}

            <TouchableOpacity style={[s.loginBtn, loading && { opacity: 0.7 }]} onPress={handleLogin} activeOpacity={0.85} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.loginBtnTxt}>Login</Text>}
            </TouchableOpacity>

            <View style={s.dividerRow}>
              <View style={s.dividerLine} />
              <Text style={s.dividerTxt}>or</Text>
              <View style={s.dividerLine} />
            </View>

            <TouchableOpacity style={s.bioBtn}>
              <Ionicons name="finger-print" size={24} color={C.primary} />
              <Text style={s.bioTxt}>Login with Biometrics</Text>
            </TouchableOpacity>
          </View>

          {/* Sign up + hidden ? hint */}
          <View style={s.bottomRow}>
            <View style={s.signupRow}>
              <Text style={s.signupTxt}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={s.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={s.hintTrigger} onPress={() => setShowHint(true)}>
              <Text style={s.hintTriggerTxt}>?</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Demo credentials modal — hidden behind ? */}
      <Modal visible={showHint} transparent animationType="fade">
        <TouchableOpacity style={s.hintOverlay} activeOpacity={1} onPress={() => setShowHint(false)}>
          <View style={s.hintCard}>
            <Text style={s.hintTitle}>Demo Credentials</Text>
            <View style={s.hintRow}>
              <Text style={s.hintKey}>Username</Text>
              <Text style={s.hintVal}>{USER.username}</Text>
            </View>
            <View style={s.hintRow}>
              <Text style={s.hintKey}>Password</Text>
              <Text style={s.hintVal}>{USER.password}</Text>
            </View>
            <Text style={s.hintDismiss}>Tap anywhere to close</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  safe:   { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },

  logoArea:      { alignItems: 'center', marginTop: 44, marginBottom: 28 },
  logoWrapper:   { width: 96, height: 96, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  arcRing:       { position: 'absolute', width: 96, height: 96, borderRadius: 48, borderWidth: 2.5, borderColor: 'transparent', borderTopColor: C.accent, borderRightColor: C.accent },
  arcRingFaint:  { position: 'absolute', width: 96, height: 96, borderRadius: 48, borderWidth: 1.5, borderColor: 'transparent', borderBottomColor: C.accent, opacity: 0.3 },
  logoCircle:    { width: 76, height: 76, borderRadius: 38, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 8 },
  logoLetters:   { color: '#fff', fontSize: 24, fontFamily: F.extraBold, letterSpacing: 1 },
  brandName:   { fontSize: 20, fontFamily: F.bold, color: C.text, letterSpacing: 0.3 },
  brandTagline:{ fontSize: 10, fontFamily: F.medium, color: C.accent, letterSpacing: 3, marginTop: 3 },

  welcomeTitle: { fontSize: 24, fontFamily: F.bold, color: C.text, textAlign: 'center', marginBottom: 6 },
  welcomeSub:   { fontSize: 14, fontFamily: F.regular, color: C.muted, textAlign: 'center', marginBottom: 24 },

  card: { backgroundColor: C.surface, borderRadius: 24, padding: 22, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 5 },

  errorBanner:    { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.debitDim, borderRadius: 12, padding: 12, marginBottom: 16 },
  errorBannerTxt: { flex: 1, fontSize: 13, fontFamily: F.medium, color: C.debit },

  label:      { fontSize: 13, fontFamily: F.semiBold, color: C.text, marginBottom: 8 },
  input:      { backgroundColor: C.inputBg, borderRadius: 13, paddingHorizontal: 16, paddingVertical: 13, fontSize: 14, fontFamily: F.regular, color: C.text, borderWidth: 1.5, borderColor: 'transparent' },
  inputError: { borderColor: C.debit },
  fieldErr:   { fontSize: 12, fontFamily: F.regular, color: C.debit, marginTop: 5, marginBottom: 2 },

  pwdLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 8 },
  forgotTxt:   { fontSize: 13, fontFamily: F.semiBold, color: C.accent },
  pwdRow:      { flexDirection: 'row', alignItems: 'center', backgroundColor: C.inputBg, borderRadius: 13, paddingRight: 12, borderWidth: 1.5, borderColor: 'transparent' },
  pwdInput:    { flex: 1, paddingHorizontal: 16, paddingVertical: 13, fontSize: 14, fontFamily: F.regular, color: C.text },
  eyeBtn:      { padding: 6 },

  loginBtn:    { alignSelf: 'center', marginTop: 24, paddingVertical: 14, paddingHorizontal: 52, backgroundColor: C.primary, borderRadius: 30, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  loginBtnTxt: { color: '#fff', fontSize: 15, fontFamily: F.bold, letterSpacing: 0.3 },

  dividerRow:  { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  dividerTxt:  { fontSize: 12, fontFamily: F.regular, color: C.muted, marginHorizontal: 14 },

  bioBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1.5, borderColor: C.primaryDim, borderRadius: 30, paddingVertical: 13 },
  bioTxt: { fontSize: 14, fontFamily: F.semiBold, color: C.primary },

  bottomRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  signupRow:   { flexDirection: 'row', alignItems: 'center' },
  signupTxt:   { fontSize: 14, fontFamily: F.regular, color: C.muted },
  signupLink:  { fontSize: 14, fontFamily: F.bold, color: C.accent },

  hintTrigger:    { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  hintTriggerTxt: { fontSize: 13, fontFamily: F.bold, color: C.muted },

  hintOverlay: { flex: 1, backgroundColor: 'rgba(28,20,16,0.5)', justifyContent: 'center', alignItems: 'center' },
  hintCard:    { backgroundColor: C.surface, borderRadius: 20, padding: 24, width: '78%', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  hintTitle:   { fontSize: 16, fontFamily: F.bold, color: C.text, marginBottom: 16 },
  hintRow:     { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  hintKey:     { fontSize: 13, fontFamily: F.regular, color: C.muted },
  hintVal:     { fontSize: 13, fontFamily: F.semiBold, color: C.text },
  hintDismiss: { fontSize: 12, fontFamily: F.regular, color: C.muted, textAlign: 'center', marginTop: 16 },
});
