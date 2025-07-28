// components/CustomDrawer.js (Sidebar Refatorada)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { getWeatherAndForecast } from '../services/weatherService';

const screenIcons = {
  'Início': 'home-variant-outline',
  'Favoritos': 'star-outline',
  'Histórico': 'history',
  'Configurações': 'cog-outline'
};

export default function CustomDrawer(props) {
  const user = auth.currentUser;
  const [currentTemp, setCurrentTemp] = useState(null);

  useEffect(() => {
    const fetchTemp = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        
        let location = await Location.getCurrentPositionAsync({});
        const data = await getWeatherAndForecast({ type: 'coords', payload: location.coords });
        if (data && data.current) {
            setCurrentTemp(Math.round(data.current.temp));
        }
      } catch (error) {
        console.error("Erro ao buscar temperatura para a sidebar:", error);
      }
    };
    fetchTemp();
  }, []);

  const { state, ...rest } = props;
  const newState = { ...state };
  newState.routes = newState.routes.map(route => ({
    ...route,
    drawerIcon: ({ color, size }) => (
      <MaterialCommunityIcons name={screenIcons[route.name] || 'help-circle'} size={size} color={color} />
    ),
  }));

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#141E30', '#243B55']} style={{ flex: 1 }}>
        <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
          <LinearGradient colors={['rgba(255,255,255,0.1)', 'transparent']} start={{x:0, y:0}} end={{x:0, y:1}} style={styles.header}>
            <Image 
              source={{ uri: `https://ui-avatars.com/api/?name=${user?.email || 'U'}&background=2a5298&color=fff&size=128&bold=true` }} 
              style={styles.avatar}
            />
            <Text style={styles.userEmail} numberOfLines={1}>{user ? user.email : 'Bem-vindo'}</Text>
            <View style={styles.locationContainer}>
                <MaterialCommunityIcons name="map-marker-radius-outline" size={16} color="#ccc" />
                {currentTemp !== null ? (
                    <Text style={styles.locationText}>Sua Localização: {currentTemp}°C</Text>
                ) : (
                    <ActivityIndicator size="small" color="#ccc" />
                )}
            </View>
          </LinearGradient>
          <View style={styles.drawerItemsContainer}>
            <DrawerItemList state={newState} {...rest} />
          </View>
        </DrawerContentScrollView>
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => signOut(auth)} style={styles.logoutButton}>
            <MaterialCommunityIcons name="logout-variant" size={22} color="#FF7043" />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 20, paddingTop: 60, alignItems: 'center', marginBottom: 20 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 15, borderWidth: 3, borderColor: '#64B5F6', },
  userEmail: { color: 'white', fontSize: 18, fontWeight: '600', },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 15, paddingVertical: 8, paddingHorizontal: 15, },
  locationText: { color: '#ccc', fontSize: 13, marginLeft: 8, fontWeight: '500' },
  drawerItemsContainer: { paddingTop: 10, },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', },
  logoutButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, },
  logoutText: { color: 'white', marginLeft: 15, fontSize: 15, fontWeight: '500', }
});