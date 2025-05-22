import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MovieCard from '../Components/MovieCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchMoviesByGenre, fetchMoviesBySearch, fetchMoviesByReleaseYear, fetchMoviesByRating } from '../Api/MoviesAPI';
import { ResultScreenNavigationProp, ResultScreenRouteProp } from '../types/ResultScreenType';

const { width } = Dimensions.get('window');

const ResultScreen = () => {
  const route = useRoute<ResultScreenRouteProp>();
  const navigation = useNavigation<ResultScreenNavigationProp>();
  const { searchText, genre, year, rating } = route.params || {};
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMovies = async (pageNum: number) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      
      setError(null);
      
      let data;
      if (searchText) {
        data = await fetchMoviesBySearch(searchText, pageNum);
      } else if (genre) {
        data = await fetchMoviesByGenre(genre, pageNum);
      } else if (year) {
        data = await fetchMoviesByReleaseYear(year, pageNum);
      } else if (rating) {
        data = await fetchMoviesByRating(rating, pageNum);
      }

      setTotalPages(data.meta?.total_pages || 1);
      
      if (pageNum === 1) {
        setMovies(data.movies || []);
      } else {
        // Filter out duplicates before adding
        const newMovies = data.movies || [];
        const existingIds = new Set(movies.map(movie => movie.id));
        const filteredNewMovies = newMovies.filter(movie => !existingIds.has(movie.id));
        setMovies(prev => [...prev, ...filteredNewMovies]);
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to fetch movies');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (page < totalPages && !isLoadingMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    setPage(1);
    setTotalPages(1);
    fetchMovies(1);
  }, [searchText, genre, year, rating]);

  useEffect(() => {
    if (page > 1) {
      fetchMovies(page);
    }
  }, [page]);

  const renderMovie = ({ item }: any) => (
    <View style={styles.movieItemContainer} testID={`movie-item-${item.id}`}>
      <TouchableOpacity>
        <View style={styles.movieItem}>
          <MovieCard movie={item} onPress={() => navigation.navigate('MovieDetails', { movie: item })} />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (isLoadingMore) {
      return <ActivityIndicator color="#FF0000" size="large" style={{ marginVertical: 20 }} />;
    }
    if (page < totalPages && !loading && movies.length > 0) {
      return (
        <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} testID="back-button">
          <Icon name="arrow-back" size={26} color="#fff" testID="back-icon" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {searchText
            ? `Search Results for "${searchText}"`
            : genre
            ? `Search Results for "${genre}"})`
            : year
            ? `Movies Released in "${year}")`
            : rating
            ? `Movies with Rating "${rating}")`
            : 'Movies'}
        </Text>
      </View>
      {loading && page === 1 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color="#FF0000" size="large" testID="loading-indicator" />
        </View>
      ) : error ? (
        <Text style={styles.noResults} testID="error-text">{error}</Text>
      ) : movies.length === 0 ? (
        <Text style={styles.noResults}>No movie found</Text>
      ) : (
        <FlatList
          testID="movies-flatlist"
          data={movies}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.columnWrapper}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
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
    fontFamily: 'Helvetica',
    letterSpacing: 0.6,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  movieItemContainer: {
    width: '48%',
  },
  movieItem: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  noResults: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  loadMoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 20,
    backgroundColor: '#1E1E1E',
  },
  loadMoreText: {
    color: '#FF0000',
    fontWeight: '600',
    fontSize: 16,
  },
});















































































































// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import MovieCard from '../Components/MovieCard';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { fetchMoviesByGenre, fetchMoviesBySearch, fetchMoviesByReleaseYear, fetchMoviesByRating } from '../Api/MoviesAPI';
// import { ResultScreenNavigationProp, ResultScreenRouteProp } from '../types/ResultScreenType';

// const { width } = Dimensions.get('window');

// const ResultScreen = () => {
//   const route = useRoute<ResultScreenRouteProp>();
//   const navigation = useNavigation<ResultScreenNavigationProp>();
//   const { searchText, genre, year, rating } = route.params || {};
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   const fetchMovies = async (pageNum: number) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       let data;
//       if (searchText) {
//         data = await fetchMoviesBySearch(searchText, pageNum);
//       } else if (genre) {
//         data = await fetchMoviesByGenre(genre, pageNum);
//       } else if (year) {
//         data = await fetchMoviesByReleaseYear(year, pageNum);
//       } else if (rating) {
//         data = await fetchMoviesByRating(rating, pageNum);
//       }

