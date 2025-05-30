import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL='https://movie-explorer-ror-varun.onrender.com/api/v1';

export const updateDeviceToken=async(device_token)=>{
    try{
        const token = await AsyncStorage.getItem('token');

        const response = await axios.post(`${baseURL}/update_device_token`,
            {
                device_token:device_token
            },
            {
                headers:{ Authorization: `Bearer ${token}`,}
            })
            return response.data;
    }
    catch(error)
    {
        throw error;
    }
}


export const toggleNotifications = async (notificationsEnabled) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.post(`${baseURL}/toggle_notifications`,
      { notifications_enabled: notificationsEnabled },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};



