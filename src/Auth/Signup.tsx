import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SignUpResponse } from '../types/authTypes';
import { registerUser } from '../Api/AuthAPI';
import Toast from 'react-native-toast-message'; 
import Icon from 'react-native-vector-icons/MaterialIcons';

const Signup=()=>{

  const navigation=useNavigation<any>();
  const [name,setName]=useState<string>('');
  const [email,setEmail]=useState<string>('');
  const [password,setPassword]=useState<string>('');
  const [confirmPassword,setConfirmPassword]=useState<string>('');
  const [error,setError]=useState<string>('');
  const [showPassword,setShowPassword]=useState(false);
  const [showConfirmPassword,setShowConfirmPassword]=useState(false);

  const nameValid=/^[A-Za-z\s]{2,}$/;
  const emailValid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const passwordValid=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
   const passwordValid = /^(?=.*[@#$])[A-Za-z0-9@#$]{6,}$/;


  const handleSignUp=async()=>{
    if (!name ||!email|| !password || !confirmPassword){
      setError('Please fill all fields');
    }
    else if (!nameValid.test(name)){
      setError('Enter a valid name, at least 2 letters');
    }else if (!emailValid.test(email)) {
      setError('Enter a valid email');
    }
    else if (!passwordValid.test(password)){
      setError('Password must be at least 6 characters long and include at least one special character');
    }
    else if (password !== confirmPassword){
      setError('Passwords do not match');
    }
    else{
      try{
        const result: SignUpResponse=await registerUser(name, email, password);

        Toast.show({
          type: 'success',
          text1: 'Sign up Successful',
        });
        navigation.replace('Login');

      }
      catch (error: any){
         Toast.show({
          type: 'error', 
          text1: `Sign up failed: ${error.message || 'Something went wrong'}`,
        });
      }
    }
  };

  return(
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/SignUp.jpg')}
          style={styles.image}
          testID="signup-image"
        />
      </View>

      <View style={styles.innerContainer}>
        <Text style={styles.title}>Join MovieFlix</Text>

        <View style={styles.inputContainer}>

          <TouchableOpacity style={styles.leftIcon}>
            <Icon name="person" size={20} color="white"/>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Enter Your Name"
            placeholderTextColor="white"
            value={name}
            onChangeText={setName}
            testID="name-input"
          />
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.leftIcon}>
            <Icon name="email" size={20} color="white"/>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Enter Your Email"
            placeholderTextColor="white"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            testID="email-input"
          />
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.leftIcon}>
            <Icon name="lock" size={20} color="white"/>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Enter Your Password"
            placeholderTextColor="white"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            testID="password-input"
          />
          <TouchableOpacity 
            style={styles.rightIcon}
            onPress={()=>setShowPassword(!showPassword)}
          >
            <Icon name={showPassword ?'visibility' : 'visibility-off'} size={20} color="white"/>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.leftIcon}>
            <Icon name="lock" size={20} color="white"/>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="white"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            autoCapitalize="none"
            testID="confirmPassword-input"
          />
          <TouchableOpacity 
            style={styles.rightIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon name={showConfirmPassword ? 'visibility' : 'visibility-off'} size={20} color="white" />
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Icon name="error" size={20} color="white" style={styles.errorIcon} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handleSignUp} testID="signup-button">
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>navigation.navigate('Login')} testID="login-navigation">
          <Text style={styles.SignupText}>
            Already have an account?<Text style={styles.SignupLink}> Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

const styles=StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#0C0F14',
  },
  imageContainer:{
    marginTop: 6,
    height: 360,
    width: 460,
  },
  image:{
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  innerContainer:{
    marginTop: 25,
    padding: 20,
  },
  title:{
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
    marginBottom: 35,
    fontFamily: 'serif',
  },
  inputContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F222A',
    borderRadius: 15,
    borderColor: '#FF0000',
    borderWidth: 1,
    marginBottom: 18,
  },
  input:{
    flex: 1,
    height: 50,
    fontSize: 14,
    color: 'white',
    paddingHorizontal: 10,
    paddingRight: 40,
  },
  leftIcon:{
    paddingLeft: 15,
    paddingRight: 10,
  },
  rightIcon:{
    paddingRight: 15,
  },
  button:{
    marginTop: 30,
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  buttonText:{
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  SignupText:{
    color: '#999',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  SignupLink:{
    color: '#fff',
    fontWeight: 'bold',
  },
  errorContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  errorIcon:{
    marginRight: 8,
  },
  errorText:{
    color: '#fff',
    fontSize: 14,
  },
});

























