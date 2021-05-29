import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Pressable,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking,
  ImageBackground,
  BackHandler
} from 'react-native';
import { strings, setLanguage, isRTL } from '../../locales/i18n';
import BottomBar from '../Components/bottomBar';
import AddressBar from '../Components/addressBar';
import SearchBar from '../Components/searchbar';
import Offers from '../Components/offers';
import {
  Container,
  Content,
  Switch,
  Tabs,
  Tab,
  ScrollableTab,
  Icon,
  Toast,
} from 'native-base';
import Starters from '../Components/starters';
import Restaurants from '../Components/restaurantsList';
import FavoriteSwitch from '../Components/favoritesSwitch';
import deal from '../images/deal.png';
import kfcImage from '../images/kfc.png';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import RestaurantTabs from '../Components/RestaurantTabs';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import OrderItem from './activeOrder/orderItem';
import { connect } from 'react-redux';
import { homeFeedRequest } from '../redux/homeFeed/homeFeedActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { path } from '../config/path';
import Distance from '../Components/distance';
import Duration from '../Components/duration';
import Colors from '../config/colors';
import Geolocation from '@react-native-community/geolocation';
import { Picker } from 'native-base'
import DiscountBadge from '../images/discount-badge.png'
import { NavigationEvents } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import car from '../images/car.png'
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import messaging from '@react-native-firebase/messaging'
import firebase from '@react-native-firebase/app'
const LATITUDE_DELTA = 0.0062998339347544174 //Very high zoom level
const LONGITUDE_DELTA = 0.004023313891394764





const windowHeight = Dimensions.get('window').height;

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

