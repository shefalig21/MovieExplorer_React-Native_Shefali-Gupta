import React from 'react';
import { View } from 'react-native';

export default function Carousel({ data, renderItem }) {
  return (
    <View>
      {data.map((item, index) => renderItem({ item, index }))}
    </View>
  );
}
