import React, { useEffect, useState } from 'react';
import { View,Text,FlatList,StyleSheet,Image,TouchableOpacity,ScrollView,ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getWatchlist, toggleWatchlist } from '../Api/WatchlistApi';
import { Movie } from '../types/WatchlistTypes';

const Watchlist=()=>{
  const [watchlist,setWatchlist]=useState<Movie[]>([]);
  const [loading,setLoading]=useState<boolean>(true);
  const navigation=useNavigation();

  const fetchWatchlist=async()=>{
    setLoading(true);
    try{
      const data=await getWatchlist();
      setWatchlist(data.movies || []);
    }
    catch(error) {
      console.log('Error fetching watchlist:',error);
    }
    setLoading(false);
  };

  useEffect(()=>{
    const removeFocusListner=navigation.addListener('focus',fetchWatchlist);
    return removeFocusListner;
  },[navigation]);

  const removeFromWatchlist=(id)=>{
    toggleWatchlist(id)
      .then(()=>{
        setWatchlist(prev=>prev.filter(movie=>movie.id !== id));
      })
      .catch(err=>{
        console.log('Error removing movie:',err);
      });
  };

  const renderItem=({ item })=>(
    <View style={styles.movieContainer}>

      <Image source={{ uri: item.poster_url }} style={styles.poster}/>
      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.movieTitle}>{item.title}</Text>

          <TouchableOpacity onPress={()=>removeFromWatchlist(item.id)}>
            <Icon name="favorite" size={20} color="#FF0000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.year}>{item.release_year}</Text>
        <Text style={styles.genre}>{item.genre}</Text>
        <View style={styles.ratingRow}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
    </View>
  );

  return(
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="white"/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
      </View>

      {loading?(
        <ActivityIndicator size="large" color="#E50914" style={{ marginTop: 50 }}/>
      ):watchlist.length=== 0 ?(
        <Text style={styles.emptyText}>No movies in your watchlist</Text>
      ):(
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </ScrollView>
  );
};

const styles=StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#0C0F14',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle:{
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  movieContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  poster:{
    width: 130,
    height: 180,
    borderRadius: 8,
  },
  detailsContainer:{
    flex: 1,
    marginHorizontal: 18,
  },
  titleRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movieTitle:{
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  year:{
    color: '#bbb',
    fontSize: 14,
    marginTop: 2,
  },
  genre:{
    color: '#999',
    fontSize: 14,
    marginTop: 2,
  },
  ratingRow:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText:{
    color: '#FFD700',
    marginLeft: 4,
    fontSize: 15,
  },
  emptyText:{
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});

export default Watchlist;







