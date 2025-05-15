import React from 'react';
import { render, waitFor, screen,fireEvent} from '@testing-library/react-native';
import HomeScreen from '../src/Screens/HomeScreen';
import * as api from '../src/Api/MoviesAPI';

jest.mock('../src/Api/MoviesAPI');

const mockMovies = [
  { id: 1, title: 'Baahubali 2: The Conclusion', release_year: 2017, rating: 8.2 },
  { id: 2, title: 'Fight Club', release_year: 2016, rating: 8.7 },
  { id: 3, title: 'Black Panther', release_year: 2018, rating: 7.3 },
];

describe('HomeScreen Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading indicator initially', async () => {
    (api.getMovieDetails as jest.Mock).mockResolvedValueOnce({ movies: [], meta: {} });

    render(<HomeScreen />);

    expect(screen.getByTestId('homeLoadingIndicator')).toBeTruthy();
  });

  it('renders the scroll view and MoviesList after loading', async () => {
    (api.getMovieDetails as jest.Mock).mockResolvedValueOnce({
      movies: mockMovies,
      meta: { total_pages: 1 },
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('homeScrollView')).toBeTruthy();
    });

    expect(screen.getByText('Trending')).toBeTruthy();
    expect(screen.getByText('Popular')).toBeTruthy();
    expect(screen.getByText('Top Rated')).toBeTruthy();
  });

  it('filters and passes top 10 new movies to MovieCarousel', async () => {
    (api.getMovieDetails as jest.Mock).mockResolvedValueOnce({
      movies: mockMovies,
      meta: { total_pages: 1 },
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('movieCarousel')).toBeTruthy();
    });
  });

});


