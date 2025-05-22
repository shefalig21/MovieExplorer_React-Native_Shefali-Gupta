import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "https://movie-explorer-ror-varun.onrender.com/api/v1";

export const createSubscription = async (plan_type) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Retrieved token:', token);

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.post(`${baseURL}/user_subscriptions`, { plan_type }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.url) {
      console.log('Subscription response:', response.data);
      return { checkout_url: response.data.url }; 
    } else {
      throw new Error('No checkout URL returned from the server');
    }
  } catch (error) {
    console.error('Error creating subscription:', error.response?.data || error.message);
    throw error;
  }
};


export const confirmSubscriptionSuccess = async (session_id) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${baseURL}/user_subscriptions/success?session_id=${session_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Error confirming subscription success:', error.response?.data || error.message);
    throw error;
  }
};


export const getUserSubscriptionStatus = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.get(`${baseURL}/user_subscriptions/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.plan_type; 
  } catch (error) {
    console.log('❌ Error fetching plan type:', error.response?.data || error.message);
    return 'Free'; 
  }
};

export const getUserSubscriptions = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(`${baseURL}/user_subscriptions`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; 
  } catch (error) {
    console.error('Error fetching user subscriptions:', error.response?.data || error.message);
    throw error;
  }
};