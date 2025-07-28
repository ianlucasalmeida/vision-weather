// firebase/config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Importações atualizadas para persistência de autenticação no React Native
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// A configuração do seu app Firebase que você forneceu
const firebaseConfig = {
  apiKey: "AIzaSyDFzI0m6VIJJCHTBU5qxfbJ7nXM55imQeA",
  authDomain: "vision-clima.firebaseapp.com",
  projectId: "vision-clima",
  storageBucket: "vision-clima.appspot.com",
  messagingSenderId: "503672370902",
  appId: "1:503672370902:web:2a89d386121e736dcf7b77"
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
