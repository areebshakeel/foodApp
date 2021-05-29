import React, { Component } from 'react';
import { View, Text, Button, Platform, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Content, Icon } from 'native-base';
import Colors from '../config/colors';
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { path } from '../config/path';
// import { strings, setLanguage, isRTL } from '../locales/i18n';
import Geolocation from '@react-native-community/geolocation';
const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

class AddressBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: 'Daniel',
      lang: 'en',
      modal: false,
      workCheck: true,
      homeCheck: false,
      location: '',
      addresses: [],
      selectedAddress: '',
      coordinates: [],
      rerender: 0,
      loader: false
    };
    // this.props.navigation.addListener = this.props.navigation.addListener.bind(this)
  }

  async componentDidMount() {
    this.setState({ loader: true })
    let location = await AsyncStorage.getItem('Location')
    let formattedLocation = JSON.parse(location)
    console.log('Location in Address Bar-->> ', formattedLocation);
    console.log('My addres Location -->> ', location);
    if (!location || location == "") {
      this.getPosition()
    }
    await this.setState({ location: formattedLocation == null ? "No Address Selected" : formattedLocation })

    let token = await AsyncStorage.getItem('Token')
    let Token = JSON.parse(token)
    this.setState({ token: Token })
    axios.post(path.getAddress, {}, {
      headers: {
        'Authorization': 'Bearer ' + Token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      this.setState({ addresses: resp.data.data.list.reverse(), loader: false })
      this.state.addresses.map((item, index) => {
        index == 0 ? this.setState({ [item.address]: true }) : this.setState({ [item.address]: false })
      })
    }).catch((e) => {
      console.log(e);
      this.setState({ loader: false })
    })
    // let loc = await AsyncStorage.getItem('Location')
    // let locs = JSON.parse(loc)
    // this.setState({locs : locs})
    this.setState({ loader: false })
  }

  getPosition = async () => {

    await Geolocation.getCurrentPosition(async (position) => {
      console.log("My Address Gotten-->> ", position);

      let region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
      fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + region.latitude + "," + region.longitude + "&key=" + "AIzaSyAqC5og7feEmdPWUfi05lcXsZnmtWf99SY")
        .then((response) => response.json())
        .then((responseJson) => {
          AsyncStorage.setItem('Location', JSON.stringify(responseJson.results[0].formatted_address))
          const userLocation = responseJson.results[0].formatted_address;
          console.log("Response in Address bar-->> ", responseJson.results[0].formatted_address)
          this.setState({ location: userLocation })
        })
      await AsyncStorage.setItem('location', JSON.stringify(region))

    })

  }

  getRefresh = async () => {
    let token = await AsyncStorage.getItem('Token')
    let Token = JSON.parse(token)
    this.setState({ token: Token })
    axios.post(path.getAddress, {}, {
      headers: {
        'Authorization': 'Bearer ' + Token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      this.setState({ addresses: resp.data.data.list })
      // this.state.addresses.map((item, index) => {
      //   index == 0 ? this.setState({ [item.address]: true }) : this.setState({ [item.address]: false })
      // })
    }).catch((e) => {
      console.log(e);
    })
  }
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  demoMethod(value) {
    this.props.sendData(value);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.input} onTouchEnd={
          () => {
            !this.props.disable ?
              this.setState({ modal: true }) : this.setState({ modal: false })
          }
        }>
          <Icon name="ios-location-outline" style={styles.icon} />
          <Text style={styles.text}>{this.state.location ? this.state.location : "No Address Selected"}</Text>
          <Icon name="caret-down" style={styles.iconDown} />
        </View>
        <View style={styles.notification}>
          <Icon
            Button
            onPress={() => this.props.navigation.navigate('Notifications')}
            name="md-notifications"
            style={{ color: '#000000', fontSize: 25 }}
          />
        </View>
        <Modal isVisible={this.state.modal} onBackdropPress={() => this.setState({ modal: false })}
          style={{
            justifyContent: 'flex-start',
            margin: 0,
            padding: 0
          }}
          animationIn={'slideInDown'}
          animationOut={'slideOutUp'}
        >
          <View style={{}}>
            <View style={{ backgroundColor: 'white', height: 50, display: Platform.OS === 'ios' ? 'flex' : 'none' }}></View>
            <View style={{ backgroundColor: 'white' }}>
              <View style={{ flexDirection: 'row', backgroundColor: 'white', margin: 10 }}>
                <View style={{ ...styles.input, width: '90%' }} onTouchEnd={() => { this.setState({ modal: true }) }}>
                  <Icon name="ios-location-outline" style={styles.icon} />
                  <Text style={styles.text}>{this.state.location}</Text>
                  <Icon name="caret-down" style={styles.iconDown} />
                </View>
                <View style={{ ...styles.notification, width: "10%" }}>
                  <Icon
                    Button
                    onPress={() => {
                      this.setState({ modal: false })
                      this.props.navigation.navigate('Notifications')
                    }}
                    name="md-notifications"
                    style={{ color: '#000000', fontSize: 25 }}
                  />
                </View>
              </View>
              <View>
                <View style={{
                  backgroundColor: Colors.grey,
                  padding: 18,
                  width: "100%",
                  borderBottomColor: 'lightgrey',
                  borderBottomWidth: 1
                }}>
                  <Text style={{
                    color: Colors.AppColor,
                    fontFamily: semiBold,
                    fontSize: 17
                  }}>
                    Deliver to:
                  </Text>
                  <Text style={{
                    fontFamily: regular,
                    fontSize: 16
                  }}>
                    {this.state.selectedAddress ? this.capitalizeFirstLetter(this.state.selectedAddress + "") : 'Please set delivery address'}
                  </Text>
                </View>
                <View style={{
                  backgroundColor: Colors.grey,
                  padding: 18,
                  width: "100%",
                  borderBottomColor: 'lightgrey',
                  borderBottomWidth: 1
                }} onTouchEnd={() => {
                  this.setState({
                    modal: false
                  })
                  this.props.navigation.navigate('Location')
                }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{
                      height: 20,
                      width: 20,
                      marginRight: 10,
                      justifyContent: 'center',
                      flex: 0.1
                    }}>
                      <Image
                        source={require('../images/target.png')}
                        style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                      />
                    </View>
                    <View style={{
                      justifyContent: 'center',
                      flex: 0.9
                    }}>
                      <Text style={{
                        fontFamily: regular,
                        fontSize: 16
                      }}>
                        Current Location
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{
                  maxHeight: 200
                }}>
                  {this.state.loader ? <ActivityIndicator
                    animating={true}
                    style={{ marginVertical: 20, alignSelf: 'center', zIndex: 99 }}
                    size={Platform.OS === 'android' ? 50 : 'large'}
                    color={Colors.AppColor}
                  /> : null}
                  <FlatList
                    ListEmptyComponent={() => {
                      return (
                        <View style={{}}>
                          <Text style={{ display: this.state.loader ? 'none' : 'flex', paddingVertical: 20, fontFamily: semiBold, textAlign: 'center' }}>No Addresses Found</Text>
                        </View>
                      )
                    }}
                    data={this.state.addresses}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={{
                          backgroundColor: Colors.grey,
                          padding: 18,
                          width: "100%",
                          borderBottomColor: 'lightgrey',
                          borderBottomWidth: 1
                        }}>
                          <View style={{ flexDirection: 'row' }}>
                            <View style={{
                              height: 20,
                              width: 20,
                              marginRight: 10,
                              justifyContent: 'center',
                              flex: 0.1
                            }}>
                              {item.title == "home" && <Image
                                source={require('../images/home2.png')}
                                style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                              />}
                              {item.title == "work" && <Image
                                source={require('../images/work.png')}
                                style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                              />}
                              {item.title == "other" && <Image
                                source={require('../images/placeholder.png')}
                                style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                              />}
                            </View>
                            <View style={{
                              justifyContent: 'center',
                              flex: 0.8
                            }}>
                              <Text style={{
                                fontFamily: regular,
                                fontSize: 16
                              }}>
                                {this.capitalizeFirstLetter(item.title)}
                              </Text>
                              <Text style={{
                                fontFamily: regular,
                                // fontSize: 16,
                                color: 'grey'
                              }}>
                                {item.address}
                              </Text>
                            </View>
                            <TouchableOpacity style={{
                              flex: 0.1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              // backgroundColor : 'red'
                            }} onPress={async () => {
                              this.setState({ loader: true })
                              this.setState({ rerender: this.state.rerender + 1, modal: false, })
                              this.demoMethod(this.state.rerender)
                              this.state.addresses.map((item, index) => {
                                this.setState({ [item.title + index]: false })
                              })
                              this.setState({ [item.title + index]: true, selectedAddress: [item.title] })
                              await this.setState({ coordinates: item.latlong.split(",") })
                              if (this.state.token) {
                                fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.coordinates[0] + "," + this.state.coordinates[1] + "&key=" + "AIzaSyAqC5og7feEmdPWUfi05lcXsZnmtWf99SY")
                                  .then((response) => response.json())
                                  .then((responseJson) => {
                                    // console.log("Response-->> ", responseJson.results[0].formatted_address)
                                    let location = {
                                      longitude: this.state.coordinates[1],
                                      latitude: this.state.coordinates[0],
                                    }
                                    AsyncStorage.setItem('location', JSON.stringify(location)).then(() => {
                                      console.log('New Location Set ', location);
                                      this.setState({ loader: false })
                                    })
                                    AsyncStorage.setItem('Location', JSON.stringify(responseJson.results[0].formatted_address))
                                    const userLocation = responseJson.results[0].formatted_address;
                                    this.setState({
                                      location: userLocation,
                                      regionChangeProgress: false,
                                      addressComponents: responseJson.results[0].address_components,
                                      addressType: responseJson.results[0].types,
                                      loader: false
                                      // modalVisible: true
                                    })
                                  }).catch(()=>{
                                    this.setState({loader : false})
                                  })
                              }

                            }}>
                              <View style={{
                                height: 20,
                                width: 20,
                                justifyContent: 'center',
                              }}>
                                {
                                  this.state[item.title + index] ? <Image
                                    source={require('../images/checked.png')}
                                    style={{ height: '100%', width: '100%', resizeMode: 'contain', display: this.state.workCheck ? 'flex' : 'none' }}
                                  /> : null
                                }
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                    }}
                  />
                </View>
                {/* <View style={{
                  backgroundColor: Colors.grey,
                  padding: 18,
                  width: "100%",
                  borderBottomColor: 'lightgrey',
                  borderBottomWidth: 1
                }} onTouchEnd={() => {
                  this.setState({
                    workCheck: false, homeCheck: true
                  })
                }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{
                      height: 20,
                      width: 20,
                      marginRight: 10,
                      justifyContent: 'center',
                      flex: 0.1
                    }}>
                      <Image
                        source={require('../images/home2.png')}
                        style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                      />
                    </View>
                    <View style={{
                      justifyContent: 'center',
                      flex: 0.8
                    }}>
                      <Text style={{
                        fontFamily: regular,
                        fontSize: 16
                      }}>
                        Home
                      </Text>
                      <Text style={{
                        fontFamily: regular,
                        // fontSize: 16,
                        color: 'grey'
                      }}>
                        Lorem emopa sda sda skd asdjk asndaj dnasjk asdj aksjnd ak das kdjn adjk asdkj asd kjas dkj adka skdja
                      </Text>
                    </View>
                    <View style={{
                      flex: 0.1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <View style={{
                        height: 20,
                        width: 20,
                        justifyContent: 'center',
                      }}>
                        <Image
                          source={require('../images/checked.png')}
                          style={{ height: '100%', width: '100%', resizeMode: 'contain', display: this.state.homeCheck ? 'flex' : 'none' }}
                        />
                      </View>
                    </View>
                  </View>
                </View> */}
                <View style={{
                  backgroundColor: Colors.grey,
                  padding: 18,
                  width: "100%",
                  borderBottomColor: 'lightgrey',
                  borderBottomWidth: 1
                }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{
                      height: 20,
                      width: 20,
                      marginRight: 10,
                      justifyContent: 'center',
                      flex: 0.1
                    }}>
                      <Image
                        source={require('../images/plus.png')}
                        style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
                      />
                    </View>
                    <View onTouchEnd={() => {
                      this.setState({ modal: false })
                      this.state.token ? this.props.navigation.navigate('SaveAddress') : this.props.navigation.navigate('Login')
                    }} style={{
                      justifyContent: 'center',
                      flex: 0.9
                    }}>
                      <Text style={{
                        fontFamily: semiBold,
                        fontSize: 16,
                        color: Colors.AppColor
                      }}>
                        Add a new Address
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    width: '95%',
    alignSelf: 'center',
    borderRadius: 5,
    margin: 5,
  },
  notification: {
    width: '10%',
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
  input: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#F2F8FF',
    borderRadius: 5,
  },
  icon: {
    fontSize: 20,
    color: Colors.AppColor,
    alignSelf: 'center',
  },
  iconDown: {
    fontSize: 10,
    color: Colors.AppColor,
    alignSelf: 'center',
  },
  text: {
    alignSelf: 'center',
    color: '#7F7E7F',
    backgroundColor: '#F2F8FF',
    textAlign: 'left',
    width: '70%',
    fontSize: 10,
    fontFamily: regular,
  },
});



export default AddressBar;
