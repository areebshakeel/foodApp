import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform, StatusBar, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { Container, Content } from 'native-base';
import ProfileImage from '../../images/user-image.png';
import VehicleEdit from '../../Components/vehicleEdit';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import DeleteIcon from '../../images/delete.png';
import BellIcon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { path } from '../../config/path';
import Avatar from 'react-native-vector-icons/FontAwesome'

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function MyVehicles({ navigation }) {
  const [isSwiped, setSwipe] = useState(false);
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [userImage, setUserImage] = useState('')
  const [vehicleData, setVehicleData] = useState([])
  const [loader, setLoader] = useState(true)
  const [refresh, setRefresh] = useState(false)
  const [i, setI] = useState(0)
  const [vehicleId, setVehicleId] = useState('')
  const [profile, setProfile] = useState('')

  useEffect(() => {
    getProfile()
    getVehicle()
  }, [])
  async function getProfile() {
    // setLoader(true)
    try {
      setLoader(true)
      let token = await AsyncStorage.getItem('Token')
      const TokenValue = JSON.parse(token);
      console.log('Profile token-->> ', TokenValue)

      await axios.post(path.GET_PROFILE, {}, {
        headers: {
          'Authorization': 'Bearer ' + TokenValue,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }).then((res) => {
        const profileData = res.data.data.profile
        // const vehicleData= res
        // // console.log('vehicles-->> ', vehicleData)
        console.log('Res in Profile-->', profileData);
        setProfile(profileData)
        setUserEmail(profileData[0].email)
        setUserName(profileData[0].name)
        setUserImage(profileData[0].img)
        console.log('profile-->> ', profile)
      }).catch((e) => {
        setLoader(false)
        console.log('Error in profile', e)
      })
    }
    catch (error) {
      console.log('errro in Profile', error)
    }
  }

  async function getVehicle() {
    setLoader(true)
    let token = await AsyncStorage.getItem('Token')
    const TokenValue = JSON.parse(token);
    console.log('Get Vehicle-->> ', TokenValue)

    await axios.post(path.GET_VEHICLE_API, {}, {
      headers: {
        'Authorization': 'Bearer ' + TokenValue,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
      console.log('Res in Get Vehicle-->> ', res.data.data);
      let data = res.data.data
      setVehicleData(data)
      setLoader(false)
      // console.log('VehicleState-->>', vehicleData)
    }).catch((e) => {
      setLoader(false)
      console.log('Error in Get vehicle--> ', e);
    })
  }

  // Pull to refresh
  async function onRefresh() {
    getProfile()
    setRefresh(true)
    let token = await AsyncStorage.getItem('Token')
    const TokenValue = JSON.parse(token);
    // console.log('Get Vehicle-->> ', TokenValue)

    await axios.post(path.GET_VEHICLE_API, {}, {
      headers: {
        'Authorization': 'Bearer ' + TokenValue,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
      setRefresh(false)
      console.log('Res in Get Vehicle-->> ', res.data.data);
      let data = res.data.data
      setVehicleData(data)
      setLoader(false)
      // console.log('VehicleState-->>')
    }).catch((e) => {
      console.log('Error in Get vehicle didMount--> ', e.response.data);
    })
  }

  if (i == 0) {
    navigation.addListener(
      'focus',
      // getVehicle()

      async () => {
        getProfile()

        try {
          let token = await AsyncStorage.getItem('Token')
          const TokenValue = JSON.parse(token);
          // console.log('Get Vehicle-->> ', TokenValue)

          await axios.post(path.GET_VEHICLE_API, {}, {
            headers: {
              'Authorization': 'Bearer ' + TokenValue,
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            },
          }).then((res) => {
            setLoader(true)
            setI(1)
            console.log('Res in Get Vehicle-->> ', res.data.data);
            let data = res.data.data
            setVehicleData(data)
            setLoader(false)
            // console.log('VehicleState-->>', vehicleData)
          }).catch((e) => {
            console.log('Error in Get vehicle navigate--> ', e.response.data);
          })
        } catch (error) {
          console.log("err-->> " + error);
        }
      }
    )
  }
 const  shortDesc = (str) => {
    let length_temp = 15;
    let temp_ret = str.length > length_temp ? (str.substring(0, length_temp) + "...") : (str);
    return temp_ret;
  }
  const  shortDesc1 = (str) => {
    let length_temp = 25;
    let temp_ret = str.length > length_temp ? (str.substring(0, length_temp) + "...") : (str);
    return temp_ret;
  }

  const rightActions = () => {
    // console.log('vehcle ID-->> ', vehicleId)
    async function deleteVehicle() {

      try {
        let token = await AsyncStorage.getItem('Token')
        const TokenValue = JSON.parse(token);

        let form = new FormData()
        form.append('id', vehicleId)

        await axios.post(path.DELETE_VEHICLE_API, form, {
          headers: {
            'Authorization': 'Bearer ' + TokenValue,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        }).then((res) => {
          console.log('Vehile delete res-->>> ', res)
          getVehicle()

        }).catch((e) => {
          console.log('Error vehicle delete--> ', e.response.data);
        })
      } catch (error) {
        console.log("err-->> ", error);
      }
    }
    return (
      <TouchableOpacity onPress={() => deleteVehicle()} style={styles.rightActions}>
        <Image source={DeleteIcon} resizeMode="contain" />
      </TouchableOpacity>
    );

  };
  return (
    <Container>
      <StatusBar barStyle={'light-content'} color={Colors.AppColor} backgroundColor={Colors.AppColor} />
      {Platform.OS === 'ios' && (
        <View
          style={{
            width: '100%',
            height: 50,
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: Colors.AppColor,
          }}
        />
      )}
      <Content style={styles.container} refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={() => onRefresh()}
        />} >

        <View
          style={{
            backgroundColor: Colors.AppColor,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: Colors.AppColor,
              padding: 8,
            }}>
            <TouchableOpacity style={styles.arrow} onPress={() => navigation.goBack()}>
              <Icon color="#FFF" name="arrowleft" size={30} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headingText}>Profile</Text>
            </View>
            <View>
              <BellIcon
                onTouchEnd={() => navigation.navigate('Notifications')}
                name="bell"
                size={25}
                color="#FFF"
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.push('AccountInformation', profile)}
            style={styles.profile}>
            <View style={{ marginBottom: 10 }}>
              {/* <Image resizeMode="contain" source={ProfileImage} style={{ width: 100 }} /> */}
              <Avatar name="user-circle" size={100} color="#FFF" />
            </View>
            <View style={{ paddingLeft: 10 }}>
              <Text style={{ color: '#FFF', fontSize: 20, fontFamily: medium, }} numberOfLines={1} ellipsizeMode="tail" >
                {shortDesc(userName.toUpperCase())}
              </Text>
              <Text
                style={{
                  color: '#FFF',
                  fontSize: 12,
                  fontFamily: medium,
                }}>
                {shortDesc1(userEmail)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.vehicle}>
          <Text
            style={{
              color: Colors.AppColor,
              fontFamily: semiBold,
              fontSize: 20,
            }}>
            My Vehicles
          </Text>
          <TouchableOpacity onPress={() => navigation.push('VehicleRegistration', { token: false })
          } >
            <Text

              style={{
                color: Colors.AppColor,
                fontFamily: regular,
                fontSize: 12,
              }}>
              Add new Vehicle
          </Text>

          </TouchableOpacity>
        </View>
        <ActivityIndicator animating={loader}
          style={{ position: 'absolute', alignSelf: 'center', marginTop: '20%', zIndex: 99 }}
          size={Platform.OS === 'android' ? 40 : 'large'}
          color="#FFF" />
        {!loader && vehicleData.length == 0 ? <Text style={{
          fontFamily: semiBold,
          textAlign: 'center'
        }}>No Vehicles Present.</Text> : null}
        {vehicleData ? vehicleData.map((item) => {
          return <Swipeable
            onSwipeableWillClose={() => setSwipe(false)}
            onSwipeableRightWillOpen={() => { setSwipe(true), setVehicleId(item.id) }}
            renderRightActions={() => rightActions()}>
            <View
              style={{
                padding: !isSwiped ? 4 : 0,
                marginRight: isSwiped ? -40 : 0,
                width: '95%',
                alignSelf: 'center',
              }}>
              <VehicleEdit navigation={navigation} data={item} isSwiped={isSwiped} />
            </View>
          </Swipeable>
        }) : <ActivityIndicator animating={loader}
          style={{ position: 'absolute', alignSelf: 'center', marginTop: '44%' }}
          size={Platform.OS === 'android' ? 40 : 'large'}
          color={Colors.AppColor} />}
      </Content>
    </Container>
  );
}
const styles = StyleSheet.create({
  headingText: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: semiBold,
  },
  arrow: {
    alignSelf: 'flex-start',
  },
  container: {
    // padding:10,
    // marginTop
  },
  profile: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: Colors.AppColor,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  vehicle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    marginTop: 10,
  },
  rightActions: {
    backgroundColor: Colors.AppColor,
    // padding: 10,
    flex: 0.2,
    paddingHorizontal: 20,
    // paddingVertical:10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomEndRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
    // width: '25%',
    alignSelf: 'center',
    // marginRight: 10,
  },
});
