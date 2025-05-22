import { StyleSheet, Text, View, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import StackNavigation from './Navigation/StackNavigation';
import Toast from 'react-native-toast-message';
import { toastConfig } from './toastConfig';

const App = () => {
  useEffect(() => {
    requestPermissionAndroid();
  }, []);

  const requestPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Alert.alert("Permission Granted");
        getToken();
      } else {
        // Alert.alert("Permission Denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      Alert.alert(remoteMessage.notification?.title,remoteMessage.notification?.body );
    });

    return unsubscribe;
  }, []);

  const getToken=async()=>{
    const token = await messaging().getToken(); 
    console.log('token',token);
  }

  return (
     <View style={styles.container}>

      <StackNavigation/>

      <Toast config={toastConfig}/>
      
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#0C0F14',
  }
});








