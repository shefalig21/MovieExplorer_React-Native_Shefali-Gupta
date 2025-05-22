import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getWatchlist, toggleWatchlist } from '../Api/WatchlistApi';
import { Movie } from '../types/WatchlistTypes';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const data = await getWatchlist();
      setWatchlist(data.movies || []);
    } catch (error) {
      console.log('Error fetching watchlist:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const removeFocusListener = navigation.addListener('focus', fetchWatchlist);
    return removeFocusListener;
  }, [navigation]);

  const removeFromWatchlist = (id: number) => {
    toggleWatchlist(id)
      .then(() => {
        setWatchlist(prev => prev.filter(movie => movie.id !== id));
      })
      .catch(err => {
        console.log('Error removing movie:', err);
      });
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <View style={styles.movieContainer} testID={`movie-item-${item.id}`}>
      <Image source={{ uri: item.poster_url }} style={styles.poster} testID={`movie-poster-${item.id}`} />
      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.movieTitle} testID={`movie-title-${item.id}`}>{item.title}</Text>
          <TouchableOpacity onPress={() => removeFromWatchlist(item.id)} testID={`remove-favorite-${item.id}`}>
            <Icon name="favorite" size={20} color="#FF0000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.year} testID={`movie-year-${item.id}`}>{item.release_year}</Text>
        <Text style={styles.genre} testID={`movie-genre-${item.id}`}>{item.genre}</Text>
        <View style={styles.ratingRow}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText} testID={`movie-rating-${item.id}`}>{item.rating}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container} testID="watchlist-scrollview">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} testID="back-button">
          <Icon name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} testID="header-title">Watchlist</Text>
      </View>

      {loading ? (
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color="#E50914" testID="loading-indicator" />
        </View>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={watchlist.length === 0 ? styles.centeredView : { paddingBottom: 70 }}
          ListEmptyComponent={<Text style={styles.emptyText} testID="empty-text">No movies in your watchlist</Text>}
          testID="watchlist-flatlist"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0F14',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  movieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  poster: {
    width: 130,
    height: 180,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    marginHorizontal: 18,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movieTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  year: {
    color: '#bbb',
    fontSize: 14,
    marginTop: 2,
  },
  genre: {
    color: '#999',
    fontSize: 14,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: '#999',
    marginLeft: 4,
    fontSize: 15,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Watchlist;












































































































// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { getWatchlist, toggleWatchlist } from '../Api/WatchlistApi';
// import { Movie } from '../types/WatchlistTypes';

// const Watchlist = () => {
//   const [watchlist, setWatchlist] = useState<Movie[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const navigation = useNavigation();

//   const fetchWatchlist = async () => {
//     setLoading(true);
//     try {
//       const data = await getWatchlist();
//       setWatchlist(data.movies || []);
//     } catch (error) {
//       console.log('Error fetching watchlist:', error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     const removeFocusListener = navigation.addListener('focus', fetchWatchlist);
//     return removeFocusListener;
//   }, [navigation]);

//   const removeFromWatchlist = (id: number) => {
//     toggleWatchlist(id)
//       .then(() => {
//         setWatchlist(prev => prev.filter(movie => movie.id !== id));
//       })
//       .catch(err => {
//         console.log('Error removing movie:', err);
//       });
//   };

//   const renderItem = ({ item }: { item: Movie }) => (
//     <View style={styles.movieContainer} testID={`movie-item-${item.id}`}>
//       <Image source={{ uri: item.poster_url }} style={styles.poster} testID={`movie-poster-${item.id}`} />
//       <View style={styles.detailsContainer}>
//         <View style={styles.titleRow}>
//           <Text style={styles.movieTitle} testID={`movie-title-${item.id}`}>{item.title}</Text>
//           <TouchableOpacity onPress={() => removeFromWatchlist(item.id)} testID={`remove-favorite-${item.id}`}>
//             <Icon name="favorite" size={20} color="#FF0000" />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.year} testID={`movie-year-${item.id}`}>{item.release_year}</Text>
//         <Text style={styles.genre} testID={`movie-genre-${item.id}`}>{item.genre}</Text>
//         <View style={styles.ratingRow}>
//           <Icon name="star" size={16} color="#FFD700" />
//           <Text style={styles.ratingText} testID={`movie-rating-${item.id}`}>{item.rating}</Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container} testID="watchlist-scrollview">
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} testID="back-button">
//           <Icon name="arrow-back" size={28} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle} testID="header-title">Watchlist</Text>
//       </View>

//       {loading ? (
//         <View style={styles.centeredView}>
//           <ActivityIndicator size="large" color="#E50914" testID="loading-indicator" />
//         </View>
//       ) : (
//         <FlatList
//           data={watchlist}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderItem}
//           contentContainerStyle={watchlist.length === 0 ? styles.centeredView : { paddingBottom: 70 }}
//           ListEmptyComponent={<Text style={styles.emptyText} testID="empty-text">No movies in your watchlist</Text>}
//           testID="watchlist-flatlist"
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0C0F14',
//     paddingTop: 50,
//     paddingHorizontal: 16,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   headerTitle: {
//     color: 'white',
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginLeft: 16,
//   },
//   movieContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1a1a1a',
//     padding: 10,
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   poster: {
//     width: 130,
//     height: 180,
//     borderRadius: 8,
//   },
//   detailsContainer: {
//     flex: 1,
//     marginHorizontal: 18,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   movieTitle: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     flex: 1,
//     marginRight: 8,
//   },
//   year: {
//     color: '#bbb',
//     fontSize: 14,
//     marginTop: 2,
//   },
//   genre: {
//     color: '#999',
//     fontSize: 14,
//     marginTop: 2,
//   },
//   ratingRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   ratingText: {
//     color: '#999',
//     marginLeft: 4,
//     fontSize: 15,
//   },
//   emptyText: {
//     color: '#aaa',
//     textAlign: 'center',
//     fontSize: 16,
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default Watchlist;


