import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://movie-explorer-ror-varun.onrender.com/api/v1';

export const getMovies = async (page = 1, perPage = 10) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${baseURL}/movies?page=${page}&per_page=${perPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error fetching movies:', error.response?.data || error.message);
    throw error;
  }
};

export const addMovie = async (data) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${baseURL}/movies`,data, {
      headers: {
        "Content-Type": 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Movie added successfully:', response.data);
    return response.data; 
  } catch (error) {
    console.error('Error adding movie:', error.response);
    throw error; 
  }
};


export const updateMovie = async (id, data) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log("In update API:", data);

    const response = await axios.patch(`${baseURL}/movies/${id}`, data, {
      headers: {
        "Content-Type": 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Movie updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating movie:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteMovie = async (id) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.delete(`${baseURL}/movies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('Error deleting movie:', error.response?.data || error.message);
    throw error;
  }
};


