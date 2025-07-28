// screens/SearchScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ScrollView, TextInput, Keyboard, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import debounce from 'lodash.debounce';

import { getWeatherAndForecast } from '../services/weatherService';
import { findCities } from '../services/geoDBService';
import { WeatherDetails, SunriseSunset, ForecastBlock } from '../components/WeatherComponents';
import { addFavorite, removeFavorite, isFavorite } from '../services/firestoreService';

export default function SearchScreen({ navigation }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (weatherData) {
        const locationData = { name: weatherData.name, lat: weatherData.current.coord.lat, lon: weatherData.current.coord.lon };
        setIsFav(await isFavorite(locationData));
      }
    };
    checkIfFavorite();
  }, [weatherData]);

  const handleSearch = async (suggestion) => {
    Keyboard.dismiss();
    setLoading(true);
    setSuggestions([]);
    setSearchTerm(`${suggestion.city}, ${suggestion.countryCode}`);
    setWeatherData(null);
    try {
      const data = await getWeatherAndForecast({ type: 'city', payload: { city: suggestion.city, countryCode: suggestion.countryCode } });
      setWeatherData(data);
    } catch (error) {
      Alert.alert("Erro na Busca", error.message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFindCities = useCallback(
    debounce(async (text) => {
      if (text.length >= 3) {
        setLoadingSuggestions(true);
        setSuggestions(await findCities(text));
        setLoadingSuggestions(false);
      } else {
        setSuggestions([]);
      }
    }, 400),
    []
  );

  useEffect(() => {
    debouncedFindCities(searchTerm);
  }, [searchTerm, debouncedFindCities]);

  const handleToggleFavorite = async () => {
    if (!weatherData) return;
    const locationData = { name: weatherData.name, lat: weatherData.current.coord.lat, lon: weatherData.current.coord.lon };
    try {
      if (isFav) {
        await removeFavorite(locationData);
      } else {
        await addFavorite(locationData);
      }
      setIsFav(!isFav);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível alterar o status de favorito.");
    }
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity style={searchStyles.suggestionItem} onPress={() => handleSearch(item)}>
      <Text style={searchStyles.suggestionText}>{item.city}, {item.country}</Text>
    </TouchableOpacity>
  );

  const renderResults = () => {
    if (loading) return <ActivityIndicator size="large" color="white" style={{ marginTop: 50 }} />;
    if (weatherData) {
      const { current, daily, name } = weatherData;
      return (
        <ScrollView contentContainerStyle={searchStyles.scrollContent}>
          <View style={searchStyles.resultHeader}>
            <Text style={searchStyles.resultCityName}>{name}</Text>
            <TouchableOpacity onPress={handleToggleFavorite}>
              <MaterialCommunityIcons name={isFav ? "star" : "star-outline"} size={32} color={isFav ? "#FFD700" : "white"} />
            </TouchableOpacity>
          </View>
          <WeatherDetails humidity={current.humidity} clouds={current.clouds} windSpeed={current.speed} />
          <SunriseSunset sunrise={current.sunrise} sunset={current.sunset} />
          <ForecastBlock dailyData={daily} />
          <View style={searchStyles.mapContainer}>
            <MapView style={searchStyles.map} initialRegion={{ latitude: current.coord.lat, longitude: current.coord.lon, latitudeDelta: 0.5, longitudeDelta: 0.5 }} scrollEnabled={false} zoomEnabled={false}>
              <Marker coordinate={{ latitude: current.coord.lat, longitude: current.coord.lon }} />
            </MapView>
          </View>
        </ScrollView>
      );
    }
    return (
      <View style={searchStyles.placeholderContainer}>
        <MaterialCommunityIcons name="map-search-outline" size={80} color="rgba(255,255,255,0.3)" />
        <Text style={searchStyles.placeholderText}>Encontre o clima de qualquer cidade do mundo.</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#141E30', '#243B55']} style={searchStyles.container}>
      <SafeAreaView style={searchStyles.safeArea}>
        <View style={searchStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}><MaterialCommunityIcons name="arrow-left" size={30} color="white" /></TouchableOpacity>
          <Text style={searchStyles.headerTitle}>Buscar Localidade</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={searchStyles.searchSection}>
          <View style={searchStyles.searchContainer}>
            <TextInput style={searchStyles.input} placeholder="Comece a digitar uma cidade..." placeholderTextColor="rgba(255,255,255,0.5)" value={searchTerm} onChangeText={setSearchTerm} />
            {loadingSuggestions && <ActivityIndicator size="small" color="white" />}
          </View>
          {suggestions.length > 0 && (
            <FlatList data={suggestions} renderItem={renderSuggestionItem} keyExtractor={(item) => item.id.toString()} style={searchStyles.suggestionsList} />
          )}
        </View>
        <View style={searchStyles.resultsContainer}>{renderResults()}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const searchStyles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, alignItems: 'center', backgroundColor: 'transparent' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 20, paddingTop: 10, zIndex: 10 },
  headerTitle: { fontSize: 22, color: 'white', fontWeight: 'bold' },
  searchSection: { width: '90%', zIndex: 100 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 15, marginTop: 10, paddingHorizontal: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', },
  input: { flex: 1, height: 50, color: 'white', fontSize: 16, },
  suggestionsList: { maxHeight: 200, backgroundColor: '#243B55', borderRadius: 10, marginTop: 2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  suggestionItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  suggestionText: { color: 'white', fontSize: 16 },
  resultsContainer: { flex: 1, width: '100%', marginTop: 10 },
  scrollContent: { alignItems: 'center', paddingBottom: 20 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  resultCityName: { fontSize: 32, color: 'white', fontWeight: 'bold', marginRight: 15 },
  mapContainer: { width: '90%', height: 200, borderRadius: 20, overflow: 'hidden', marginTop: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', },
  map: { ...StyleSheet.absoluteFillObject, },
  placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  placeholderText: { color: 'rgba(255,255,255,0.5)', fontSize: 18, textAlign: 'center', marginTop: 20 },
});