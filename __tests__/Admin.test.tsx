import React from 'react';
import { render } from '@testing-library/react-native';
import AdminScreen from '../src/Screens/AdminScreen';

describe('AdminScreen basic render', () => {
  it('renders component and verifies presence of testIDs', () => {
    const { getByTestId } = render(<AdminScreen />);
    
    expect(getByTestId('add-movie-button')).toBeTruthy();
    expect(getByTestId('logout-button')).toBeTruthy();
    expect(getByTestId('movies-flatlist')).toBeTruthy();
    expect(getByTestId('add-movie-modal')).toBeTruthy();
    expect(getByTestId('edit-movie-modal')).toBeTruthy();
  });
});