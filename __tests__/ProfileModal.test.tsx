import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileModal from '../src/Components/ProfileModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockReplace = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      replace: mockReplace,
    }),
  };
});

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('ProfileModal', () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem = jest.fn((key) => {
      switch (key) {
        case 'userName':
          return Promise.resolve('Shefali');
        case 'userEmail':
          return Promise.resolve('shefali@example.com');
        case 'userRole':
          return Promise.resolve('Admin');
        default:
          return Promise.resolve(null);
      }
    });
  });

  it('renders user details correctly when visible', async () => {
    const { getByTestId } = render(
      <ProfileModal visible={true} onClose={onCloseMock} />
    );

    await waitFor(() => {
      expect(getByTestId('profileHeader').props.children).toBe('Welcome');
      expect(getByTestId('profileName').props.children).toBe('Shefali');
      expect(getByTestId('profileEmail').props.children).toBe('shefali@example.com');
      expect(getByTestId('profileRole').props.children).toBe('Admin');
    });
  });

  it('calls logout logic and navigates to Login screen', async () => {
    AsyncStorage.removeItem = jest.fn(() => Promise.resolve());

    const { getByTestId } = render(
      <ProfileModal visible={true} onClose={onCloseMock} />
    );

    fireEvent.press(getByTestId('logoutButton'));

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockReplace).toHaveBeenCalledWith('Login');
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
