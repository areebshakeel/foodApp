import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Switch,
  Button,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Container, Content, Toast } from 'native-base';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import SocialMeidaButton from '../Components/common/socialMediaButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import Logo from '../images/logo.png';
import { connect } from 'react-redux';
import { userLoginRequest, userLoginSuccess } from '../redux/user/userActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { path } from '../config/path';
import Loader from '../Components/Loader';
import Colors from '../config/colors';
import { LoginButton, AccessToken, LoginManager, LoginBehaviorIOS, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import Geolocation from '@react-native-community/geolocation'
import DeviceInfo from 'react-native-device-info'
import MapView from "react-native-maps";
import messaging from '@react-native-firebase/messaging'
import Firebase from '@react-native-firebase/app'

const Login = ({ navigation, userData, userError, updateTheUser, loading }) => {
  const [isHidden, setIsHidden] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false)
  const [emptyUsername, setEmptyUsername] = useState(false)
  const [emptyPassword, setEmptyPassword] = useState(false)
  const [googleEmail, setGoogleEmail] = useState('')
  const [location, setLocation] = useState({})
  const toggleSwitch = () => setIsEnabled(!isEnabled);
  const [deviceId, setDeviceId] = useState('')

  const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
  const semiBold =
    Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
  const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
  const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

  GoogleSignin.configure({
    scopes: ['email', 'profile'], // what API you want to access on behalf of the user, default is email and profile
    // webClientId: '769357624073-onhmte6sullttuets2utjs2k7m8mmdg7.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    // hostedDomain: '', // specifies a hosted domain restriction
    // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
    // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    // accountName: '', // [Android] specifies an account name on the device that should be used
    iosClientId: '769357624073-5iou4uasp0l8gjjvjmt8fb55l5a4drju.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    // googleServicePlistPath: '', // [iOS] optional, if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  }
  )
  const config = {
    clientId: "769357624073-5iou4uasp0l8gjjvjmt8fb55l5a4drju.apps.googleusercontent.com",
    appId: "1:769357624073:ios:45e79a409cf13f8c7019d8",
    apiKey: "AIzaSyDHY1Pg7fVQ5-NF6g5XJzYlW9DThliEwtM",
    databaseURL: "https://foodapp-8fea2-default-rtdb.firebaseio.com/",
    messagingSenderId: "769357624073",
    projectId: "foodapp-8fea2",
    storageBucket: "foodapp-8fea2.appspot.com"
  }
  const firebaseToken = async () => {
    // Firebase.initializeApp({
    //   clientId: "769357624073-5iou4uasp0l8gjjvjmt8fb55l5a4drju.apps.googleusercontent.com",
    //   appId: "1:769357624073:ios:45e79a409cf13f8c7019d8",
    //   apiKey: "AIzaSyDHY1Pg7fVQ5-NF6g5XJzYlW9DThliEwtM",
    //   databaseURL: "https://foodapp-8fea2-default-rtdb.firebaseio.com/",
    //   messagingSenderId: "769357624073",
    //   projectId: "foodapp-8fea2",
    //   storageBucket: "foodapp-8fea2.appspot.com"
    // })
    // await messaging().getAPNSToken().then((res) => {
    //   console.log('APNS Token -->> ', res);
    // })
    await messaging().getToken().then((res) => {
      console.log('Firebase token inlogin ', res);
      setDeviceId(res)
    })

    // const permission = await messaging().requestPermission()
    // console.log('Ios Permisson --> ', permission)
  }

  useEffect(() => {

    (async () => {
      Platform.OS !== "ios" ? firebaseToken() : iosToken()
      // console.log('Device ID IOS', deviceId);
      // alert()
      var getCredentials = await AsyncStorage.getItem('loginCredentials')
      var login = JSON.parse(getCredentials)
      console.log("LOGIN ", login);
      await getPosition()
      if (login) {
        console.log("LOGIN ", login);
        setUserName(login.email)
        setPassword(login.password)
      } else {
        setUserName('')
        setPassword('')
      }
      const remove = AsyncStorage.removeItem('Token').then(() => {

      }).catch((e) => {
      })

      clearCart()
    })();
    // iosToken()
  }, [])
  const iosToken = async () => {
    Firebase.initializeApp({
      clientId: "769357624073-5iou4uasp0l8gjjvjmt8fb55l5a4drju.apps.googleusercontent.com",
      appId: "1:769357624073:ios:45e79a409cf13f8c7019d8",
      apiKey: "AIzaSyDHY1Pg7fVQ5-NF6g5XJzYlW9DThliEwtM",
      databaseURL: "https://foodapp-8fea2-default-rtdb.firebaseio.com/",
      messagingSenderId: "769357624073",
      projectId: "foodapp-8fea2",
      storageBucket: "foodapp-8fea2.appspot.com"
    })
    if (Platform.OS == "ios") {
      await messaging().getToken().then((res) => {
        console.log('asdasdasd Login-->> ', res);
        setDeviceId(res)
      })
    }
  }
  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn().then(async (res) => {

        let userDetails = res.user
        let user = {
          loginType: "google",
          email: userDetails.email,
          givenName: userDetails.givenName,
          familyName: userDetails.familyName,
          "device_id": deviceId,
          'os': Platform.__constants.Release,
          "model": Platform.__constants.Model,
          "platform": Platform.OS,
          "device": Platform.__constants.Model
        }
        let data = {
          email: userDetails.email,
          loginType: "facebook",
          password: '12344567788',
          "device_id": deviceId,
          'os': Platform.__constants.Release,
          "model": Platform.__constants.Model,
          "platform": Platform.OS,
          "device": Platform.__constants.Model
        }
        console.log("Google -->>  user -->> ", user)
        setLoader(true)
        await axios.post(path.LOGIN_API, data).then(async (res) => {
          let { token } = res.data.data
          DeviceInfo.getIpAddress().then((res) => {
            console.log('My Ip -->> ', res)

          }).catch((e) => {
            console.log("Error in IP -->>", e);
          })
          console.log('My Google -->> Google se Login Hogayaa', token)
          await AsyncStorage.setItem('Token', JSON.stringify(token)).then(() => {
            setLoader(false)
            console.log("Error in Login ");
            AsyncStorage.setItem('loginType', 'SocialLogin')
            navigation.replace('Home')
          }).catch((e) => {
            setLoader(false)
            console.log('Error in Setting Token Google', e);
          })
        }).catch((e) => {
          setLoader(false)
          console.log('Error login Google', JSON.stringify(e))
          DeviceInfo.getIpAddress().then((res) => {
            console.log('My Ip -->> ', res)
            let myError = e.message
            if (res == "0.0.0.0") {
              console.log('Net Nhi Chal rha')
              Toast.show({
                text: JSON.stringify(myError).substr(1, myError.length),
                type: 'danger',
                position: 'center',
                style: {
                  marginTop: 50,
                }
              })
            } else {
              console.log('Net Chal rhaa hay');
              navigation.replace('MobileVerification', { user: user })
            }
          }).catch((e) => {
            console.log("Error in IP -->>", e);
          })
        })

      }).catch((e) => {
        setLoader(false)
        console.log('Google user failed-->>', JSON.stringify(e.message));

      })

    } catch (error) {
      setLoader(false)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setLoader(false)
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setLoader(false)
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setLoader(false)
        // play services not available or outdated
      } else {
        setLoader(false)
        // some other error happened
      }
    }
  }

  const setPosition = () => {
    AsyncStorage.setItem('location', JSON.stringify(location)).then(() => {
      console.log('Settled Location => ', location);
    })
  }

  const getPosition = async () => {
    let loc = await AsyncStorage.getItem('location')
    let formattedAddress = JSON.parse(loc)
    if (formattedAddress) {
      setLocation(formattedAddress)
    } else {
      Geolocation.getCurrentPosition((position) => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        setLocation(region)
      })
    }
  }
  const signIn = async () => {
    if (userName == "" || password == "") {
      userName == "" ? setEmptyUsername(true) : setEmptyUsername(false)
      password == "" ? setEmptyPassword(true) : setEmptyPassword(false)
    } else if (userName !== "" || password !== "") {
      setLoader(true);
      let data = {
        email: userName,
        password: password,
        device_id: deviceId,
        os: Platform.__constants.Release,
        model: Platform.__constants.Model,
        platform: Platform.OS,
        device: Platform.__constants.Model
      }

      await axios.post(path.LOGIN_API, data)
        .then((resp) => {
          if (resp.data.data.status == '200') {
            if (isEnabled) {
              AsyncStorage.removeItem('loginCredentials').then(() => {
                AsyncStorage.setItem('loginCredentials', JSON.stringify(data)).then(() => {
                  console.log('Credentials Saved');
                })
              })
            }
            setLoader(false)
            // AsyncStorage.removeItem('Token').then(() => {
            //   console.log('Removed');
            // });
            let token = resp.data.data.token;
            console.log('Tokemn ', token);
            let currency = resp.data.data.currency
            AsyncStorage.setItem('Token', JSON.stringify(token)).then(() => {
              AsyncStorage.setItem('Currency', JSON.stringify(currency)).then(() => {
                navigation.replace('Home');
              }).catch((e) => {
                alert(e)
              })
            });
          } else {
            Toast.show({
              text: "Login Error",
              type: 'danger',
              position: 'top',
              style: {
                marginTop: 50
              }
            })
          }
        })
        .catch((e) => {
          setLoader(false)
          // let error = JSON.stringify(e)
          let error = JSON.stringify(e.response.data.data)

          console.log('Login Error-->> ', error);
          // console.log('Login Error-->> ', e.response.data?e.response.data:"Server Crashing")
          Toast.show({
            text: "Invalid Username or password",
            type: 'danger',
            position: 'top',
            style: {
              marginTop: 50
            }
          })
        });
    }

  }



  const initUser = async (token) => {
    await fetch('https://graph.facebook.com/v2.5/me?fields=email,first_name,last_name,friends&access_token=' + token)
      .then(async (response) => {
        response.json().then(async (json) => {
          console.log("Faceboo ka Dataa-->> ", json)

          const ID = json.id
          const EM = json.email
          const FN = json.first_name
          const LN = json.last_name

          const data = {
            email: EM,
            loginType: "facebook",
            password: '12344567788',
            device_id: deviceId,
            os: Platform.__constants.Release,
            model: Platform.__constants.Model,
            platform: Platform.OS,
            device: Platform.__constants.Model
          }
          const user = {
            loginType: "facebook",
            email: EM,
            givenName: FN,
            familyName: LN,
            device_id: deviceId,
            os: Platform.__constants.Release,
            model: Platform.__constants.Model,
            platform: Platform.OS,
            device: Platform.__constants.Model
          }
          console.log('My USer', user);


          await axios.post(path.LOGIN_API, data).then(async (res) => {
            let { token } = res.data.data
            console.log('Facebook se Login Hogayaa', token)
            await AsyncStorage.setItem('Token', JSON.stringify(token)).then(() => {
              setLoader(false)
              AsyncStorage.setItem('loginType', 'SocialLogin')
              navigation.replace('Home')
            }).catch((e) => {
              Toast.show({
                text: "Couldn't connect with Facebook",
                type: 'danger',
                position: 'top',
                style: {
                  marginTop: 50,
                }
              })
              console.log('Error in Setting Token FB', e);
            })

          }).catch((e) => {
            setLoader(false)
            let myError = JSON.stringify(e.message)
            console.log('Facebook error-->> ', myError);
            DeviceInfo.getIpAddress().then((res) => {
              console.log('My Ip -->> ', res)
              // if (res == "0.0.0.0") {
              //   console.log('Net Nhi Chal rha')
              //   Toast.show({
              //     text: "Kindly check your internet Connection"+myError,
              //     type: 'danger',
              //     position: 'top',
              //     style: {
              //       marginTop: 50
              //     }
              //   })

              // } 

              console.log('Net Chal rhaa hay');
              navigation.replace('MobileVerification', { user: user })

            }).catch((e) => {
              console.log("Error in IP -->>", e)
            })
            console.log('Error login FB', e.response.data)


          })

        })
      })
      .catch(() => {
        console.log('ERROR GETTING DATA FROM FACEBOOK')
      })
  }

  const loginWithFacebook = () => {
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      function (result) {
        setLoader(true)
        if (result.isCancelled) {
          console.log("==> Login cancelled");
          setLoader(false)

        } else {

          console.log(
            "==> Login success with permissions: " +
            result.grantedPermissions.toString()
          )

          console.log('Facebook Login Data-->> ', result)

          AccessToken.getCurrentAccessToken().then(
            (data) => {
              // console.log(data.accessToken.toString())
              let token = data.accessToken.toString()
              console.log('FB Acces token-->>  ', data)
              initUser(token)

            })
        }
      },
      function (error) {

        let myError = JSON.stringify(error.message)
        console.log(myError.substr(1, myError.length - 2));
        DeviceInfo.getIpAddress().then((res) => {
          console.log('My Ip -->> ', res)
          if (res == "0.0.0.0") {
            console.log('Net Nhi Chal rha')
            Toast.show({
              text: myError.substr(1, myError.length - 2),
              type: 'danger',
              position: 'top',
              style: {
                marginTop: 50,
              }
            })
          } else {
            console.log('Net Chal rhaa hay');
            Toast.show({
              text: "Couldn't connect with Facebook",
              type: 'danger',
              position: 'top',
              style: {
                marginTop: 50,
              }
            })
          }
        }).catch((e) => {
          console.log("Error in IP -->>", e);
        })
      }
    );
  }



  const clearCart = async () => {
    await AsyncStorage.removeItem('Cart').then(() => {
      // alert('Done')

    }

    )
  }

  return (
    <Content style={{ backgroundColor: 'white' }}>
      <ActivityIndicator
        animating={loader}
        style={{ position: 'absolute', alignSelf: 'center', marginTop: '60%' }}
        size={Platform.OS === 'android' ? 50 : 'large'}
        color={Colors.AppColor}
      />
      <MapView
        style={{ flex: 1 }}
        // initialRegion={this.state.initialRegion}
        showsUserLocation={true}
        autoFocus={true}
      // initialRegion={this.state.region ? this.state.region : this.state.initialRegion}
      // onMapReady={this.onMapReady}
      // onRegionChangeComplete={this.onRegionChange}
      >
        <MapView.Marker
          coordinate={{ "latitude": 0, "longitude": 0 }}
          title={"Your Location"}
          draggable
        />
      </MapView>
      {/* {console.log(userName)} */}
      <View style={{ marginTop: 10, marginBottom: 10, flex: 1 }}>
        <View
          onTouchEnd={() => navigation.replace('Home')}
          style={{ alignSelf: 'flex-end', marginRight: 15 }}>
          <Text
            style={{ fontSize: 20, fontFamily: semiBold, color: '#464951' }}>
            Skip
            </Text>
        </View>
        <View style={styles.container}>
          <View />
          <Image
            resizeMode="contain"
            source={Logo}
            style={{ width: 200, height: 180 }}
          />
          <Text style={styles.logoText}>Find food you love</Text>
          <Text style={styles.description}>
            Discover the best food from over 1,000 restaurants
            </Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={{
            ...styles.inputs,
            borderColor: emptyUsername ? 'red' : '#707070',
          }}>
            <AntIcon
              name="user"
              size={28}
              color="#9A9A9A"
              style={{ paddingVertical: 4, paddingHorizontal: 10 }}
            />
            <TextInput
              value={userName}
              autoCapitalize={false}
              autoCorrect={false}
              onChangeText={(value) => {
                setEmptyUsername(false)
                setUserName(value)
              }}
              autoCapitalize={false}
              style={styles.inputText}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="#9A9A9A"
            />
          </View>
          <View style={{
            display: emptyUsername ? 'flex' : 'none',
            alignSelf: "flex-start",
            marginLeft: 15
          }}>
            <Text style={{
              color: 'red',

            }}>Please enter email</Text>
          </View>

          <View style={{
            ...styles.inputs,
            borderColor: emptyPassword ? 'red' : '#707070',
          }}>
            <AntIcon
              name="lock"
              size={28}
              color="#9A9A9A"
              style={{ paddingHorizontal: 9 }}
            />
            <TextInput
              value={password}
              onChangeText={(value) => {
                setEmptyPassword(false)
                setPassword(value)

              }
              }
              autoCapitalize={false}
              secureTextEntry={isHidden ? true : false}
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="#9A9A9A"
            />

            {isHidden ? (
              <EntypoIcon
                Button
                onPress={() => setIsHidden(false)}
                name="eye-with-line"
                size={25}
                color="#9A9A9A"
              />
            ) : (
              <EntypoIcon
                Button
                onPress={() => setIsHidden(true)}
                name="eye"
                size={25}
                color="#9A9A9A"
              />
            )}
          </View>
        </View>
        <View style={{
          display: emptyPassword ? 'flex' : 'none',
          marginLeft: 15
        }}>
          <Text style={{
            color: 'red'
          }}>Please enter password</Text>
        </View>
        <View style={styles.remberContainer}>
          <View>
            <Text style={styles.rememberText}>Remember Me</Text>
          </View>
          <View>
            <Switch
              onValueChange={toggleSwitch}
              value={isEnabled}
              trackColor={{ false: '#ACACAC', true: Colors.AppColor }}
              thumbColor={'#ffffff'}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.authBtnContainer}
          // onPress={() => navigation.navigate('Home') }
          onPress={() => signIn()}>
          <View style={styles.authButtonText}>
            <Text style={styles.authBtn}>Sign In</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('OtpVerify')}
          style={styles.forgetPasswordContainer}>
          <Text style={styles.forgetPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.borderLineContainer}>
          <View style={styles.borderLine}></View>
          <Text
            style={{
              paddingLeft: 15,
              paddingRight: 5,
              fontSize: 18,
              // fontWeight: 'bold',
              color: Colors.AppColor,
            }}>
            OR
            </Text>
          <View style={styles.borderLine}></View>
        </View>
        <View style={styles.socialMediaButtonContainer}>
          <SocialMeidaButton
            onPress={() => loginWithFacebook()}

            color="white"
            backgroundColor="#3b5998"
            title="Connect with Facebook"
            icon={() => <Icon name="facebook" size={30} color="white" />}
          />

        </View>
        <View style={styles.socialMediaButtonContainer}>
          <SocialMeidaButton
            onPress={() => googleSignIn()}
            color="white"
            backgroundColor={Colors.AppColor}
            title="Connect with Google"
            icon={() => <Icon name="google" size={30} color="white" />}
          />


          <View style={styles.socialMediaButtonContainer} >

          </View>


        </View>
        <View style={styles.haveAnAccountContainer}>
          <Text
            style={{ paddingLeft: 4, fontFamily: regular, color: '#9A9A9A' }}>
            Don't have an account?
            </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text
              style={{
                color: Colors.AppColor,
                textDecorationLine: 'underline',
                fontFamily: regular,
              }}>
              {' '}
                Sign Ups
              </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{ textAlign: 'center', fontFamily: semiBold, fontSize: 10 }}>Build number : 37</Text>
    </Content>
  );
};

