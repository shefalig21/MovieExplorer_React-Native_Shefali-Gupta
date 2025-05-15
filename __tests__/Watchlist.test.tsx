import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Watchlist from '../src/Screens/WatchlistScreen';


const mockGoBack = jest.fn();
const mockAddListener = jest.fn((event, callback) => {
  if (event === 'focus') {
    callback();
  }
  return jest.fn(); 
});

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      goBack: mockGoBack,
      addListener: mockAddListener,
    }),
  };
});

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

describe('Watchlist Component', () => {
  it('renders loading indicator initially', () => {
    const { getByTestId } = render(<Watchlist />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('calls navigation.goBack when back button pressed', () => {
    const { getByTestId } = render(<Watchlist />);
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('renders header title correctly', () => {
    const { getByTestId } = render(<Watchlist />);
    const headerTitle = getByTestId('header-title');
    expect(headerTitle.props.children).toBe('Wishlist');
  });

  it('shows loading indicator when component mounts', () => {
  const { getByTestId } = render(<Watchlist />);
  expect(getByTestId('loading-indicator')).toBeTruthy();
});

});
