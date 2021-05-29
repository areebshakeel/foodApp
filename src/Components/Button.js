import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Colors from '../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const CustomButton = ({text, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 5,
    backgroundColor: Colors.AppColor,
  },
  text: {
    padding: 10,
    fontSize: 16,
    fontFamily: semiBold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default CustomButton;
