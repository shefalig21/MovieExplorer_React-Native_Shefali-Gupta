import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MovieCard from '../Components/MovieCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchMoviesByGenre, fetchMoviesBySearch, fetchMoviesByReleaseYear, fetchMoviesByRating } from '../Api/MoviesAPI';
import { ResultScreenNavigationProp,ResultScreenRouteProp } from '../types/ResultScreenType';

const ResultScreen = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const navigation = useNavigation<ResultScreenNavigationProp>();
  const { searchText, genre, year, rating } = route.params || {};
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      let data;
      if (searchText) {
        data = await fetchMoviesBySearch(searchText);
      } else if (genre) {
        data = await fetchMoviesByGenre(genre);
      } else if (year) {
        data = await fetchMoviesByReleaseYear(year); 
      } else if (rating) {
        data = await fetchMoviesByRating(rating); 
      }

      setMovies(data.movies || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [searchText, genre, year, rating]);

  const renderMovie = ({ item }:any) => (
    <TouchableOpacity onPress={() => navigation.navigate('MovieDetails', { movie: item })}>
      <View style={styles.movieItem}>
        <MovieCard movie={item} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {searchText
            ? `Search Results for  "${searchText}"`
            : genre
            ? `Search Results for  "${genre}"`
            : year
            ? `Movies Released in  "${year}"`
            : rating
            ? `Movies with Rating  "${rating}+"`
            : 'Movies'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color="#FF0000" size="large" />
        </View>
      ) : error ? (
        <Text style={styles.noResults}>{error}</Text>
      ) : movies.length === 0 ? (
        <Text style={styles.noResults}>No movie found</Text>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0F14',
    padding: 16,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    flexShrink: 1,
    marginLeft: 15,
    fontFamily:'Helvetica',
    letterSpacing: 0.6,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 20,
    paddingHorizontal: 4,
  },
  movieItem: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: 8,
  },
  noResults: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});




















