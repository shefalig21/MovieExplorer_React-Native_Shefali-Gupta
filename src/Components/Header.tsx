import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { HeaderProps } from '../types/NavigationTypes';

const Header = ({ navigation }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image
          source={require('../assets/images/lg2.png')}
          style={styles.logo}
          testID="logo-image"
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    paddingBottom: 10,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',     
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
});



