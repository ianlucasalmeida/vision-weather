// screens/SettingsScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  return (
    <LinearGradient colors={['#141E30', '#243B55']} style={settingsStyles.container}>
        <SafeAreaView style={settingsStyles.safeArea}>
            <View style={settingsStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={30} color="white" /></TouchableOpacity>
                <Text style={settingsStyles.title}>Configurações</Text>
                <View style={{width: 30}}/>
            </View>
            <View style={settingsStyles.content}>
                <Text style={settingsStyles.subtitle}>Em breve, as opções da sua conta estarão aqui.</Text>
            </View>
        </SafeAreaView>
    </LinearGradient>
  );
}

const settingsStyles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%', backgroundColor: 'transparent' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 20 },
  title: { fontSize: 22, color: 'white', fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 10 },
});