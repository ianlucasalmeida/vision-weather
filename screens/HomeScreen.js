// screens/HomeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, StatusBar, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import { getWeatherAndForecast } from '../services/weatherService';
import { WeatherDetails, SunriseSunset, ForecastBlock, getWeatherIcon } from '../components/WeatherComponents';
import { getDynamicTheme } from '../utils/theme';

export default function HomeScreen({ navigation }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [theme, setTheme] = useState(['#3C4A5C', '#242D39']);

  const fetchInitialWeather = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão negada", "Não é possível obter o clima sem acesso à localização.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const data = await getWeatherAndForecast({ type: 'coords', payload: location.coords });
      setWeatherData(data);
      setTheme(getDynamicTheme(data.current.main));
    } catch (error) {
      Alert.alert("Erro ao Carregar", "Não foi possível buscar os dados do tempo. Tente novamente.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInitialWeather();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInitialWeather();
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return <ActivityIndicator size="large" color="white" style={styles.centered} />;
    }
    if (weatherData) {
      const { current, daily, name } = weatherData;
      return (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />}
        >
          <Text style={styles.temperatureText}>{Math.round(current.temp)}°</Text>
          <MaterialCommunityIcons name={getWeatherIcon(current.main)} size={120} color="white" style={{ marginVertical: -10 }}/>
          <View style={styles.locationContainer}>
            <MaterialCommunityIcons name="map-marker-outline" size={20} color="white" />
            <Text style={styles.locationText}>{name}</Text>
          </View>
          <Text style={styles.dateText}>{new Date(current.dt * 1000).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</Text>
          <WeatherDetails humidity={current.humidity} clouds={current.clouds} windSpeed={current.speed} />
          <SunriseSunset sunrise={current.sunrise} sunset={current.sunset} />
          <ForecastBlock dailyData={daily} />
        </ScrollView>
      );
    }
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Não foi possível carregar os dados.</Text>
        <TouchableOpacity onPress={fetchInitialWeather} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient colors={theme} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}><MaterialCommunityIcons name="menu" size={30} color="white" /></TouchableOpacity>
          <Text style={styles.headerTitle}>Visão do Clima</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}><MaterialCommunityIcons name="magnify" size={30} color="white" /></TouchableOpacity>
        </View>
        <View style={styles.content}>{renderContent()}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', backgroundColor: 'transparent' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 20, paddingTop: 10 },
  headerTitle: { color: 'rgba(255,255,255,0.9)', fontSize: 22, fontWeight: 'bold' },
  content: { flex: 1, width: '100%', justifyContent: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { alignItems: 'center', paddingBottom: 20, width: '100%' },
  temperatureText: { fontSize: 90, fontWeight: '200', color: 'white', fontFamily: 'System' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  locationText: { fontSize: 22, fontWeight: '600', color: 'white', marginLeft: 5 },
  dateText: { fontSize: 16, color: '#ccc', marginTop: 5 },
  errorText: { color: '#f9a8d4', fontSize: 18, textAlign: 'center' },
  retryButton: { marginTop: 20, backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  retryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});