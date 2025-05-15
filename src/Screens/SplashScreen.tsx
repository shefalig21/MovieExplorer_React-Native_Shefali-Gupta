import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SplashScreenProps } from '../types/SplashScreenTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen=({ navigation }: SplashScreenProps)=>{
  const [showLogo, setShowLogo]=useState(true);
  const [showLoader, setShowLoader]=useState(false);

  useEffect(()=>{
    const checkToken= async()=>{
      const token=await AsyncStorage.getItem('token');

      setTimeout(()=>{
        if (token){
          setShowLogo(false); 
          setShowLoader(true); 
          setTimeout(()=>{
            navigation.replace('Main');
          }, 2000);
        }
        else{
          navigation.replace('Login');
        }
      },2000);
    };

    checkToken();
  },[]);

  return (
    <View style={styles.container} testID="splash-screen">
      {showLogo && (
        <Image
          source={require('../assets/images/logo5.png')}
          style={styles.logo}
          testID="splashScreen-logo"
        />
      )}
      {showLoader &&(
        <ActivityIndicator size="large" color="#FF0000"  testID="splashScreen-loader"/>
      )}
    </View> 
  );
};

export default SplashScreen;

const styles=StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#0C0F14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo:{
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
});











