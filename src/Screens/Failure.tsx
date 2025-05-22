import React from 'react';
import { View,Text,StyleSheet,TouchableOpacity,Image,Dimensions } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { RootNavigationProp } from '../types/NavigationTypes';

const {width} = Dimensions.get('window');

const Failure = () => {
  
  const navigation = useNavigation<RootNavigationProp>();
  
  const handleTryAgain = () => {
    navigation.navigate('Main', {
      screen: 'Subscription',
    });
  };

  const handleNavigate = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="zoomIn" duration={1000} style={styles.circleBackground}>
        <Animatable.Image
          animation="bounce"
          iterationCount="infinite"
          duration={1500}
          source={require('../assets/images/cross.png.webp')}
          style={styles.crossImage}
          resizeMode="contain"
        />
      </Animatable.View>

      <Animatable.Text animation="fadeInUp" delay={300} style={styles.title}>
        Payment Failed
      </Animatable.Text>

      <Animatable.Text animation="fadeInUp" delay={500} style={styles.subText}>
        Your transaction could not be completed
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" delay={700}>
        <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
          <Text style={styles.tryAgainText}>Try Again</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={900}>
        <TouchableOpacity style={styles.backHomeButton} onPress={handleNavigate}>
          <Text style={styles.backHomeText}>Back to Home</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default Failure;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C0F14',
  },
  circleBackground: {
    backgroundColor: '#ff4d4d',
    width: 105,
    height: 105,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#ff4d4d',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    marginTop:-35,
  },
  crossImage: {
    width: 70,
    height: 70,
  },
  title: {
    marginTop:10,
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 60,
    textAlign: 'center',
  },
  tryAgainButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 14,
    paddingHorizontal: width * 0.25,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: '#ff4d4d',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  tryAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backHomeButton: {
    backgroundColor: '#ffffff10',
    borderWidth: 1,
    borderColor: '#ffffff40',
    paddingVertical: 14,
    paddingHorizontal: width * 0.22,
    borderRadius: 14,
  },
  backHomeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});












