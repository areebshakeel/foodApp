import React from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import ForgotImage from '../../../assets/forget-password-img.png';
import Input from '../Input';
import Button from '../Button';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/AntDesign';
import Colors from '../../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function ForgotPassword(props) {
  return (
    <ScrollView style={{backgroundColor: '#FFFF'}}>
      <View style={styles.container}>
        <View style={styles.arrow}>
          <Icon name="arrowleft" size={30} />
        </View>
        <View style={styles.imageContainer}>
          <Image source={ForgotImage} />
        </View>
        <View style={styles.forgotPasswordHeading}>
          <Text style={styles.forgotPasswordHeadingText}>Forgot Password?</Text>
        </View>
        <View style={{marginTop: 30, padding: 10}}>
          <View>
            <Input label="Enter your email address*" />
          </View>
          <View onTouchEnd={() => props.flagFalse()} style={{marginTop: 10}}>
            <Button backgroundColor= {Colors.AppColor} title="Submit" color="#FFFF" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // width:'?%',
    padding: 4,
    // alignItems:'center',
    marginTop: 20,
    backgroundColor: '#FFFF',
  },
  imageContainer: {
    alignSelf: 'center',
  },
  forgotPasswordHeadingText: {
    color: Colors.AppColor,
    fontSize: 24,
    // textAlign:'left',
    fontFamily: bold,
  },
  forgotPasswordHeading: {
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginTop: 20,
    padding: 2,
  },
  arrow: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
});