//       const newMovies = data.movies || [];
      
//       if (newMovies.length < 10) {
//         setHasMore(false);
//       }
      
//       if (pageNum === 1) {
//         setMovies(newMovies);
//       } else {
//         setMovies(prev => [...prev, ...newMovies]);
//       }
//     } catch (err) {
//       console.error('Error fetching movies:', err);
//       setError('Failed to fetch movies');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setPage(1);
//     setHasMore(true);
//     fetchMovies(1);
//   }, [searchText, genre, year, rating]);

//   useEffect(() => {
//     if (page > 1) {
//       fetchMovies(page);
//     }
//   }, [page]);

//   const loadMore = () => {
//     if (!loading && hasMore) {
//       setPage(prev => prev + 1);
//     }
//   };

//   const renderMovie = ({ item }: any) => (
//     <View style={styles.movieItemContainer} testID={`movie-item-${item.id}`}>
//       <TouchableOpacity>
//         <View style={styles.movieItem}>
//           <MovieCard movie={item} onPress={() => navigation.navigate('MovieDetails', { movie: item })} />
//         </View>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderFooter = () => {
//     if (loading && page > 1) {
//       return <ActivityIndicator color="#FF0000" size="large" style={{ marginVertical: 20 }} />;
//     }
//     if (hasMore && !loading && movies.length > 0) {
//       return (
//         <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
//           <Text style={styles.loadMoreText}>Load More</Text>
//         </TouchableOpacity>
//       );
//     }
//     return null;
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} testID="back-button">
//           <Icon name="arrow-back" size={26} color="#fff" testID="back-icon" />
//         </TouchableOpacity>
//         <Text style={styles.headerText}>
//           {searchText
//             ? `Search Results for "${searchText}"`
//             : genre
//             ? `Search Results for "${genre}"`
//             : year
//             ? `Movies Released in "${year}"`
//             : rating
//             ? `Movies with Rating "${rating}"`
//             : 'Movies'}
//         </Text>
//       </View>
//       {loading && page === 1 ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator color="#FF0000" size="large" testID="loading-indicator" />
//         </View>
//       ) : error ? (
//         <Text style={styles.noResults} testID="error-text">{error}</Text>
//       ) : movies.length === 0 ? (
//         <Text style={styles.noResults}>No movie found</Text>
//       ) : (
//         <FlatList
//           testID="movies-flatlist"
//           data={movies}
//           renderItem={renderMovie}
//           keyExtractor={(item) => item.id.toString()}
//           numColumns={2}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.list}
//           columnWrapperStyle={styles.columnWrapper}
//           onEndReached={loadMore}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={renderFooter}
//         />
//       )}
//     </View>
//   );
// };

// export default ResultScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0C0F14',
//     padding: 16,
//     paddingTop: 48,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 30,
//     flexWrap: 'wrap',
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 18,
//     flexShrink: 1,
//     marginLeft: 15,
//     fontFamily: 'Helvetica',
//     letterSpacing: 0.6,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   list: {
//     paddingBottom: 20,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//     marginBottom: 35,
//   },
//   movieItemContainer: {
//     width: '48%',
//   },
//   movieItem: {
//     width: '100%',
//     aspectRatio: 2 / 3,
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   noResults: {
//     color: '#fff',
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 100,
//   },
//   loadMoreButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     alignSelf: 'center',
//     marginVertical: 20,
//     backgroundColor: '#1E1E1E',
//   },
//   loadMoreText: {
//     color: '#FF0000',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });


























// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import MovieCard from '../Components/MovieCard';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { fetchMoviesByGenre, fetchMoviesBySearch, fetchMoviesByReleaseYear, fetchMoviesByRating } from '../Api/MoviesAPI';
// import { ResultScreenNavigationProp,ResultScreenRouteProp } from '../types/ResultScreenType';

// const ResultScreen = () => {
//   const route = useRoute<ResultScreenRouteProp>();
//   const navigation = useNavigation<ResultScreenNavigationProp>();
//   const { searchText, genre, year, rating } = route.params || {};
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);

