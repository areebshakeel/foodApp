import React from 'react';
import { View, Text, Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
// import CreditrCardImage from '../../../assets/credit-card.png'
import { CheckBox } from '@react-native-community/checkbox';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';
export default function PaymentCards(props) {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: props.backgroundColor,
        borderRadius: 10,
        alignItems: 'center',
        padding: 10,
      }}>
  <View style={styles.creditCardContainer}>
        <Image resizeMode="contain" source={props.icon} />
        <Text
          style={{
            fontSize: 15,
            color: props.textColor,
            fontFamily: semiBold,
            width: '70%',
            textAlign: 'center',
          }}>
          {props.text}
        </Text>
      </View>
      <View>{/* <CheckBox/> */}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: background,
    // borderRadius:10,
    // alignItems:'center',
    // padding:10
    // alignContent:'center'
  },
  creditCardContainer: {
    width: '50%',
    // backgroundColor:'red',
    borderColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'flex-start',
  },
  creditCardText: {
    fontSize: 15,
    color: '#464951',
    fontFamily: semiBold,
  },
});
