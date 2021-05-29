import {Icon} from 'native-base';
import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import Colors from '../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const Distance = ({distance}) => {
  return (
    <View style={styles.main}>
      <Icon style={styles.location} name="location-outline" />
      <Text> </Text>
      <Text style={styles.text}>{distance}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.AppColor,
    borderRadius: 15,
    height: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  location: {
    fontSize: 10,
    color: '#ffffff',
    alignItems: 'center',
    marginBottom:2
  },
  text: {
    color: '#ffffff',
    fontFamily: regular,
    fontSize: 9,
    textAlign:'center',
    alignItems:'center'
  },
});
export default Distance;
