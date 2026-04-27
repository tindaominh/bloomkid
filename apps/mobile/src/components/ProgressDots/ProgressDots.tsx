import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          testID={`progress-dot-${i}`}
          style={[styles.dot, { opacity: i === current ? 1 : 0.3 }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF6B35' },
});
