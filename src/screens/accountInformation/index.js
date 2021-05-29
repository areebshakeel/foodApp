import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Container, Content, Radio, Toast } from 'native-base';
import Input from '../../Components/Input';
import PhoneInput from 'react-native-phone-input';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../../Components/Button/index';
import Colors from '../../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { path } from '../../config/path';
import axios from 'axios';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function AccountInformation({ navigation, route }) {
  const [gender, setGender] = useState(false);
  const [firstName, setFirstName] = useState(route.params[0].fname)
  const [lastName, setLastName] = useState(route.params[0].lname)
  const [firstnameValidation, setFirstnameValidation] = useState(false)
  const [lastnameValidation, setLastNameValidation] = useState(false)
  const [loader, setLoader] = useState(false)
  const [tokenState, setTokenState] = useState('')
  const [profile, setProfile] = useState('')
  const [loginType, setLoginType] = useState('')
  const [loginType2, setLoginType2] = useState('')
  console.log('account-->> ', route.params)
  // useEffect(() => {
  //   getProfile()

  // }, [])
  useEffect(() => {
    (async () => {
      let data = await AsyncStorage.getItem('loginType')
      // let lt = JSON.parse(data)
      // alert(data);
      setLoginType2(data)

      getProfile()
    })();
  }, []);
  async function getProfile() {
    // setLoader(true)
    try {
      setLoader(true)
      let token = await AsyncStorage.getItem('Token')
      const TokenValue = JSON.parse(token);
      setTokenState(TokenValue)
      console.log('Profile token-->> ', TokenValue)

      await axios.post(path.GET_PROFILE, {}, {
        headers: {
          'Authorization': 'Bearer ' + TokenValue,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        }
      }).then((res) => {
        const profileData = res.data.data.profile
        // const vehicleData= res
        // // console.log('vehicles-->> ', vehicleData)
        console.log('Res in Profile-->', profileData);

        setProfile(profileData)
        setLoginType(profileData[0].loginType)
        setLoader(false)
        // setUserEmail(profileData[0].email)
        // setUserName(profileData[0].name)
        // setUserImage(profileData[0].img)
        console.log('profile-->> ', loginType)
      }).catch((e) => {
        setLoader(false)
        console.log('Error in profile', e)
      })
    }
    catch (error) {
      console.log('errro in Profile', error)
    }
  }

  async function editProfile() {
    // alert()
    if (firstName == null || firstName == "") {
      setFirstnameValidation(true)
    }
    if (lastName == null || lastName == "") {
      setLastNameValidation(true)
    }
    if (firstName == null || firstName == "" && lastName == null || lastName == "") {
      if (firstName == null || firstName == "") {
        setFirstnameValidation(true)
      }
      if (lastName == null || lastName == "") {
        setLastNameValidation(true)
      }
    } else {
      try {
        let token = await AsyncStorage.getItem('Token')
        const TokenValue = JSON.parse(token);

        let form = new FormData()
        form.append('fname', firstName)
        form.append('lname', lastName)
        form.append("device_id", "123")
        form.append('os', Platform.__constants.Release)
        form.append("model", Platform.__constants.Model,)
        form.append("platform", Platform.OS)
        form.append("device", Platform.__constants.Model)

        await axios.post(path.EDIT_PROFILE_API, form, {
          headers: {
            'Authorization': 'Bearer ' + TokenValue,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          }
        }).then((res) => {
          Toast.show({
            text: res.data.data.Message,
            type: 'success',
            position: 'top',
            style: {
              marginTop: 40
            },
            onClose: () => { navigation.navigate('MyVehicles') }
          })
          console.log('Profile updated', res.data.data.Message)
        }).catch((e) => {
          console.log('error in edit profile ', e.response.data)
        })
      } catch (error) {

      }
    }
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
            <Text style={styles.headingText}>Edit Profile</Text>
          </View>
          <View>
            <Text style={styles.headingText}></Text>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Input onChangeText={(value) => {
            setFirstName(value)
            setFirstnameValidation(false)
          }} value={firstName} label="First Name*" />
          <View style={{
            display: firstnameValidation ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Please enter first name</Text>
          </View>
          <Input onChangeText={(value) => {
            setLastName(value)
            setLastNameValidation(false)
          }} value={lastName} label="Last Name*" />
          <View style={{
            display: lastnameValidation ? 'flex' : 'none'
          }}>
            <Text style={{
              color: 'red'
            }}>Please enter last name</Text>
          </View>
          {/* {loginType ?
            <View style={{ alignItems: 'flex-end', marginVertical: 10 }} ></View>
            : <View
              onTouchEnd={() => navigation.navigate('ChangePassword')}
              style={{ alignItems: 'flex-end', marginVertical: 10 }}>
              <Text style={styles.changePassword}>Change Password?</Text>
            </View>


          } */}

          {
            !loginType2 &&
              <View
                onTouchEnd={() => navigation.navigate('ChangePassword')}
                style={{ alignItems: 'flex-end', marginVertical: 10 }}>
                <Text style={styles.changePassword}>Change Password?</Text>
              </View>
          }

          <View style = {{marginTop : 20}}>
            <Button onPress={() => editProfile()} title="Save" backgroundColor={Colors.AppColor} color="#FFF" />
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
  radioButtonContainer: {
    flex: 0.48,
    borderColor: '#707070',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
  },
});