const mapDispatchToprops = (dispatch) => {
  return {
    updateTheUser: (obj) => dispatch(userLoginRequest(obj)),
  };
};
function mapStateToProps(state, ownProps) {
  const userData = state.userReducer.user || {};
  const { profile, token } = userData;
  const loading = state.userReducer.loading;
  console.log('loading-->> ', loading);
  console.log('user Token from Reducer-->> ', userData);
  const userError = state.userReducer.error;
  return { userData, userError, loading };
}

export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    // lineHeight: 300,
  },
  logoText: {
    color: Colors.AppColor,
    fontSize: 30,
    marginTop: 6,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  description: {
    color: '#9A9A9A',
    width: 205,
    textAlign: 'center',
    marginTop: 6,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  inputContainer: {
    alignItems: 'center',
  },
  inputs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#707070',
    borderRadius: 10,
    // padding: 4,
    paddingHorizontal: 12,
    margin: 8,
    justifyContent: "space-between",
    width: '95%',
  },

  inputText: {
    maxWidth: '80%',
    minWidth: '80%',
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
    paddingVertical: 10
  },
  remberContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    marginBottom: 4,
    width: '95%',
  },
  rememberText: {
    fontSize: 18,
    color: '#9A9A9A',
    // textAlign:'center'
  },
  authBtnContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: Colors.AppColor,
    height: 50,
    borderRadius: 8,
  },
  authBtn: {
    textAlign: 'center',
    color: 'white',
    textAlignVertical: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  authButtonText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgetPasswordContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 8,
    width: '95%',
  },
  forgetPasswordText: {
    fontSize: 16,
    color: Colors.AppColor,
    textDecorationLine: 'underline',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  borderLine: {
    marginLeft: 15,
    borderTopColor: Colors.AppColor,
    borderWidth: 1,
    borderStyle: 'solid',
    width: '38%',
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    backgroundColor: Colors.AppColor,
  },
  borderLineContainer: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  socialMediaButtonContainer: {
    // flex: 1,
    alignItems: 'center',
    margin: 10,
    width: '95%',
  },
  haveAnAccountContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});