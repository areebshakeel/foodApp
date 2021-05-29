import React, { Component } from 'react';
import { Text, View, ActivityIndicator, Image, PermissionsAndroid, Dimensions, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Alert, Linking } from 'react-native';
import MapView from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
let { width, height } = Dimensions.get('window')
import Button from '../Components/Button/index'
import { Container, Content, Icon } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ASPECT_RATIO = width / height
const windowHeight = Dimensions.get('window').height
import DeviceInfo from 'react-native-device-info';
import locationFocused from '../images/location-focused.png';

const LATITUDE_DELTA = 0.0062998339347544174 //Very high zoom level
const LONGITUDE_DELTA = 0.004023313891394764
// Disable yellow box warning messages

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            region: null,
            isMapReady: false,
            marginTop: 1,
            userLocation: "",
            regionChangeProgress: false,
            addressComponents: "",
            addressType: "",
            modalVisible: false,
            buttonTitle: 'Locate Yourself',
            markerLocation: ''
        };
    }

    getPosition = async () => {

        Geolocation.getCurrentPosition(
            (position) => {
                const region = {
                    latitude:position.coords.latitude,
                    longitude:position.coords.longitude,
                    latitudeDelta:   LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                };
                console.log("REGION", position)
                this.setState({
                    region: region,
                    loading: false,
                    error: null,
                    initialRegion: null
                });
            },
            (error) => {
                // alert(error);
                this.setState({
                    error: error.message,
                    loading: false,
                    initialRegion: {
                        latitude: 24.926294,
                        longitude: 67.022095,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    },
                })
            },
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 5000 },
        );
    }
    async componentDidMount() {
        this.getLocation()
        let locs = await AsyncStorage.getItem('location')
        let los = JSON.parse(locs)
        if (!los) {
            DeviceInfo.isLocationEnabled().then(async (resp) => {
                if (!resp) {
                    Alert.alert(
                        "Location",
                        "Kindly allow location for best results",
                        [
                            { text: "OK", onPress: () => Linking.openSettings() }
                        ]
                    );
                }
            })
        }
        // console.log("USER FROM REDUX", this.props.user)
        // const { user } = this.props
        // console.log("FROM IN MAP", this.props.navigation.getParam("from"))
        // const from = this.props.navigation.getParam("from")
        this.getPosition()
        console.log("Position Inside Maps ->> ", this.state.region)
    }

    onMapReady = () => {
        this.setState({ isMapReady: true, marginTop: 0 });
    }

    // Fetch location details as a JOSN from google map API
    fetchAddress = () => {
        fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.region.latitude + "," + this.state.region.longitude + "&key=" + "AIzaSyAqC5og7feEmdPWUfi05lcXsZnmtWf99SY")
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Response-->> ", responseJson.results[0].formatted_address)
                // AsyncStorage.setItem('Location', JSON.stringify(responseJson.results[0].formatted_address))
                const userLocation = responseJson.results[0].formatted_address;
                this.setState({
                    userLocation: userLocation,
                    regionChangeProgress: false,
                    addressComponents: responseJson.results[0].address_components,
                    addressType: responseJson.results[0].types,
                    // modalVisible: true
                })
            })
    }

    // Update state on region change
    onRegionChange = region => {
        this.setState({
            region,
            regionChangeProgress: true,
            modalVisible: false,
            markerLocation : region
        },
            () => {
                !this.state.initialRegion && this.fetchAddress()
            }
        );
        // this.setState({
        //     region
        // })
    }

    // Action to be taken after select location button click
    // onLocationSelect = () => alert(this.state.userLocation);
    onLocationSelect = () => this.setState({ modalVisible: true })

    // createProfile = () => {
    //     const { } = this.state
    // }
    getLocation = async () => {
        let loc = await AsyncStorage.getItem('location')
        let location = JSON.parse(loc)
        if (location) {
            location.longitudeDelta = LONGITUDE_DELTA
            location.latitudeDelta = LATITUDE_DELTA
            await this.setState({ markerLocation: location })
        } else {
            Geolocation.getCurrentPosition((pos) => {
                this.setState({ markerLocation: pos.coords })
            })
        }
    }
    currentLocation = () => {
        Geolocation.getCurrentPosition((pos) => {
            this.setState({ markerLocation: pos.coords, region : pos.coords })
        })
    }
    render() {
        const { modalVisible, regionChangeProgress } = this.state
        return (
            <Container style={styles.container}>
                <TouchableOpacity
                    onPress={
                        () => this.props.navigation.goBack()
                    }
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 200,
                        height: 50,
                        width: 50,
                        position: 'absolute',
                        top: Platform.OS == "ios" ? 50 : 10,
                        left: 10,
                        zIndex: 99,
                        justifyContent: 'center'
                    }}>
                    <Icon
                        name="close"
                        style={styles.close}
                    />
                </TouchableOpacity>
                {Platform.OS === 'ios'?<TouchableOpacity
                    onPress={
                     ()=>this.currentLocation()
                    }
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 200,
                        height: 50,
                        width: 50,
                        position: 'absolute',
                        top: Platform.OS == "ios" ? 50 : 10,
                        right: 10,
                        zIndex: 99,
                        justifyContent: 'center',
                        padding: 12
                    }}>
                    <Image source={locationFocused} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
                </TouchableOpacity>: <View></View>}
                <View style={{ width: "100%", height: "100%" }}>

                    {
                        (this.state.initialRegion || this.state.region) &&
                        // !!this.state.region.latitude && !!this.state.region.longitude &&
                        <MapView
                            style={{ flex: 1 }}
                            // initialRegion={this.state.initialRegion}
                            showsUserLocation={true}
                            autoFocus={true}
                            // initialRegion={this.state.markerLocation ? this.state.markerLocation : this.state.initialRegion}
                            region = {this.state.markerLocation ? this.state.markerLocation : this.state.initialRegion}
                            // region={this.state.region ? this.state.region : this.state.initialRegion}
                            onMapReady={this.onMapReady}
                            onRegionChangeComplete={this.onRegionChange}
                        >
                            {this.state.region && <MapView.Marker
                                coordinate={{ "latitude": this.state.region.latitude, "longitude": this.state.region.longitude }}
                                title={"Your Location"}
                                draggable
                            />}
                        </MapView>
                    }
                </View>
                <View style={{
                    position: "absolute",
                    bottom: 0,
                    width: '100%',
                    paddingHorizontal: 10,
                    height: 100,
                    alignSelf: "center",
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: "white",
                    alignItems: 'center'
                    // flexDirection: "row",
                    // justifyContent: "center",
                    // alignItems: "center"
                }}>

                    <Button
                        onPress={() => {
                            // alert(JSON.stringify(this.state.userLocation))
                            AsyncStorage.setItem('location', JSON.stringify(this.state.region)).then(() => {
                                AsyncStorage.setItem('Location', JSON.stringify(this.state.userLocation)).then(() => {
                                    this.props.navigation.replace("Home")
                                })
                            })
                            // AsyncStorage.removeItem('location').then(()=>{
                            //     let location = {
                            //       longitude : this.state.region.latitude,
                            //       latitude : this.state.region.longitude
                            //     }
                            //     AsyncStorage.setItem('Location', JSON.stringify(this.state.finalLocationName))
                            //       console.log('New Location Set');
                            //     })
                            //   })
                            // this.props.navigation.navigate("Nearby", { location: this.state.region, restaurants : 'Restaurants' })
                            // this.props.navigation.replace("Home")
                        }}
                        title={this.state.buttonTitle}
                        color='#FFFFFF'
                        backgroundColor="#2196F3" />
                    {/* <TouchableOpacity
                            style={{backgroundColor: regionChangeProgress ? 'lightgrey' :  colors.primaryBtn, alignItems:"center", height:30, justifyContent:"center"}}
                            disabled={regionChangeProgress}
                            onPress={this.onLocationSelect}
                        >
                            <Text style={{color:"white"}}>PICK THIS LOCATION</Text>
                        </TouchableOpacity> */}
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width,
    },
    map: {

        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width
    },
    mapMarkerContainer: {
        left: '47%',
        position: 'absolute',
        top: '42%'
    },
    mapMarker: {
        fontSize: 40,
        color: "red"
    },
    deatilSection: {
        flex: 4,
        backgroundColor: "#fff",
        padding: 10,
        display: "flex",
        justifyContent: "flex-start"
    },
    spinnerView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    btnContainer: {
        width: Dimensions.get("window").width - 20,
        position: "absolute",
        bottom: 100,
        left: 10
    },
    close: {
        // width: '10%',
        alignSelf: 'center'
    },
})

export default Map
