import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getWatchlist, toggleWatchlist } from '../Api/WatchlistApi';
import MoviesList from '../Components/MoviesList';
import { getMovieDetails } from '../Api/MoviesAPI';
import Toast from 'react-native-toast-message';
import { Movie,WatchlistResponse } from '../types/MovieDetails.type';

const { width }=Dimensions.get('window');

const MovieDetails=()=>{

  const navigation=useNavigation();
  const route=useRoute();
  const { movie }=route.params;

  const [isInWatchlist,setIsInWatchlist]=useState(false);
  const [allMovies,setAllMovies]=useState<Movie[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const checkWishlist=async()=>{
      try{
        const data: WatchlistResponse=await getWatchlist();
        const inList=data.movies.some((item)=>item.id===movie.id);
        setIsInWatchlist(inList);

      }catch(error){
        console.log('Error fetching wishlist:',error);
      }
    };

    const fetchMovies=async()=>{
      try{
        const data=await getMovieDetails(1);
        setAllMovies(data.movies);
      }
      catch(err){
        console.log('Error fetching movies:',err);
      }
      finally{
        setLoading(false);
      }
    };

    checkWishlist();
    fetchMovies();
  },[movie.id]);

  const handleToggleWatchlist=async()=>{
    try{
      if(!isInWatchlist){
        const message=await toggleWatchlist(movie.id);
        setIsInWatchlist(true);
        Toast.show({
        type: 'success',
        text1: 'Added to Watchlist',
        text2: message,
      });
      }
      else{
       Toast.show({
        type: 'error',
        text1: 'Already in Watchlist',
        text2: 'This movie is already in your watchlist.',
      });
      }
    }
    catch(err){
      Toast.show({
      type: 'error',
      text1: 'Something went wrong',
      text2: 'Please try again later.',
    });
    }
  };

  const topRatedMovies: Movie[] =allMovies.filter((m)=>m.rating >7.0 && m.release_year>2000);

  return(
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.goBack()}  testID="back-button">
        <Icon name="arrow-back" size={28} color="white"/>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image testID="poster-image" source={{ uri: movie.poster_url }} style={styles.poster}/>
        <Text testID="movie-title"  style={styles.title}>{movie.title}</Text>
        <Text testID="movie-rating" style={styles.info}>⭐ {movie.rating}/10</Text>
        <Text testID="movie-genre" style={styles.info}>Genre: {movie.genre}</Text>
        <Text testID="movie-year" style={styles.info}>Release Year: {movie.release_year}</Text>
        <Text testID="movie-duration" style={styles.info}>Duration: {movie.duration}h</Text>

        <Text testID="movie-description" style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{movie.description}</Text>

        <TouchableOpacity
          style={styles.wishlistButton} onPress={handleToggleWatchlist} testID="watchlist-button">
          <Icon name={isInWatchlist?'favorite':'favorite-border'} size={22} color="#fff"
            style={styles.iconStyle}
          />
          <Text testID="watchlist-text" style={styles.wishlistText}>
            {isInWatchlist?'Added to Watchlist':'Add to Watchlist'}
          </Text>
        </TouchableOpacity>

        {!loading && topRatedMovies.length>0 &&(
          <View style={styles.relatedMoviesContainer} testID="related-movies-container">
            <Text style={styles.relatedMoviesTitle}>Related Movies</Text>
            <MoviesList
              movies={topRatedMovies}
              onMoviePress={(movie)=>navigation.navigate('MovieDetails',{ movie })}
              skipInitialLoader
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MovieDetails;

const styles=StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#0C0F14',
    paddingTop: 40,
  },
  backIcon:{
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  scrollContent:{
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  poster:{
    width: width - 32,
    height: 600,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 20,
    alignSelf: 'center',
  },
  title:{
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info:{
    color: '#aaa',
    marginBottom: 4,
    fontSize: 16,
  },
  descriptionTitle:{
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  description:{
    color: '#ccc',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  wishlistButton:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
    backgroundColor: '#E50914',
    marginBottom: 24,
  },
  iconStyle:{
    marginRight: 8,
  },
  wishlistText:{
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  relatedMoviesContainer:{
    marginTop: 10,
    paddingBottom: 20,
  },
  relatedMoviesTitle:{
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});









































// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { getWatchlist, toggleWatchlist } from '../Api/WatchlistApi';
// import MoviesList from '../Components/MoviesList';
// import { getMovieDetails } from '../Api/MoviesAPI';
// import Toast from 'react-native-toast-message';
// import { Movie,WatchlistResponse } from '../types/MovieDetails.type';

// const { width }=Dimensions.get('window');

// const MovieDetails=()=>{

//   const navigation=useNavigation();
//   const route=useRoute();
//   const { movie }=route.params;

//   const [isInWatchlist,setIsInWatchlist]=useState(false);
//   const [allMovies,setAllMovies]=useState<Movie[]>([]);
//   const [loading,setLoading]=useState(true);

//   useEffect(()=>{
//     const checkWishlist=async()=>{
//       try{
//         const data: WatchlistResponse=await getWatchlist();
//         const inList=data.movies.some((item)=>item.id===movie.id);
//         setIsInWatchlist(inList);

//       }catch(error){
//         console.log('Error fetching wishlist:',error);
//       }
//     };

//     const fetchMovies=async()=>{
//       try{
//         const data=await getMovieDetails(1);
//         setAllMovies(data.movies);
//       }
//       catch(err){
//         console.log('Error fetching movies:',err);
//       }
//       finally{
//         setLoading(false);
//       }
//     };

//     checkWishlist();
//     fetchMovies();
//   },[movie.id]);

//   const handleToggleWatchlist=async()=>{
//     try{
//       if(!isInWatchlist){
//         const message=await toggleWatchlist(movie.id);
//         setIsInWatchlist(true);
//         Toast.show({
//         type: 'success',
//         text1: 'Added to Watchlist',
//         text2: message,
//       });
//       }
//       else{
//        Toast.show({
//         type: 'error',
//         text1: 'Already in Watchlist',
//         text2: 'This movie is already in your watchlist.',
//       });
//       }
//     }
//     catch(err){
//       Toast.show({
//       type: 'error',
//       text1: 'Something went wrong',
//       text2: 'Please try again later.',
//     });
//     }
//   };

//   const topRatedMovies: Movie[] =allMovies.filter((m)=>m.rating >7.0 && m.release_year>2000);

//   return(
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.backIcon}
//         onPress={() => navigation.goBack()}>
//         <Icon name="arrow-back" size={28} color="white"/>
//       </TouchableOpacity>

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
//         <Image source={{ uri: movie.poster_url }} style={styles.poster}/>
//         <Text style={styles.title}>{movie.title}</Text>
//         <Text style={styles.info}>⭐ {movie.rating}/10</Text>
//         <Text style={styles.info}>Genre: {movie.genre}</Text>
//         <Text style={styles.info}>Release Year: {movie.release_year}</Text>
//         <Text style={styles.info}>Duration: {movie.duration}h</Text>

//         <Text style={styles.descriptionTitle}>Description</Text>
//         <Text style={styles.description}>{movie.description}</Text>

//         <TouchableOpacity
//           style={styles.wishlistButton}
//           onPress={handleToggleWatchlist}>
//           <Icon name={isInWatchlist?'favorite':'favorite-border'} size={22} color="#fff"
//             style={styles.iconStyle}
//           />
//           <Text style={styles.wishlistText}>
//             {isInWatchlist?'Added to Watchlist':'Add to Watchlist'}
//           </Text>
//         </TouchableOpacity>

//         {!loading && topRatedMovies.length>0 &&(
//           <View style={styles.relatedMoviesContainer}>
//             <Text style={styles.relatedMoviesTitle}>Related Movies</Text>
//             <MoviesList
//               movies={topRatedMovies}
//               onMoviePress={(movie)=>navigation.navigate('MovieDetails',{ movie })}
//               skipInitialLoader
//             />
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// export default MovieDetails;

// const styles=StyleSheet.create({
//   container:{
//     flex: 1,
//     backgroundColor: '#0C0F14',
//     paddingTop: 40,
//   },
//   backIcon:{
//     position: 'absolute',
//     top: 40,
//     left: 20,
//     zIndex: 10,
//   },
//   scrollContent:{
//     paddingHorizontal: 16,
//     paddingBottom: 40,
//   },
//   poster:{
//     width: width - 32,
//     height: 600,
//     resizeMode: 'cover',
//     borderRadius: 12,
//     marginBottom: 20,
//     alignSelf: 'center',
//   },
//   title:{
//     fontSize: 26,
//     color: 'white',
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   info:{
//     color: '#aaa',
//     marginBottom: 4,
//     fontSize: 16,
//   },
//   descriptionTitle:{
//     marginTop: 16,
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 6,
//   },
//   description:{
//     color: '#ccc',
//     fontSize: 15,
//     lineHeight: 22,
//     marginBottom: 20,
//   },
//   wishlistButton:{
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 30,
//     width: '100%',
//     backgroundColor: '#E50914',
//     marginBottom: 24,
//   },
//   iconStyle:{
//     marginRight: 8,
//   },
//   wishlistText:{
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   relatedMoviesContainer:{
//     marginTop: 10,
//     paddingBottom: 20,
//   },
//   relatedMoviesTitle:{
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });




