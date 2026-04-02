import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from '../theme';
import { hapticLight } from '../utils/haptics';

const { width } = Dimensions.get('window');
const FRAME = width * 0.65;

export default function ScanQRScreen({ navigation }) {
  const scanLine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, { toValue: FRAME - 4, duration: 1800, useNativeDriver: true }),
        Animated.timing(scanLine, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { hapticLight(); navigation.goBack(); }} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <TouchableOpacity style={styles.flashBtn}>
          <Ionicons name="flash-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Camera area */}
      <View style={styles.cameraArea}>
        {/* Dim overlay corners */}
        <View style={styles.overlay}>
          {/* Frame */}
          <View style={styles.frame}>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            {/* Scan line */}
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLine }] }]} />
          </View>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.bottom}>
        <Text style={styles.instruction}>Point your camera at a QR code</Text>
        <Text style={styles.subInstruction}>The QR code will be scanned automatically</Text>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.orTxt}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.manualBtn}
          onPress={() => { hapticLight(); navigation.navigate('SendMoney'); }}
        >
          <Ionicons name="keypad-outline" size={18} color={C.primary} style={{ marginRight: 8 }} />
          <Text style={styles.manualTxt}>Enter details manually</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const CORNER = 24;
const BORDER = 3;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  flashBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: F.bold, fontSize: 18, color: '#fff' },
  cameraArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overlay: { width: FRAME, height: FRAME, position: 'relative' },
  frame: { width: FRAME, height: FRAME, overflow: 'hidden' },
  corner: { position: 'absolute', width: CORNER, height: CORNER },
  cornerTL: { top: 0, left: 0, borderTopWidth: BORDER, borderLeftWidth: BORDER, borderColor: C.primary, borderTopLeftRadius: 8 },
  cornerTR: { top: 0, right: 0, borderTopWidth: BORDER, borderRightWidth: BORDER, borderColor: C.primary, borderTopRightRadius: 8 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: BORDER, borderLeftWidth: BORDER, borderColor: C.primary, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: BORDER, borderRightWidth: BORDER, borderColor: C.primary, borderBottomRightRadius: 8 },
  scanLine: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: C.primary, opacity: 0.9 },
  bottom: {
    backgroundColor: C.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingTop: 28, paddingBottom: 40, alignItems: 'center',
  },
  instruction: { fontFamily: F.bold, fontSize: 17, color: C.text, marginBottom: 6 },
  subInstruction: { fontFamily: F.regular, fontSize: 13, color: C.muted, marginBottom: 24 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
  orTxt: { fontFamily: F.regular, fontSize: 13, color: C.muted, paddingHorizontal: 12 },
  manualBtn: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: C.primary,
    borderRadius: 30, paddingVertical: 14, paddingHorizontal: 28,
  },
  manualTxt: { fontFamily: F.bold, fontSize: 14, color: C.primary },
});
