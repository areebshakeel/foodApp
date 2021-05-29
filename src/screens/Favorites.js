import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
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
} from 'native-base';
import CustomHeader from '../Components/Header';
import Restaurants from '../Components/restaurantsList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { path } from '../config/path';
import Colors from '../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

class Favorites extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: 'Daniel',
      lang: 'en',
      token: '',
      data: '',
      animate: true,
      refresh: false,
      refreshing : 1
    };
  }

  async componentDidMount() {
    // Getting Data from AsyncStorage 
    this.getPosition()
    let token = await AsyncStorage.getItem('Token')
    const TokenValue = JSON.parse(token)
    console.log('TOken in Favoritess-->> ', TokenValue)
    this.setState({ token: TokenValue })

    // Using Favorites API
    const formData = new FormData()
    formData.append('lat', this.state.region.latitude)
    formData.append("long", this.state.region.longitude)
    await axios.post(path.FAVORITES_API, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }
    }).then((resp) => {
      let response = resp.data.data
      let { list } = response
      this.setState({ data: list, animate: false })
    }).catch(() => {
      Alert.alert(
        "Login Required",
        "Kindly log in to your account to view profile details",
        [
          {
            text: "No",
            onPress: () => this.props.navigation.goBack(),
            style: "cancel"
          },
          { text: "Yes", onPress: () => this.props.navigation.navigate('Login') }
        ],
        { cancelable: false }
      )
    })  
  }

  getPosition = async () => {
    let location = await AsyncStorage.getItem('location')
    let formattedLocation = JSON.parse(location)
    if (formattedLocation) {
      this.setState({ region: formattedLocation })
    } else {
      
      Geolocation.getCurrentPosition(async(position) => {
        console.log("My Home Gotten-->> ", position);
       
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
       await AsyncStorage.setItem('location',JSON.stringify(region))
        this.setState({ region: region })
      })
    }
  }

  onRefresh = async () => {
    await this.getPosition()
    this.setState({refresh:true})
    const formData = new FormData()
    formData.append('lat', this.state.region.latitude)
    formData.append("long", this.state.region.longitude)
     axios.post(path.FAVORITES_API, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }
    }).then((resp) => {
      let response = resp.data.data
      let { list } = response
      this.setState({ data: list, animate: false })

    }).catch((e) => {
      console.log(e);
    })
    this.setState({refresh:false})

  }
  gotoFilters = () => {
    this.props.navigation.navigate('SearchFilters');
  };
  getData = async (val) => {
    await this.onRefresh()
    this.setState({ refreshing: val + 1, loadAddress : val + 1 })
  }

  render() {
    this.props.navigation.addListener('focus',()=>{
      // this.onRefresh()
      this.setState({refreshing : this.state.refreshing + 1})
    })
    return (
      <Container key = {this.state.refreshing}>
        <Content style={{ width: '100%', flex: 1, flexDirection: 'column' }}
          refreshControl={
            <RefreshControl refreshing={this.state.refresh} onRefresh={this.onRefresh} />
          }
        >
          <View style={{ marginTop: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon onPress={() => this.props.navigation.goBack()} name="arrow-back-outline" />
              <AddressBar navigation={this.props.navigation} sendData={this.getData} key={this.state.refreshing}  />
            </View>
            {/* <SearchBar gotoFilters={this.gotoFilters} /> */}
          </View>
          <View
            style={{
              flex: 0.8,
              marginTop: 2,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <CustomHeader heading={'Favorites'} />
            {this.state.animate ? <ActivityIndicator size="large" color = {Colors.AppColor} animating={this.state.animate} /> :
            <View style={{alignSelf:"flex-start", paddingLeft:15}} >
              <Restaurants key = {this.state.refreshing} data={this.state.data} numColumns={2} horizontal={false} navigator = {this.props.navigation}/>
              
              </View>}


          </View>
        </Content>
      </Container>
    );
  }
}
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
    fontSize: 15,
  },
});

export default Favorites;
