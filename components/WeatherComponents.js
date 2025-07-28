// components/WeatherComponents.js
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// --- Componente para Detalhes (Liquid Glass) ---
export const WeatherDetails = ({ humidity, clouds, windSpeed }) => (
  <View style={detailsStyles.container}>
    <BlurView intensity={70} tint="light" style={detailsStyles.detailCard}>
      <MaterialCommunityIcons name="water-percent" size={28} color="#81D4FA" />
      <Text style={detailsStyles.value}>{humidity}%</Text>
      <Text style={detailsStyles.label}>Umidade</Text>
    </BlurView>
    <BlurView intensity={70} tint="light" style={detailsStyles.detailCard}>
      <MaterialCommunityIcons name="cloud-outline" size={28} color="#B0BEC5" />
      <Text style={detailsStyles.value}>{clouds}%</Text>
      <Text style={detailsStyles.label}>Nuvens</Text>
    </BlurView>
    <BlurView intensity={70} tint="light" style={detailsStyles.detailCard}>
      <MaterialCommunityIcons name="weather-windy" size={28} color="#FFF176" />
      <Text style={detailsStyles.value}>{Math.round(windSpeed * 3.6)}</Text>
      <Text style={detailsStyles.label}>km/h</Text>
    </BlurView>
  </View>
);

// --- Componente para Nascer e Pôr do Sol (Liquid Glass) ---
export const SunriseSunset = ({ sunrise, sunset }) => {
  const formatTime = (timestamp) => new Date(timestamp * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return (
    <BlurView style={sunStyles.container} intensity={70} tint="light">
        <View style={sunStyles.sunItem}>
            <MaterialCommunityIcons name="weather-sunset-up" size={32} color="#FFD54F" />
            <Text style={sunStyles.label}>Nascer do Sol</Text>
            <Text style={sunStyles.time}>{formatTime(sunrise)}</Text>
        </View>
        <View style={sunStyles.divider} />
        <View style={sunStyles.sunItem}>
            <MaterialCommunityIcons name="weather-sunset-down" size={32} color="#FF8A65" />
            <Text style={sunStyles.label}>Pôr do Sol</Text>
            <Text style={sunStyles.time}>{formatTime(sunset)}</Text>
        </View>
    </BlurView>
  );
};

// --- Componente para o Bloco de Previsão Semanal (Liquid Glass) ---
export const ForecastBlock = ({ dailyData }) => {
  const getDayOfWeek = (timestamp) => new Date(timestamp * 1000).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  return (
    <BlurView style={forecastStyles.container} intensity={70} tint="light">
        <Text style={forecastStyles.title}>Previsão Semanal</Text>
        {dailyData.slice(1, 6).map((day, index) => (
          <View key={index} style={forecastStyles.dayRow}>
            <Text style={forecastStyles.dayText}>{getDayOfWeek(day.dt)}</Text>
            <View style={forecastStyles.rainContainer}>
              <MaterialCommunityIcons name="weather-pouring" size={18} color="#90CAF9" />
              <Text style={forecastStyles.rainText}>{Math.round(day.pop * 100)}%</Text>
            </View>
            <View style={forecastStyles.tempContainer}>
              <Text style={forecastStyles.tempText}>{Math.round(day.temp.min)}°</Text>
              <LinearGradient colors={['#FFB74D', '#FF7043']} style={forecastStyles.tempBar} start={{x: 0, y: 0}} end={{x: 1, y: 0}} />
              <Text style={forecastStyles.tempText}>{Math.round(day.temp.max)}°</Text>
            </View>
          </View>
        ))}
    </BlurView>
  );
};

// --- Função de Ícone (mantida) ---
export const getWeatherIcon = (iconName) => {
  switch (iconName) {
    case 'Clear': return 'weather-sunny'; case 'Clouds': return 'weather-cloudy'; case 'Rain': return 'weather-rainy';
    case 'Drizzle': return 'weather-partly-rainy'; case 'Thunderstorm': return 'weather-lightning'; case 'Snow': return 'weather-snowy';
    default: return 'weather-fog';
  }
};

// --- ESTILOS "LIQUID GLASS" ---
const detailsStyles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginTop: 25, },
  detailCard: { flex: 1, marginHorizontal: 5, borderRadius: 20, overflow: 'hidden', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  value: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 8, },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4, textTransform: 'uppercase' },
});

const sunStyles = StyleSheet.create({
  container: { width: '90%', borderRadius: 20, overflow: 'hidden', marginTop: 25, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'},
  sunItem: { alignItems: 'center' },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 8, },
  time: { color: 'white', fontSize: 20, fontWeight: 'bold', },
  divider: { width: 1, height: '80%', backgroundColor: 'rgba(255,255,255,0.2)' },
});

const forecastStyles = StyleSheet.create({
  container: { width: '90%', borderRadius: 20, overflow: 'hidden', marginTop: 25, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  title: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  dayRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  dayText: { color: 'white', fontSize: 16, fontWeight: '600', width: 60, textTransform: 'capitalize' },
  rainContainer: { flexDirection: 'row', alignItems: 'center', width: 70, },
  rainText: { color: '#90CAF9', fontSize: 14, marginLeft: 5 },
  tempContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tempText: { color: 'white', fontSize: 16, fontWeight: '500' },
  tempBar: { flex: 1, height: 6, borderRadius: 3, marginHorizontal: 10 },
});
