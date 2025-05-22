import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MovieCarouselProps } from '../types/MovieCarouselTypes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width: screenWidth }=Dimensions.get('window');
const CARD_WIDTH=screenWidth * 0.92;
const CARD_HEIGHT=CARD_WIDTH * 1.6;

type NavigationProp = NativeStackNavigationProp<any>;

const MovieCarousel=({ movies,testID }: MovieCarouselProps)=>{
  const navigation=useNavigation<NavigationProp>();
  const carouselMovies=movies;

  const renderItem=({ item,index }:any)=>(

    <TouchableOpacity
      testID={`movie-card-${index}`}
      style={styles.card}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{ uri: item.poster_url }}
        style={styles.image}
        imageStyle={styles.imageStyle}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent','rgba(0,0,0,0.95)']}
          style={styles.overlay}
        >
          <View style={styles.textContainer}>
            <Text testID={`movie-title-${index}`} style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text testID={`movie-genre-${index}`} style={styles.genre}>{item.genre}</Text>
            
            <View style={styles.ratingRow}>
              <Icon name="star" size={18} color="#FFD700" />
              <Text testID={`movie-rating-${index}`} style={styles.ratingText}>{item.rating}</Text>
            </View>

            <TouchableOpacity
              style={styles.moreDetailsButton}
              testID={`watch-now-btn-${index}`}
              onPress={()=>navigation.navigate('MovieDetails',{ movie: item })}
            >
              <Text style={styles.moreDetailsText}>More Details</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>

    </TouchableOpacity>
  );

  return(
    <View style={styles.carouselContainer}  testID={testID}>
      <Carousel
        loop
        autoPlay
        data={carouselMovies}
        scrollAnimationDuration={800}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        renderItem={renderItem}
        mode="parallax"
        modeConfig={{ parallaxScrollingOffset: 70 }}
        pagingEnabled
        snapEnabled
      />
    </View>
  );
};

const styles=StyleSheet.create({
  carouselContainer:{
    backgroundColor: '#0C0F14',
    alignItems: 'center',
    marginTop: -30,
  },
  card:{
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#fff',
    shadowRadius: 8,
    elevation: 10,
    backgroundColor: '#1e1e1e',
  },
  image:{
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  imageStyle:{
    borderRadius: 20,
  },
  overlay:{
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 60,
    justifyContent: 'flex-end',
  },
  textContainer:{
    alignItems: 'flex-start',
  },
  title:{
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  genre:{
    color: '#bbb',
    fontSize: 14,
    marginBottom: 8,
  },
  ratingRow:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  ratingText:{
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
  },
  moreDetailsButton:{
    backgroundColor: '#E50914',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 30,
  },
  moreDetailsText:{
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MovieCarousel;