//   const fetchMovies = async (pageNum = 1) => {
//     if (pageNum === 1) {
//       setLoading(true);
//     } else {
//       setIsLoadingMore(true);
//     }
    
//     setError(null);
//     try {
//       let data;
//       if (searchText) {
//         data = await fetchMoviesBySearch(searchText, pageNum);
//       } else if (genre) {
//         data = await fetchMoviesByGenre(genre, pageNum);
//       } else if (year) {
//         data = await fetchMoviesByReleaseYear(year, pageNum);
//       } else if (rating) {
//         data = await fetchMoviesByRating(rating, pageNum);
//       }
      
//       setTotalPages(data.total_pages || 1);
      
//       if (pageNum === 1) {
//         setMovies(data.movies || []);
//       } else {
//         setMovies(prevMovies => [...prevMovies, ...(data.movies || [])]);
//       }
//     } catch (err) {
//       console.error('Error fetching movies:', err);
//       setError('Failed to fetch movies');
//     } finally {
//       setLoading(false);
//       setIsLoadingMore(false);
//     }
//   };

//   const loadMoreMovies = () => {
//     if (page < totalPages && !isLoadingMore) {
//       setPage(prevPage => prevPage + 1);
//       fetchMovies(page + 1);
//     }
//   };

//   useEffect(() => {
//     setPage(1);
//     fetchMovies(1);
//   }, [searchText, genre, year, rating]);

//   const renderMovie = ({ item }:any) => (
//     <View style={styles.movieItemContainer} testID={`movie-item-${item.id}`}>
//       <TouchableOpacity>
//         <View style={styles.movieItem}>
//           <MovieCard movie={item} onPress={()=>navigation.navigate('MovieDetails',{ movie: item })}/>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}  testID="back-button">
//           <Icon name="arrow-back" size={26} color="#fff" testID="back-icon"/>
//         </TouchableOpacity>
//         <Text style={styles.headerText}>
//           {searchText
//             ? `Search Results for "${searchText}"`
//             : genre
//             ? `Search Results for "${genre}"`
//             : year
//             ? `Movies Released in "${year}"`
//             : rating
//             ? `Movies with Rating "${rating}"`
//             : 'Movies'}
//         </Text>
//       </View>
//       {loading ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator color="#FF0000" size="large" testID="loading-indicator" />
//         </View>
//       ) : error ? (
//         <Text style={styles.noResults} testID="error-text">{error}</Text>
//       ) : movies.length === 0 ? (
//         <Text style={styles.noResults}>No movie found</Text>
//       ) : (
//         <FlatList
//          testID="movies-flatlist"
//           data={movies}
//           renderItem={renderMovie}
//           keyExtractor={(item) => item.id.toString()}
//           numColumns={2}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.list}
//           columnWrapperStyle={styles.columnWrapper}
//           onEndReached={loadMoreMovies}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={
//             isLoadingMore ? (
//               <ActivityIndicator color="#FF0000" size="large" style={{ marginVertical: 20 }} testID="loading-more-indicator"/>
//             ) : null
//           }
//         />
//       )}
//     </View>
//   );
// };

// export default ResultScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0C0F14',
//     padding: 16,
//     paddingTop: 48,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 30,
//     flexWrap: 'wrap',
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 18,
//     flexShrink: 1,
//     marginLeft: 15,
//     fontFamily:'Helvetica',
//     letterSpacing: 0.6,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   list: {
//     paddingBottom: 20,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//     marginBottom: 35,
//   },
//   movieItemContainer: {
//     width: '48%', 
//   },
//   movieItem: {
//     width: '100%',
//     aspectRatio: 2/3, 
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   noResults: {
//     color: '#fff',
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 100,
//   },
// })

























// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import MovieCard from '../Components/MovieCard';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { fetchMoviesByGenre, fetchMoviesBySearch, fetchMoviesByReleaseYear, fetchMoviesByRating } from '../Api/MoviesAPI';
// import { ResultScreenNavigationProp,ResultScreenRouteProp } from '../types/ResultScreenType';

// const ResultScreen = () => {
//   const route = useRoute<ResultScreenRouteProp>();
//   const navigation = useNavigation<ResultScreenNavigationProp>();
//   const { searchText, genre, year, rating } = route.params || {};
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);

