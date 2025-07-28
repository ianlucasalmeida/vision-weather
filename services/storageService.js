// services/storageService.js
// Gerencia o armazenamento local (AsyncStorage) para o histórico.

import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;

export const getSearchHistory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Erro ao ler histórico", e);
    return [];
  }
};

export const addToSearchHistory = async (location) => {
  try {
    const history = await getSearchHistory();
    // Evita duplicados, colocando o mais recente no topo
    const newHistory = [location, ...history.filter(item => item.name.toLowerCase() !== location.name.toLowerCase())];
    // Limita o histórico a 10 itens
    if (newHistory.length > MAX_HISTORY_ITEMS) {
      newHistory.pop();
    }
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.error("Erro ao salvar no histórico", e);
  }
};
