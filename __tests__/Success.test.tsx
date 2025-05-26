import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Success from '../src/Screens/Success';

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

describe('Success Screen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders all elements correctly', () => {
    const { getByTestId } = render(<Success />);
    
    expect(getByTestId('successImage')).toBeTruthy();
    expect(getByTestId('successTitle').props.children).toBe('Payment Successful!');
    expect(getByTestId('successSubText').props.children).toBe('Your transaction has been completed');
    expect(getByTestId('successBackHomeButton')).toBeTruthy();
    expect(getByTestId('successButtonText').props.children).toBe('Back to Home');
  });

  it('navigates to Main screen on button press', () => {
    const { getByTestId } = render(<Success />);
    
    fireEvent.press(getByTestId('successBackHomeButton'));
    
    expect(mockNavigate).toHaveBeenCalledWith('Main');
  });
});
