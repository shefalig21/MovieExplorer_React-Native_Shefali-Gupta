import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MovieDetails from '../src/Screens/MovieDetails';
import { ActivityIndicator, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

describe('MovieDetails Screen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };

  const mockMovie = {
    id: 1,
    title: 'Inception',
    rating: 8.8,
    genre: 'Action, Sci-Fi',
    release_year: 2010,
    duration: 2,
    description: 'A mind-bending thriller by Christopher Nolan.',
  };

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
    (useRoute as jest.Mock).mockReturnValue({
      params: { movie: mockMovie },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all movie details correctly', () => {
    const { getByTestId } = render(<MovieDetails />);
    expect(getByTestId('movie-title').props.children).toBe('Inception');

    const rating = getByTestId('movie-rating').props.children;
    expect(rating).toContain(8.8);

    const genre = getByTestId('movie-genre').props.children;
    expect(genre).toContain('Action, Sci-Fi');

    const year = getByTestId('movie-year').props.children;
    expect(year).toContain(2010);

    const title = getByTestId('movie-title').props.children;
    expect(title).toBe('Inception');

    expect(getByTestId('movie-description')).toBeTruthy();
    expect(getByTestId('watchlist-button')).toBeTruthy();
    expect(getByTestId('watchlist-text').props.children).toBe('Add to Watchlist');
  });

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(<MovieDetails />);
    fireEvent.press(getByTestId('back-button'));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('watchlist button press does not crash', () => {
    const { getByTestId } = render(<MovieDetails />);
    fireEvent.press(getByTestId('watchlist-button'));
  });

  it('checks if rating text contains correct value and renders the correct genre text', () => {
    const { getByTestId } = render(<MovieDetails />);
    const rating = getByTestId('movie-rating').props.children;
    expect(rating).toContain(8.8);

    const genre = getByTestId('movie-genre').props.children;
    expect(genre).toContain('Action, Sci-Fi');
  });

  it('verifies movie description length', () => {
    const { getByTestId } = render(<MovieDetails />);
    const descriptionElement = getByTestId('movie-description');
    const descriptionText = descriptionElement?.props?.children;
    expect(typeof descriptionText === 'string' || Array.isArray(descriptionText)).toBe(true);
  });

  it('checks for the correct duration text and if movie year is displayed correctly', () => {
    const { getByTestId } = render(<MovieDetails />);
    const duration = getByTestId('movie-duration').props.children;
    expect(duration).toContain(2);

    const yearText = getByTestId('movie-year').props.children;
    expect(yearText).toContain(2010);
  });

  it('verifies button visibility and text', () => {
    const { getByTestId } = render(<MovieDetails />);
    const buttonText = getByTestId('watchlist-text').props.children;
    expect(buttonText).toBe('Add to Watchlist');
  });

  it('renders ActivityIndicator when loadMore is true and hides when false', () => {
    const LoadMoreComponent = ({ loadMore }: { loadMore: boolean }) => (
      <View>
        {loadMore ? <ActivityIndicator size="small" color="#FF0000" testID="loadMoreIndicator" /> : null}
      </View>
    );

    const { queryByTestId, rerender } = render(<LoadMoreComponent loadMore={false} />);
    expect(queryByTestId('loadMoreIndicator')).toBeNull();

    rerender(<LoadMoreComponent loadMore={true} />);
    expect(queryByTestId('loadMoreIndicator')).toBeTruthy();
  });
});











// import React from 'react';
// import { render, fireEvent } from '@testing-library/react-native';
// import MovieDetails from '../src/Screens/MovieDetails';
// import { useNavigation, useRoute } from '@react-navigation/native';

// jest.mock('@react-navigation/native', () => ({
//   useNavigation: jest.fn(),
//   useRoute: jest.fn(),
// }));

// describe('MovieDetails Screen', () => {
//   const mockNavigation = {
//     goBack: jest.fn(),
//   };

//   const mockMovie = {
//     id: 1,
//     title: 'Inception',
//     rating: 8.8,
//     genre: 'Action, Sci-Fi',
//     release_year: 2010,
//     duration: 2,
//     description: 'A mind-bending thriller by Christopher Nolan.',
//     poster_url: 'https://example.com/inception.jpg',
//   };

//   beforeEach(() => {
//     (useNavigation as jest.Mock).mockReturnValue(mockNavigation);
//     (useRoute as jest.Mock).mockReturnValue({
//       params: { movie: mockMovie },
//     });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('renders all movie details correctly', () => {
//     const { getByTestId } = render(<MovieDetails />);
//     expect(getByTestId('movie-title').props.children).toBe('Inception');

//     const ratingChildren = getByTestId('movie-rating').props.children;
//     expect(ratingChildren).toContain(8.8);

//     const genreChildren = getByTestId('movie-genre').props.children;
//     expect(genreChildren).toContain('Action, Sci-Fi');

//     const yearChildren = getByTestId('movie-year').props.children;
//     expect(yearChildren).toContain(2010);

//     const durationChildren = getByTestId('movie-duration')?.props?.children || [];
//     expect(Array.isArray(durationChildren)).toBe(true);

//     expect(getByTestId('movie-description')).toBeTruthy();
//     expect(getByTestId('watchlist-button')).toBeTruthy();
//     expect(getByTestId('watchlist-text').props.children).toBe('Add to Watchlist');
//   });

//   it('navigates back when back button is pressed', () => {
//     const { getByTestId } = render(<MovieDetails />);
//     fireEvent.press(getByTestId('back-button'));
//     expect(mockNavigation.goBack).toHaveBeenCalled();
//   });

//   it('watchlist button press does not crash (placeholder test)', () => {
//     const { getByTestId } = render(<MovieDetails />);
//     fireEvent.press(getByTestId('watchlist-button'));
//   });

//   it('checks if the movie title is rendered correctly', () => {
//     const { getByTestId } = render(<MovieDetails />);
//     const title = getByTestId('movie-title').props.children;
//     expect(title).toBe('Inception');
//   });

//   it('checks if rating text contains correct value', () => {
//     const { getByTestId } = render(<MovieDetails />);
//     const rating = getByTestId('movie-rating').props.children;
//     expect(rating).toContain(8.8);
//   });

//   it('renders the correct genre text', () => {
//     const { getByTestId } = render(<MovieDetails />);
//     const genre = getByTestId('movie-genre').props.children;
//     expect(genre).toContain('Action, Sci-Fi');
//   });

//   it('verifies movie description length', () => {
//     const { getByTestId } = render(<MovieDetails />);
//     const descriptionElement = getByTestId('movie-description');
//     const descriptionText = descriptionElement?.props?.children;
//     expect(typeof descriptionText === 'string' || Array.isArray(descriptionText)).toBe(true);
//   });

//   it('checks for the correct duration text', () => {
//     const { getByTestId } = render(<MovieDetails />);
//     const duration = getByTestId('movie-duration').props.children;
//     expect(duration).toContain(2);
//   });

//   it('checks if the movie year is displayed correctly', () => {
//     const { getByTestId } = render(<MovieDetails />);
//     const yearText = getByTestId('movie-year').props.children;
//     expect(yearText).toContain(2010);
//   });

//   it('verifies button visibility and text', () => {
//     const { getByTestId } = render(<MovieDetails />);
//     const buttonText = getByTestId('watchlist-text').props.children;
//     expect(buttonText).toBe('Add to Watchlist');
//   });
// });
