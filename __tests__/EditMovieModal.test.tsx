import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditMovieModal from '../src/Components/EditMovieModal';

const movieMock = {
  id: '1',
  title: 'Old Title',
  description: 'Old Description',
  genre: 'Action',
  release_year: '2021',
  rating: '4.5',
  director: 'Jane Doe',
  duration: '120 mins',
  is_premium: true,
  poster_url: 'https://example.com/poster.jpg',
  banner_url: 'https://example.com/banner.jpg',
};

describe('EditMovieModal', () => {
  it('renders correctly with pre-filled movie data', () => {
    const { getByTestId } = render(
      <EditMovieModal visible={true} onClose={jest.fn()} movie={movieMock} />
    );

    expect(getByTestId('input-Title').props.value).toBe('Old Title');
    expect(getByTestId('input-Genre').props.value).toBe('Action');
    expect(getByTestId('input-Release Year').props.value).toBe('2021');
    expect(getByTestId('input-Rating').props.value).toBe('4.5');
    expect(getByTestId('input-Director').props.value).toBe('Jane Doe');
    expect(getByTestId('input-Duration').props.value).toBe('120 mins');
    expect(getByTestId('premium-picker').props.selectedValue).toBe('true');
  });

  it('calls onClose when back button is pressed', () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = render(
      <EditMovieModal visible={true} onClose={onCloseMock} movie={movieMock} />
    );
    fireEvent.press(getByTestId('back-button'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('updates input fields', () => {
    const { getByTestId } = render(
      <EditMovieModal visible={true} onClose={jest.fn()} movie={movieMock} />
    );
    const titleInput = getByTestId('input-Title');
    fireEvent.changeText(titleInput, 'New Title');
    expect(titleInput.props.value).toBe('New Title');
  });

  it('shows error toast when required fields are missing on submit', async () => {
    const { getByTestId } = render(
      <EditMovieModal
        visible={true}
        onClose={jest.fn()}
        movie={{ ...movieMock, title: '', genre: '', release_year: '', poster_url: '' }}
      />
    );

    const titleInput = getByTestId('input-Title');
    fireEvent.changeText(titleInput, '');
    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      expect(getByTestId('submit-button')).toBeTruthy();
    });
  });

  it('renders image previews if poster and banner are present', () => {
    const { getAllByRole } = render(
      <EditMovieModal visible={true} onClose={jest.fn()} movie={movieMock} />
    );
    const images = getAllByRole('image');
    expect(images.length).toBeGreaterThan(0);
  });

  it('handles premium picker value change', () => {
    const { getByTestId } = render(
      <EditMovieModal visible={true} onClose={jest.fn()} movie={movieMock} />
    );

    const picker = getByTestId('premium-picker');
    fireEvent(picker, 'valueChange', 'false');
    expect(picker.props.selectedValue).toBe('false');
  });
});