// firebase/config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Importações atualizadas para persistência de autenticação no React Native
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// A configuração agora é lida de forma segura a partir do arquivo .env
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Inicializa o Firebase App
const app = initializeApp(firebaseConfig);

// Inicializa o Firebase Auth com persistência local
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Exporta os serviços para serem usados no resto do app
export { auth };
export const db = getFirestore(app);
