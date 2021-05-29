import React from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function Button(props, disabled) {
  console.log('Disabled', disabled);
  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={props.onPress}
      style={{
        width: '100%',
        backgroundColor: props.backgroundColor,
        paddingVertical: 15,
        paddingHorizontal:70,
        borderRadius: 8,
        alignSelf: 'center',
        
      }}>
      <Text
        style={{
          color: props.color,
          fontSize: 16,
          fontFamily: semiBold,
          textAlign: 'center',
          alignSelf: 'center',
        }}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}
