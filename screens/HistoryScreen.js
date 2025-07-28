// screens/HistoryScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getSearchHistory } from '../services/storageService';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HistoryScreen({ navigation }) {
    const [history, setHistory] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            const fetchHistory = async () => {
                setHistory(await getSearchHistory());
            };
            fetchHistory();
        }
    }, [isFocused]);

    return (
        <LinearGradient colors={['#141E30', '#243B55']} style={historyStyles.container}>
            <SafeAreaView style={historyStyles.safeArea}>
                <View style={historyStyles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={30} color="white" /></TouchableOpacity>
                    <Text style={historyStyles.title}>Histórico de Busca</Text>
                    <View style={{width: 30}}/>
                </View>
                <FlatList
                    data={history}
                    style={{width: '100%'}}
                    contentContainerStyle={{paddingHorizontal: 20}}
                    keyExtractor={(item, index) => `${item.name}-${index}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={historyStyles.item} onPress={() => navigation.navigate('Search', { city: item.name })}>
                            <Text style={historyStyles.itemText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={historyStyles.emptyText}>Seu histórico está vazio.</Text>}
                />
            </SafeAreaView>
        </LinearGradient>
    );
}

const historyStyles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', width: '100%', backgroundColor: 'transparent' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 20 },
  title: { fontSize: 22, color: 'white', fontWeight: 'bold' },
  item: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 20, borderRadius: 10, marginBottom: 10 },
  itemText: { color: 'white', fontSize: 18 },
  emptyText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 50, fontSize: 16 }
});