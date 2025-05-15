import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../Screens/SplashScreen';
import Login from '../Auth/Login';
import Signup from '../Auth/Signup';
import MovieDetails from '../Screens/MovieDetails';
import ResultScreen from '../Screens/ResultScreen';
import AdminScreen from '../Screens/AdminScreen';
import BottomTabNavigation from './BottomTabNavigation';
import PaymentScreen from '../Screens/PaymentScreen';


const Stack=createNativeStackNavigator();

const StackNavigation=()=>{
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Signup" component={Signup}/>
        <Stack.Screen name="Main" component={BottomTabNavigation}/>
        <Stack.Screen name="MovieDetails" component={MovieDetails}/>
        <Stack.Screen name="ResultScreen" component={ResultScreen}/>
        <Stack.Screen name="Admin" component={AdminScreen}/>
        <Stack.Screen name="Payment" component={PaymentScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
    
  );
};

export default StackNavigation;














