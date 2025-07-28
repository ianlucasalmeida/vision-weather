// services/firestoreService.js
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

// Função auxiliar para obter a referência do documento de favoritos do usuário
const getFavoritesRef = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Usuário não autenticado.");
  return doc(db, 'users', userId); // Usando uma coleção 'users' para melhor organização
};

// Adiciona um local aos favoritos
export const addFavorite = async (location) => {
  try {
    const favoritesRef = getFavoritesRef();
    await updateDoc(favoritesRef, {
      favorites: arrayUnion(location)
    }).catch(async (error) => {
      if (error.code === 'not-found' || error.message.includes('No document to update')) {
        await setDoc(favoritesRef, { favorites: [location] }, { merge: true });
      } else {
        throw error;
      }
    });
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error.code);
    if (error.code === 'unavailable') {
      throw new Error("Não foi possível adicionar o favorito. Verifique sua conexão com a internet.");
    }
    throw new Error("Ocorreu um erro inesperado ao salvar o favorito.");
  }
};

// Remove um local dos favoritos
export const removeFavorite = async (location) => {
  try {
    const favoritesRef = getFavoritesRef();
    await updateDoc(favoritesRef, {
      favorites: arrayRemove(location)
    });
  } catch (error) {
    console.error("Erro ao remover favorito:", error.code);
    if (error.code === 'unavailable') {
      throw new Error("Não foi possível remover o favorito. Verifique sua conexão com a internet.");
    }
    throw new Error("Ocorreu um erro inesperado ao remover o favorito.");
  }
};

// Obtém a lista de todos os favoritos
export const getFavorites = async () => {
  try {
    const favoritesRef = getFavoritesRef();
    const docSnap = await getDoc(favoritesRef);
    if (docSnap.exists() && docSnap.data().favorites) {
      return docSnap.data().favorites;
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error.code);
    if (error.code === 'unavailable') {
      throw new Error("Não foi possível carregar os favoritos. Verifique sua conexão com a internet.");
    }
    throw new Error("Ocorreu um erro inesperado ao buscar os favoritos.");
  }
};

// Verifica se um local específico já é um favorito
export const isFavorite = async (location) => {
    try {
        const favorites = await getFavorites();
        return favorites.some(fav => fav.name === location.name);
    } catch (error) {
        // Se não for possível buscar, assume que não é favorito para evitar erros na UI
        console.error("Erro ao verificar favorito, assumindo 'false':", error.message);
        return false;
    }
};
