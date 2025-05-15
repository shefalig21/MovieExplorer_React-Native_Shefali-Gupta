import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#111',
        borderRadius: 10,
        padding: 12,
        marginHorizontal: 10,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          backgroundColor: 'red',
          borderRadius: 20,
          width: 30,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon name="check" size={18} color="white" />
      </View>

      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>{text1}</Text>
        {text2 ? <Text style={{ color: '#ccc', fontSize: 13 }}>{text2}</Text> : null}
      </View>

      <TouchableOpacity onPress={() => Toast.hide()}>
        <Icon name="close" size={20} color="white" />
      </TouchableOpacity>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#111',
        borderRadius: 10,
        padding: 12,
        marginHorizontal: 10,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          backgroundColor: 'red',
          borderRadius: 20,
          width: 30,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon name="error" size={18} color="white" />
      </View>

      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>{text1}</Text>
        {text2 ? <Text style={{ color: '#ccc', fontSize: 13 }}>{text2}</Text> : null}
      </View>

      <TouchableOpacity onPress={() => Toast.hide()}>
        <Icon name="close" size={20} color="white" />
      </TouchableOpacity>
    </View>
  ),
};
