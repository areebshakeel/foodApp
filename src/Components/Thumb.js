import React, {memo} from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import Colors from '../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const THUMB_RADIUS = 12;

const Thumb = ({text}) => {
  return (
    <View style={styles.root}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    backgroundColor: Colors.AppColor,
    position: 'relative',
  },
  text: {
    color: '#464951',
    position: 'absolute',
    bottom: 30,
    fontSize: 14,
    fontFamily: semiBold,
    left: 3,
  },
});

export default memo(Thumb);
