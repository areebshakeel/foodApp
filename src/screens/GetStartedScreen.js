import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { View, Text, ImageBackground, ActivityIndicator, Platform } from 'react-native'
import Colors from '../config/colors';
import Logo from '../images/logo.png'
import Geolocation from '@react-native-community/geolocation';

export default function GetStartedScreen({ navigation }) {
    const [tokenState, setTokenState] = useState('')
    // const getToken = async () => {

    //     let token = await AsyncStorage.getItem('Token')
    //     const TokenValue = JSON.parse(token)
    //     setTokenState(TokenValue)
    //     console.log('Token in Navigation-->> ', TokenValue)
    // }

    useEffect(() => {
        (async () => {
            let data = await AsyncStorage.getItem('Token')
            let token = JSON.parse(data)
            try {

                token ? navigation.navigate('Home') : navigation.navigate('Welcome')

            } catch (error) {
                alert(error)
            }
        })();
    }, [])

    const getPosition = () => {
     
        console.log("Welcome Position-->> ",location )
        const geoLocation = Geolocation.getCurrentPosition(
          (position) => {
            const region = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }
            console.log("REGION", position)
    
            setLocation(region)
            AsyncStorage.setItem('location', JSON.stringify(region)).then((res=>{
              console.log('Gotten location', res)
              navigation.navigate('Home')
            }))
          },
          (error) => {
            Alert.alert("Kindly Allow Location", "Please allow location for the best results."
              ,
              [
                { text: "OK", onPress: () => Linking.openSettings() }
              ],
              { cancelable: false });
            // this.setState({
            //   error: error.message,
            //   loading: false,
            //   initialRegion: {
            //     latitude: 24.926294,
            //     longitude: 67.022095,
            //     latitudeDelta: LATITUDE_DELTA,
            //     longitudeDelta: LONGITUDE_DELTA,
            //   },
            // })
          },
          { enableHighAccuracy: false, timeout: 200000, maximumAge: 5000 },
        );
      }
    return (
        <View style={{ backgroundColor: '#FFF', flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
            <ImageBackground resizeMode="contain" source={Logo} style={{ width: '100%', height: 300 }} />
        </View>
    )
}