//   const fetchMovies = async (pageNum = 1) => {
//     if (pageNum === 1) {
//       setLoading(true);
//     } else {
//       setIsLoadingMore(true);
//     }
    
//     setError(null);
//     try {
//       let data;
//       if (searchText) {
//         data = await fetchMoviesBySearch(searchText, pageNum);
//       } else if (genre) {
//         data = await fetchMoviesByGenre(genre, pageNum);
//       } else if (year) {
//         data = await fetchMoviesByReleaseYear(year, pageNum);
//       } else if (rating) {
//         data = await fetchMoviesByRating(rating, pageNum);
//       }
      
//       setTotalPages(data.total_pages || 1);
      
//       if (pageNum === 1) {
//         setMovies(data.movies || []);
//       } else {
//         setMovies(prevMovies => [...prevMovies, ...(data.movies || [])]);
//       }
//     } catch (err) {
//       console.error('Error fetching movies:', err);
//       setError('Failed to fetch movies');
//     } finally {
//       setLoading(false);
//       setIsLoadingMore(false);
//     }
//   };

//   const loadMoreMovies = () => {
//     if (page < totalPages && !isLoadingMore) {
//       setPage(prevPage => prevPage + 1);
//       fetchMovies(page + 1);
//     }
//   };

//   useEffect(() => {
//     setPage(1);
//     fetchMovies(1);
//   }, [searchText, genre, year, rating]);

//   const renderMovie = ({ item }:any) => (
//     <View style={styles.movieItemContainer} testID={`movie-item-${item.id}`}>
//       <TouchableOpacity>
//         <View style={styles.movieItem}>
//           <MovieCard movie={item} onPress={()=>navigation.navigate('MovieDetails',{ movie: item })}/>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}  testID="back-button">
//           <Icon name="arrow-back" size={26} color="#fff" testID="back-icon"/>
//         </TouchableOpacity>
//         <Text style={styles.headerText}>
//           {searchText
//             ? `Search Results for "${searchText}"`
//             : genre
//             ? `Search Results for "${genre}"`
//             : year
//             ? `Movies Released in "${year}"`
//             : rating
//             ? `Movies with Rating "${rating}"`
//             : 'Movies'}
//         </Text>
//       </View>
//       {loading ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator color="#FF0000" size="large" testID="loading-indicator" />
//         </View>
//       ) : error ? (
//         <Text style={styles.noResults} testID="error-text">{error}</Text>
//       ) : movies.length === 0 ? (
//         <Text style={styles.noResults}>No movie found</Text>
//       ) : (
//         <FlatList
//          testID="movies-flatlist"
//           data={movies}
//           renderItem={renderMovie}
//           keyExtractor={(item) => item.id.toString()}
//           numColumns={2}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.list}
//           columnWrapperStyle={styles.columnWrapper}
//           onEndReached={loadMoreMovies}
//           onEndReachedThreshold={0.5}
//           ListFooterComponent={
//             isLoadingMore ? (
//               <ActivityIndicator color="#FF0000" size="large" style={{ marginVertical: 20 }} testID="loading-more-indicator"/>
//             ) : null
//           }
//         />
//       )}
//     </View>
//   );
// };

// export default ResultScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0C0F14',
//     padding: 16,
//     paddingTop: 48,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 30,
//     flexWrap: 'wrap',
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 18,
//     flexShrink: 1,
//     marginLeft: 15,
//     fontFamily:'Helvetica',
//     letterSpacing: 0.6,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   list: {
//     paddingBottom: 20,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between',
//     marginBottom: 35,
//   },
//   movieItemContainer: {
//     width: '48%', 
//   },
//   movieItem: {
//     width: '100%',
//     aspectRatio: 2/3, 
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   noResults: {
//     color: '#fff',
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 100,
//   },
// });

