import React, { useEffect, useState } from 'react';
import { View,Text,StyleSheet,Image,TouchableOpacity,ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message'; 
import { getUserSubscriptionStatus } from '../Api/SubscriptionAPI';

const ProfileScreen=()=>{
  const navigation=useNavigation<any>();
  const [user,setUser]=useState({username: '',email: '',role: '',avatar: '',plan: '' });

  useEffect(()=>{
    const fetchUser=async()=>{
      try{
        const username=await AsyncStorage.getItem('userName');
        const email=await AsyncStorage.getItem('userEmail');
        const avatar=await AsyncStorage.getItem('userAvatar');
        const role=await AsyncStorage.getItem('userRole');

        const plan=await getUserSubscriptionStatus();

        console.log('Loaded from AsyncStorage:',{username,email,avatar,role,plan});

        setUser(prev=>({...prev,
          username: username || '',
          email: email || '',
          avatar: avatar || '',
          role: role || '',
          plan: plan || ''
        }));
      } catch (err) {
        console.log('Failed to load user data');
      }
    };
    fetchUser();
  }, []);

  const handleLogout=async()=>{
    try{
      await AsyncStorage.removeItem('token');
      Toast.show({
        type: 'success',
        text1: 'Logged out successfully',
      });
      navigation.replace('Login');
    }catch (error) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to log out',
      });
    }
  };

  const displayPlan = () => {
  if ( !user.plan || user.plan.trim() === '' || user.plan.toLowerCase() === 'no plan' || user.plan.toLowerCase() === 'free' 
  ) {
    return 'No Plan';
  }
  return user.plan;
};

  return(
    <View style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.avatarContainer}>
          {user.avatar && user.avatar !== 'null' && user.avatar !== '' ?(
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
           ):(
          <Image source={require('../assets/images/avatar1.jpg')} style={styles.avatar}/>
        )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>YOUR NAME</Text>
          <Text style={styles.input}>{user.username}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>YOUR EMAIL</Text>
          <Text style={styles.input}>{user.email}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>YOUR ROLE</Text>
          <Text style={styles.input}>{user.role}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>YOUR PLAN</Text>
          <Text style={styles.input}>{displayPlan()}</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles= StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#0C0F14',
  },
  scrollContainer:{
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  avatarContainer:{
    marginBottom: 120, 
    alignItems: 'center',
  },
  avatar:{
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FF0000',
    marginTop: 70,
  },
  inputGroup:{
    width: '100%',
    marginBottom: 30,
  },
  label:{
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  input:{
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 15,
  },
  logoutBtn:{
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
  logoutText:{
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 15,
  },
  logoutIcon:{
    marginRight: 4,
  },
});


