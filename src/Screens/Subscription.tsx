import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { createSubscription, getUserSubscriptionStatus } from '../Api/SubscriptionAPI';
import Toast from 'react-native-toast-message';
import { subscriptionPlans } from '../Data/subscriptionPlans';
import { SubscriptionStatusType, PlanType } from '../types/SubscriptionType';

const Subscription = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatusType | 'No Plan' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const status = await getUserSubscriptionStatus();

        if (!status || status === '' || status.toLowerCase() === 'free') {
          setSubscriptionStatus('No Plan');
        } else {
          setSubscriptionStatus(status);
        }
      } catch (error) {
        console.error('Failed to fetch subscription status:', error);
        setSubscriptionStatus('No Plan'); 
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to check subscription status',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const handleCheckout = async () => {
    try {
      const planMap: Record<string, string> = {
        basic: '1-day',
        standard: '1-month',
        premium: '3-months',
      };

      const backendPlanType = planMap[selectedPlan];
      if (!backendPlanType) {
        throw new Error('Invalid plan selected');
      }

      const result = await createSubscription(backendPlanType);

      if (result?.checkout_url) {
        navigation.navigate('Payment', { checkoutUrl: result.checkout_url });
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Checkout Failed',
        text2: error.message || 'Please try again later',
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF0000" testID="loading-indicator" />
      </View>
    );
  }

  const isSubscribed = subscriptionStatus && subscriptionStatus !== 'No Plan';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeIcon} testID="close-button">
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText} testID="header-title">
          Choose Your Plan{'\n'}Select the perfect subscription for you
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {subscriptionPlans.map((item) => (
          <TouchableOpacity
            key={item.id}
            testID={`plan-${item.id}`}
            onPress={() => setSelectedPlan(item.id)}
            style={[
              styles.card,
              selectedPlan === item.id && styles.cardSelected
            ]}
          >
            {item.id === 'standard' && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}
            <View style={styles.cardInfo}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
            <Text style={styles.duration}>{item.duration}</Text>
            <View style={styles.features}>
              {item.features.map((text, index) => (
                <Text key={index} style={styles.featureText}>✔ {text}</Text>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {isSubscribed ? (
          <TouchableOpacity
            style={[styles.payButton, styles.payButtonDisabled]}
            disabled={true}
            testID="already-subscribed-button"
          >
            <Text style={styles.payText}>Already Subscribed</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.payButton}
            onPress={handleCheckout}
            testID="pay-now-button"
          >
            <Text style={styles.payText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0F14',
    padding: 16,
    paddingBottom: 80, 
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    marginTop: 25,
    marginBottom: 30,
  },
  header: {
    marginBottom: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 28,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#1A1C22',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardSelected: {
    borderColor: '#FF0000',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: '#FF0000',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 1,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  price: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  duration: {
    color: '#FF0000',
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 8,
  },
  features: {
    marginTop: 8,
  },
  featureText: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 4,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  payButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  payButtonDisabled: {
    backgroundColor: '#555',
  },
});

export default Subscription;







































