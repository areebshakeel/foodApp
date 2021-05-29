import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import WalletImage from '../../images/wallet.png';
import kfcImage from '../../images/kfc.png';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function OrderItem(props) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (props.fromDispute) {
          props.flagFalse();
        } else {
          props.flagFalse();
          props.setOrderItemId(props.orderItemId)
          props.setOrderItemOrderNumber(props.orderItemOrderNumber)
        }

      }
      }
      style={{
        padding: 5,
        backgroundColor: props.backgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          height: 40,
          width: 40,
          marginRight: 5,
          borderRadius: 5,
          overflow: 'hidden'
        }}>
          <Image source={{ uri: props.orderImage }} style={{
            height: '100%',
            width: '100%',
            resizeMode: 'cover'
          }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  color: props.textColor,
                  fontSize: 14,
                  fontFamily: semiBold,
                }}>
                {' '}
                {props.itemName}{' '}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <EntypoIcon color={props.textColor} name="location-pin" />
              <Text
                style={{
                  color: props.textColor,
                  fontSize: 10,
                  fontFamily: regular,
                }}>
                {props.location}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View>
        <Text
          style={{
            color: props.textColor,
            fontSize: 14,
            fontFamily: semiBold,
          }}>
          {props.time}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
