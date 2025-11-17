import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../../environments/environment';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    lastname: '',
    username: '',
    email: '',
    birthDate: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${baseUrl}/auth/signup`, form);

      // Save JWT token
      if (res.data.token) {
        await AsyncStorage.setItem('token', res.data.token);
      }

      setMessage('Registration successful!');

      // Navigate to home after 1 second
      setTimeout(() => {
        navigation.replace('Main');
      }, 1000);
    } catch (error) {
      console.log('Register Error:', error);
      setMessage('Registration failed.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>

          {message ? (
            <Text
              style={[
                styles.messageText,
                message.includes('successful') ? styles.successText : styles.errorText,
              ]}
            >
              {message}
            </Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={form.name}
            onChangeText={(value) => handleChange('name', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={form.lastname}
            onChangeText={(value) => handleChange('lastname', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={form.username}
            onChangeText={(value) => handleChange('username', value)}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={form.email}
            onChangeText={(value) => handleChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Birth Date (YYYY-MM-DD)"
            value={form.birthDate}
            onChangeText={(value) => handleChange('birthDate', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  messageText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  successText: {
    color: '#34C759',
  },
  errorText: {
    color: '#ff3b30',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

export default RegisterScreen;

