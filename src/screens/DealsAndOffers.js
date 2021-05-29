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
import DealsList from '../Components/DealsList';
import { connect } from 'react-redux';
import { getDealsRequest } from '../redux/deals/dealsAction';
import { path } from '../config/path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Colors from '../config/colors';

const filters = ['food', 'high Price', '5 Stars'];

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

class Deals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: 'Daniel',
      lang: 'en',
      dealsItem: '',
      token: '',
      animate: true,
      data: '',
      refresh: false
    };
  }

  onRefresh = () => {
    console.log('ONREFRESHH-->>>>')
    this.setState({ refresh: true })
    const formData = new FormData()

    formData.append("lat", "24.831099")
    formData.append("long", "67.034730")

    axios.post(path.GET_DEALS_API, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      console.log('On refresh')
      let response = resp.data.data
      let { list } = response
      this.setState({ data:list, animate: false })
    }).catch((e) => {
      alert('Errorrr ')
      console.log('Error in deals-->>', e)

    });
    this.setState({ refresh: false })

  }


  async componentDidMount() {
    let token = await AsyncStorage.getItem('Token')
    const TokenValue = JSON.parse(token);
    this.setState({ token: TokenValue })

    const formData = new FormData()
    formData.append("lat", "24.831099")
    formData.append("long", "67.034730")

    await axios.post(path.GET_DEALS_API, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      let response = resp.data.data
      let { list } = response
      this.setState({ data: list, animate: false })
    }).catch((e) => {
      alert('Errorrr ')
    });

  }

  gotoFilters = () => {
    this.props.navigation.navigate('SearchFilters');
  };

  navigator = (restaurantsType) => {
    this.props.navigation.navigate('Nearby', { restaurants: restaurantsType });
  };
  render() {
    const heading = this.props.route.params.restaurants;
    // console.log('Statee Dataa inside Offers-->> ', this.state.list);

    return (
      <Container>
        <Content style={{ width: '100%', flex: 1, flexDirection: 'column' }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={this.onRefresh}
            />
          }>
          <View style={{ marginTop: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                onPress={() => this.props.navigation.goBack()}
                name="arrow-back-outline"
              />
              <AddressBar navigation={this.props.navigation} />
            </View>
            <SearchBar navigator={this.navigator} gotoFilters={this.gotoFilters} />
          </View>
          <View
            style={{
              flex: 0.8,
              marginTop: 2,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <CustomHeader
              heading={heading}
              filters={heading === 'Filters:' ? filters : []}
            />
            {this.state.animate ? <ActivityIndicator size="large" color={Colors.AppColor} /> :
              <DealsList data={this.state.data} numColumns={1} horizontal={false} />}


          </View>
        </Content>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateDeals: (token) => dispatch(getDealsRequest(token)),
  };
};

function mapStateToProps(state, ownProps) {
  // Getting The User Token
  const userData = state.userReducer.user || {};
  const { profile, token } = userData;
  console.log();
  const userError = state.userReducer.error;
  console.log('user Token inside Offers-->> ', userData);

  // Getting data from near By Reducer
  const dealsData = state.dealsReducer;
  const { data } = dealsData;
  // const {list}= data
  console.log('Dataa from Deals Reducer', data);
  return { userData, userError, data };
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

export default connect(mapStateToProps, mapDispatchToProps)(Deals);
