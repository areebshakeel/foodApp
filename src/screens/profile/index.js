import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, SafeAreaView, Alert, ScrollView, ActivityIndicator } from 'react-native';
import ProfileImage from '../../images/avatar.jpg';
import CameraIcon from '../../images/camera-icon.png';
import CLoseImage from 'react-native-vector-icons/AntDesign';
import ProfileDetails from './profileDetails';
import UserImage from '../../images/profile-avatar.png';
import OrdersImage from '../../images/my-order-icon.png';
import WalletImage from '../../images/wallet-icon-new.png';
import DisputeImage from '../../images/information.png';
import LogoutImage from '../../images/logout.png';
import FavouriteImage from '../../images/favorites.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { path } from '../../config/path';
import Avatar from 'react-native-vector-icons/FontAwesome'
import Colors from '../../config/colors';
import { NavigationActions, StackActions } from 'react-navigation';
import { LoginButton, AccessToken, LoginManager, LoginBehaviorIOS, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { Toast } from 'native-base';
import { GoogleSignin } from '@react-native-community/google-signin';
import messaging from '@react-native-firebase/messaging'
import Firebase from '@react-native-firebase/app'


export default function Profile({ navigation }) {
  const [loader, setLoader] = useState(false)
  const [profile, setProfile] = useState('')
  const [loginType, setLoginType] = useState('')
  const [deviceId, setDeviceId] = useState('')


  navigation.addListener('focus', async () => {
    let data = await AsyncStorage.getItem('Token')
    let token = JSON.parse(data)
    setTokenState(token)
    console.log({ token });
    if (!token) {
      navigation.navigate('Login')
    } else {
      getProfile()
    }
  })
  const [tokenState, setTokenState] = useState('')
  const [local, setLocal] = useState(true)
  const getToken = async () => {
    let token = await AsyncStorage.getItem('Token').then((res) => {
      setTokenState(JSON.parse(token))

    }).catch((error) => {
      console.log('Erorr in getting Token')
    })

  }
  const firebaseToken = async () => {
    Firebase.initializeApp()
    await messaging().getToken().then((res) => {
      console.log('Firebase token in Profile ', res);
      setDeviceId(res)
    })
  }
  useEffect(() => {
    (async () => {
      firebaseToken()
      let data = await AsyncStorage.getItem('Token')
      let token = JSON.parse(data)
      setTokenState(token)
      console.log('My token', token);
      getProfile()
      try {

        if (!token) {
          navigation.navigate('Login')
        }
      } catch (error) {
        alert(error)
      }
    })()
  }, [])

  const logoutFacebook = async () => {
   
      var current_access_token = '';
     await AccessToken.getCurrentAccessToken().then((data) => {
        console.log('My Access token in logout-->> ',data)
        current_access_token = data.accessToken.toString();
      }).then(() => {
       
        let logout =
        new GraphRequest(
          "me/permissions/",
          {
              accessToken: current_access_token,
              httpMethod: 'DELETE'
          },
          (error, result) => {
            console.log(error, result)
              if (!error) {
                  console.log('Error fetching data: ' + error)
              } else {
                  LoginManager.logOut();
                  alert('LOGOUT HOGAYA')
                  navigation.navigate('Login')
              }
          });
        new GraphRequestManager().addRequest(logout).start();
      })
      .catch(error => {
        console.log(error)
      });      
    

  }

  async function getProfile() {
    
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

  const profiDetails = [
    { image: UserImage, text: 'My Profile', route: 'MyVehicles' },
    { image: OrdersImage, text: 'Orders', route: 'OrderHistory' },
    { image: FavouriteImage, text: 'Favorites', route: 'Favorites' },
    { image: WalletImage, text: 'My Wallet', route: 'MyWallet' },
    { image: DisputeImage, text: 'Disputes', route: 'Disputes' },
    { image: LogoutImage, text: 'Logout', route: 'Login' },
  ];

  const logoutGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
     // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };
  async function handler(item) {
    let token = await AsyncStorage.getItem('Token')
    let TokenValue = JSON.parse(token)
    if (item.route === 'Login') {
      try {
        let token = await AsyncStorage.getItem('Token')
        let TokenValue = JSON.parse(token)
        console.log('TOken in Logout', TokenValue)
        Alert.alert(
          "Are you sure you want to logout",
          "",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => logout(item) }
          ],
          { cancelable: false }
        );
        async function logout(item) {
          console.log('Device iD Logout-->>');
          let form = new FormData()
          form.append('device_id', deviceId)
          setLoader(true)
          loginType=="google" ? logoutGoogle():null
          loginType=="facebook"? LoginManager.logOut():'null'
          await axios.post(path.LOGOUT_API, form, {
            headers: {
              'Authorization': 'Bearer ' + TokenValue,
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            },
          }).then((res) => {
            // logoutFB()
            // logoutGoogle()
            AsyncStorage.removeItem('location')
            AsyncStorage.removeItem('Location')
            AsyncStorage.removeItem('Token').then((res) => {
              AsyncStorage.removeItem('Cart').then(() => {
                AsyncStorage.removeItem('loginType')
                setLoader(false)
                navigation.navigate(item.route)
                console.log('Cart Removed from Async ', res)
              })
            }).catch((e) => {
              setLoader(false)
              console.log('couldnt clear ASync Storage', e)
            })
            console.log('Logout Successfull-->> ')
            navigation.navigate(item.route)
          }).catch((e) => {
            setLoader(false)
            Toast.show({
              text: "Error Logging out something went wrong",
              type: 'danger',
              position: 'top',
              style: {
                marginTop: 50
              }
            })
            console.log('Error in Log out-->> ', e.message)
            navigation.navigate("Login")
          })
        }
      } catch (error) {
        setLoader(false)
        console.log('Error in Loging out', error)
      }
    }
    else {
      console.log('Profile Token-->> ', TokenValue)
      TokenValue ?
        navigation.navigate(item.route) : navigation.navigate('Login')
    }
  }
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <ActivityIndicator
          animating={loader}
          style={{ position: 'absolute', alignSelf: 'center', marginTop: '60%' }}
          size={Platform.OS === 'android' ? 50 : 'large'}
          color={Colors.AppColor}
        />
        <View onTouchEnd={() => navigation.goBack()}>
          <CLoseImage name="close" size={30} />
        </View>
        <View style={styles.imageContainer}>
          {/* <Image resizeMode="contain" source={ProfileImage} style={{ borderRadius: 100,width:50 }} /> */}
          <Avatar name="user-circle" size={100} color={Colors.AppColor} />
         
        </View>
        <View style={{ marginTop: 30 }}>
          {profiDetails.map((item, index) => {
            return (
              <ProfileDetails
                onPress={() => handler(item)}
                text={item.text}
                icon={item.image}
                index={index}
                dataLength={profiDetails.length}
              />
            );
          })}
          {/* {loginType=="facebook"?<LoginButton style={{
            width:'100%', height:50, color:'#FFF',
          }}  onLogoutFinished={()=>handler()} />:<Text></Text>} */}
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  imageContainer: {
    alignSelf: 'center',
  },
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: '#FFFF',
  },
  line: {
    // borderTopWidth:1,
    borderColor: '#464951',
    // marginTop:5
  },
})