import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import Toast from 'react-native-toast-message';
import {confirmSubscriptionSuccess} from '../Api/SubscriptionAPI';
import {RootStackParamList} from '../types/NavigationTypes';
import {StackScreenProps} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = StackScreenProps<RootStackParamList, 'Payment'>;

const PaymentScreen = ({route, navigation}: Props) => {
  const {checkoutUrl} = route.params;
  const [hasHandled, setHasHandled] = useState(false);
  const [showWebView, setShowWebView] = useState(true);

  useEffect(() => {
    if (!checkoutUrl) {
      Toast.show({
        type: 'error',
        text1: 'Checkout Error',
        text2: 'No checkout URL provided.',
      });
      navigation.goBack();
    }
  }, [checkoutUrl]);

  const handleNavigationChange = async (navState: any) => {
    const {url} = navState;
    console.log(url);

    if (url.includes('cancel')) {
      navigation.navigate('Failure')
    }

    if (hasHandled) return;

    if (url.includes('session_id=')) {
      const sessionId = url.split('session_id=')[1].split('&')[0];
      // console.log('Detected Session ID:', sessionId)

      if (url.includes('success')) {
        setHasHandled(true);
        setShowWebView(false);
        try {
          const res = await confirmSubscriptionSuccess(sessionId);
          // Toast.show({
          //   type: 'success',
          //   text1: 'Payment Successful',
          //   text2: 'Thank you! Redirecting...',
          // });

          if (res.status === 200) {
            navigation.navigate('Success');
          }
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Subscription Error',
            text2: "We couldn't confirm your subscription.",
          });
          navigation.goBack();
        }
      }
    }

    if (url.includes('failure')) {
      setHasHandled(true);
      setShowWebView(false);
      Toast.show({
        type: 'error',
        text1: 'Payment Failed',
        text2: 'Your payment could not be completed.',
      });
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {showWebView ? (
        <WebView
          source={{uri: checkoutUrl}}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator
              size="large"
              color="#FF0000"
              style={styles.loader}
            />
          )}
          onNavigationStateChange={handleNavigationChange}
        />
      ) : (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FF0000" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


















































