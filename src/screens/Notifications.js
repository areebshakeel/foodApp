import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Dimensions
} from 'react-native';
import RangeSlider from 'rn-range-slider';
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
  CheckBox,
} from 'native-base';
import CustomHeader from '../Components/Header';
import Restaurants from '../Components/restaurantsList';
import Filter from '../Components/Filter';
import CustomButton from '../Components/Button';
import SliderScreen from '../Components/Slider';
import NotificationCard from '../Components/NotificationCard';
import Colors from '../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { path } from '../config/path';


const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

class Notifications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: false,
      list: '',
      loader:false,
      tokenState:'',
    };
  }
  async componentDidMount() {
    let token = await AsyncStorage.getItem('Token')
    let tokenValue = JSON.parse(token)
    this.setState({loader:true, tokenState:tokenValue})
    await axios.post(path.getNotifications, {}, {
      headers: {
        'Authorization': 'Bearer '+tokenValue ,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
    
      console.log('Res in Noti -->> ', res.data.data.list)
      this.setState({ list: res.data.data.list,loader:false })
      console.log("All Noti", res.data.data.list);
    }).catch((e) => {
      this.setState({loader:false })
      console.log('Error in Noti --> ', e.response.data);
    })
  }

  render() {
    const { isChecked } = this.state;
    return (
      <Container>
        <SafeAreaView>
          <View style={styles.header}>
            <Icon
              name="arrow-back"
              onPress={() => this.props.navigation.goBack()}
              style={styles.close}
            />
            <Text style={styles.heading}>Notifications</Text>
            <ActivityIndicator
              animating={this.state.loader}
              style={{ marginTop: '50%', position: "absolute",left:150,bottom:-100, alignSelf: "center" }}
              size={Platform.OS === 'android' ? 50 : 'large'}
              color={Colors.AppColor}
            />
          </View>
        </SafeAreaView>
        <Content
          style={{
            width: '100%',
            flex: 1,
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
          }}>
          <View
            style={{
              flex: 0.8,
              marginTop: 2,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <FlatList
              data={this.state.list}
              ListEmptyComponent={({ }) => {
                return (
                  <View style={{
                    paddingVertical: 20,
                    width: Dimensions.get('screen').width,
                  }}>
                    <Text style={{ fontFamily: semiBold, fontSize: 15, textAlign: 'center' }}>You have no Notifications to show 😟</Text>
                  </View>
                )
              }}
              renderItem={({ item }) => {
                return (
                  <NotificationCard
                    title={item.title}
                    description={item.message}
                    id={item.id}
                    token={this.state.tokenState}
                    read={item.readStatus}
                    icon = {item.img}
                  />
                )
              }}
            />

            <View style={{ marginBottom: 10 }} />
          </View>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  favorite: {
    fontFamily: 'ƒ-SemiBold',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 5,
    marginBottom: 10,
    shadowColor: 'grey',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heading: {
    fontFamily: semiBold,
    fontSize: 20,
    color: Colors.AppColor,
    width: '80%',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '95%',
    alignSelf: 'center',
    marginVertical: 2,
  },
  close: {
    width: '10%',
    paddingBottom: 5,
    paddingLeft: 10,
  },
  checkText: {
    fontFamily: regular,
    fontSize: 15,
    color: '#9A9A9A',
    marginLeft: 18,
  },
  sliderView: {
    width: '95%',
    marginVertical: 20,
    height: 80,
    alignSelf: 'center',
  },
});

export default Notifications;
