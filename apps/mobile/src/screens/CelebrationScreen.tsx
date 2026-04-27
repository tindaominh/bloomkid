import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export function CelebrationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text testID="celebration-message" style={styles.message}>
        🎉 Great job!
      </Text>
      <TouchableOpacity
        testID="play-again-btn"
        style={styles.btn}
        onPress={() => router.replace('/')}
        accessibilityRole="button"
      >
        <Text style={styles.btnLabel}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32 },
  message: { fontSize: 48, fontWeight: '800' },
  btn: { minHeight: 56, justifyContent: 'center', paddingHorizontal: 40, backgroundColor: '#FF6B35', borderRadius: 28 },
  btnLabel: { fontSize: 20, fontWeight: '700', color: '#fff' },
});
