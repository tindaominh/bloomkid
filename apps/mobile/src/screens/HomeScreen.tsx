import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CategoryTile } from '../components/CategoryTile/CategoryTile';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/lessons/categories`)
      .then((r) => r.json())
      .then((data: string[]) => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator testID="home-loading" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        numColumns={2}
        renderItem={({ item }) => (
          <CategoryTile
            category={item}
            onPress={(cat) =>
              router.push({ pathname: '/flashcard', params: { category: cat } })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
