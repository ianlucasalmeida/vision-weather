// screens/RegisterScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (email !== '' && password !== '') {
      createUserWithEmailAndPassword(auth, email, password)
        .catch(error => Alert.alert('Erro no Cadastro', error.message));
    } else {
      Alert.alert('Campos Vazios', 'Por favor, preencha e-mail e senha.');
    }
  };

  return (
    <LinearGradient colors={['#192f6a', '#3b5998', '#4c669f']} style={styles.container}>
      <Text style={styles.title}>Crie sua Conta</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha (mínimo 6 caracteres)"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Já tem uma conta? Faça o login</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 32, color: 'white', fontWeight: 'bold', marginBottom: 40 },
    input: { width: '100%', height: 50, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingHorizontal: 15, color: 'white', marginBottom: 15, fontSize: 16 },
    button: { width: '100%', height: 50, backgroundColor: '#f9a8d4', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#192f6a', fontSize: 18, fontWeight: 'bold' },
    linkText: { color: 'white', marginTop: 20 }
});
