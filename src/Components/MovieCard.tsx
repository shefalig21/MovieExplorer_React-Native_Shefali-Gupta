import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MovieCardProps } from '../types/movieCardTypes';

const MovieCard = ({ movie, onPress }: MovieCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} testID="movie-card">
      <Image source={{ uri: movie.poster_url }} style={styles.image} testID="movie-card-image" />

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2} testID="movie-card-title">{movie.title}</Text>
        <Text style={styles.detail} numberOfLines={1} testID="movie-card-genre">{movie.genre}</Text>
        <View style={styles.Row}>
          <Text style={styles.year} testID="movie-card-release-year">{movie.release_year}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.year} testID="movie-card-duration">{movie.duration}h</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles=StyleSheet.create({
  card:{
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
  image:{
    width: '100%',
    height: 310,
    resizeMode: 'cover',
  },
  infoContainer:{
    backgroundColor: '#2C2F36',
    paddingVertical: 10,
    paddingHorizontal: 8,
    flex: 1,
    justifyContent: 'center',
  },
  title:{
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  detail:{
    color: '#BBBBBB',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 6,
  },
  Row:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  year:{
    color: '#999999',
    fontSize: 11,
  },
  dot:{
    color: '#999999',
    fontSize: 11,
    marginHorizontal: 5,
  },
});

export default MovieCard;




















// import React from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import { MovieCardProps } from '../types/movieCardTypes';

// const MovieCard = ({ movie, onPress }: MovieCardProps) => {
//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress} testID="movie-card">
//       <Image source={{ uri: movie.poster_url }} style={styles.image} testID="movie-card-image" />

//       <View style={styles.infoContainer}>
//         <Text style={styles.title} numberOfLines={2} testID="movie-card-title">{movie.title}</Text>
//         <Text style={styles.detail} numberOfLines={1} testID="movie-card-genre">{movie.genre}</Text>
//         <View style={styles.Row}>
//           <Text style={styles.year} testID="movie-card-release-year">{movie.release_year}</Text>
//           <Text style={styles.dot}>•</Text>
//           <Text style={styles.year} testID="movie-card-duration">{movie.duration}h</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles=StyleSheet.create({
//   card:{
//     backgroundColor: '#1C1F26',
//     borderRadius: 14,
//     overflow: 'hidden',
//     marginRight: 14,
//     width: 200,
//     height: 400,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowRadius: 6,   
//   },
//   image:{
//     width: '100%',
//     height: 310,
//     resizeMode: 'cover',
//   },
//   infoContainer:{
//     backgroundColor: '#2C2F36',
//     paddingVertical: 10,
//     paddingHorizontal: 8,
//     flex: 1,
//     justifyContent: 'center',
//   },
//   title:{
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   detail:{
//     color: '#BBBBBB',
//     fontSize: 12,
//     textAlign: 'center',
//     marginBottom: 6,
//   },
//   Row:{
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   year:{
//     color: '#999999',
//     fontSize: 11,
//   },
//   dot:{
//     color: '#999999',
//     fontSize: 11,
//     marginHorizontal: 5,
//   },
// });

// export default MovieCard;




