import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import MovieCard from './MovieCard';
import { getMovieDetails } from '../Api/MoviesAPI';
import { MoviesListProps,Movie } from '../types/MoviesListTypes';
import { MovieCardData } from '../types/movieCardTypes';

const MoviesList=({ title,onMoviePress,filter=()=>true }: MoviesListProps)=>{

  const [movies,setMovies]=useState<Movie[]>([]);
  const [page,setPage]=useState<number>(1);
  const [totalPages,setTotalPages]=useState<number>(1);
  const [loading,setLoading]=useState<boolean>(true);
  const [loadMore,setLoadMore]=useState<boolean>(false);

  useEffect(()=>{
    loadMovies(1);
  },[]);

  const loadMovies=async(pageNum:number)=>{
    try{
      if(pageNum === 1){
        setLoading(true);
      }
      else{
        setLoadMore(true);
      }

      const data=await getMovieDetails(pageNum);

      const filtered=data.movies.filter(filter);

      setMovies((prev)=>
        pageNum===1?filtered
          :[...prev,...filtered.filter((m: MovieCardData)=>!prev.some((p)=>p.id===m.id))]
      );

      setTotalPages(data.meta.total_pages);
      setPage(pageNum);
    }
    catch(error){
      console.error('Error loading movies:',error);
    }
    finally{
      setLoading(false);
      setLoadMore(false);
    }
  };

  const handleLoadMore=()=>{
    if(!loadMore && page<totalPages) {
      loadMovies(page+1);
    }
  };

  if(loading && page === 1){
    return(
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="#FF0000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>

      <FlatList
        data={movies}
        keyExtractor={(item)=>item.id.toString()}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={() => onMoviePress(item)} testID={`movieCard-${item.id}`} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
        loadMore ? <ActivityIndicator size="small" color="#FF0000"  testID="loadMoreIndicator" /> : null
           }
        testID="flatlist"
      />
    </View>
  );
};

export default MoviesList;

const styles=StyleSheet.create({
  container:{
    marginVertical: 20,
  },
  heading:{
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    paddingHorizontal: 10,
  },
  horizontalList:{
    paddingHorizontal: 10,
  },
  loaderContainer:{
    marginVertical: 20,
    alignItems: 'center',
  },
});















