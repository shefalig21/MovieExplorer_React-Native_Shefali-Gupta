// __tests__/ResultScreen.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import ResultScreen from '../src/Screens/ResultScreen';

// Mock react-navigation hooks
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: {
      searchText: 'Batman',
      genre: undefined,
      year: undefined,
      rating: undefined,
    },
  }),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// Mock your MovieCard component with proper React import and Text component
jest.mock('../src/Components/MovieCard', () => (props: any) => {
  return <Text testID="movie-card">{props.movie?.title || 'Mock Movie'}</Text>;
});

// Mock the API calls (just return dummy data)
jest.mock('../src/Api/MoviesAPI', () => ({
  fetchMoviesBySearch: jest.fn(() => Promise.resolve({
    total_pages: 1,
    movies: [
      { id: 1, title: 'Batman Begins' },
      { id: 2, title: 'The Dark Knight' },
    ],
  })),
  fetchMoviesByGenre: jest.fn(),
  fetchMoviesByReleaseYear: jest.fn(),
  fetchMoviesByRating: jest.fn(),
}));

describe('ResultScreen basic UI tests', () => {
  it('renders header and movie cards', async () => {
    const { findByText, findAllByTestId, getByTestId } = render(<ResultScreen />);

    // Check header text
    expect(await findByText('Search Results for "Batman"')).toBeTruthy();

    // Wait for movie cards to appear
    const cards = await findAllByTestId('movie-card');
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0].props.children).toBe('Batman Begins');

    // Check back button exists
    const backButton = getByTestId('back-button');
    expect(backButton).toBeTruthy();
  });

  it('calls goBack when back button is pressed', () => {
    const navigationMock = jest.fn();
    const goBackMock = jest.fn();

    // Override useNavigation mock
    jest.mock('@react-navigation/native', () => ({
      useRoute: () => ({
        params: {},
      }),
      useNavigation: () => ({
        navigate: jest.fn(),
        goBack: goBackMock,
      }),
    }));

    const { getByTestId } = render(<ResultScreen />);

    fireEvent.press(getByTestId('back-button'));
    expect(goBackMock).toHaveBeenCalled();
  });
});
