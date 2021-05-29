import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  SafeAreaView,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import Logo from '../../images/logo.png';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/AntDesign';
import AntIcon from 'react-native-vector-icons/AntDesign';
// import CheckBox from '@react-native-community/checkbox';
import { CheckBox, Content } from 'native-base';
import Input from '../../Components/Input';
import SecurityInput from '../../Components/securityInput';
import Button from '../../Components/Button/index';
import { set } from 'react-native-reanimated';
import Colors from '../../config/colors';
import MobileVerification from './mobileVerification';
import validator from 'validator';
import axios from 'axios';
import { path } from '../../config/path';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function PersonalInfo({ navigation }) {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emptyField, setEmptyField] = useState(false)
  const [firstnameValidation, setFirstnameValidation] = useState(false)
  const [lastnameValidation, setLastnameValidation] = useState(false)
  const [emailValidation, setEmailValidation] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState(false)
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState(false)
  const [samePassword, setSamePassword] = useState(false)
  const [term, setTerm] = useState(false)
  const [lengthValidition, setLengthValidation] = useState(false)
  const [emailVerify, setEmailVerify] = useState(true)
  const [loader, setLoader] = useState(false)
  const [emailValidationCheck, setEmailValidationCheck] = useState("")
  function changeIsHidden() {
    setIsHidden(!isHidden);
  }
  const personalInfo = {
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  }

  const verifyEmail = async () => {
    let form = new FormData()
    form.append('email', personalInfo.email)
    await axios.post(path.CHECK_EMAIL, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
      setLoader(false)
      setEmailVerify(true)
      console.log('Email verified-->> ', res)
      // navigation.push('MobileVerification', { 'personalInfo': personalInfo })
    }).catch((e) => {
      setLoader(false)
      setEmailVerify(false)
      setEmailValidationCheck(e.response.data.data.error.email[0])
      console.log('Error in Email Verficaton-->> ', e.response.data.data.error.email[0])
    })
  }
  function signup() {
    if (firstName && lastName && password && emailVerify &&
      password === confirmPassword && toggleCheckBox && password.length >= 6 && validator.isEmail(email)) {
      navigation.push('MobileVerification', { 'personalInfo': personalInfo })
    }
    console.log(password.length);
    if (password.length < 6) {
      setLengthValidation(true)
    }
    if (password !== confirmPassword) {
      setSamePassword(true)
      // Alert.alert("Password Error", "Passwords donot match")
    }
    if (!toggleCheckBox) {
      setTerm(true)
      // Alert.alert("Acceptance", "You need to accept Terms and Conditions and Privacy Policy")
    }
    if (firstName == "" || null) {
      setFirstnameValidation(true)
    } else {
      setFirstnameValidation(false)
    }
    if (lastName == "" || null) {
      setLastnameValidation(true)
    } else {
      setLastnameValidation(false)
    }
    if (!validator.isEmail(email)) {
      setEmailValidation(true)
    } else {
      setEmailValidation(false)
    }
    if (password == "" || null) {
      setPasswordValidation(true)
    } else {
      setPasswordValidation(false)
    }
    if (confirmPassword == "" || null) {
      setConfirmPasswordValidation(true)
    } else {
      setConfirmPasswordValidation(false)
    }
    if (toggleCheckBox) {
      setEmptyField(true)
      setTerm(false)
    } else {
      setEmptyField(false)
    }
  }


  return (
    <View style={styles.container}>
      {/* <ScrollView style={{ backgroundColor: '#FFFF' }}>
    <SafeAreaView>   */}
      <Content>
        <View style={styles.arrow}>
          <Icon onPress={() => navigation.goBack()} name="arrowleft" size={30} />
        </View>
        <View style={styles.imageContainer}>
          <Image resizeMode="contain" source={Logo} style={{ height: 150 }} />
        </View>
        <View>
          <Input borderColor={firstnameValidation ? "red" : "#707070"} onChangeText={(value) => {
            setFirstName(value)
            setFirstnameValidation(false)
          }} label="First Name*" />
          <View style={{
            display: firstnameValidation ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Please enter first name</Text>
          </View>
        </View>
        <View>
          <Input borderColor={lastnameValidation ? "red" : "#707070"} onChangeText={(value) => {
            setLastName(value)
            setLastnameValidation(false)
          }} label="Last Name*" />
          <View style={{
            display: lastnameValidation ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Please enter last name</Text>
          </View>
        </View>
        <View>
          <Input onBlur = {()=>{verifyEmail()}} keyboardType={"email-address"} noCapital borderColor={emailValidation ? "red" : "#707070"} onChangeText={(value) => {
            setEmail(value)
            setEmailValidation(false)
            setEmailVerify(true)
          }} label="Email Address*" />
          <View style={{
            display: emailValidation ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Please enter valid email address</Text>
          </View>
          <View style={{
            display: !emailVerify ? 'flex' : 'none',
          }}>
            <Text style={{
              color: 'red'
            }}>{emailValidationCheck}</Text>
          </View>
        </View>
        <View>
          <SecurityInput
            noCapital={false}
            borderColor={passwordValidation ? "red" : samePassword ? 'red' : lengthValidition ? 'red' : "#707070"}
            changeIsHidden={changeIsHidden}
            isHidden={isHidden}
            label="Password*"
            onChangeText={(value) => {
              setPassword(value)
              setPasswordValidation(false)
              setSamePassword(false)
              setLengthValidation(false)
            }}
          />
          <View style={{
            display: passwordValidation ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Please enter password</Text>
          </View>
          <View style={{
            display: samePassword ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Passwords do not match</Text>
          </View>
          <View style={{
            display: lengthValidition ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Password must be minimum 6 characters</Text>
          </View>
        </View>
        <View>
          <SecurityInput
            borderColor={confirmPasswordValidation ? "red" : samePassword ? 'red' : "#707070"}
            changeIsHidden={changeIsHidden}
            isHidden={isHidden}
            label="Re-Enter Password*"
            onChangeText={(value) => {
              setConfirmPassword(value)
              setConfirmPasswordValidation(false)
              setSamePassword(false)
            }}
          />
          <View style={{
            display: confirmPasswordValidation ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Please re-enter password</Text>
          </View>
          <View style={{
            display: samePassword ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Passwords do not match</Text>
          </View>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            color={toggleCheckBox ? Colors.AppColor : '#9A9A9A'}
            disabled={false}
            checked={toggleCheckBox}
            onPress={() => {
              setToggleCheckBox(!toggleCheckBox)
              toggleCheckBox ? setTerm(true) : setTerm(false)
            }}
          />
          <View style={{ flexDirection: 'row', paddingLeft: 16 }}>
            <Text
              onTouchEnd={() => navigation.navigate('TermsAndConditions')}
              style={{
                color: '#707070',
                fontSize: 12,
                fontFamily: regular,
                alignSelf: 'center',
                textAlign: 'left',
                textDecorationLine: 'underline',
              }}>
              I agree Terms & Conditions
          </Text>
            <Text
              style={{
                color: '#707070',
                fontSize: 12,
                fontFamily: regular,
                alignSelf: 'center',
                textAlign: 'left',
              }}>
              {' '}
            &{' '}
            </Text>
            <Text
              style={{
                color: '#707070',
                fontSize: 12,
                fontFamily: regular,
                alignSelf: 'center',
                textAlign: 'left',
                textDecorationLine: 'underline',
              }}
              onTouchEnd={() => navigation.navigate('Privacy')}>
              Privacy Policy
          </Text>
          </View>
        </View>
        <View style={{
          display: term ? 'flex' : 'none'
        }}>
          <Text style={{
            color: 'red'
          }}>You need to accept terms and conditions and privacy policy</Text>
        </View>
        <ActivityIndicator
          animating={loader}
          style={{ position: 'absolute', alignSelf: 'center', marginTop: '60%' }}
          size={Platform.OS === 'android' ? 50 : 'large'}
          color={Colors.AppColor}
        />

        <View
          style={{ marginTop: 10 }}>
          <Button onPress={() => signup()} title="Next" backgroundColor={Colors.AppColor} color="#FFFF" />
        </View>
      </Content>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: 'white'
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: 10,
  },
  arrow: {
    alignSelf: 'flex-start',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    // justifyContent:'space-between',
    // paddingLeft:5
  },
});
