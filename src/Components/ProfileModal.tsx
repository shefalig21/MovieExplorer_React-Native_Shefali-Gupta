import React, { useEffect, useState } from 'react';
import { Modal,View,Text,StyleSheet,TouchableOpacity,TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { ProfileModalProps } from '../types/ProfileTypes';

const ProfileModal = ({ visible, onClose }: ProfileModalProps) => {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState({ username: '',email: '',role: '',});

  useEffect(() => {
    const fetchUserData = async () => {
      const username = await AsyncStorage.getItem('userName');
      const email = await AsyncStorage.getItem('userEmail');
      const role = await AsyncStorage.getItem('userRole');

      setUser({
        username: username || '',
        email: email || '',
        role: role || '',
      });
    };

    if (visible) fetchUserData();
  }, [visible]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      Toast.show({
        type: 'success',
        text1: 'Logout Successful',
        text2: 'You have been logged out.',
      });
      onClose();
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

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <Text style={styles.header}>Welcome</Text>

              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{user.username}</Text>

              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>

              <Text style={styles.label}>Role</Text>
              <Text style={styles.value}>{user.role}</Text>

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, 
    paddingRight: 10,

  },
  modalContainer: {
    backgroundColor: '#1A1D24',
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  header: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    letterSpacing:0.4,
  },
  label: {
    color: '#999',
    fontSize: 12,
    marginTop: 10,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    borderBottomColor: '#FF0000',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  logoutButton: {
    marginTop: 25,
    backgroundColor: '#FF0000',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});




