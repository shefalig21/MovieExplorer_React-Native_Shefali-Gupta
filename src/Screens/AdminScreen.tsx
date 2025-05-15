import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Text, Image,Alert,ListRenderItem} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { deleteMovie, getMovies } from '../Api/AdminAPI';
import AddMovieModal from '../Components/AddMovieModal';
import EditMovieModal from '../Components/EditMovieModal';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MovieAPIResponse,Movie } from '../types/AdminTYpe';

const AdminScreen = () => {
  const navigation = useNavigation<any>();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log("Admin token:",token);
      if (!token) {
        navigation.replace('Login');
      }
    };
    checkToken();
  }, []);

  const fetchMovies = async (newPage: number= 1) => {
    try {
      if (newPage === 1) setLoading(true);
      else setLoadingMore(true);

      const data: MovieAPIResponse = await getMovies(newPage);
      if (newPage === 1) {
        setMovies(data.movies);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...data.movies]);
      }
      setTotalPages(data.meta.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleEditMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setEditModalVisible(true);
  };

  const handleModalClose = () => {
    setEditModalVisible(false);
    setSelectedMovie(null);
    fetchMovies(); 
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  };

  const handleDelete = async (id: number) => {
  try {
    await deleteMovie(id);
    Toast.show({
      type: 'success',
      text1: 'Movie deleted successfully',
    });
    fetchMovies(); 
  } catch (error) {
    console.error('Delete Error:', error);
    Toast.show({
      type: 'error',
      text1: 'Failed to delete movie',
      text2: 'Please try again later.',
    });
  }
};

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('token');
     Toast.show({
      type: 'success',
      text1: 'Logout Successful',
      text2: 'You have been logged out.',
    });
    navigation.replace('Login');
  } catch (error) {
    console.error('Logout error:', error);
    Toast.show({
      type: 'error',
      text1: 'Logout Failed',
      text2: 'Something went wrong while logging out.',
    });
  }
};

  const renderMovie: ListRenderItem<Movie>  = ({ item }) => (
    <View style={styles.movieCard}>
      <Image source={{ uri: item.poster_url }} style={styles.poster} />
      <View style={styles.movieInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.year}>{item.release_year}</Text>
      </View>
      <View style={styles.icons}>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleEditMovie(item)}>
          <Icon name="edit" size={22} color="#FF0000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={()=>handleDelete(item.id)}>
          <Icon name="delete" size={22} color="#FF0000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/logo5.png')} style={styles.logo} />
        <TouchableOpacity onPress={openModal}>
          <Icon name="add-circle" size={28} color="#FF0000" style={styles.Icon}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
      <Icon name="person" size={26} color="#FF0000" />
    </TouchableOpacity>

      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF0000" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore && <ActivityIndicator size="small" color="#FF0000" />
          }
        />
      )}

      <AddMovieModal visible={isModalVisible} onClose={closeModal} />

      <EditMovieModal
        visible={editModalVisible}
        movie={selectedMovie}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0F14',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  logo: {
    width: 150,
    height: 120,
    resizeMode: 'contain',
  },
  Icon:{
    marginLeft:150,
  },
  movieCard: {
    backgroundColor: '#1A1D24',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 3,
  },
  poster: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#555',
  },
  movieInfo: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  year: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 4,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    marginHorizontal: 4,
  },
});






















