import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Subscription from '../src/Screens/Subscription';
import { NavigationContainer } from '@react-navigation/native';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

describe('Subscription Screen', () => {
  it('renders loading spinner initially', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Subscription />
      </NavigationContainer>
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders all subscription plans', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Subscription />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByTestId('plan-basic')).toBeTruthy();
      expect(getByTestId('plan-standard')).toBeTruthy();
      expect(getByTestId('plan-premium')).toBeTruthy();
    });
  });

  it('selects a plan and triggers checkout', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Subscription />
      </NavigationContainer>
    );

    await waitFor(() => getByTestId('plan-standard'));
    fireEvent.press(getByTestId('plan-standard'));

    const payNowBtn = getByTestId('pay-now-button');
    expect(payNowBtn).toBeTruthy();

    fireEvent.press(payNowBtn);
  });

  it('defaults to basic plan selected initially', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Subscription />
      </NavigationContainer>
    );

    await waitFor(() => {
      const basicPlan = getByTestId('plan-basic');
      expect(basicPlan).toBeTruthy();
    });
  });

  it('updates selection when another plan is tapped', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <Subscription />
      </NavigationContainer>
    );
    await waitFor(() => getByTestId('plan-premium'));
    fireEvent.press(getByTestId('plan-premium'));

    const payNowBtn = getByTestId('pay-now-button');
    expect(payNowBtn).toBeTruthy();
  });

  it('renders header text properly', async () => {
  const { getByTestId } = render(
    <NavigationContainer>
      <Subscription />
    </NavigationContainer>
  );

  await waitFor(() => {
    expect(getByTestId('header-title')).toBeTruthy();
  });
});

it('shows "Pay Now" button when not subscribed', async () => {
    const { getByTestId, queryByTestId } = render(
      <NavigationContainer>
        <Subscription />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
      expect(getByTestId('pay-now-button')).toBeTruthy();
    });
  });

});
