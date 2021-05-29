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
  Dimensions,
  ActivityIndicator,
  RefreshControl
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
import ReviewCard from '../Components/ReviewCard';
import Colors from '../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { path } from '../config/path';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';
const notifications = [
  {
    title: 'Michael Bruno',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua read more',
    date: 'Aug 19, 20',
    stars: 3,
  },
  {
    title: 'Michael Bruno',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua read more',
    date: 'Aug 19, 20',
    stars: 5,
  },
  {
    title: 'Vestibulum Maximus',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua read more',
    date: 'Aug 19, 20',
    stars: 4,
  },
  {
    title: 'Michael Bruno',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua read more',
    date: 'Aug 19, 20',
    stars: 5,
  },
  {
    title: 'Michael Bruno',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua read more',
    date: 'Aug 19, 20',
    stars: 2,
  },
  {
    title: 'Michael Bruno',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua read more',
    date: 'Aug 19, 20',
    stars: 5,
  },
  {
    title: 'Vestibulum Maximus',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua read more',
    date: 'Aug 19, 20',
    stars: 1,
  },
  {
    title: 'Michael Bruno',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua read more',
    date: 'Aug 19, 20',
    stars: 5,
  },
];

class Reviews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: false,
      rid: 0,
      token: '',
      ReviewsData: [],
      loader : false,
      refresh : false
    };
  }

  async componentDidMount() {
    this.setState({loader : true})
    let token = await AsyncStorage.getItem('Token')
    let TokenValue = JSON.parse(token)
    this.setState({ token: TokenValue })
    let { rid } = this.props.route.params
    let form = new FormData()
    this.setState({ rid })
    form.append('rid', rid)
   await axios.post(path.get_reviews, form, {
      headers: {
        'Authorization': 'Bearer ' + TokenValue,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then((resp) => {
      this.setState({ ReviewsData: resp.data.data.list })
      this.setState({loader : false})
    }).catch((e) => {
      this.setState({loader : false})
    })
  }

  onRefresh = ()=> {
    this.setState({loader : true, refresh : true})

    let form = new FormData()
    form.append('rid', this.state.rid)
    axios.post(path.get_reviews, form, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then((resp) => {
      this.setState({ ReviewsData: resp.data.data.list })
      this.setState({loader : false, refresh : false})
    }).catch((e) => {
      alert(JSON.stringify(e.message))
      this.setState({loader : false, refresh : false})
    })
  }
  render() {
    console.log("Loader__>>", this.state.loader)
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
            <Text style={styles.heading}>Reviews</Text>
          </View>
        </SafeAreaView>
        <Content
          style={{
            width: '100%',
            flex: 1,
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
          }} refreshControl={
            <RefreshControl
                refreshing={this.state.refresh}
                onRefresh={this.onRefresh}
            />
        }>

          <View
            style={{
              flex: 0.8,
              marginTop: 10,
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginHorizontal : 15
            }}>
               
            <FlatList
              data={this.state.ReviewsData}
              ListEmptyComponent={
                () => {
                  return <View style={{ width: Dimensions.get('window').width - 30 }}><Text style={{ textAlign: 'center', fontFamily: semiBold }}>No Reviews Found</Text></View>
                }
              }
              renderItem={({ item, index }) => {
                return (
                  <ReviewCard
                    title={item.name}
                    description={item.comments}
                    date={new Date((item.createdAt).replace(" ", "T")).toLocaleDateString('en-US')}
                    star={item.rating}
                  />
                )
              }}
            />
          </View>
          {this.state.loader ? <ActivityIndicator
              animating={true}
              style={{ marginVertical: 50 }}
              size={Platform.OS === 'android' ? 50 : 'large'}
              color={Colors.AppColor}
          /> : null}
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
  header: {
    // marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
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

export default Reviews;
