
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MovieCard from '../src/Components/MovieCard';

describe('MovieCard', () => {
  const mockMovie = {
    title: 'Joker',
    genre: 'Crime',
    release_year: '2019',
    duration: '2',
  };

  it('renders movie details correctly', () => {
    const { getByTestId } = render(
      <MovieCard movie={mockMovie} onPress={jest.fn()} />
    );

    expect(getByTestId('movie-card-title').props.children).toBe('Joker');
    expect(getByTestId('movie-card-genre').props.children).toBe('Crime');
    expect(getByTestId('movie-card-release-year').props.children).toBe('2019');
    expect(getByTestId('movie-card-duration').props.children.join('')).toBe('2h');

  });

  it('calls onPress when card is pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <MovieCard movie={mockMovie} onPress={onPressMock} />
    );

    fireEvent.press(getByTestId('movie-card'));
    expect(onPressMock).toHaveBeenCalled();
  });
});





