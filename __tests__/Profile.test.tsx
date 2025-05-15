import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../src/Screens/ProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key) => {
    const data = {
      userName: 'Test User',
      userEmail: 'test@example.com',
      userAvatar: '',
      userRole: 'tester',
    };
    return Promise.resolve(data[key] || '');
  }),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

const mockReplace = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    replace: mockReplace,
  }),
}));

describe('ProfileScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders labels correctly', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('YOUR NAME')).toBeTruthy();
    expect(getByText('YOUR EMAIL')).toBeTruthy();
    expect(getByText('YOUR ROLE')).toBeTruthy();
    expect(getByText('YOUR PLAN')).toBeTruthy();
  });

  it('displays user data correctly', async () => {
    const { getByTestId } = render(<ProfileScreen />);
    await waitFor(() => {
      expect(getByTestId('profile-username').props.children).toBe('Test User');
      expect(getByTestId('profile-email').props.children).toBe('test@example.com');
      expect(getByTestId('profile-role').props.children).toBe('tester');
      expect(getByTestId('profile-plan').props.children).toBe('No Plan'); 
    });
  });

  it('shows default avatar if no avatar', async () => {
    const { getByTestId } = render(<ProfileScreen />);
    await waitFor(() => {
      expect(getByTestId('profile-avatar-default')).toBeTruthy();
    });
  });

  it('logout button calls removeItem, shows toast, and navigates', async () => {
    const { getByTestId } = render(<ProfileScreen />);
    const logoutBtn = await waitFor(() => getByTestId('logout-button'));
    fireEvent.press(logoutBtn);
    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('token');
      expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
      expect(mockReplace).toHaveBeenCalledWith('Login');
    });
  });

  it('shows error toast if logout fails', async () => {
    AsyncStorage.removeItem.mockImplementationOnce(() => Promise.reject('error'));
    const { getByTestId } = render(<ProfileScreen />);
    const logoutBtn = await waitFor(() => getByTestId('logout-button'));
    fireEvent.press(logoutBtn);
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
    });
  });
});
