import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../Api/AuthAPI';
import { LoginResponse } from '../types/authTypes';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../types/NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Login = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordValid = /^(?=.*[@#$])[A-Za-z0-9@#$]{6,}$/;

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError('Please fill all fields');
      } else if (!emailValid.test(email)) {
        setError('Enter a valid email');
      } else if (!passwordValid.test(password)) {
        setError('Password must be at least 6 characters long and include at least one special character.');
      } else {
        const result: LoginResponse = await loginUser(email, password);

        if (result.token) {
          await AsyncStorage.setItem('token', result.token);
          await AsyncStorage.setItem('userName', result.user.name);
          await AsyncStorage.setItem('userEmail', result.user.email);
          await AsyncStorage.setItem('userAvatar', result.user.profile_picture_url || '');
          await AsyncStorage.setItem('userRole', result.user.role || '');

          Toast.show({
            type: 'success',
            text1: 'Login Successful',
            text2: 'Welcome back!',
          });

          if (result.user.role === 'supervisor') {
            navigation.replace('Admin');
          } else {
            navigation.replace('Main');
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login failed',
            text2: 'Token not found',
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
    }
  };

  return (
  <View style={styles.container} testID="login-screen">

    <View style={styles.imageContainer}>
      <Image
        source={require('../assets/images/login.png')}
        style={styles.image}
      />
    </View>

    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome back</Text>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconContainer}>
            <Icon name="email" size={20} color="white" />
          </TouchableOpacity>

          <TextInput
            testID="email-input"
            style={styles.input}
            placeholder="Enter Your Email"
            placeholderTextColor="white"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconContainer}>
            <Icon name="lock" size={20} color="white" />
          </TouchableOpacity>

          <TextInput
            testID="password-input"
            style={styles.input}
            placeholder="Enter Your Password"
            placeholderTextColor="white"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            testID="toggle-password-visibility"
          >
            <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="white" />
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Icon name="error" size={20} color="white" style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} testID="login-button">
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')} testID="signup-button">
          <Text style={styles.SignupText}>
            Already have an account? <Text style={styles.SignupLink}>SignUp</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
    
  </View>
);
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0F14',
  },
  imageContainer: {
    height: 400,
    width: 540,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  innerContainer: {
    marginTop: 60,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'flex-start',
    marginBottom: 25,
    fontFamily: 'serif',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F222A',
    borderRadius: 15,
    borderColor: '#FF0000',
    borderWidth: 1,
    marginBottom: 18,
  },
  iconContainer: {
    paddingLeft: 15,
    paddingRight: 10,
  },
  input: {
    height: 50,
    flex: 1,
    fontSize: 16,
    color: 'white',
    paddingRight: 50,
  },
  eyeIcon: {
    paddingRight: 15,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  SignupText: {
    color: '#999',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  SignupLink: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
  },
});









































