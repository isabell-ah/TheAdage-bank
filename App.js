import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import LoginScreen from './screens/LoginScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import RootNavigator from './navigation/RootNavigator';

const KEYS = { onboarded: 'adage_onboarded', loggedIn: 'adage_loggedIn' };

function AppContent() {
  const { C, isDark } = useTheme();

  const [appReady,     setAppReady]     = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isLoggedIn,   setIsLoggedIn]   = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_300Light, Poppins_400Regular, Poppins_500Medium,
    Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold,
  });

  // Restore persisted state on mount
  useEffect(() => {
    (async () => {
      try {
        const [ob, li] = await Promise.all([
          SecureStore.getItemAsync(KEYS.onboarded),
          SecureStore.getItemAsync(KEYS.loggedIn),
        ]);
        if (ob === 'true') setHasOnboarded(true);
        if (li === 'true') setIsLoggedIn(true);
      } catch (_) {}
      setAppReady(true);
    })();
  }, []);

  const handleOnboardDone = async () => {
    await SecureStore.setItemAsync(KEYS.onboarded, 'true');
    setHasOnboarded(true);
  };

  const handleLogin = async () => {
    await SecureStore.setItemAsync(KEYS.loggedIn, 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync(KEYS.loggedIn);
    setIsLoggedIn(false);
  };

  // Show spinner until fonts + storage are ready
  if (!fontsLoaded || !appReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
        <ActivityIndicator color={C.primary} size="large" />
      </View>
    );
  }

  if (!hasOnboarded) {
    return (
      <>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <OnboardingScreen onDone={handleOnboardDone} />
      </>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        <RootNavigator onLogout={handleLogout} />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
