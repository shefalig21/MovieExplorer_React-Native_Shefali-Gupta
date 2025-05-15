import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Signup from '../src/Auth/Signup';
import Toast from 'react-native-toast-message'; 


jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));


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

describe('Signup Screen', () => {

  it('renders signup screen correctly', () => {
    const { getByTestId } = render(<Signup />);
    expect(getByTestId('signup-image')).toBeTruthy();
    expect(getByTestId('name-input')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('confirmPassword-input')).toBeTruthy();
  });

  it('shows error if fields are empty', () => {
    const { getByTestId, getByText } = render(<Signup />);
    fireEvent.press(getByTestId('signup-button'));
    expect(getByText('Please fill all fields')).toBeTruthy();
  });

  it('shows error for invalid name', () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<Signup />);
    fireEvent.changeText(getByPlaceholderText('Enter Your Name'), 'S');
    fireEvent.changeText(getByPlaceholderText('Enter Your Email'), 'sheff@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter Your Password'), 'pass123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'pass123');
    fireEvent.press(getByTestId('signup-button'));
    expect(getByText('Enter a valid name, at least 2 letters')).toBeTruthy();
  });

  it('shows error for invalid email', () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<Signup />);
    fireEvent.changeText(getByPlaceholderText('Enter Your Name'), 'Shefali');
    fireEvent.changeText(getByPlaceholderText('Enter Your Email'), 'shef.com');
    fireEvent.changeText(getByPlaceholderText('Enter Your Password'), 'pass123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'pass123');
    fireEvent.press(getByTestId('signup-button'));
    expect(getByText('Enter a valid email')).toBeTruthy();
  });

  it('shows error for invalid password', () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<Signup />);
    fireEvent.changeText(getByPlaceholderText('Enter Your Name'), 'Shefali');
    fireEvent.changeText(getByPlaceholderText('Enter Your Email'), 'shef@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter Your Password'), '123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), '123');
    fireEvent.press(getByTestId('signup-button'));
    expect(getByText('Password must be at least 6 characters and include both letters and numbers')).toBeTruthy();
  });

  it('shows error if passwords do not match', () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<Signup />);
    fireEvent.changeText(getByPlaceholderText('Enter Your Name'), 'Shefali');
    fireEvent.changeText(getByPlaceholderText('Enter Your Email'), 'sheff@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter Your Password'), 'pass123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'pass124');
    fireEvent.press(getByTestId('signup-button'));
    expect(getByText('Passwords do not match')).toBeTruthy();
  });

  
  it('updates input values correctly', () => {
    const { getByPlaceholderText } = render(<Signup />);
    const nameInput = getByPlaceholderText('Enter Your Name');
    const emailInput = getByPlaceholderText('Enter Your Email');
    const passwordInput = getByPlaceholderText('Enter Your Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');

    fireEvent.changeText(nameInput, 'Sheff');
    fireEvent.changeText(emailInput, 'sheff@example.com');
    fireEvent.changeText(passwordInput, 'pass123');
    fireEvent.changeText(confirmPasswordInput, 'pass123');

    expect(nameInput.props.value).toBe('Sheff');
    expect(emailInput.props.value).toBe('sheff@example.com');
    expect(passwordInput.props.value).toBe('pass123');
    expect(confirmPasswordInput.props.value).toBe('pass123');
  });

   it('navigates to login screen on link press', () => {
    const { getByTestId } = render(<Signup />);
    fireEvent.press(getByTestId('login-navigation'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
 
});