import React from 'react';
import { View,Text,Image,TouchableOpacity,StyleSheet,ImageBackground,Alert } from 'react-native';
import {MovieCardProps} from '../types/movieCardTypes';
import { getUserSubscriptionStatus } from '../Api/SubscriptionAPI';
import Toast from 'react-native-toast-message'; 

const MovieCard = ({movie, onPress}: MovieCardProps) => {
  
  const handleOnPress = async () => {
  const status = await getUserSubscriptionStatus();

  if (movie.premium && status === "Free") {
    Toast.show({
      type: 'error',
      text1: 'Premium Movie',
      text2: 'This movie is premium. Please upgrade.',
      position: 'top',
      visibilityTime: 3000,
      topOffset: 60,
    });
  } else {
    onPress();
  }
};
  
  return (
    <TouchableOpacity style={styles.card} onPress={handleOnPress} testID="movie-card">
      <ImageBackground
        source={{uri: movie.poster_url}}
        style={styles.image}
        testID="movie-card-image">
        {movie.premium && <Text style={styles.premiumText}>👑</Text>}
      </ImageBackground>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2} testID="movie-card-title">
          {movie.title}
        </Text>
        <Text style={styles.detail} numberOfLines={1} testID="movie-card-genre">
          {movie.genre}
        </Text>
        <View style={styles.Row}>
          <Text style={styles.year} testID="movie-card-release-year">
            {movie.release_year}
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.year} testID="movie-card-duration">
            {movie.duration}h
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1F26',
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 14,
    width: 200,
    height: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 310,
    resizeMode: 'cover',
    position: 'relative',
  },
  infoContainer: {
    backgroundColor: '#2C2F36',
    paddingVertical: 10,
    paddingHorizontal: 8,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  detail: {
    color: '#BBBBBB',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 6,
  },
  Row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  year: {
    color: '#999999',
    fontSize: 11,
  },
  dot: {
    color: '#999999',
    fontSize: 11,
    marginHorizontal: 5,
  },
  premiumText: {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: '#0C0F14', 
  color: '#000',            
  fontSize: 14,
  fontWeight: 'bold',
  padding: 6,
  borderRadius: 20,
  textAlign: 'center',
  elevation: 5,
  shadowColor: '#000',
  shadowRadius: 3,
},
});

export default MovieCard;



