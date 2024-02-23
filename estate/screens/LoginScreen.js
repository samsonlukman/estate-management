// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const goToRegistration = () => {
    navigation.navigate('UserRegistrationForm'); // Replace 'Registration' with the actual name of your registration screen
  };
  const handleLogin = async () => {
    try {
      // Call the login function from the AuthContext
      await login(username, password);
      Alert.alert('Login Successful');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Registration" onPress={goToRegistration} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
