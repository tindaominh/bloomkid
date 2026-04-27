import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CategoryTileProps {
  category: string;
  onPress: (category: string) => void;
}

export function CategoryTile({ category, onPress }: CategoryTileProps) {
  return (
    <TouchableOpacity
      testID={`category-tile-${category}`}
      style={styles.tile}
      onPress={() => onPress(category)}
      accessibilityRole="button"
    >
      <Text style={styles.label}>{category}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    minHeight: 80,
    minWidth: 80,
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
