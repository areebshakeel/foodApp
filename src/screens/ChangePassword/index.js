import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, Alert, ActivityIndicator } from 'react-native';
import { Container, Content, Radio, Toast } from 'native-base';
import Input from '../../Components/Input';
import PhoneInput from 'react-native-phone-input';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../../Components/Button/index';
import Colors from '../../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { path } from '../../config/path';
import PasswordInput from '../../Components/PasswordInput';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function ChangePassword({ navigation }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfrimPassword] = useState('')
  const [oldPasswordColor, setOldPasswordColor] = useState(false)
  const [newPasswordColor, setNewPasswordColor] = useState(false)
  const [confirmPasswordColor, setConfrimPasswordColor] = useState(false)
  const [oldPasswordText, setOldPasswordText] = useState('')
  const [loader, setLoader] = useState(false)
  async function changePassword() {

    try {
      // if (oldPassword && newPassword > 5 && newPassword === confirmPassword) {
      // if (1 == 1) {
      // setOldPasswordColor(false)
      // setNewPasswordColor(false)
      // setConfrimPasswordColor(false)

      // let token = await AsyncStorage.getItem('Token')
      // let TokenValue = JSON.parse(token)
      // console.log(TokenValue)

      // let form = new FormData()
      // form.append('current_password', oldPassword)
      // form.append('new_password', newPassword)
      // form.append('c_password', confirmPassword)

      // setLoader(true)
      // await axios.post(path.CHANGE_PASSWORD_API, form, {

      //   headers: {
      //     'Authorization': 'Bearer ' + TokenValue,
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //     'Accept': 'application/json',
      //   },
      // }).then((res) => {
      //   setLoader(false)
      //   console.log('Res in change Password-->> ', res)
      //   Alert.alert('Password Changed')
      //   setOldPasswordText('')
      //   navigation.navigate('MyVehicles')
      // }).catch((e) => {
      //   setLoader(false)
      //   console.log('Error in Change Password-->> ', e.response.data.data)
      //   setOldPasswordText(e.response.data.data.error.current_password[0])
      //   // Alert.alert('Error in changing Password')
      // })

      // }


      // else {
      if (!oldPassword || oldPassword.length < 6) {
        setOldPasswordColor(true)
      } else if (!newPassword || newPassword.length < 6) {
        setNewPasswordColor(true)
      }
      else if (!confirmPassword || confirmPassword.length < 6 || confirmPassword !== newPassword) {
        setConfrimPasswordColor(true)
      } else {
        setOldPasswordColor(false)
        setNewPasswordColor(false)
        setConfrimPasswordColor(false)

        let token = await AsyncStorage.getItem('Token')
        let TokenValue = JSON.parse(token)
        console.log(TokenValue)

        let form = new FormData()
        form.append('current_password', oldPassword)
        form.append('new_password', newPassword)
        form.append('c_password', confirmPassword)

        setLoader(true)
        await axios.post(path.CHANGE_PASSWORD_API, form, {

          headers: {
            'Authorization': 'Bearer ' + TokenValue,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        }).then((res) => {
          setLoader(false)
          console.log('Res in change Password-->> ', res)
          Toast.show({
            text: res.data.data.Message,
            type: 'success',
            position: 'top',
            style: {
              marginTop: 40
            },
            onClose : ()=>{navigation.navigate('MyVehicles')}
          })
          setOldPasswordText('')
          navigation.navigate('MyVehicles')
        }).catch((e) => {
          setLoader(false)
          console.log('Error in Change Password-->> ', e.response.data.data)
          setOldPasswordText(e.response.data.data.error.current_password[0])
          // Alert.alert('Error in changing Password')
        })
      }
      //   if (newPassword !== confirmPassword) { Alert.alert(`Password doesn't match`) 
      // }

      // console.log('Password doesnt match')
      // }
    } catch (error) {
      console.log('Error-->> ', error)
    }
  }
  function oldPasswordFunction(value) {
    setOldPassword(value)
    setOldPasswordText('')
  }
  return (
    <Container>
      <Content style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View onTouchEnd={() => navigation.goBack()} style={styles.arrow}>
            <Icon name="arrowleft" size={30} />
          </View>
          <View>
            <Text style={styles.headingText}>Change Password</Text>
          </View>
          <View>
            <Text style={styles.headingText}></Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <PasswordInput maxLength={12} onChangeText={(value) => oldPasswordFunction(value)} securityText label="Old Password*" />

          {oldPasswordColor || oldPasswordText ? <View style={{
            display: 'flex'
          }}>
            <Text style={{
              color: 'red'
            }}>{!oldPassword ? "Old password required" : (oldPassword.length < 6 ? "Old password too short" : oldPasswordText ? oldPasswordText : "")}</Text>
          </View> : <Text></Text>}

          <PasswordInput maxLength={12} onChangeText={(value) => setNewPassword(value)} securityText label="New Password*" />
          {newPasswordColor ? <View style={{
            display: 'flex'
          }}>
            <Text style={{
              color: 'red'
            }}>{!newPassword ? "New password required" : (newPassword.length < 6 ? "New password too short" : "")}</Text>
          </View> : <Text></Text>}

          <PasswordInput maxLength={12} onChangeText={(value) => setConfrimPassword(value)} securityText label="Confirm Password*" />
          {confirmPasswordColor ? <View style={{
            display: 'flex'
          }}>
            <Text style={{
              color: 'red'
            }}>{!confirmPassword ? "Confirm password required" : (confirmPassword !== newPassword ? "Password doesn`t match " : "")}</Text>
          </View> : <Text></Text>}
          <View
            style={{ marginTop: 10 }}>
            <ActivityIndicator
              animating={loader}
              style={{ alignSelf: 'center' }}
              size={Platform.OS === 'android' ? 50 : 'large'}
              color={Colors.AppColor}
            />
            <Button onPress={() => changePassword()} title="Save" backgroundColor={Colors.AppColor} color="#FFF" />
          </View>
        </View>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#707070',
    // marginTop:
    // paddingHorizontal: 50,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    // alignItems:'flex-start',
    flexDirection: 'row',
    // flexDirection:'row',
    // justifyContent:'space-between'
  },
  input: {
    maxWidth: 300,
    minWidth: 300,
  },
  headingText: {
    color: Colors.AppColor,
    fontSize: 20,
    fontFamily: semiBold,
  },
  arrow: {
    alignSelf: 'flex-start',
  },
  container: {
    padding: 10,
  },
  radioButton: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#707070',
    width: '48%',
    flexDirection: 'row',
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    // justifyContent:'center'
  },
  changePassword: {
    color: Colors.AppColor,
    fontSize: 15,
    fontFamily: regular,
    textDecorationLine: 'underline',
  },
});
