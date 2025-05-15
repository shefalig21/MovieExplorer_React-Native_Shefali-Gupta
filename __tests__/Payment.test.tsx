// import React from 'react';
// import { render, waitFor } from '@testing-library/react-native';
// import PaymentScreen from '../src/Screens/PaymentScreen';
// import Toast from 'react-native-toast-message';
// import { WebView } from 'react-native-webview';

// jest.mock('react-native-webview', () => {
//   return {
//     WebView: jest.fn().mockImplementation(({ onNavigationStateChange }) => {
//       onNavigationStateChange({ url: 'https://example.com/success?session_id=test123' });
//       return null;
//     }),
//   };
// });

// jest.mock('react-native-toast-message', () => ({
//   show: jest.fn(),
// }));

// jest.mock('../src/Api/SubscriptionAPI', () => ({
//   confirmSubscriptionSuccess: jest.fn().mockResolvedValue(true),
// }));

// describe('PaymentScreen', () => {
//   const mockGoBack = jest.fn();
//   const mockNavigate = jest.fn();

//   const createTestProps = (props) => ({
//     route: { params: { checkoutUrl: 'https://payment.com/checkout' } },
//     navigation: { navigate: mockNavigate, goBack: mockGoBack },
//     ...props,
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('renders PaymentScreen correctly', () => {
//     const props = createTestProps();
//     const { getByTestId } = render(<PaymentScreen {...props} />);
//     expect(getByTestId('payment-screen')).toBeTruthy();
//     expect(WebView).toHaveBeenCalled();
//   });

//   it('shows toast and navigates on successful payment URL', async () => {
//     const props = createTestProps();
//     render(<PaymentScreen {...props} />);

//     await waitFor(() => {
//       expect(Toast.show).toHaveBeenCalledWith({
//         type: 'success',
//         text1: 'Payment Successful',
//         text2: 'Thank you! Redirecting...',
//       });

//       expect(mockNavigate).toHaveBeenCalledWith('Main');
//     });
//   });

//   it('shows error toast when no checkout URL is provided', async () => {
//     const props = createTestProps({ route: { params: {} } });
//     render(<PaymentScreen {...props} />);

//     await waitFor(() => {
//       expect(Toast.show).toHaveBeenCalledWith({
//         type: 'error',
//         text1: 'Checkout Error',
//         text2: 'No checkout URL provided.',
//       });
//       expect(mockGoBack).toHaveBeenCalled();
//     });
//   });

//   it('handles payment failure correctly', async () => {
//     WebView.mockImplementation(({ onNavigationStateChange }) => {
//       onNavigationStateChange({ url: 'https://example.com/failure' });
//       return null;
//     });

//     const props = createTestProps();
//     render(<PaymentScreen {...props} />);

//     await waitFor(() => {
//       expect(Toast.show).toHaveBeenCalledWith({
//         type: 'error',
//         text1: 'Payment Failed',
//         text2: 'Your payment could not be completed.',
//       });
//       expect(mockGoBack).toHaveBeenCalled();
//     });
//   });

// });
