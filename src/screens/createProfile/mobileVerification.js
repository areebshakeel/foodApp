import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  Animated,
  ActivityIndicator
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MobileVerifyImage from '../../images/Authentication-bro.png';
import PhoneInput from 'react-native-phone-input';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../../Components/Button/index'
import Colors from '../../config/colors';
import { Content, Container, Picker, Toast } from 'native-base';
import axios from 'axios';
import { path } from '../../config/path';
// import OtpInputs from 'react-native-otp-inputs'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import UAE from '../../images/uae.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging'
import Firebase from '@react-native-firebase/app'

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';


export default function MobileVerification({ navigation, route }) {
  const [code, setCode] = useState('+971')
  const [number, setNumber] = useState('')
  const [otp1, setOtp1] = useState('')
  const [otp2, setOtp2] = useState('')
  const [otp3, setOtp3] = useState('')
  const [otp4, setOtp4] = useState('')
  const [otpInputs, setOtpInputs] = useState(false)
  const [timer, setTimer] = useState(0)
  const [otpError, setOtpError] = useState('')
  const [otpValidation, setOtpValidation] = useState(false)
  const [numberTakenValidation, setNumberTakenValidation] = useState(false)
  const [validationNumberError, setValidationNumberError] = useState('')
  const [resendOtp, setResendOtp] = useState(true)
  const [generateOtp, setGenerateOtp] = useState(true)
  const [isPlaying, setIsplaying] = useState(true)
  const [readOnly, setReadOnly] = useState(true)
  const [otpIncorrect, setOtpErrors] = useState('')
  const [loader, setLoader] = useState(false)
  const [deviceId, setDeviceId] = useState('')


  const userData = route.params.personalInfo ? route.params.personalInfo : ""
  const myUser = route.params.user
  
  console.log("Ols user-->> ", userData)
  const firebaseToken = async () => {
    Firebase.initializeApp()
    await messaging().getToken().then((res) => {
      console.log('Firebase token inlogin ', res);
      setDeviceId(res)
      Object.assign(userData ? userData : myUser,
        {
          "device_id": deviceId?deviceId:res ,
          'os': Platform.__constants.Release,
          "model": Platform.__constants.Model,
          "platform": Platform.OS,
          "device": Platform.__constants.Model
    
        })
    })
    const permission = await messaging().requestPermission()
    console.log('Ios Permisson --> ', permission)
  }
  useEffect(() => {
    firebaseToken()
    
    setTimer(30)
  }, [])

  const mobile = code.concat(number)
  console.log('mobile', mobile)
  const countryCodes = [

    {
      "name": "Viet Nam",
      "dial_code": "+92",
      "code": "VN"
    },

  ]
  
  async function sendOtp() {
    setLoader(true)
    setReadOnly(false)
    setValidationNumberError('')
    if (number) {
      setOtpValidation(false)
      setNumberTakenValidation(false)
      setLoader(false)
      console.log('mobile--->> ', mobile)
      const formData = new FormData()
      formData.append('mobile', mobile)
      formData.append('type', 'Registration')
      await axios.post(path.SEND_OTP, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }).then((res) => {
        setLoader(false)
        setIsplaying(true)
        setOtpInputs(true)
        setGenerateOtp(false)
        setResendOtp(false)
        setTimeout(() => {
          setOtpInputs(false)
          setResendOtp(true)
          setReadOnly(true)
        }, 30000)
        setTimer(30)
        console.log('Res in send OTP', res);
        // Alert.alert('Please Input the OTP!')
      }).catch((e) => {
        setLoader(false)
        console.log("Errror Send OTP", e.response.data)
        let myError = JSON.stringify(e.response.data.data.error.mobile[0])
        setOtpError(myError)
        // alert(myError.substr(1, myError.length - 2))
        setValidationNumberError(myError.substr(1, myError.length - 2))
        let valError = myError.substr(1, myError.length - 2)
        if(valError == "The mobile has already been taken.") {
          setReadOnly(true)
        } else {
          setReadOnly(false)
        }
        
        setNumberTakenValidation(true)
        setResendOtp(true)
      })
    } else {
      setNumberTakenValidation(true)
      setReadOnly(true)
      setLoader(false)
    }
  }

  console.log('Meraa user', myUser)

  async function verifyOtp(code) {
    setLoader(true)
    console.log(typeof (code))
    setOtpInputs(false)
    const formData = new FormData()
    formData.append('type', 'registration')
    formData.append('mobile', mobile)
    formData.append('otp', code)
    console.log('stringg-->> ', typeof (mobile))

    await axios.post(path.VERIFY_OTP, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then(async (res) => {
      setLoader(false)
      console.log('OTP Successfull')
      // Alert.alert(" OTP Verification ", '  SUCCESSFULL   ')
      // navigation.navigate('Login')
      //SENDING USER DATA FOR REGISTRATION
      let userFormData = new FormData()
      if (route.params.personalInfo) {
        userFormData.append('fname', userData.firstName)
        userFormData.append('lname', userData.lastName)
        userFormData.append('email', userData.email)
        userFormData.append('phone', mobile)
        userFormData.append('password', userData.password)
        userFormData.append('c_password', userData.confirmPassword)
        userFormData.append('device_id', userData.device_id)
        userFormData.append('os', userData.os)
        userFormData.append('device', userData.device)
        userFormData.append('model', userData.model)
        userFormData.append('platform', userData.platform)
      } else if (route.params.user) {
        userFormData.append('fname', myUser.givenName)
        userFormData.append('lname', myUser.familyName)
        userFormData.append('email', myUser.email)
        userFormData.append('phone', mobile)
        userFormData.append('password', '1234567890')
        userFormData.append('c_password', '1234567890')
        userFormData.append('device_id', myUser.device_id)
        userFormData.append('os', myUser.os)
        userFormData.append('device', myUser.device)
        userFormData.append('model', myUser.model)
        userFormData.append('platform', myUser.platform)
        userFormData.append("loginType", "facebook")
      }

      // console.log('userForm-->> ', userFormData)
      await axios.post(path.REGISTER_USER, userFormData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }).then(async (res) => {
        setLoader(false)

        // Alert.alert(" OTP Verification ", '  SUCCESSFULL   ')
        console.log('Res Register-->> ', res)
        Toast.show({
          text: res.data.data.Message,
          type: 'success',
          position: 'top',
          style: {
            marginTop: 40
          }
        })
        userFormData.append(userData.email)
        userFormData.append(userFormData.password)
        await axios.post(path.LOGIN_API, userFormData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          }
        }).then((res) => {
          setLoader(false)
          console.log(res)
          let token = res.data.data.token;
          AsyncStorage.setItem('Token', JSON.stringify(token))
          navigation.navigate('VehicleRegistration', { register: true })
        })
      }).catch((error) => {
        setGenerateOtp(true)
        if (error.response.data.data.error.email) {
          console.log('Register Error->> ', error.response.data.data.error.email[0])
          let registerError = error.response.data.data.error.email[0]
          // alert(registerError)
          Toast.show({
            text: registerError,
            type: 'danger',
            position: 'top',
            style: {
              marginTop: 40
            },
            onClose: () => { navigation.navigate('Signup') }
          })
        } else {
          navigation.navigate('Signup')
          Toast.show({
            text: "Cannot Register user Invalid Inputs info",
            type: 'danger',
            position: 'top',
            style: {
              marginTop: 40
            },
          })
          // alert('Cannot Register user Invalid Inputs info')
        }
      })

    }).catch((e) => {
      setLoader(false)
      console.log(e)
      console.log('Otp Verification ', e.response.data.data.Message)
      setOtpErrors(e.response.data.data.Message)
      // Alert.alert('Invalid OTP')
      setGenerateOtp(true)
      setOtpValidation(true)
    })
  }

  return (
    <Container>

      <Content style={styles.container}>
        <View onTouchEnd={() => navigation.goBack()} style={styles.arrow}>
          <Icon name="arrowleft" size={30} />
          <Text style={styles.skip}> </Text>
        </View>
        <View style={styles.headingContainer}>
          <Text style={styles.mobileVerifyHeading}>Mobile Number Verification</Text>
          <Text style={styles.verifyDescription}>
            A verification code will be sent {'\n'} to your mobile phone.
          </Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={MobileVerifyImage} resizeMode="contain" width />
        </View>



        <View style={{
          alignSelf: 'center',
          alignItems: "center",
          flexDirection: 'row',
          // justifyContent: 'space-between',
          // flex:1,
          paddingHorizontal: 10,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: "#707070", height: '8%', width: '83%',
          backgroundColor: '#F8F8F8',
          borderRadius: 8,
          marginTop: 20
        }} >

          <Image source={UAE} resizeMode="contain" style={{ width: '10%' }} />
          {/* <Icon style={{ paddingHorizontal: 10 }} name="caretdown" color="#707070" /> */}
          <Text style={{ color: "#707070", paddingHorizontal: 5 }}> +971</Text>

          <TextInput editable={readOnly} maxLength={9} onChangeText={(value) => setNumber(value)}
            placeholderTextColor="#707070" keyboardType="number-pad" style={{ maxWidth: "70%", minWidth: '80%', color: '#707070' }} />
        </View>
        <View style={{
          display: otpValidation ? 'flex' : 'none',
          marginLeft: 35,
          marginTop: 20
        }}>
          <Text style={{
            color: 'red'
          }}>{otpIncorrect}</Text>
        </View>

        <View style={{
          display: numberTakenValidation ? 'flex' : 'none',
          marginLeft: 35,
          marginTop: 20
        }}>
          <Text style={{
            color: 'red'
          }}>{validationNumberError ? validationNumberError : "Cannot leave the number empty"}</Text>
        </View>
        {otpInputs ? <View style={styles.otpContainer}>
          <Text style={styles.otpHeading}>OTP Verification</Text>
          <View style={{ width: '70%', alignSelf: 'center' }} >
            <Text style={styles.otpDescription}>
              A verification code has been sent to your mobile number
          </Text>
          </View>
          <View >
            <View style={{ alignItems: 'center' }} >
              <CountdownCircleTimer
                size={70}
                strokeWidth={2}
                isPlaying={isPlaying}
                duration={timer}
                colors={[
                  ['#004777', 0.4],
                  ['#F7B801', 0.4],
                  ['#2196F3', 0.2],
                ]}
              >{({ remainingTime, animatedColor }) => (
                <Animated.Text style={{ color: '#2196F3' }}>
                  {remainingTime}
                </Animated.Text>
              )}
              </CountdownCircleTimer>
            </View>
            <OTPInputView
              style={{ width: '80%', alignSelf: 'center', height: 100 }}
              pinCount={4}
              autoFocusOnLoad={true}
              onCodeChanged={() => {setIsplaying(false) && setTimer(30)}}
              onCodeFilled={(code) => verifyOtp(code)}
              codeInputFieldStyle={styles.otpStyle}
              codeInputHighlightStyle={styles.otpText}
            />
          </View>

        </View>
          : <Text> </Text>}

        {generateOtp ?
          <View style={{ paddingHorizontal: 30, marginTop: 10 }} >

            <Button
              onPress={() => sendOtp()}
              title="Generate OTP" backgroundColor={Colors.AppColor} color="#FFFF" />

          </View>
          : (resendOtp ?
            <View style={{ paddingHorizontal: 30, marginTop: 10 }} >

              <Button
                onPress={() => sendOtp()}
                title="Resend OTP" backgroundColor={Colors.AppColor} color="#FFFF" />

            </View> : null
          )}
        <ActivityIndicator animating={loader}
          style={{ position: 'absolute', alignSelf: 'center', marginTop: '75%' }}
          size={Platform.OS === 'android' ? 40 : 'large'}
          color={Colors.AppColor} />
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: '#FFFF',
    flex: 1
  },
  imageContainer: {
    alignSelf: 'center',
    alignItems: 'center'
  },
  mobileVerifyHeading: {
    color: Colors.AppColor,
    fontSize: 24,
    fontFamily: bold,
    fontWeight: 'bold',
  },
  headingContainer: {
    alignSelf: 'flex-start',
    padding: 20,
    marginTop: 20,
  },
  verifyDescription: {
    color: '#3D3D3D',
    // fontWeight:'Semibold',
    width: 240,
    fontSize: 15,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#707070',
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    // justifyContent: 'space-evenly'
    // flex:1,

  },
  allInputsContainer: {
    // alignSelf: 'center',
    paddingHorizontal: 25
  },
  otpStyle: {
    borderColor: '#707070',
    borderRadius: 8,
    color: 'black',
    fontWeight: 'bold'

  },
  otpText: {
    color: "black",
    fontWeight: 'bold',
    fontSize: 20
  },

  inputs: {
    maxWidth: "70%",
    minWidth: "67%",
  },
  label: {
    color: '#9A9A9A',
    fontWeight: 'bold',
  },
  otpHeading: {
    color: Colors.AppColor,
    fontSize: 24,
    fontFamily: bold,
    textAlign: 'center',
  },
  otpContainer: {
    marginTop: 10,
    alignSelf: 'center',
  },
  otpDescription: {
    textAlign: 'center',
    fontSize: 15,
    color: '#3D3D3D',
    fontFamily: regular
  },
  otpInput: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#3D3D3D',
    width: 50,
    borderRadius: 8,
    paddingVertical: 10,
    textAlign: 'center',

    // margin:2,
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: Colors.AppColor,
    paddingVertical: 15,
    paddingHorizontal: 130,
    borderRadius: 8,
    marginTop: 6,
  },

  arrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },

  picker: {
    width: '100%',
    flex: 0.2,

  }
});