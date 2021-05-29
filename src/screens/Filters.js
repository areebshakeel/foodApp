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
  StatusBar,
  RefreshControl
} from 'react-native';
import { strings, setLanguage, isRTL } from '../../locales/i18n';
import BottomBar from '../Components/bottomBar';
import AddressBar from '../Components/addressBar';
import SearchBar from '../Components/searchbar';
import Offers from '../Components/offers';
import {
  Container,
  Content,
  Icon,
} from 'native-base';
import CustomHeader from '../Components/Header';
import Restaurants from '../Components/restaurantsList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../config/colors';
import axios from 'axios';
import { path } from '../config/path';
import Geolocation from "@react-native-community/geolocation";

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold = Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Daniel',
      lang: 'en',
      filters: [],
      data: [],
      location: {
        latitude: '24.106',
        longitude: '65.326'
      },
      categoryIds: [],
      foodGroupIds: [],
      ratingIds: [],
      price: [],
      selectedCategory: [],
      selectedFoodGroup: [],
      FoodGroups: [],
      rating: [],
      PriceRange: [],
      finalPriceRange: [],
      token: '',
      curbside: '',
      Location: [],
      loader: false,
      refresh: false,
      distance: 0,
      refreshing: 1,
      text: '',
      fromHome: false,
      fromSearchFilter: false,
      filterPlaceholder: null
    };
  }
  async componentDidMount() {
    try {
      const { fromHome, fromSearchFilter, distance, filterPlaceholder } = this.props.route.params
      this.setState({ fromHome, fromSearchFilter, distance, filterPlaceholder })
    } catch (e) { }
    console.log('Filtered Text -->> ', this.state.text);
    this.setState({ text: this.props.route.params.text })
    const { filters, data, categoryIds, foodGroupIds, ratingIds, price, selectedCategory, FoodGroups, rating, PriceRange, token, curbside } = this.props.route.params
    this.setState({ filters: filters, data: data, categoryIds, foodGroupIds, ratingIds, price, selectedCategory, FoodGroups, rating, PriceRange, token, curbside })
    try {
      let { distance } = this.props.route.params
      if (distance) {
        this.setState({ distance })
      }
    } catch (e) {

    }
    let location = await AsyncStorage.getItem('location')
    const Location = JSON.parse(location)
    if (Location) {
      this.setState({ Location })
    } else {
      Geolocation.getCurrentPosition((pos) => {
        this.setState({ Location: pos.coords })
      })
    }
    let newToken = await AsyncStorage.getItem('Token')
    let tokenValue = JSON.parse(newToken)
    this.setState({ token: tokenValue })
    this.searchFilter(this.props.route.params.text)
  }

  // On Refresh Function inside filters
  onRefresh = async () => {

    // const { filters, data, categoryIds, foodGroupIds, ratingIds, price, selectedCategory, FoodGroups, rating, PriceRange, token, curbside } = this.props.route.params
    // this.setState({ filters: filters, data: data, categoryIds, foodGroupIds, ratingIds, price, selectedCategory, FoodGroups, rating, PriceRange, token, curbside })

    let location = await AsyncStorage.getItem('location')
    const Location = JSON.parse(location)
    if (Location) {
      await this.setState({ Location })
      await this.HitFilters()
    } else {
      Geolocation.getCurrentPosition((pos) => {
        this.setState({ Location: pos.coords })
      })
      await this.HitFilters()
    }
  }

  // updateLocation = async () =>{
  //   await this.setState({Location : location})
  // }

  navigator = (restaurantsType) => {
    this.props.navigation.navigate('Nearby', { restaurants: restaurantsType, location: this.state.region });
  };
  gotoFilters = () => {
    this.props.navigation.navigate('SearchFilters');
  };

  searchElement(nameKey, myArray, attribute) {
    if (attribute === 'type') {
      for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].type === nameKey) {
          return true;
        }
      }
    } else if (attribute === 'name') {
      for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
          return true;
        }
      }
    } else {
      for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
          return true;
        }
      }
    }
  }
  RemoveFilter = async (name) => {
    let NewCategories = []
    let NewFoodGroups = []
    let NewRating = []
    let NewPriceRange = []

    let Categories = this.state.categoryIds
    let FoodGroups = this.state.FoodGroups
    let Rating = this.state.rating
    let PriceRange = this.state.price

    this.state.selectedCategory.map((item) => { // Catergories
      NewCategories.push(Categories.find(x => x.id == item))
    })

    this.state.foodGroupIds.map((item) => { // Food Groups
      NewFoodGroups.push(FoodGroups.find(x => x.id == item))
    })

    this.state.ratingIds.map((item) => { // Ratings
      NewRating.push(Rating.find(x => x.id == item))
    })

    this.state.price.map((item) => { // Price
      NewPriceRange.push(this.state.PriceRange.find(x => x.id == item))
    })

    if (this.searchElement(name, NewCategories, 'name')) {
      let id = (Categories.find(x => x.name == name).id)
      await this.setState({ selectedCategory: this.state.selectedCategory.filter(item => item !== id) })
    } else if (this.searchElement(name, NewFoodGroups, 'name')) {
      let id = FoodGroups.find(x => x.name == name).id
      await this.setState({ foodGroupIds: this.state.foodGroupIds.filter(item => item !== id) })
    } else if (this.searchElement(name, NewRating, 'type')) {
      let id = Rating.find(x => x.type == name).id
      await this.setState({ ratingIds: this.state.ratingIds.filter(item => item !== id) })
    } else if (this.searchElement(name, NewPriceRange, 'type')) {
      let id = this.state.PriceRange.find(x => x.type == name).id
      await this.setState({ PriceRange: this.state.PriceRange.filter(item => item !== id) })
    } else if (name == "Curbside") {
      await this.setState({ curbside: !this.state.curbside })
    }
    this.HitFilters(name)
  }
  HitFilters = async (name) => {
    this.setState({ filters: this.state.filters.filter(item => item !== name), loader: true })
    const formData = new FormData()
    this.state.curbside ? formData.append("curbPickup", this.state.curbside) : null
    // formData.append("curbPickup", this.state.curbside ? this.state.curbside : -1)
    formData.append("category", this.state.selectedCategory.length == 0 ? 0 : this.state.selectedCategory + '')
    formData.append("foodGroup", this.state.foodGroupIds.length == 0 ? 0 : this.state.foodGroupIds + '')
    formData.append("rating", this.state.ratingIds.length == 0 ? 0 : this.state.ratingIds + '')
    formData.append("priceSt", "0")
    formData.append("priceEnd", "0")
    formData.append("discount", "0")
    formData.append("lat", this.state.Location.latitude ? this.state.Location.latitude : 0)
    formData.append("long", this.state.Location.longitude ? this.state.Location.longitude : 0)
    formData.append("distanceSt", "0")
    formData.append("distanceEnd", this.state.distance)

    await axios.post(path.GET_FILTER_RESTAURANT, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then(async (resp) => {
      await this.setState({
        data: resp.data.data.list,
        loader: false
      })
    }).catch((e) => {
      console.log(e);
      this.setState({ loader: false })
    })
    this.setState({ loader: false })
  }
  
  getData = async (val) => {
    await this.setPosition().then(async () => {
      await this.HitFilters().then(async () => {
        await this.onRefresh().then(() => {
          this.onRefresh().then(() => {
            this.setState({ refreshing: this.state.refreshing + 1 })
          })
        })
      })
    })
  }

  setPosition = async () => {
    let location = await AsyncStorage.getItem('location')
    const Location = JSON.parse(location)
    if (Location) {
      await this.setState({ Location })
    } else {
      Geolocation.getCurrentPosition(async (pos) => {
        await this.setState({ Location: pos.coords })
      })

    }
  }

  searchFilter = async (val) => {
    // if (this.state.filters !== "") {
    //   let v = this.state.filters.push(val)
    //   this.setState({ filters: v })
    // }

    this.setState({ loader: true })
    let formData = new FormData()
    this.state.curbside ? formData.append("curbPickup", this.state.curbside) : null
    formData.append("category", this.state.selectedCategory ? this.state.selectedCategory.length == 0 ? 0 : this.state.selectedCategory + '' : 0)
    formData.append("foodGroup", this.state.foodGroupIds ? this.state.foodGroupIds.length == 0 ? 0 : this.state.foodGroupIds + '' : 0)
    formData.append("rating", this.state.ratingIds ? this.state.ratingIds.length == 0 ? 0 : this.state.ratingIds + '' : 0)
    formData.append("priceSt", "0")
    formData.append("priceEnd", "0")
    formData.append("discount", "10")
    formData.append("lat", this.state.Location.latitude ? this.state.Location.latitude : 0)
    formData.append("long", this.state.Location.longitude ? this.state.Location.longitude : 0)
    formData.append("distanceSt", "0")
    formData.append("distanceEnd", this.state.distance)
    formData.append('text', val ? val : "")
    // if (this.props.route.params.text) {
    console.log('Filter Filled=>')
    await axios.post(path.GET_FILTER_RESTAURANT, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then(async (response) => {
      this.setState({ loader: false })
      console.log('Response in search bar', response.data.data.list)
      await this.setState({
        data: response.data.data.list,
        loader: false
      })

      // this.props.navigation.replace('Filters', {
      //   filters: [this.state.filterText],
      //   data: response.data.data.list,
      //   categoryIds: 0,
      //   selectedCategory: 0,
      //   foodGroupIds: 0,
      //   FoodGroups: 0,
      //   ratingIds: 0,
      //   rating: 0,
      //   price: 0,
      //   PriceRange: 0,
      //   token: this.state.token,
      //   curbside: -1,
      //   distance: "9999999999999999"
      // })
    }).catch((e) => {
      this.setState({ loader: false })
      console.log('Error Search Text Filter', e);
    })
    this.setState({ loader: false })
    // }
    //  else {
    //   this.setState({ loader: false })
    // }

  }
  render() {
    console.log('Filtered Token -->> ', this.state.token)
    return (
      <Container key={this.state}>
        <Content style={{ width: '100%', flex: 1, flexDirection: 'column' }} refreshControl={
          <RefreshControl
            refreshing={this.state.refresh}
            onRefresh={this.onRefresh}
          />}>
          <ActivityIndicator
            animating={this.state.loader}
            style={{ position: 'absolute', alignSelf: 'center', marginTop: '60%', zIndex: 99 }}
            size={Platform.OS === 'android' ? 50 : 'large'}
            color={Colors.AppColor}
          />
          <View style={{ marginTop: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="arrow-back-outline" onPress={() => this.state.fromHome ? this.props.navigation.replace('Home') : this.props.navigation.replace('SearchFilters')} />
              <AddressBar key={this.state} navigation={this.props.navigation} sendData={this.getData} />
            </View>
            <SearchBar
              placeholder={this.state.filterPlaceholder ? this.state.filterPlaceholder : 'Search for dishes or Restaurants'}
              searchFunction={(val) => { this.setState({ searchText: val }) }}
              searchButtonOnpress={() => {
                this.searchFilter(this.state.searchText)
                // let v = this.state.filters.push(this.state.searchText)
                this.setState({ searchText: "" })
              }}
              navigator={this.navigator} gotoFilters={this.gotoFilters} />
          </View>
          <View
            style={{
              flex: 0.8,
              marginTop: 2,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            {/* <CustomHeader heading={'Filter:'} filters={this.state.filters} categoryIds = {this.state.categoryIds} foodGroupIds = {this.state.foodGroupIds} ratingIds = {this.state.ratingIds} price = {this.state.price} /> */}
            <View style={styles.container}>
              <Text style={styles.heading}>{'Filter:'}</Text>
              <View style={styles.wraper}>
                {this.state.filters &&
                  this.state.filters.map((filter) => {
                    console.log(this.state.filters);
                    return (
                      <TouchableOpacity onPress={() => this.RemoveFilter(filter)} style={styles.filter}>
                        <Text style={styles.text}>{filter}</Text>
                        <Icon style={styles.icon} name="close-outline" />
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
            </View>
            <View style={{ alignSelf: 'flex-start', paddingHorizontal: 10, justifyContent: 'center' }} >
              {this.state.loader ? null :
                <Restaurants key={this.state} navigator={this.props.navigation} data={this.state.data} numColumns={2} horizontal={false} />
              }

            </View>
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
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    margin: 5,
    borderBottomWidth: 2,
    borderBottomColor: Colors.AppColor,
  },
  heading: {
    marginVertical: 10,
    fontSize: 16,
    fontFamily: semiBold,
    color: Colors.AppColor,
    alignSelf: 'flex-start',
  },
  filter: {
    backgroundColor: Colors.AppColor,
    margin: 1.5,
    paddingHorizontal: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#ffffff',
    fontFamily: semiBold,
    fontSize: 12,
  },
  icon: {
    color: '#ffffff',
    fontSize: 20,
  },
  wraper: {
    flexDirection: 'row',
    width: '85%',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
});

export default Filters;
