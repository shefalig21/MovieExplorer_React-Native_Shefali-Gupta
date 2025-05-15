import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { createSubscription,getUserSubscriptionStatus } from '../Api/SubscriptionAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { CreateSubscriptionResultType,SubscriptionStatusType,PlanType } from '../types/SubscriptionType';

const Subscription=()=>{
  const navigation=useNavigation();
  const [selectedPlan,setSelectedPlan]=useState<string>('basic');
  const [subscriptionStatus,setSubscriptionStatus]=useState<SubscriptionStatusType | 'No Plan' | null>(null);

  const plans: PlanType[]=[
    {
      id: 'basic',
      title: 'Basic',
      duration: '1 Day',
      price: '$2.12',
      features: ['24-hour access', 'Basic features', 'Limited content'],
    },
    {
      id: 'standard',
      title: 'Standard',
      duration: '1 Month',
      price: '$8.98',
      features:  ['Full month access', 'All standard features', 'Unlimited content', 'Priority support'],
    },
    {
      id: 'premium',
      title: 'Premium',
      duration: '3 Months',
      price: '$12.14',
      features: ['3 months access', 'All premium features', 'Exclusive content', '24/7 Priority support', 'Offline access'],
    },
  ];

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      let status = await getUserSubscriptionStatus();  

      if (!status || status === '' || status.toLowerCase() === 'free') {
        status = 'No Plan';
      }

      setSubscriptionStatus(status);  
      await AsyncStorage.setItem('subscriptionStatus', status); 
    };

    fetchSubscriptionStatus();
  }, []); 

  const checkout=async()=>{
    try{
      const planMap: { [key: string]: string }={
        basic: '1-day',
        standard: '1-month',
        premium: '3-months',
      };
      const backendPlanType=planMap[selectedPlan];

      if (!backendPlanType) {
        Toast.show({
          type: 'error',
          text1: 'Invalid plan selected',
          text2: 'Please choose a valid subscription plan.',
        });
        return;
      }

      const result: CreateSubscriptionResultType = await createSubscription(backendPlanType);

      if (result.checkout_url) {
        navigation.navigate('Payment', {
          checkoutUrl: result.checkout_url,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Checkout Failed',
          text2: 'No checkout URL returned from server.',
        });
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: error.message || 'Please try again later.',
      });
    }
  };

  const isSubscribed = subscriptionStatus !== null && subscriptionStatus !== 'No Plan';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeIcon}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          Choose Your Plan{'\n'}Select the perfect subscription for you
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {plans.map((item) => {
          const selected = selectedPlan === item.id;

          return (
            <TouchableOpacity key={item.id} onPress={() => setSelectedPlan(item.id)}
              style={[styles.card, selected && styles.cardSelected]}>
              {item.id === 'standard' && <View style={styles.popularBadge}><Text style={styles.popularText}>Most Popular</Text></View>}
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
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[styles.payButton, isSubscribed && styles.payButtonDisabled]} onPress={isSubscribed ? undefined : checkout}
        disabled={isSubscribed}
      >
        <Text style={styles.payText}>{isSubscribed ? 'Already Subscribed' : 'Pay Now'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0F14',
    padding: 16,
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
  payButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  payText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  payButtonDisabled: {
    backgroundColor: '#555', 
  }
});

export default Subscription;


