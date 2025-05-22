import React from 'react';
import { View,Text,StyleSheet,TouchableOpacity,Image } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { RootNavigationProp } from '../types/NavigationTypes';

const Success = () => {
  const navigation = useNavigation<RootNavigationProp>();

  const handleNavigation = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.circleBackground}>
        <Animatable.Image
          animation="bounce"
          duration={1200}
          source={require('../assets/images/tick.png')}
          style={styles.tickImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.successText}>Payment Successful!</Text>
      <Text style={styles.subText}>Your transaction has been completed</Text>

      <TouchableOpacity style={styles.button} onPress={handleNavigation}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0F14',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  circleBackground: {
    backgroundColor: '#1A0000',
    width: 120,
    height: 120,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 250,
  },
  tickImage: {
    width: 105,
    height: 105,
  },
  successText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 50,
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 110,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
