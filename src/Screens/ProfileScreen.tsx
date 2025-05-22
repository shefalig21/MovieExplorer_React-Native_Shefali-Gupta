import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message'; 
import { getUserSubscriptionStatus, getUserSubscriptions } from '../Api/SubscriptionAPI';
import { getUserDetails } from '../Api/UserAPI';
import { User } from '../types/ProfileTypes';
import { RootNavigationProp } from '../types/NavigationTypes';

const ProfileScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();

  const [user, setUser] = useState<User>({ username: '', email: '', role: '', avatar: '', plan: '' });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hasPlan, setHasPlan] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await getUserDetails();
        const username = userDetails.name || '';
        const email = userDetails.email || '';
        const avatar = userDetails.profile_picture_url || '';
        const role = userDetails.role || '';
        const plan = await getUserSubscriptionStatus();

        const planExists = plan && plan.trim() !== '' && plan.toLowerCase() !== 'no plan' && plan.toLowerCase() !== 'free';
        setHasPlan(planExists);

        if (planExists) {
          const subscriptionData = await getUserSubscriptions();
          if (subscriptionData && subscriptionData.length > 0) {
            const { start_date, end_date } = subscriptionData[0];
            setStartDate(start_date);
            setEndDate(end_date);
          }
        }

        setUser(prev => ({
          ...prev,
          username,
          email,
          avatar,
          role,
          plan: plan || ''
        }));
      } catch (err) {
        console.log('Failed to load user data', err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      Toast.show({
        type: 'success',
        text1: 'Logged out successfully',
      });
      navigation.replace('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to log out',
      });
    }
  };

  const displayPlan = () => {
    if (!user.plan || user.plan.trim() === '' || user.plan.toLowerCase() === 'no plan' || user.plan.toLowerCase() === 'free') {
      return 'No Plan';
    }
    return user.plan;
  };

  return (
    <View style={styles.container} testID="profile-screen">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.avatarContainer, hasPlan && { marginBottom: 60 }]}>
          {user.avatar && user.avatar !== 'null' && user.avatar !== '' ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} testID="profile-avatar" />
          ) : (
            <Image source={require('../assets/images/avatar1.jpg')} style={styles.avatar} testID="profile-avatar-default" />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>YOUR NAME</Text>
          <Text style={styles.input} testID="profile-username">{user.username}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>YOUR EMAIL</Text>
          <Text style={styles.input} testID="profile-email">{user.email}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>YOUR ROLE</Text>
          <Text style={styles.input} testID="profile-role">{user.role}</Text>
        </View>

        {hasPlan ? (
          <View style={styles.planBox}>
            <Text style={styles.planTitle}>Your Subscription</Text>

            <View style={styles.planField}>
              <Text style={styles.planLabel}>Plan</Text>
              <Text style={styles.planValue}>{displayPlan()}</Text>
            </View>

            <View style={styles.planField}>
              <Text style={styles.planLabel}>Member Since</Text>
              <Text style={styles.planValue}>{startDate || 'N/A'}</Text>
            </View>

            <View style={styles.planField}>
              <Text style={styles.planLabel}>Expires On</Text>
              <Text style={styles.planValue}>{endDate || 'N/A'}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>YOUR PLAN</Text>
            <Text style={styles.input} testID="profile-plan">{displayPlan()}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.logoutBtn, hasPlan && { marginTop: 30 }]}
          onPress={handleLogout}
          testID="logout-button"
        >
          <Icon name="logout" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0F14',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 120,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FF0000',
    marginTop: 70,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    // borderBottomWidth: 1,
    // borderBottomColor: '#FF0000',
    paddingBottom: 15,
  },
  logoutBtn: {
    backgroundColor: '#FF0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 50,
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: '100%',
    elevation: 5,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  logoutIcon: {
    marginRight: 4,
  },
  planBox: {
    width: '100%',
    backgroundColor: '#1A1C22',
    borderRadius: 12,
    padding: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#FF0000',
    shadowColor: '#FF0000',
    shadowRadius: 6,
    elevation: 4,
    marginTop: 30,
  },
  planTitle: {
    fontSize: 18,
    color: '#FF0000',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  planField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planLabel: {
    color: '#ccc',
    fontSize: 15,
  },
  planValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
























































