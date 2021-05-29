import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import OrderCard from './orderCard';
import Icon from 'react-native-vector-icons/AntDesign';
import Colors from '../../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function OrderHistory() {
  const orders = [0, 1, 2];
  return (
    <View style={{backgroundColor: '#FFFF', padding: 10, height: '100%'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <View style={styles.arrow}>
          <Icon name="arrowleft" size={30} />
        </View>
        <View>
          <Text style={styles.headingText}>Order History</Text>
        </View>
        <View>
          <Text></Text>
        </View>
      </View>
      {orders.map((item) => (
        <View style={{marginTop: 20}}>
          <OrderCard />
          <View style={styles.line}></View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  headingText: {
    color: Colors.AppColor,
    fontSize: 20,
    fontFamily: semiBold,
    // alignSelf:'center'
  },
  arrow: {
    alignSelf: 'flex-start',
  },
  line: {
    borderTopWidth: 2,
    borderColor: '#7F7E7F',
  },
});
