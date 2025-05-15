import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Header from '../src/Components/Header';

describe('Header Component', () => {
  const mockNavigate = jest.fn();
  const mockNavigation = { navigate: mockNavigate };

  it('renders logo image', () => {
    const { getByTestId } = render(<Header navigation={mockNavigation} />);
    expect(getByTestId('logo-image')).toBeTruthy();
  });

  it('renders notification button', () => {
    const { getByTestId } = render(<Header navigation={mockNavigation} />);
    expect(getByTestId('notification-button')).toBeTruthy();
  });
});                                                            