class Home extends Component {
  constructor(props) {
    super(props);
    if (Platform.OS == "ios") {
      firebase.initializeApp({
        clientId: "769357624073-5iou4uasp0l8gjjvjmt8fb55l5a4drju.apps.googleusercontent.com",
        appId: "1:769357624073:ios:45e79a409cf13f8c7019d8",
        apiKey: "AIzaSyDHY1Pg7fVQ5-NF6g5XJzYlW9DThliEwtM",
        databaseURL: "https://foodapp-8fea2-default-rtdb.firebaseio.com/",
        messagingSenderId: "769357624073",
        projectId: "foodapp-8fea2",
        storageBucket: "foodapp-8fea2.appspot.com"
      })
    }



    PushNotification.configure({
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },

      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        Toast.show({
          text: notification.message,
          type: "success",
          duration: 5000
        })
        // PushNotification.localNotification({
        //   title: notification.title, // (optional)
        //   message: notification.message, // (required)
        // })
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);

      },

      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },


      popInitialNotification: true,


      requestPermissions: true,
    })


    this.state = {
      username: 'Daniel',
      lang: 'en',
      token: '',
      dealsList: '',
      active: '',
      nearbyList: '',
      catList: '',
      fav: false,
      activeOrder: [],
      categories: [],
      Cat: [],
      reorder: [],
      loader: true,
      starterLoader: false,
      refresh: false,
      loading: false,
      region: {
        latitude: '0',
        longitude: '0',
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      error: null,
      loadAddress: 0,
      refreshing: 0,
      render: 1,
      selected: 0,
      // latitude:24.563,
      // longitude:26.668,
      check: 1

    };
    // this.getData = this.getData.bind(this);
    this.viewabilityConfigCallbackPairs = [{
      viewabilityConfig: {
        minimumViewTime: 500,
        itemVisiblePercentThreshold: 100
      },
      onViewableItemsChanged: this.handleItemsInViewPort
    },
    {
      viewabilityConfig: {
        minimumViewTime: 150,
        itemVisiblePercentThreshold: 10
      },
      onViewableItemsChanged: this.handleItemsPartiallyVisible
    }
    ];


  }
  onViewableItemsChanged = async ({ viewableItems, changed }) => {

    console.log("Viewable Item", viewableItems[0].index);


    await this.setState({ selected: viewableItems[0].index })
    this.flatlist.scrollToIndex({ animated: true, index: viewableItems[0].index });




    // if (viewableItems[0].index == 0) {
    //   this.setState({ selected: viewableItems[0].index })
    // }
    // else if (viewableItems[0].index == 1) {
    //   this.setState({ selected: 2 })
    // this.flatlist.scrollToIndex({ animated: true, index: 3 });

    // }
    // else if (viewableItems[0].index == 2) {
    //   this.setState({ selected: viewableItems[0].index })
    // }
    // else if (viewableItems[0].index == 3) {
    //   this.setState({ selected: viewableItems[0].index })
    // }
  };

  changeMyScrolling = async (i) => {
    // console.log(viewableItems[0].index);
    // this.flatlist.scrollToIndex({ animated: true, index: 3 });
    this.flatListRef.scrollToIndex({ animated: true, index: i });
    // this.setState({ selected: i })
  };

  getData = async (val) => {
    await this.onRefresh()
    await this.getHomeFeed()
    // await this.componentDidMount()
    this.setState({ refreshing: val + 1, loadAddress: val + 1 })
  }

  async componentDidMount() {
  
    messaging().subscribeToTopic('notification')
    messaging().onMessage((res) => {

      console.log('On Message ', res);
      Platform.OS == "ios" ?
        Toast.show({
          text: res.notification.body,
          duration: 5000,
        }) : null
    })

    PushNotification.configure({
      onRegister: function (token) {
        console.log("TOKEN:-->>", JSON.stringify(token.token));
      },

      onNotification: function (notification) {
        console.log("NOTIFICATION:-->>", notification);
        // alert(JSON.stringify(notification))
        Toast.show({
          text: notification.message,
          type: "success",
          duration: 5000,
        })
        // PushNotification.localNotification({
        //   title: notification.title, // (optional)
        //   message: notification.message, // (required)
        //   repeatTime:"hour"
        // })

        // PushNotificationIOS.removeDeliveredNotifications({
        //   alertTitle: notification.title,
        //   alertBody: notification.message
        // })
      },
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);

      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    })



    this.props.navigation.addListener('focus', async () => {
      // this.onRefresh()
      await this.setState({ check: 1 })
      await this.getHomeFeed()
    })
    await this.getPosition()
    let locs = await AsyncStorage.getItem('location')
    let los = JSON.parse(locs)
    console.log('location in Home screen -->> ', los);
    if (!los) {
      DeviceInfo.isLocationEnabled().then(async (resp) => {
        if (!resp) {
          Platform.OS == "android" ? this.androidLocationEnabler() :
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
    await this.getHomeFeed()
    BackHandler.addEventListener("hardwareBackPress", this.backAction);
  }



  androidLocationEnabler = () => {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      // interval: 10000,
      // fastInterval: 5000,
    })
      .then(async () => {
        await this.getPosition()
        await this.onRefresh()
        // The user has accepted to enable the location services
        // data can be :
        //  - "already-enabled" if the location services has been already enabled
        //  - "enabled" if user has clicked on OK button in the popup
      })
      .catch((err) => {
        // err.code 
        // The user has not accepted to enable the location services or something went wrong during the process
        // "err" : { "code" : "ERR00|ERR01|ERR02|ERR03", "message" : "message"}
        // codes :
        //  - ERR00 : The user has clicked on Cancel button in the popup
        //  - ERR01 : If the Settings change are unavailable
        //  - ERR02 : If the popup has failed to open
        //  - ERR03 : Internal error
      });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }

  getHomeFeed = async () => {
    this.setState({ loader: true })
    try {
      await this.getPosition()
      if (!this.state.region.latitude) {
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
      } else {
        let token = await AsyncStorage.getItem('Token')
        let TokenValue = JSON.parse(token);
        console.log('My Token-->> ', TokenValue)
        this.setState({ token: TokenValue })
        // await this.getPosition()
        const formData = new FormData()
        formData.append("lat", this.state.region.latitude)
        formData.append("long", this.state.region.longitude)
        await axios.post(this.state.token ? path.HOME_AUTHENTIATED_API : path.HOME_FEED_API, formData, {
          headers: {
            'Authorization': 'Bearer ' + this.state.token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        }).then(async (resp) => {
          let response = resp.data.data
          // alert(JSON.stringify(response))
          let { deals, categories, reorder, favorite, activeOrder, itemsByCat, menu } = response
          await this.setState({ dealsList: deals, catList: itemsByCat, activeOrder: activeOrder, reorder: reorder, favorite: favorite, categories: categories, Cat: menu, loader: false })
          // console.log(this.state.activeOrder);
          console.log("this.state.reorder", this.state.reorder);
          this.setState({ loader: false })

        }).catch((e) => {
          this.setState({ loader: false })
          console.log('Erro in Home-->> ', e)

          Alert.alert("Server Error", "Server Error", [
            { text: "OK", onPress: () => this.props.navigation.navigate("Login") }
          ],
            { cancelable: false })
        })
      }
    } catch (error) {
      console.log(error)
      alert('Bad Network Connection')
      this.setState({ loader: false })

    }
  }

  // fetchAddress = async () => {
  //   await axios.post("https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.region.latitude + "," + this.state.region.longitude + "&key=" + "AIzaSyAqC5og7feEmdPWUfi05lcXsZnmtWf99SY")
  //     // .then((response) => response.json())
  //     .then((responseJson) => {

  //       console.log("Addres Location-->> ", responseJson.data.results[0].formatted_address)
  //       AsyncStorage.setItem('Location', JSON.stringify(responseJson.data.results[0].formatted_address))
  //       // const userLocation = responseJson.results[0].formatted_address;
  //       // this.setState({
  //       //   userLocation: userLocation,
  //       //   regionChangeProgress: false,
  //       //   addressComponents: responseJson.results[0].address_components,
  //       //   addressType: responseJson.results[0].types,
  //       //   // modalVisible: true
  //       // })
  //     }).catch((e)=>{
  //       console.log("Error in fetch-->> ", e.message)
  //     })
  // }
  backAction = () => {
    // Alert.alert("Hold on!", "Are you sure you want to go back?", [
    //   {
    //     text: "Cancel",
    //     onPress: () => null,
    //     style: "cancel"
    //   },
    //   { text: "YES", onPress: () => this.props.navigation.navigate('Login') }
    // ]);
    return true;
  }
  activeOrder = () => {
    let Data = this.state.active;
    // console.log('Updated Array-->> ', Data);
  };
  navigator = (restaurantsType) => {
    this.props.navigation.navigate('Nearby', { restaurants: restaurantsType, location: this.state.region });
  };
  gotoFilters = () => {
    this.props.navigation.navigate('SearchFilters');
  };

  onRefresh = async () => {
    await this.getPosition()
    this.setState({ loadAddress: this.state.loadAddress + 1 })
    // this.getPosition()
    // console.log('new Loaction-->> ', this.state.region)
    let token = await AsyncStorage.getItem('Token')
    let Token = JSON.parse(token)
    this.setState({ token: Token })
    if (!this.state.region.latitude) {
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
    } else {
      try {
        this.setState({ refresh: true, loader: true })
        const formData = new FormData()

        // console.log('Pull Location-->> ', this.state.region.latitude)
        formData.append("lat", this.state.region.latitude)
        formData.append("long", this.state.region.longitude)
        await axios.post(this.state.token ? path.HOME_AUTHENTIATED_API : path.HOME_FEED_API, formData, {
          headers: {
            'Authorization': 'Bearer ' + this.state.token,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        }).then(async (resp) => {
          let response = resp.data.data
          let { deals, categories, reorder, favorite, activeOrder, itemsByCat, menu } = response
          await this.setState({ dealsList: deals, catList: itemsByCat, activeOrder: activeOrder, reorder: reorder, favorite: favorite, categories: categories, Cat: menu, loader: false })
        }).catch((e) => {
          // alert(JSON.stringify(this.state.region.latitude))
          // console.log(e.response.data)
          // Alert.alert("Server Error", "Server error", [
          //   { text: "OK", onPress: () => this.props.navigation.navigate("Login") }
          // ],
          //   { cancelable: false });
        });
        this.setState({ refresh: false, loader: false })
      } catch (error) {
        alert('Bad Network')
      }
    }
  }

  //  25.076798, 55.210413 
  // Getting Location

  getPosition = async () => {
    let location = await AsyncStorage.getItem('location')
    let formattedLocation = JSON.parse(location)
    if (formattedLocation) {
      this.setState({ region: formattedLocation })
    } else {

      Geolocation.getCurrentPosition(async (position) => {
        console.log("My Home Gotten-->> ", position);

        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        await AsyncStorage.setItem('location', JSON.stringify(region))
        this.setState({ region: region })
      })
    }
  }



  shortDesc = (str) => {
    let length_temp = 10;
    let temp_ret = str.length > length_temp ? (str.substring(0, length_temp) + "...") : (str);
    return temp_ret;
  }


  render() {


    this.props.navigation.addListener('focus', () => {
      this.setState({ loadAddress: this.state.loadAddress + 1 })

    })
    return (
      <Container key={this.state.loadAddress}>
        <Content style={{ width: '100%', flex: 1, flexDirection: 'column' }} refreshControl={
          <RefreshControl
            refreshing={this.state.refresh}
            onRefresh={this.onRefresh}
          />}>
          <AddressBar disable={false} key={this.state.loadAddress} navigation={this.props.navigation} sendData={this.getData} />
          <SearchBar
            search
            navigation={this.props.navigation}
            location={this.state.region}
            navigator={this.navigator}
            gotoFilters={this.gotoFilters}
          />
          <View style={{ marginTop: 5 }}></View>
          <View
            style={{
              flex: 0.8,
              marginTop: 2,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            {this.state.loader ? <ActivityIndicator
              animating={true}
              style={{ marginTop: '50%', position: "absolute", alignSelf: "center" }}
              size={Platform.OS === 'android' ? 50 : 'large'}
              color={Colors.AppColor}
            /> : null}
            <FlatList
              extraData={this.state.dealsList}
              showsHorizontalScrollIndicator={false}
              data={this.state.dealsList}
              horizontal={true}
              renderItem={({ item }) => {
                return (
                  <Offers
                    data={item}
                    location={this.state.region}
                    navigation={this.props.navigation}
                    navigator={(restaurantsType) =>
                      this.props.navigation.navigate('Deals', {
                        restaurants: restaurantsType,
                      })
                    }
                  />
                )
              }}
              keyExtractor={item => item.id}
            />
            <ActivityIndicator
              animating={this.state.starterLoader}
              style={{ position: 'absolute', alignSelf: "center", marginTop: '40%', zIndex: 99 }}
              size={Platform.OS === 'android' ? 50 : 'large'}
              color={Colors.AppColor}
            />
            {/* <Starters data={this.state.categories} navigation = {this.props.navigation} /> */}
            <FlatList
              showsHorizontalScrollIndicator={false}
              extraData={this.state}
              data={this.state.categories}
              horizontal={true}
              renderItem={({ item }) => {
                const onpress = (id, name) => {
                  this.props.navigation.navigate('Nearby', {
                    restaurants: `Restaurants serving '${name}'`,
                    data: true,
                    category: id
                  })
                }
                return (
                  <TouchableOpacity style={styles.item} onPress={() => onpress(item.id, item.name)}>
                    <View style={styles.starter}>
                      <View style={{ height: 45, width: 45 }}>
                        <Image source={{ uri: item.img }} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
                      </View>
                      <Text style={styles.text}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }}
              keyExtractor={(item) => item.id}
            />
            <View
              style={{
                flex: 1,
                paddingVertical: 10,
                alignItems: 'baseline',
                flexDirection: 'row',
                width: '90%',
                alignSelf: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    ...styles.favorite,
                    color: `${this.state.fav ? '#ACACAC' : Colors.AppColor}`,
                  }}>
                  Reorder
                </Text>
                <Switch
                  value={this.state.fav}
                  onValueChange={() => { this.setState({ fav: !this.state.fav }) }}
                  trackColor={{ false: '#ACACAC', true: Colors.AppColor }}
                  thumbColor={'#ffffff'}
                  style={{
                    marginHorizontal: 10,
                  }}
                />
                <Text
                  style={{
                    ...styles.favorite,
                    color: `${this.state.fav ? Colors.AppColor : '#ACACAC'}`,
                  }}>
                  Favorite
                </Text>
              </View>
              <TouchableOpacity onPress={() => this.state.fav ? this.props.navigation.navigate('Favorites') : this.props.navigation.navigate('OrderHistory')}>
                <Text
                  style={styles.showAll}>
                  Show All
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.fav ? (
              <View key={this.state.loadAddress}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={this.state.favorite}
                  extraData={this.state}
                  horizontal={true}
                  ListEmptyComponent={() => {
                    return (
                      <View style={{
                        paddingVertical: 20,
                        width: Dimensions.get('screen').width,
                      }}>
                        <Text style={{ fontFamily: semiBold, fontSize: 15, textAlign: 'center' }}>No favorites found in your list! 😟</Text>
                      </View>
                    )
                  }}
                  renderItem={({ item }) => {
                    return (
                      <Pressable onPress={() => this.props.navigation.navigate('Menu', { restaurantId: item.restaurantId, lat: this.state.region.latitude, long: this.state.region.longitude })} style={styles.itemFav}>
                        <Image style={styles.imageFav} source={{ uri: item.img }} />
                        <ImageBackground source={DiscountBadge} style={{
                          width: 70,
                          height: 40,
                          position: 'absolute',
                          left: -7,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }} >
                          <Text style={{ color: '#FFF', fontFamily: semiBold }}>50%</Text>

                        </ImageBackground>
                        <View style={styles.rowFav}>
                          <Text style={styles.titleFav}>{item.name}</Text>
                          <Text style={styles.titleFav}>AED {Math.round(item.avgPrice)}</Text>
                        </View>
                        <View style={styles.rowFav}>
                          <Text style={styles.subTitleFav}>{this.shortDesc(item.restaurant)}</Text>

                          <Image source={{ uri: '' }} style={{ height: 10, width: 28 }} />
                        </View>
                        <View style={styles.rowFav}>
                          <View style={styles.subRowFav}>
                            <Icon name="star" style={styles.starFav} />
                            <Text style={styles.titleFav}>{Math.round(item.rating)}</Text>
                          </View>
                          <View
                            style={{
                              ...styles.subRowFav,
                              width: 100,
                              justifyContent: 'space-between',
                            }}>
                            <Distance distance={item.distance ? ((Math.round(item.distance >= 1000 ? (item.distance / 1000) : item.distance)) + (item.distance >= 1000 ? 'km' : 'm')) : '0m'} />
                            <View style={{ width: 2 }} />
                            <Duration duration={Math.round(item.time) + 'm'} />
                          </View>
                        </View>
                      </Pressable>
                    )
                  }}

                  keyExtractor={(item) => item.id}
                />
              </View>
            ) : (
              <View key={this.state.loadAddress}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  extraData={this.state}
                  data={this.state.reorder}
                  horizontal={true}
                  ListEmptyComponent={() => {
                    return (
                      <View style={{
                        paddingVertical: 20,
                        width: Dimensions.get('screen').width,
                      }}>
                        <Text style={{ fontFamily: semiBold, fontSize: 15, textAlign: 'center' }}>No items to reorder! 😟</Text>
                      </View>
                    )
                  }}
                  renderItem={({ item }) => {
                    // console.log('Reorder-->> ', item)
                    return (
                      <Pressable onPress={() => this.props.navigation.navigate('Menu',
                        { restaurantId: item.restaurantId, lat: this.state.region.latitude, long: this.state.region.longitude })}
                        style={styles.itemFav}>
                        {console.log('item.img ', item.img)}
                        <Image style={styles.imageFav} source={{ uri: item.img }} />
                        <ImageBackground source={DiscountBadge} style={{
                          width: 70,
                          height: 40,
                          position: 'absolute',
                          left: -7,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }} >
                          <Text style={{ color: '#FFF', fontFamily: semiBold }}>50%</Text>
                        </ImageBackground>
                        <View style={styles.rowFav}>
                          <Text style={styles.titleFav}>{this.shortDesc(item.restaurant)}</Text>
                          <Text style={styles.titleFav}>AED {Math.round(item.avgPrice)}</Text>
                        </View>
                        <View style={styles.rowFav}>
                          <Text style={styles.subTitleFav}>{this.shortDesc(item.description)}</Text>

                          <Image source={{ uri: '' }} style={{ height: 10, width: 28 }} />
                        </View>
                        <View style={styles.rowFav}>
                          <View style={styles.subRowFav}>
                            <Icon name="star" style={styles.starFav} />
                            <Text style={styles.titleFav}>{Math.round(item.rating)}</Text>
                          </View>
                          <View
                            style={{
                              ...styles.subRowFav,
                              width: 100,
                              justifyContent: 'space-between',
                            }}>

                            <Distance distance={item.distance ? ((Math.round(item.distance >= 1000 ? (item.distance / 1000) : item.distance)) + (item.distance >= 1000 ? 'km' : 'm')) : '0m'} />
                            <View style={{ width: 2 }} />
                            <Duration duration={Math.round(item.time) + 'm'} />
                          </View>
                        </View>
                      </Pressable>
                    )
                  }}
                  keyExtractor={(item) => item.id}
                />
              </View>
            )}
            <View style={styles.banner}>
              <Image style={styles.image} source={deal} />
              <Text
                style={{
                  ...styles.nearBy,
                  top: 30,
                  left: 10,
                  fontFamily: regular,
                }}>
                Nearby
              </Text>
              <Text
                style={{
                  ...styles.nearBy,
                  top: 55,
                  left: 10,
                  fontFamily: semiBold,
                }}>
                Restaurants
              </Text>
              <TouchableOpacity
                onPress={() => this.navigator('Restaurants')}
                style={{
                  ...styles.nearBy,
                  top: 90,
                  left: 10,
                  backgroundColor: '#DC471A',
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontFamily: regular,
                    fontSize: 15,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                  }}>
                  View More
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginLeft: 15 }}>
              <Text style={{ fontSize: 17, color: Colors.AppColor, fontFamily: semiBold }}>What's on your mind? </Text>
            </View>
            {/* {
              Platform.OS === "android" ?

                <ScrollView style={{}}>
                  <RestaurantTabs location={this.state.region} data={this.state.Cat} navigator={this.navigatior} navigation={this.props.navigation} />
                </ScrollView>

                :
                <>
                  <RestaurantTabs location={this.state.region} data={this.state.Cat} navigator={this.navigatior} navigation={this.props.navigation} />
                </>
            } */}
            <View style={{}}>
              <View style={{ height: this.state.activeOrder.length > 1 ? Dimensions.get('screen').height - 190 : Dimensions.get('screen').height - 150, flex: 1 }}>
                <View style={{ height: 50, width: '100%' }}>
                  <FlatList
                    ref={flatlist => this.flatlist = flatlist}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={this.state.Cat}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity onPress={async () => {
                          // this.changeMyScrolling(index)
                          // return
                          // await this.setState({ selected: index })
                          // alert(`${this.state.selected}, ${index}`)
                          this.flatListRef.scrollToIndex({ animated: true, index: index, viewOffset: -20 });
                          // setTimeout(() => {
                          // this.flatlist.scrollToIndex({ animated: true, index: index });
                          // }, 1000)


                          // this.flatListRef.scrollToOffset({animated: true, offset: 200})

                          console.log("scroll index1", this.state.selected)
                          console.log("scroll index2", index)
                        }} style={{ paddingHorizontal: 30, paddingVertical: 15, borderBottomWidth: 5, borderBottomColor: this.state.selected == index ? Colors.AppColor : 'transparent', height: 50 }}>
                          <Text style={{ fontFamily: semiBold, color: this.state.selected == index ? 'black' : 'grey' }}>{item.name}</Text>
                        </TouchableOpacity>
                      )
                    }}
                  />
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <FlatList
                    data={this.state.Cat}
                    nestedScrollEnabled={true}
                    // onScrollAnimationEnd={this.onViewableItemsChanged}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    // onMomentumScrollBegin = {()=>{
                    //   this.setState({selected : this.state.selectedNum})
                    //   // this.flatlist.scrollToIndex({ animated: true, index: this.state.selectedNum });
                    // }}
                    // onScrollBeginDrag ={()=>{
                    //   this.setState({selected : this.state.selectedNum})
                    //   // this.flatlist.scrollToIndex({ animated: true, index: this.state.selectedNum });
                    // }}
                    // onMomentumScrollEnd = {()=>{
                    //   this.setState({selected : this.state.selectedNum})
                    //   // this.flatlist.scrollToIndex({ animated: true, index: this.state.selectedNum });
                    // }}
                    ref={(ref) => { this.flatListRef = ref; }}
                    renderItem={({ item }) => {
                      return (
                        <>
                          <View >
                            <Text style={{
                              marginTop: 30,
                              marginBottom: 10,
                              fontSize: 21,
                              fontFamily: semiBold
                            }}>{item.name}</Text>
                            <FlatList
                              data={item.data}
                              numColumns={2}
                              alwaysBounceVertical={false}
                              renderItem={({ item }) => {
                                return (
                                  <Pressable onPress={() => {
                                    this.props.navigation.push('Menu', { restaurantId: item.restaurantId, })
                                  }} style={styles.item2}>
                                    <Image style={styles.image2} source={{ uri: item.img }} />
                                    <ImageBackground source={DiscountBadge} style={{
                                      width: 70,
                                      height: 40,
                                      position: 'absolute',
                                      left: -7,
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }} >
                                      <Text style={{ color: '#FFF', fontFamily: semiBold }}>50%</Text>
                                    </ImageBackground>
                                    <View style={styles.row}>
                                      <View style={{ flex: 0.7 }}>
                                        <Text style={{
                                          color: '#464951',
                                          fontFamily: semiBold,
                                          fontSize: 12,
                                        }}>{shortDesc(item.name)}</Text>
                                      </View>
                                      <View style={{ flex: 0.4 }}>
                                        <Text style={{
                                          color: '#464951',
                                          fontFamily: semiBold,
                                          fontSize: 12,
                                        }}>AED{" " + (item.avgPrice ? item.avgPrice : "0")}</Text>
                                      </View>
                                    </View>
                                    <View style={styles.row}>
                                      <Text style={{
                                        color: '#979797',
                                        fontFamily: regular,
                                        fontSize: 8,
                                      }}>{shortDesc(item.restaurant)}</Text>
                                      {item.isCurbPickup == "on" ? <Image source={car} style={{ height: 10, width: 28 }} /> : null}
                                    </View>
                                    <View style={styles.row}>
                                      <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        width: 30,
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#F3F4F4',
                                        paddingBottom: 5,
                                        marginTop: 4,
                                      }}>
                                        <Icon name="star" style={{
                                          color: Colors.AppColor,
                                          fontSize: 15,
                                          alignSelf: 'center',
                                          paddingBottom: 5,
                                        }} />
                                        <Text style={{
                                          color: '#464951',
                                          fontFamily: semiBold,
                                          fontSize: 12,
                                        }}>{Math.round(item.rating)}</Text>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'flex-start',
                                          width: 30,
                                          alignSelf: 'center',
                                          alignItems: 'center',
                                          backgroundColor: '#F3F4F4',
                                          paddingBottom: 5,
                                          marginTop: 4,
                                          width: 100,
                                          justifyContent: 'space-between',
                                        }}>
                                        <Distance distance={item.distance ? ((Math.round(item.distance >= 1000 ? (item.distance / 1000) : item.distance)) + (item.distance >= 1000 ? 'km' : 'm')) : '0m'} />
                                        <View style={{ width: 2 }} />
                                        <Duration duration={Math.round(item.time) + "m"} />
                                      </View>
                                    </View>
                                  </Pressable>
                                )
                              }}
                            />
                          </View>
                        </>
                      )
                    }}
                  />

                </View>
              </View>
            </View>

          </View>
          <View style={{ paddingBottom: this.state.activeOrder.length > 0 ? 60 : 0 }} />
        </Content>
        {/* <RestaurantTabs location={this.state.region} data={this.state.Cat} navigator={this.navigatior} navigation={this.props.navigation} /> */}
        {
          this.state.token && this.state.activeOrder.length > 0 ?
            <TouchableOpacity activeOpacity={0.90} style={styles.bottomBanner} onPress={() => this.props.navigation.navigate('ActiveOrders')}>
              <View
                style={{
                  backgroundColor: '#ffffffe6',
                  paddingVertical: 12,
                  borderTopWidth: 0.5,
                  borderTopColor: 'lightgrey'
                }}>
                <Text style={styles.bottomText}>Active Order</Text>
              </View>

              {/* {this.state.activeOrder.map((item) => { */}
              {/* console.log(item);
              return ( */}
              <View
                style={{
                  backgroundColor: 'white',
                  borderTopColor: 'lightgrey',
                  borderTopWidth: 1,
                }}>
                <View
                  activeOpacity={1}
                  style={{
                    padding: 5,
                    backgroundColor: '#F9F9F9',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      height: 50,
                      width: 50,
                      overflow: 'hidden',
                      marginRight: 5
                    }}>
                      <Image source={{ uri: this.state.activeOrder[0].img }} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}>
                      <View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text
                            style={{
                              color: '#464951',
                              fontSize: 14,
                              fontFamily: semiBold,
                            }}>
                            {' '}
                            {this.state.activeOrder[0].restaurant}{' '}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <EntypoIcon color="#464951" name="location-pin" />
                          <Text
                            style={{
                              color: '#464951',
                              fontSize: 10,
                              fontFamily: regular,
                            }}>
                            {this.shortDesc(this.state.activeOrder[0].address)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: '#464951',
                        fontSize: 14,
                        fontFamily: semiBold,
                      }}>
                      {Math.round(this.state.activeOrder[0].TimeRemaining) + "m"}
                    </Text>
                  </View>
                </View>
              </View>
              {/* )
            })} */}
            </TouchableOpacity> : <Text></Text>
        }
      </Container >
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateHome: (token) => dispatch(homeFeedRequest(token)),
  };
};

