import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://movie-explorer-ror-varun.onrender.com/api/v1';

export const getUserDetails = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await axios.get(`${baseURL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    return response.data.user;
  } catch (error) {
    console.log('Error fetching user details:', error.message);
    throw error;
  }
};


export const updateProfilePicture = async (profilePicture) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token not found');
    }

    const formData = new FormData();
    formData.append('profile_picture', {
      uri: profilePicture.uri,
      type: 'image/jpeg',
      name: profilePicture.name,
    });

    const response = await axios.post(`${baseURL}/update_profile_picture`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });

    return response.data.user; 
  } catch (error) {
    console.log('Error updating profile picture:', error.message);
    throw error;
  }
};
