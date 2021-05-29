import React, {memo} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const Label = ({text, suffix, ...restProps}) => {
  return (
    <View style={styles.root} {...restProps}>
      <Text style={styles.text}>{`${text}${suffix}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  text: {
    fontSize: 14,
    fontFamily: semiBold,
    color: '#000000',
  },
});

export default memo(Label);