function mapStateToProps(state, ownProps) {
  // Getting dataa from User Reducer
  const userData = state.userReducer.user || {};
  const { profile, token } = userData;
  // console.log('user Token inside Home from Reducer-->> ', userData);
  const userError = state.userReducer.error;

  // Getting Data from HomeFeed Reducer
  const dataHome = state.homeFeedReducer.homeData || {};
  const { deals, itemsByCat, activeOrder } = dataHome;


  // Getting data from Nearby
  const nearbyData = state.getNearByResturantsReducer;
  const { data } = nearbyData;
  // const {list}= data

  return { userData, userError, deals, activeOrder, data, itemsByCat };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({

  favorite: {
    fontFamily: semiBold,
    fontSize: 15,
  },
  banner: {
    marginVertical: 5,
    marginBottom: 15,
    width: '95%',
    alignSelf: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 153,
    borderRadius: 10,
  },
  nearBy: {
    position: 'absolute',
    color: '#ffffff',
    fontSize: 23,
  },
  bottomBanner: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  showAll: {
    color: '#000',
    fontFamily: semiBold,
    fontSize: 15,
    // width: '95%',
    // alignSelf: 'center',
  },
  bottomText: {
    color: Colors.AppColor,
    fontFamily: semiBold,
    fontSize: 15,
    width: '95%',
    alignSelf: 'center',
  },
  containerFav: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    width: '95%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  itemFav: {
    backgroundColor: '#FFFFF',
    // padding: 20,
    // width:"40%",
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#F3F4F4',
    borderRadius: 10,
    // borderBottomRightRadius: 10,
  },
  imageFav: {
    width: Dimensions.get('window').width / 2.2,
    height: 113,
    borderRadius: 10,
  },
  rowFav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 155,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F4',
    marginTop: 4,
  },
  subRowFav: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 30,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F4',
    paddingBottom: 5,
    marginTop: 4,
  },
  titleFav: {
    color: '#464951',
    fontFamily: semiBold,
    fontSize: 12,
    alignSelf: 'center',
  },
  subTitleFav: {
    color: '#979797',
    fontFamily: regular,
    fontSize: 8,
  },
  carFav: {
    transform: [{ rotateY: '180deg' }],
    fontSize: 25,
    alignSelf: 'center',
    textAlign: 'left',
    width: 25,
    alignItems: 'center',
    color: '#464951',
  },
  starFav: {
    color: Colors.AppColor,
    fontSize: 15,
    alignSelf: 'center',
    paddingBottom: 5,
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  item2: {
    backgroundColor: '#FFFFF',
    // padding: 20,
    // width:"40%",
    marginVertical: 5,
    marginHorizontal: 2.5,
    backgroundColor: '#F3F4F4',
    borderRadius: 10,
    // borderBottomRightRadius: 10,
  },
  starter: {
    width: 93,
    height: 103,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.AppColor,
  },
  salad: {
    width: 60,
    height: 40,
  },
  image2: {
    width: 45,
    height: 51,
  },
  text: {
    marginTop: 10,
    color: '#232E4E',
    fontFamily: semiBold,
    fontSize: 13,
  },
  image2: {
    width: Dimensions.get('window').width / 2.2,
    height: 113,
    borderRadius: 10,
  },
  row: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 155,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F4',
    marginTop: 4,
  }
});

function shortDesc(str) {
  let length_temp = 15;
  let temp_ret = str.length > length_temp ? (str.substring(0, length_temp) + "...") : (str);
  return temp_ret;
}
