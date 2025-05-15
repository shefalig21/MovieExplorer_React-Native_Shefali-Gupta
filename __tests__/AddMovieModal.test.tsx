import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import AddMovieModal from '../src/Components/AddMovieModal';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

describe('AddMovieModal Component', () => {
  const mockOnClose = jest.fn();
  const setup = () => render(<AddMovieModal visible={true} onClose={mockOnClose} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields and buttons', () => {
    const { getByTestId } = setup();
    const inputFields = [
      'input-title', 'input-genre', 'input-release_year', 'input-rating', 'input-director',
      'input-duration', 'input-streaming_platform', 'input-main_lead', 'input-description',
    ];
    inputFields.forEach((testID) => {
      expect(getByTestId(testID)).toBeTruthy();
    });
    expect(getByTestId('poster-button')).toBeTruthy();
    expect(getByTestId('banner-button')).toBeTruthy();
    expect(getByTestId('submit-button')).toBeTruthy();
    expect(getByTestId('back-button')).toBeTruthy();
  });

  it('updates state on text input', () => {
    const { getByTestId } = setup();
    fireEvent.changeText(getByTestId('input-title'), 'Inception');
    fireEvent.changeText(getByTestId('input-genre'), 'Sci-Fi');
    fireEvent.changeText(getByTestId('input-release_year'), '2010');
    fireEvent.changeText(getByTestId('input-description'), 'A mind-bending thriller.');

    expect(getByTestId('input-title').props.value).toBe('Inception');
    expect(getByTestId('input-genre').props.value).toBe('Sci-Fi');
    expect(getByTestId('input-release_year').props.value).toBe('2010');
    expect(getByTestId('input-description').props.value).toBe('A mind-bending thriller.');
  });

  it('triggers onClose when back button is pressed', () => {
    const { getByTestId } = setup();
    fireEvent.press(getByTestId('back-button'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows toast if required fields are missing', async () => {
    const { getByTestId } = setup();
    fireEvent.press(getByTestId('submit-button'));
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' })
      );
    });
  });

  it('handles image selection (poster)', async () => {
    const { getByTestId } = setup();
    (launchImageLibrary as jest.Mock).mockImplementationOnce((_, callback) => {
      callback({
        assets: [{ uri: 'poster-uri.jpg' }],
      });
    });
    fireEvent.press(getByTestId('poster-button'));
    await waitFor(() => {
      expect(launchImageLibrary).toHaveBeenCalled();
    });
  });

  it('handles image picker cancel', async () => {
    const { getByTestId } = setup();
    (launchImageLibrary as jest.Mock).mockImplementationOnce((_, callback) => {
      callback({ didCancel: true });
    });
    fireEvent.press(getByTestId('banner-button'));
    await waitFor(() => {
      expect(launchImageLibrary).toHaveBeenCalled();
    });
  });

  it('handles image picker error', async () => {
    const { getByTestId } = setup();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    (launchImageLibrary as jest.Mock).mockImplementationOnce((_, callback) => {
      callback({ errorCode: 'camera_unavailable', errorMessage: 'Camera not available' });
    });
    fireEvent.press(getByTestId('poster-button'));
    await waitFor(() => {
      expect(launchImageLibrary).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
    });
    errorSpy.mockRestore();
  });
});


// import React from 'react';
// import { fireEvent, render, waitFor } from '@testing-library/react-native';
// import AddMovieModal from '../src/Components/AddMovieModal';

// jest.mock('react-native-toast-message', () => ({
//   show: jest.fn(),
// }));

// jest.mock('react-native-image-picker', () => ({
//   launchImageLibrary: jest.fn((_, callback) => callback({ assets: [{ uri: 'dummy-uri' }] })),
// }));

// describe('AddMovieModal', () => {
//   const onClose = jest.fn();

//   it('renders all input fields and buttons', () => {
//     const { getByPlaceholderText, getByTestId } = render(
//       <AddMovieModal visible={true} onClose={onClose} />
//     );

//     expect(getByTestId('back-button')).toBeTruthy();
//     expect(getByPlaceholderText('Enter Title')).toBeTruthy();
//     expect(getByPlaceholderText('Enter Genre')).toBeTruthy();
//     expect(getByPlaceholderText('Enter Release Year')).toBeTruthy();
//     expect(getByPlaceholderText('Enter Rating')).toBeTruthy();
//     expect(getByPlaceholderText('Enter Director')).toBeTruthy();
//     expect(getByPlaceholderText('Enter Duration')).toBeTruthy();
//     expect(getByPlaceholderText('Enter Streaming Platform')).toBeTruthy();
//     expect(getByPlaceholderText('Enter Main Lead')).toBeTruthy();
//     expect(getByPlaceholderText('Enter Description')).toBeTruthy();
//     expect(getByTestId('poster-button')).toBeTruthy();
//     expect(getByTestId('banner-button')).toBeTruthy();
//     expect(getByTestId('submit-button')).toBeTruthy();
//   });

//   it('calls onClose when back button is pressed', () => {
//     const { getByTestId } = render(
//       <AddMovieModal visible={true} onClose={onClose} />
//     );

//     fireEvent.press(getByTestId('back-button'));
//     expect(onClose).toHaveBeenCalled();
//   });

//   it('shows validation error when required fields are missing', async () => {
//     const { getByTestId } = render(
//       <AddMovieModal visible={true} onClose={onClose} />
//     );

//     fireEvent.press(getByTestId('submit-button'));

//     await waitFor(() => {
//       const Toast = require('react-native-toast-message');
//       expect(Toast.show).toHaveBeenCalledWith({
//         type: 'error',
//         text1: 'Validation Error',
//         text2: 'Please fill all required fields.',
//       });
//     });
//   });

//   it('handles poster image selection', async () => {
//     const { getByTestId, getByText } = render(
//       <AddMovieModal visible={true} onClose={onClose} />
//     );

//     fireEvent.press(getByTestId('poster-button'));
//     await waitFor(() => expect(getByText('Change Poster')).toBeTruthy());
//   });

//   it('handles banner image selection', async () => {
//     const { getByTestId, getByText } = render(
//       <AddMovieModal visible={true} onClose={onClose} />
//     );

//     fireEvent.press(getByTestId('banner-button'));
//     await waitFor(() => expect(getByText('Change Banner')).toBeTruthy());
//   });

//   it('fills form fields correctly', () => {
//     const { getByPlaceholderText } = render(
//       <AddMovieModal visible={true} onClose={onClose} />
//     );

//     fireEvent.changeText(getByPlaceholderText('Enter Title'), 'Inception');
//     fireEvent.changeText(getByPlaceholderText('Enter Genre'), 'Sci-Fi');
//     fireEvent.changeText(getByPlaceholderText('Enter Release Year'), '2010');

//     expect(getByPlaceholderText('Enter Title').props.value).toBe('Inception');
//     expect(getByPlaceholderText('Enter Genre').props.value).toBe('Sci-Fi');
//     expect(getByPlaceholderText('Enter Release Year').props.value).toBe('2010');
//   });
// });
