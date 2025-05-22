import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HeaderProps } from '../types/NavigationTypes';

const Header=({navigation}: HeaderProps)=>{
  return(
    <View style={styles.container}>
   
      <View style={styles.Row}>
        <View style={styles.leftSection}>
          <Image source={require('../assets/images/logo5.png')} style={styles.logo} testID="logo-image"/>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity>
            <Icon name="notifications" size={24} color="#fff" testID="notification-button"/>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

export default Header;

const styles=StyleSheet.create({
  container:{
    backgroundColor: '#0C0F14',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop:20,
  },
  Row:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection:{
    flex: 1,
  },
  logo:{
    width: 150,
    height: 120,
    resizeMode: 'contain',
  },
  rightSection:{
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
});

