import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, Platform, SafeAreaView, Alert } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ForgotImage from '../../images/forget-password-img.png';
// import Input from '../Input'
import Button from '../../Components/Button/index';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/AntDesign';
import PasswordInput from '../../Components/PasswordInput';
import Colors from '../../config/colors';
import { Value } from 'react-native-reanimated';
import axios from 'axios';
import { path } from '../../config/path';
import { Content } from 'native-base';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function ResetPassword({ navigation, route }) {

  const [newPassword, setnNewPasword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newPasswordColor, setNewPasswordColor] = useState(true)
  const [confirmPasswordColor, setConfirmPassowrdColor] = useState(true)
  const [newPasswordValidation, setNewPasswordValidation] = useState(false)
  const [confirmPasswordValidation, setConfirmPassowrdValidation] = useState(false)

  
  function forgetPassword() {
    if (newPassword.length >= 6 && confirmPassword === newPassword) {

      try {
        const form = new FormData()
        form.append('new_password', newPassword)
        form.append('c_password', confirmPassword)
        form.append('mobile', route.params.mobile)

        axios.post(path.FORGET_PASSWORD, form, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        }).then((res) => {
          console.log('res in forget-->> ', res)
          Alert.alert('Password Changed')
          navigation.navigate('Login')
        }).catch((e) => {
          console.log('Error in forget-->> ', e.response.data);
        })
      } catch (error) {

      }
    }
    else {
      setNewPasswordValidation(true)
      setConfirmPassowrdValidation(true)
      setConfirmPassowrdColor(false)
      setNewPasswordColor(false)
    }
  }

  return (
    <Content style = {{backgroundColor : '#fff'}}>
        <View style={styles.container}>
          <View style={styles.arrow}>
            <Icon onPress={()=>navigation.navigate('Login')} name="arrowleft" size={30} />
          </View>
          <View style={styles.imageContainer}>
            <Image source={ForgotImage} />
          </View>
          <View style={styles.forgotPasswordHeading}>
            <Text style={styles.forgotPasswordHeadingText}>Reset Password?</Text>
          </View>
          <View style={{ marginTop: 10, padding: 10 }}>
            <View>
              <PasswordInput borderColor={!newPasswordValidation ? Colors.borderColor : 'red'} onChangeText={(value) => {
                setnNewPasword(value)
                setNewPasswordValidation(false)
              }} label="Enter New Password*" />
              <View style={{
                display: newPasswordValidation ? 'flex' : 'none'
              }}>
                <Text style={{
                  color: 'red'
                }}>Please enter new password</Text>
              </View>
            </View>
            <View>
              <PasswordInput borderColor={!confirmPasswordValidation ? Colors.borderColor : 'red'} onChangeText={(value) => {
                setConfirmPassword(value)
                setConfirmPassowrdValidation(false)
              }} label="Re-Enter Password*" />
              <View style={{
                display: confirmPasswordValidation ? 'flex' : 'none'
              }}>
                <Text style={{
                  color: 'red'
                }}>Please re-enter new password</Text>
              </View>
            </View>
            <View
             
              style={{ marginTop: 10 }}>
              <Button  onPress={() =>forgetPassword() }  backgroundColor={Colors.AppColor} title="Submit" color="#FFFF" />
            </View>
          </View>
        </View>
      </Content>
  );
}

const styles = StyleSheet.create({
  container: {
    // width:'?%',
    padding: 2,
    // alignItems: 'center',
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
    marginTop: 20,
    alignSelf: 'flex-start',
    marginLeft: 10,
    padding: 2,
  },
  arrow: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
});
