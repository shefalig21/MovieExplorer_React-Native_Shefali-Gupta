import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import SplashScreen from '../src/Screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockReplace = jest.fn();
const navigation = { replace: mockReplace };

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

jest.useFakeTimers();

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the logo initially', () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByTestId } = render(<SplashScreen navigation={navigation} />);
    expect(getByTestId('splashScreen-logo')).toBeTruthy();
  });

  it('navigates to Login if no token found', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    render(<SplashScreen navigation={navigation} />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('Login');
    });
  });

  it('does not show loader initially', () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { queryByTestId } = render(<SplashScreen navigation={navigation} />);

    expect(queryByTestId('splashScreen-loader')).toBeNull();
  });

  it('does not navigate anywhere immediately on render', () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    render(<SplashScreen navigation={navigation} />);

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('does not show loader if token is not present', async () => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

  const { queryByTestId } = render(<SplashScreen navigation={navigation} />);

  act(() => {
    jest.advanceTimersByTime(2000); // let it check token
  });

  await waitFor(() => {
    expect(queryByTestId('splashScreen-loader')).toBeNull();
  });
});
it('shows the logo initially', () => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  const { getByTestId } = render(<SplashScreen navigation={navigation} />);
  expect(getByTestId('splashScreen-logo')).toBeTruthy();
});

it('does not show loader on initial render', () => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  const { queryByTestId } = render(<SplashScreen navigation={navigation} />);
  expect(queryByTestId('splashScreen-loader')).toBeNull();
});
it('does not navigate on initial render', () => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  render(<SplashScreen navigation={navigation} />);
  expect(mockReplace).not.toHaveBeenCalled();
});

});
