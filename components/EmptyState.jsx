import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function EmptyState({ icon = 'document-outline', title, subtitle }) {
  const { C, F } = useTheme();
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={52} color={C.muted} style={{ marginBottom: 14 }} />
      <Text style={[styles.title, { color: C.text, fontFamily: F.semiBold }]}>{title}</Text>
      {subtitle ? <Text style={[styles.sub, { color: C.muted, fontFamily: F.regular }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 64, paddingHorizontal: 32 },
  title:     { fontSize: 17, marginBottom: 6, textAlign: 'center' },
  sub:       { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
