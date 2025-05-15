jest.mock('react-native-reanimated-carousel');

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MovieCarousel from '../src/components/MovieCarousel';
import { NavigationContainer } from '@react-navigation/native';

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

const mockMovies = [
  {
    id: 1,
    title: 'Inception',
    genre: 'Sci-Fi',
    rating: '8.8',
  },
  {
    id: 2,
    title: 'The Matrix',
    genre: 'Action',
    rating: '8.7',
  },
];

describe('MovieCarousel Component', () => {
  it('renders movie cards correctly', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <MovieCarousel movies={mockMovies} />
      </NavigationContainer>
    );

    expect(getByTestId('movie-card-0')).toBeTruthy();
    expect(getByTestId('movie-title-0').props.children).toBe('Inception');
    expect(getByTestId('movie-genre-0').props.children).toBe('Sci-Fi');
    expect(getByTestId('movie-rating-0').props.children).toBe('8.8');
  });

  //  it('displays More Details button', () => {
  //   const { getByTestId } = render(
  //     <NavigationContainer>
  //       <MovieCarousel movies={mockMovies} />
  //     </NavigationContainer>
  //   );

  //   expect(getByTestId('more-details')).toBeTruthy();
  // });

  it('navigates to MovieDetails screen when More Details is pressed', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <MovieCarousel movies={mockMovies} />
      </NavigationContainer>
    );

    fireEvent.press(getByTestId('watch-now-btn-0'));
    expect(mockNavigate).toHaveBeenCalledWith('MovieDetails', { movie: mockMovies[0] });
  });
});
