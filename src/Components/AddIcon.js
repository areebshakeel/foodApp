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

const AddIcon = ({icon, backgroundColor, navigator, isDetails}) => {
  return (
    <View
      style={{
        ...styles.main,
        borderRadius: isDetails ? 10 : 50,
        width: isDetails ? 33 : 23,
        height: isDetails ? 33 : 23,
        backgroundColor: backgroundColor === 'primary' ? Colors.AppColor : '#707070',
      }}>
      <MaterialCommunityIcons
        onPress={navigator}
        style={{...styles.location, fontSize: isDetails ? 30 : 20}}
        name={icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.AppColor,
    justifyContent: 'center',
  },
  location: {
    fontSize: 25,
    color: '#ffffff',
  },
  text: {
    color: '#ffffff',
    fontFamily: regular,
    fontSize: 10,
  },
});
export default AddIcon;
