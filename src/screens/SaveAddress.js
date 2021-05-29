import React, { Component } from 'react';
import { Text, View, ActivityIndicator, Image, PermissionsAndroid, Dimensions, TouchableOpacity, StyleSheet, TextInput, Platform } from 'react-native';
import MapView from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
let { width, height } = Dimensions.get('window')
import Button from '../Components/Button/index'
import { Container, Toast, Content, Icon } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../config/colors';
import axios from 'axios';
import { path } from '../config/path';
import locationFocused from '../images/location-focused.png';

const ASPECT_RATIO = width / height
const windowHeight = Dimensions.get('window').height
const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
    Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const LATITUDE_DELTA =parseFloat (0.0062998339347544174) //Very high zoom level
const LONGITUDE_DELTA =parseFloat (0.004023313891394764)
// Disable yellow box warning messages
const TAB_BAR_HEIGHT = 49;
class SaveAddress extends Component {
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
            buttonTitle: 'Save Address',
            finalCoordinates: {},
            finalLocationName: "",
            finalAddressName: "",
            token: "",
            swipeablePanelActive: false,
            home: true,
            work: false,
            other: false,
            selectedAddressType: "home"
        };
        // this.props.navigation.addListener = this.props.navigation.addListener.bind(this)
    }

    getPosition = async () => {

        Geolocation.getCurrentPosition(
            (position) => {
                const region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
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
        console.log('My Locationn ');

        this.getLocation()
        // console.log("USER FROM REDUX", this.props.user)
        // const { user } = this.props
        // console.log("FROM IN MAP", this.props.navigation.getParam("from"))
        // const from = this.props.navigation.getParam("from")
        // this.openPopUp()
        this.getPosition()
        let token = await AsyncStorage.getItem('Token')
        let Token = JSON.parse(token)
        this.setState({ token: Token })
    }

    onMapReady = () => {
        this.setState({ isMapReady: true, marginTop: 0 });
    }

    // Fetch location details as a JOSN from google map API
    fetchAddress = () => {
        fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.region.latitude + "," + this.state.region.longitude + "&key=" + "AIzaSyAqC5og7feEmdPWUfi05lcXsZnmtWf99SY")
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Response-->> ", responseJson.results[0].geometry.location)
                console.log("Response-->> ", responseJson.results[0].formatted_address)
                // AsyncStorage.setItem('Location', JSON.stringify(responseJson.results[0].formatted_address))
                const userLocation = responseJson.results[0].formatted_address;
                this.setState({
                    finalCoordinates: responseJson.results[0].geometry.location,
                    finalLocationName: responseJson.results[0].formatted_address,
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
    SaveAddress = async () => {
        let token = await AsyncStorage.getItem('Token')
        let Token = JSON.parse(token)
        // this.setState({ token: Token })

        const formData = new FormData()
        formData.append('title', this.state.selectedAddressType)
        formData.append('latlong', `${this.state.finalCoordinates.lat}, ${this.state.finalCoordinates.lng}`)
        formData.append('address', this.state.finalLocationName)
        await axios.post(path.createAddress, formData, {
            headers: {
                'Authorization': 'Bearer ' + Token,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
        }).then((resp) => {
            AsyncStorage.removeItem('location').then(() => {
                let location = {
                    latitude: this.state.region.latitude,
                    longitude: this.state.region.longitude
                }
                AsyncStorage.setItem('Location', JSON.stringify(this.state.finalLocationName))
                AsyncStorage.setItem('location', JSON.stringify(location)).then(() => {
                    console.log('New Location Set');
                })
            })
            Toast.show({
                text: resp.data.data.Message,
                type: 'success',
                position: 'top',
                style: {
                    marginTop: 40
                },
                onClose: () => {
                    this.props.navigation.replace('Home')
                }
            })
        }).catch((e) => {
            console.log('Create Address Error-->> ',e.response.data)
        })
        // alert(JSON.stringify(this.state.token))
    }
    // Action to be taken after select location button click
    // onLocationSelect = () => alert(this.state.userLocation);
    onLocationSelect = () => this.setState({ modalVisible: true })

    openPopUp() {
        this.bottomSheet.open()
    }
    currentLocation = () => {
        Geolocation.getCurrentPosition((pos) => {
            this.setState({ markerLocation: pos.coords, region : pos.coords })
        })
    }
    getLocation = async () => {
        let loc = await AsyncStorage.getItem('location')
        console.log('locatudoiasd', loc);
        let location = JSON.parse(loc)
        if (location) {
            location.longitudeDelta = LONGITUDE_DELTA
            location.latitudeDelta = LATITUDE_DELTA
            console.log('Deltaa ', location);
            await this.setState({ markerLocation: location })
        } else {
            Geolocation.getCurrentPosition((pos) => {
                this.setState({ markerLocation: pos.coords })
            })
        }
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
                {Platform.OS == "ios" ?<TouchableOpacity
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
                </TouchableOpacity>:<View></View>}
                
                <View style={{ width: "100%", height: "100%" }}>
                    {
                        (this.state.initialRegion || this.state.region) &&
                        // !!this.state.region.latitude && !!this.state.region.longitude &&
                        <MapView
                            style={{ flex: 1 }}
                            // initialRegion={this.state.region ? this.state.region : this.state.initialRegion}
                            showsUserLocation={true}
                            autoFocus={true}
                            //region = {this.state.markerLocation ? this.state.markerLocation : this.state.initialRegion}
                            region={this.state.region ? this.state.region : this.state.initialRegion}
                            onMapReady={this.onMapReady}
                            onRegionChangeComplete={this.onRegionChange}
                        >

                            {this.state.region && <MapView.Marker
                                coordinate={{ "latitude": Number(this.state.region.latitude), "longitude": Number(this.state.region.longitude) }}
                                title={"Your Location"}
                                draggable
                            />}
                        </MapView>
                    }
                    <View
                        style={{
                            paddingVertical: 5,
                            // paddingTop: 5,
                            backgroundColor: 'white',
                            borderTopRightRadius: 20,
                            borderTopLeftRadius: 20,
                            position: 'absolute',
                            bottom: 0,
                            width: Dimensions.get('window').width
                        }}>
                        <View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ flex: 0.025 }}></View>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ home: true, work: false, other: false, selectedAddressType: 'home' })
                                    }}
                                    style={{
                                        flex: 0.3,
                                        borderColor: Colors.AppColor,
                                        borderRadius: 200,
                                        backgroundColor: this.state.home ? Colors.AppColor : 'white',
                                        borderWidth: 2,
                                        justifyContent: 'center'
                                    }}>
                                    <Text style={{ textAlign: 'center', marginVertical: 5, color: this.state.home ? 'white' : Colors.AppColor, fontFamily: semiBold }}>
                                        Home
                                </Text>
                                </TouchableOpacity>
                                <View style={{ flex: 0.025 }}></View>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ home: false, work: true, other: false, selectedAddressType: 'work' })
                                    }}
                                    style={{
                                        flex: 0.3,
                                        borderColor: Colors.AppColor,
                                        borderRadius: 200,
                                        backgroundColor: this.state.work ? Colors.AppColor : 'white',
                                        borderWidth: 2,
                                        justifyContent: 'center'
                                    }}>
                                    <Text style={{ textAlign: 'center', marginVertical: 5, color: this.state.work ? 'white' : Colors.AppColor, fontFamily: semiBold }}>
                                        Work
                                </Text>
                                </TouchableOpacity>
                                <View style={{ flex: 0.025 }}></View>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ home: false, work: false, other: true, selectedAddressType: 'other' })
                                    }}
                                    style={{
                                        flex: 0.3,
                                        borderColor: Colors.AppColor,
                                        borderRadius: 200,
                                        backgroundColor: this.state.other ? Colors.AppColor : 'white',
                                        borderWidth: 2,
                                        justifyContent: 'center'
                                    }}>
                                    <Text style={{ textAlign: 'center', marginVertical: 5, color: this.state.other ? 'white' : Colors.AppColor, fontFamily: semiBold }}>
                                        Other
                                    </Text>
                                </TouchableOpacity>
                                <View style={{ flex: 0.025 }}></View>
                            </View>
                            <View style={{ margin: 15 }}>
                                <Button
                                    onPress={this.SaveAddress}
                                    title={this.state.buttonTitle}
                                    color='#FFFFFF'
                                    backgroundColor="#2196F3" />
                            </View>
                        </View>
                    </View>
                </View>
                {/* <BottomSheet
                    ref={ref => this.bottomSheet = ref}
                    height={230}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    topBarStyle={styles.topBarStyle}
                    backDropStyle={{ elevation: 5 }}
                    sheetStyle={{ borderRadius: 20 }}>
                    
                </BottomSheet> */}
                {/* <View style={{
                    position: "absolute",
                    bottom: 0,
                    width: '100%',
                    padding: 10,
                    alignSelf: "center",
                    justifyContent: 'center',
                    backgroundColor: "white",
                }}>

                    <TextInput
                        onChangeText={(finalAddressName) => this.setState({ finalAddressName })}
                        placeholder={"Enter Address Name"}
                        style={{
                            borderColor: Colors.borderColor,
                            borderWidth: 1,
                            backgroundColor: 'white',
                            marginBottom: 10,
                            padding: 15,
                            borderRadius: 10,
                            fontFamily: semiBold
                        }}
                    />

                    <Button
                        onPress={this.SaveAddress}
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
                {/* </View>  */}
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
    topBarStyle: {
        width: 50,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: "#000000"
    },
    close: {
        alignSelf: 'center'
    },
})

export default SaveAddress
