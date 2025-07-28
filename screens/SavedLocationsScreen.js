// screens/SavedLocationsScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SavedLocationsScreen() {
  return (
    <LinearGradient colors={['#4c669f', '#3b5998']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Localidades Salvas</Text>
        <Text style={styles.subtitle}>Em breve, suas cidades favoritas aparecerão aqui.</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, color: 'white', fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: 'white', marginTop: 10 },
});
