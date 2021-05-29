import {Icon} from 'native-base';
import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const Duration = ({duration}) => {
  return (
    <View style={styles.main}>
      <MaterialCommunityIcons style={styles.location} name="clock-outline" />
      <Text> </Text>
      <Text style={styles.text}>{duration}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.AppColor,
    borderRadius: 15,
    paddingHorizontal: 4,
    height: 20,
    justifyContent: 'space-between',

  },
  location: {
    fontSize: 10,
    color: '#ffffff',
    marginBottom:2
  },
  text: {
    color: '#ffffff',
    fontFamily: regular,
    fontSize: 9,
    textAlign:'center'
  },
});
export default Duration;
