import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MoviesList from '../src/components/MoviesList';
import { getMovieDetails } from '../src/Api/MoviesAPI';

jest.mock('../src/Api/MoviesAPI', () => ({
  getMovieDetails: jest.fn(),
}));

jest.mock('../src/components/MovieCard', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return ({ movie, onPress, testID }) => (
    <TouchableOpacity onPress={onPress} testID={testID}>
      <Text>{movie.title}</Text>
    </TouchableOpacity>
  );
});

describe('MoviesList Component', () => {
  const mockMovies = [
    { id: 1, title: 'Beauty and Beast' },
    { id: 2, title: 'Interstellar' },
  ];

  const mockMeta = {
    total_pages: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading indicator initially', async () => {
    (getMovieDetails as jest.Mock).mockImplementation(() => 
      new Promise((resolve) => setTimeout(() => resolve({ movies: mockMovies, meta: mockMeta }), 100))
    );

    const { queryByTestId, getByTestId } = render(
      <MoviesList title="Test Movies" onMoviePress={() => {}} />
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();

    expect(queryByTestId('flatlist')).toBeNull();

    await waitFor(() => {
      expect(getByTestId('flatlist')).toBeTruthy();
    });
  });

  test('renders title and movie cards after loading', async () => {
    (getMovieDetails as jest.Mock).mockResolvedValue({ movies: mockMovies, meta: mockMeta });

    const { getByText, getByTestId } = render(
      <MoviesList title="Test Movies" onMoviePress={() => {}} />
    );

    await waitFor(() => {
      expect(getByText('Test Movies')).toBeTruthy();

      mockMovies.forEach((movie) => {
        expect(getByTestId(`movieCard-${movie.id}`)).toBeTruthy();
      });
    });
  });

  test('calls onMoviePress when a MovieCard is pressed', async () => {
    (getMovieDetails as jest.Mock).mockResolvedValue({ movies: mockMovies, meta: mockMeta });

    const onMoviePressMock = jest.fn();

    const { getByTestId } = render(
      <MoviesList title="Test Movies" onMoviePress={onMoviePressMock} />
    );

    await waitFor(() => {
      expect(getByTestId('movieCard-1')).toBeTruthy();
    });

    fireEvent.press(getByTestId('movieCard-1'));

    expect(onMoviePressMock).toHaveBeenCalledWith(mockMovies[0]);
  });

  test('shows ActivityIndicator when loadMore is true', async () => {
    (getMovieDetails as jest.Mock).mockResolvedValue({ movies: mockMovies, meta: { total_pages: 2 } });

    const { getByTestId, queryByTestId } = render(
      <MoviesList title="Test Movies" onMoviePress={() => {}} />
    );
    await waitFor(() => {
      expect(getByTestId('movieCard-1')).toBeTruthy();
    });

    fireEvent(getByTestId('flatlist'), 'onEndReached');

    await waitFor(() => {
      expect(getByTestId('loadMoreIndicator')).toBeTruthy();
    });

    await waitFor(() => {
      expect(queryByTestId('loadMoreIndicator')).toBeNull();
    });
  });

  test('does not call loadMovies if loadMore is true or page equals totalPages', async () => {
    (getMovieDetails as jest.Mock).mockResolvedValue({ movies: mockMovies, meta: { total_pages: 1 } });

    const { getByTestId } = render(
      <MoviesList title="Test Movies" onMoviePress={() => {}} />
    );

    await waitFor(() => {
      expect(getByTestId('movieCard-1')).toBeTruthy();
    });

    fireEvent(getByTestId('flatlist'), 'onEndReached');

    expect(getMovieDetails).toHaveBeenCalledTimes(1);
  });
});
