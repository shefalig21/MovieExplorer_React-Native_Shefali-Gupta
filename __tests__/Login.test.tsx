import React from 'react';
import { render, fireEvent,waitFor } from '@testing-library/react-native';
import Login from '../src/Auth/Login';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

jest.mock('../src/Api/AuthAPI', () => ({
  loginUser: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
}));

describe('Login Screen', () => {
  it('renders login screen correctly', () => {
    const { getByTestId } = render(<Login />);
    expect(getByTestId('login-screen')).toBeTruthy();
  });

  it('shows error if email and password are empty', () => {
    const { getByTestId, getByText } = render(<Login />);
    fireEvent.press(getByTestId('login-button'));
    expect(getByText('Please fill all fields')).toBeTruthy();
  });

  it('shows error if email format is invalid', () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<Login />);
    fireEvent.changeText(getByPlaceholderText('Enter Your Email'), 'shefffgmail');
    fireEvent.changeText(getByPlaceholderText('Enter Your Password'), 'xyz54321');
    fireEvent.press(getByTestId('login-button'));
    expect(getByText('Enter a valid email')).toBeTruthy();
  });

  it('shows error if password is too short or invalid', () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<Login />);
    fireEvent.changeText(getByPlaceholderText('Enter Your Email'), 'shef@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter Your Password'), '54321');
    fireEvent.press(getByTestId('login-button'));
    expect(getByText('Password must be at least 6 characters and include both letters and numbers')).toBeTruthy();
  });

  it('navigates to signup screen when signup button is pressed', () => {
    const { getByTestId } = render(<Login />);
    const signupButton = getByTestId('signup-button');
    expect(signupButton).toBeTruthy();
    fireEvent.press(signupButton);
    expect(mockNavigate).toHaveBeenCalledWith('Signup');
  });

  it('updates input values correctly', () => {
    const { getByPlaceholderText } = render(<Login />);
    const emailInput = getByPlaceholderText('Enter Your Email');
    const passwordInput = getByPlaceholderText('Enter Your Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'pass123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('pass123');
  });

it('toggles password visibility if eye icon is pressed', () => {
    const { getByTestId } = render(<Login />);
    const toggleButton = getByTestId('toggle-password-visibility');
    expect(toggleButton).toBeTruthy();
    fireEvent.press(toggleButton);
  });

  it('shows error toast if login fails (invalid credentials)', async () => {
    const { getByTestId, getByPlaceholderText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText('Enter Your Email'), 'invalid@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter Your Password'), 'wrongpassword');
    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith({
        type: 'error',
        text1: 'Something went wrong',
      });
    });
  });

});



