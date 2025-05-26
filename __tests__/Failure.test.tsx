import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Failure from '../src/Screens/Failure';
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

describe('Failure Screen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders all components correctly', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Failure />
      </NavigationContainer>
    );

    expect(getByTestId('failureImage')).toBeTruthy();
    expect(getByTestId('failureTitle').props.children).toBe('Payment Failed');
    expect(getByTestId('failureSubText').props.children).toBe('Your transaction could not be completed');
    expect(getByTestId('tryAgainButton')).toBeTruthy();
    expect(getByTestId('backHomeButton')).toBeTruthy();
  });

  it('navigates to Subscription screen on Try Again button press', () => {
    const { getByTestId } = render(<Failure />);
    fireEvent.press(getByTestId('tryAgainButton'));

    expect(mockNavigate).toHaveBeenCalledWith('Main', { screen: 'Subscription' });
  });

  it('navigates to Main screen on Back to Home button press', () => {
    const { getByTestId } = render(<Failure />);
    fireEvent.press(getByTestId('backHomeButton'));

    expect(mockNavigate).toHaveBeenCalledWith('Main');
  });
});
