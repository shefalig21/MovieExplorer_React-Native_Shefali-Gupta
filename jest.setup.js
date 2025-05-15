import '@testing-library/jest-native/extend-expect';

jest.mock('@react-navigation/native');

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));


jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));