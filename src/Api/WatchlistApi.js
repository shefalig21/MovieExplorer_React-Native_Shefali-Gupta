import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://movie-explorer-ror-varun.onrender.com/api/v1/movies';

export const toggleWatchlist = async (movieId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}/toggle_watchlist`,{ movie_id: movieId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.message;
  } catch (error) {
    console.error('Toggle watchlist error:', error.response?.data || error.message);
    throw error;
  }
};

export const getWatchlist= async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/watchlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get watchlist error:', error.response?.data || error.message);
    throw error;
  }
};
