import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AudioService } from '../services/audio';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

interface CardItem {
  word: string;
  imageUrl: string;
  audioUrl: string;
}

export function FlashcardScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const audio = useRef(new AudioService()).current;
  const [items, setItems] = useState<CardItem[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/lessons/${category}`)
      .then((r) => r.json())
      .then((data: CardItem[]) => {
        setItems(data);
        setLoading(false);
      });
    return () => { audio.stop(); };
  }, [category]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator testID="flashcard-loading" size="large" />
      </View>
    );
  }

  const current = items[index];

  const handleNext = () => {
    if (index < items.length - 1) setIndex(index + 1);
    else router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID="flashcard-card"
        style={styles.card}
        onPress={() => audio.play(current.audioUrl)}
        accessibilityRole="button"
      >
        <Image source={{ uri: current.imageUrl }} style={styles.image} />
        <Text testID="flashcard-word" style={styles.word}>
          {current.word}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="flashcard-next"
        style={styles.nextBtn}
        onPress={handleNext}
        accessibilityRole="button"
      >
        <Text style={styles.nextLabel}>Next →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { width: '100%', alignItems: 'center', backgroundColor: '#fff', borderRadius: 24, padding: 24, elevation: 4 },
  image: { width: 240, height: 240, borderRadius: 12, marginBottom: 16 },
  word: { fontSize: 36, fontWeight: '700' },
  nextBtn: { marginTop: 32, minHeight: 56, justifyContent: 'center', paddingHorizontal: 32 },
  nextLabel: { fontSize: 20, fontWeight: '600' },
});
