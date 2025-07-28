// screens/FavoritesScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getFavorites, removeFavorite } from '../services/firestoreService';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      setFavorites(await getFavorites());
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os favoritos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) { fetchFavorites(); }
  }, [isFocused]);

  const handleRemoveFavorite = async (location) => {
    await removeFavorite(location);
    fetchFavorites();
  };

  return (
    <LinearGradient colors={['#141E30', '#243B55']} style={favStyles.container}>
      <SafeAreaView style={favStyles.safeArea}>
        <View style={favStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={30} color="white" /></TouchableOpacity>
          <Text style={favStyles.title}>Cidades Favoritas</Text>
          <View style={{ width: 30 }} />
        </View>
        {loading ? <ActivityIndicator size="large" color="white" /> : (
          <FlatList
            data={favorites}
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity style={favStyles.item} onPress={() => navigation.navigate('Search', { city: item.name })}>
                <Text style={favStyles.itemText}>{item.name}</Text>
                <TouchableOpacity onPress={() => handleRemoveFavorite(item)}>
                  <MaterialCommunityIcons name="star-remove" size={24} color="#f44336" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={favStyles.emptyText}>Você ainda não tem favoritos.</Text>}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const favStyles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%', backgroundColor: 'transparent' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 20 },
  title: { fontSize: 22, color: 'white', fontWeight: 'bold' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: 20, borderRadius: 10, marginBottom: 10 },
  itemText: { color: 'white', fontSize: 18 },
  emptyText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 50, fontSize: 16 }
});