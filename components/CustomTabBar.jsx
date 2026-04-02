import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const TAB_CONFIG = [
  { name: 'Home',     icon: 'home',     label: 'Home' },
  { name: 'Cards',    icon: 'card',     label: 'Cards' },
  { name: 'Explore',  icon: 'compass',  label: 'Explore' },
  { name: 'Accounts', icon: 'business', label: 'Accounts' },
  { name: 'Profile',  icon: 'grid',     label: 'More' },
];

export default function CustomTabBar({ state, navigation }) {
  const { C, F } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = makeStyles(C, F);
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 10 }]}>
      {state.routes.map((route, index) => {
        const config = TAB_CONFIG[index];
        const isFocused = state.index === index;
  const isAdd = false;

        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity key={route.key} style={styles.tab} onPress={onPress}>
            {isFocused && <View style={styles.activePill} />}
            <Ionicons
              name={isFocused ? config.icon : `${config.icon}-outline`}
              size={22}
              color={isFocused ? C.primary : C.muted}
            />
            <Text style={[styles.label, { color: isFocused ? C.primary : C.muted, fontFamily: isFocused ? F.semiBold : F.regular }]}>
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const makeStyles = (C, F) => StyleSheet.create({
  container:  { flexDirection: 'row', backgroundColor: C.surface, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 10 },
  tab:        { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 4 },
  activePill: { position: 'absolute', top: -10, width: 28, height: 3, borderRadius: 2, backgroundColor: C.accent },
  label:      { fontSize: 11, marginTop: 3 },
});
