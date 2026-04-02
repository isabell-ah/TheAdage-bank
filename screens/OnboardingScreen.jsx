import React, { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, Dimensions, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { BANK } from '../data';

const { width } = Dimensions.get('window');

const SLIDES = [
  { id: '1', icon: 'shield-checkmark', title: `Bank with ${BANK.name}`,  subtitle: 'Your money is protected with industry-leading 256-bit encryption and real-time fraud monitoring.' },
  { id: '2', icon: 'swap-horizontal',   title: 'Send Money Instantly',    subtitle: 'Transfer funds to anyone, anywhere in seconds. No hidden fees, no delays.' },
  { id: '3', icon: 'bar-chart',         title: 'Track Every Shilling',    subtitle: 'Smart insights on your spending habits. Stay in control of your financial life.' },
];

export default function OnboardingScreen({ onDone }) {
  const { C, F } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef(null);

  const goNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex(activeIndex + 1);
    } else {
      onDone();
    }
  };

  const styles = makeStyles(C, F);
  return (
    <SafeAreaView style={styles.safe}>
      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={onDone}>
        <Text style={styles.skipTxt}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.id}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={72} color={C.primary} />
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideSub}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Bottom */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.nextBtn} onPress={goNext}>
          <Text style={styles.nextTxt}>
            {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  safe:       { flex: 1, backgroundColor: C.bg },
  skipBtn: { alignSelf: 'flex-end', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  skipTxt: { fontFamily: F.semiBold, fontSize: 14, color: C.muted },
  slide: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 36, paddingBottom: 40,
  },
  iconCircle: { width: 160, height: 160, borderRadius: 80, backgroundColor: C.primaryDim, alignItems: 'center', justifyContent: 'center', marginBottom: 40, shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 6 },
  slideTitle: {
    fontFamily: F.extraBold, fontSize: 26, color: C.text,
    textAlign: 'center', marginBottom: 16, lineHeight: 34,
  },
  slideSub: {
    fontFamily: F.regular, fontSize: 15, color: C.muted,
    textAlign: 'center', lineHeight: 24,
  },
  bottom: { paddingHorizontal: 24, paddingBottom: 32 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 28 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.border },
  dotActive: { width: 24, backgroundColor: C.primary },
  nextBtn: {
    flexDirection: 'row', backgroundColor: C.primary, borderRadius: 30,
    paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  nextTxt: { fontFamily: F.bold, fontSize: 16, color: '#fff' },
});
