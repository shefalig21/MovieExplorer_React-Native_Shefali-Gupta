import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Header from '../Components/Header';
import MovieCarousel from '../Components/MovieCarousel';
import MoviesList from '../Components/MoviesList';
import { useNavigation } from '@react-navigation/native';
import { getMovieDetails } from '../Api/MoviesAPI';
import { MovieCardData } from '../types/movieCardTypes';
import { updateDeviceToken } from '../Api/NotificationAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen=()=>{

  const navigation=useNavigation<any>();
  const [newMovies,setNewMovies]=useState([]);
  const [loading,setLoading]=useState(true); 

  const handleMoviePress=(movie: MovieCardData)=>{
    navigation.navigate('MovieDetails',{ movie });
  };

  useEffect(()=>{
    const fetchInitialMovies=async()=>{
      try{
        const data=await getMovieDetails(1);
        const filtered=data.movies.filter((m: MovieCardData)=>m.release_year>2000);
        setNewMovies(filtered.slice(0, 10));
      }
      catch(error){
        console.error('Failed to load data',error);
      }
      finally{
        setLoading(false);
      }
    };
    fetchInitialMovies();
  },[]);

  useEffect(() => {
    const updateToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); 
        const deviceToken = await AsyncStorage.getItem('device_token'); 

        if (token && deviceToken) {
          const res = await updateDeviceToken(deviceToken);
          console.log('Device token updated:', res);
        }
      } catch (error) {
        console.error('Error updating device token:', error);
      }
    };
    updateToken();
  }, []);


  if(loading){
    return(
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FF0000" style={styles.loader} testID="homeLoadingIndicator"/>
      </SafeAreaView>
    );
  }

  return(
    <SafeAreaView style={styles.container} testID="homeScreen">

      <Header navigation={navigation} />

      <ScrollView contentContainerStyle={styles.content}  testID="homeScrollView">

        <MovieCarousel movies={newMovies}  testID="movieCarousel"/>

        <MoviesList
          title="Trending"
          filter={(movie)=>movie.rating>5.0}
          onMoviePress={handleMoviePress}
        />

        <MoviesList
          title="Popular"
          filter={(movie)=>movie.release_year>2000}
          onMoviePress={handleMoviePress}
        />

        <MoviesList
          title="Top Rated"
          filter={(movie)=>movie.rating>7.0 && movie.release_year>2000}
          onMoviePress={handleMoviePress}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles=StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#0C0F14',
  },
  content:{
    paddingBottom: 100,
  },
  loader:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});




