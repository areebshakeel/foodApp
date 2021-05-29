import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Alert,
  Linking
} from 'react-native';
import WelcomeImage from '../images/welcome.png';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import MapView from "react-native-maps";

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const LATITUDE_DELTA = 0.0062998339347544174 //Very high zoom level
const LONGITUDE_DELTA = 0.004023313891394764

export default function Welcome({ navigation }) {

  const [location, setLocation] = useState('')
  const [token, setToken] = useState('')
  useEffect(() => {
    (async () => {
      let data = await AsyncStorage.getItem('Token')
      let token = JSON.parse(data)
      // Geolocation.getCurrentPosition(
      //   (position) => {
      //     const region = {
      //       latitude: position.coords.latitude,
      //       longitude: position.coords.longitude,
      //       latitudeDelta: LATITUDE_DELTA,
      //       longitudeDelta: LONGITUDE_DELTA,
      //     }
      //     console.log("REGION", region)

      //     // setLocation(region)
      //     // setPosition()
      //   },
      // );
      let loc = await AsyncStorage.getItem('location')
      let coordinates = JSON.parse(loc)

      console.log(coordinates);

      // getPosition()
      console.log(token);
      if (token) {
        setToken(token)
        if (coordinates) {
          navigation.navigate('Home', { region: location })
        } else {
          getPosition()
          navigation.navigate('Home')
        }
        navigation.navigate('Home')
      }
      // try {

      //   token ? getPosition() : ""

      // } catch (error) {
      //   alert(error)
      // }
    })();
  }, [])

  const setPosition = () => {
    AsyncStorage.setItem('location', JSON.stringify(location)).then(() => {
      console.log('Settled Location => ', location);
    })
  }

  const getPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }
        console.log("REGION", region)

        setLocation(region)
        setPosition()
      },
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 5000 },
    );
  }


  // const getUnloggedLocation = async ()=>{
  //   console.log("Welcome Position-->> ",location )
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       const region = {
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //         latitudeDelta: LATITUDE_DELTA,
  //         longitudeDelta: LONGITUDE_DELTA,
  //       }
  //       console.log("REGION", position)
  //       setLocation(region)
  //       setPosition()
  //     },
  //     (error) => {
  //       // Alert.alert("Kindly Allow Location", "Please allow location for the best results."
  //       //   ,
  //       //   [
  //       //     { text: "OK", onPress: () => Linking.openSettings() }
  //       //   ],
  //       //   { cancelable: false });
  //       // this.setState({
  //       //   error: error.message,
  //       //   loading: false,
  //       //   initialRegion: {
  //       //     latitude: 24.926294,
  //       //     longitude: 67.022095,
  //       //     latitudeDelta: LATITUDE_DELTA,
  //       //     longitudeDelta: LONGITUDE_DELTA,
  //       //   },
  //       // })
  //     },
  //     { enableHighAccuracy: false, timeout: 200000, maximumAge: 5000 },
  //   );
  // }
  return (
    <ScrollView style={{ backgroundColor: '#FFFFFF' }}>
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
      <View style={{ marginTop: 60, backgroundColor: '#FFFFFF' }}>
        <View style={styles.headingContainer}>
          <Text style={styles.welcomeHeading}>Welcome to FoodApp</Text>
          <Text style={styles.description}>
            Food app satisfies your food craving with your favorite food and
            restaurants, where ever you are
          </Text>
          <View style={{ paddingVertical: 20, width: '50%' }}>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={() => {
                if (!token) {
                  navigation.navigate('Login')
                }
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  textAlign: 'center',
                  fontFamily: semiBold,
                }}>
                Get Started
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ alignItems: 'center', marginTop: 80 }}>
          <Image
            resizeMode="contain"
            source={WelcomeImage}
            style={{ width: 350, height: 250 }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  welcomeHeading: {
    color: Colors.AppColor,
    fontSize: 30,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: semiBold,
  },
  headingContainer: {
    width: '95%',
    alignSelf: 'center',
    alignItems: 'flex-start',
  },
  description: {
    color: '#9A9A9A',
    // width: '65%',
    textAlign: 'left',
    marginTop: 6,
    // marginRight: 20,
    fontFamily: regular,
  },
  getStartedButton: {
    backgroundColor: Colors.AppColor,
    paddingVertical: 15,
    // paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
  },
});
