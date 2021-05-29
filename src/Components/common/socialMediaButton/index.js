// import {} from 'native-base';
import React from 'react';
import {View, TouchableOpacity, Text, Platform} from 'react-native';
import Colors from '../../../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

function SocialMediaButton(props) {
  return (
    <TouchableOpacity
    onPress={props.onPress}
      style={{
        backgroundColor: props.backgroundColor
          ? props.backgroundColor
          : Colors.AppColor,
        height: 50,
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        {props.icon() ? props.icon() : ''}

        <Text
          style={{
            color: props.color ? props.color : 'white',
            textAlign: 'center',
            color: 'white',
            fontSize: 15,
            paddingLeft: 20,
            fontFamily: semiBold,
          }}>
          {props.title || 'Dummy Text'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
export default SocialMediaButton;
