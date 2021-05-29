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
  Item,

} from 'native-base';
import CustomHeader from '../Components/Header';
import Restaurants from '../Components/restaurantsList';
import Filter from '../Components/Filter';
import CustomButton from '../Components/Button';
import SliderScreen from '../Components/Slider';
import axios from 'axios';
import { path } from '../config/path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../config/colors';
import Slider from 'rn-range-slider'
import Thumb from '../Components/Thumb'
import Rail from '../Components/Rail'
import RailSelected from '../Components/RailSelected'
import Notch from '../Components/Notch'
import Label from '../Components/Label'
// import Slider from '@react-native-community/slider';
import Geolocation from '@react-native-community/geolocation';


const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

// star filled u2605
let rating = [
  { id: 1, type: '1 \u2606', isSelected: false },
  { id: 2, type: '2 \u2606', isSelected: false },
  { id: 3, type: '3 \u2606', isSelected: false },
  { id: 4, type: '4 \u2606', isSelected: false },
  { id: 5, type: '5 \u2606', isSelected: false },
];

const priceRange = [
  { id: 1, type: '$', isSelected: false },
  { id: 2, type: '$$', isSelected: false },
  { id: 3, type: '$$$', isSelected: false },
  { id: 4, type: '$$$$', isSelected: false },
];
const nearBySlider = {
  value: 0
}
const discountSlider = {
  low: 0,
  high: 0
}
let CategoriesAPI = [], FoodGroupsAPI = []

class SearchFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      token: '',
      categories: [],
      selectedCategory: '',
      foodGroup: [],
      selectedFoodGroup: '',
      selectedRating: 5,
      selectedPriceRange: [],
      nearBySliderLow: 10,
      nearBySliderHigh: 10,
      nearBySlider: '',
      loaderCategories: true,
      loaderFoodGroups: true,
      refresh: false,
      discount: 0,
      foods: [],
      categoriesSelected: [],
      foodGroupSelected: [],
      rating: [],
      priceRange: [],
      Location: [],
      nearbyValue: 0,
      discountMinValue: 0,
      discountMaxValue: 0,
      buttonLoader : false
    };
  }

  async componentDidMount() {

    let token = await AsyncStorage.getItem('Token')
    const TokenValue = JSON.parse(token);

    this.getPosition()

    this.setState({ token: TokenValue })
    const formData = {}
    CategoriesAPI = []
    FoodGroupsAPI = []

    await axios.post(path.GET_FILTER_CATEGORIES_API, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      let data = resp.data.data.list
      data.map((item) => {
        CategoriesAPI.push(item)
      })
      this.setState({ categories: data, loaderCategories: false })
    }).catch((e) => {
      console.log(e);
    });
    CategoriesAPI.map((item, index) => {
      // index == 0 ? this.setState({ [item.name]: true, selectedCategory: item.id }) : this.setState({ [item.name]: false })
      this.setState({ [item.name]: false })
    })

    await axios.post(path.GET_FILTER_FOOD_GROUPS_API, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      let data = resp.data.data.list
      data.map((item) => {
        FoodGroupsAPI.push(item)
      })
      this.setState({ foodGroup: data, loaderFoodGroups: false })
    }).catch((e) => {
      console.log(e);
    });
    FoodGroupsAPI.map((item, index) => {
      // index == 0 ? this.setState({ [item.name]: true, selectedFoodGroup: item.id }) : this.setState({ [item.name]: false })
      this.setState({ [item.name]: false })
    })
  }
  getPosition = async () => {
    let location = await AsyncStorage.getItem('location')
    let formattedLocation = JSON.parse(location)
    if (formattedLocation) {
      this.setState({ Location: formattedLocation })
    } else {

      Geolocation.getCurrentPosition(async (position) => {
        console.log("My Home Gotten-->> ", position);

        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        await AsyncStorage.setItem('location', JSON.stringify(region))
        this.setState({ Location: region })
      })
    }
  }
  HitFilters = async () => {
    console.log('Location inside filters-->> ',this.state.Location);
    this.setState({buttonLoader : true})
    const formData = new FormData()
    formData.append("curbPickup", this.state.isChecked ? 1 : 0)
    formData.append("category", this.state.categoriesSelected.length == 0 ? 0 : this.state.categoriesSelected + '')
    formData.append("foodGroup", this.state.foodGroupSelected.length == 0 ? 0 : this.state.foodGroupSelected + '')
    formData.append("rating", this.state.rating.length == 0 ? 0 : this.state.rating + '')
    formData.append("priceSt", "0")
    formData.append("priceEnd", "0")
    formData.append("discount", "0")
    formData.append("lat", this.state.Location.latitude ? this.state.Location.latitude  : 0)
    formData.append("long", this.state.Location.longitude ? this.state.Location.longitude : 0)
    formData.append("distanceSt", "0")
    formData.append("distanceEnd", nearBySlider.value*1000)

    await axios.post(path.GET_FILTER_RESTAURANT, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      console.log('Response in filters-->> ', resp);
      this.setState({buttonLoader : false})
      let CategoryName = this.state.categoriesSelected.map((item) => {
        return CategoriesAPI.find(x => x.id == item).name
      })
      let FoodName = this.state.foodGroupSelected.map((item) => {
        return `${FoodGroupsAPI.find(x => x.id == item).name}`
      })
      let PriceRange = this.state.priceRange.map((item) => {
        return priceRange.find(x => x.id == item).type
      })
      let Rating = this.state.rating.map((item) => {
        return rating.find(x => x.id == item).type
      })
      let obj = []
      this.state.isChecked ?
        obj = ["Curbside", ...CategoryName, ...FoodName, ...Rating, ...PriceRange] :
        obj = [...CategoryName, ...FoodName, ...Rating, ...PriceRange]
      let response = resp.data.data.list
      this.props.navigation.push('Filters', {
        filters: obj,
        data: response,
        categoryIds: CategoriesAPI,
        selectedCategory: this.state.categoriesSelected,
        foodGroupIds: this.state.foodGroupSelected,
        FoodGroups: FoodGroupsAPI,
        ratingIds: this.state.rating,
        rating: rating,
        price: this.state.priceRange,
        PriceRange: priceRange,
        token: this.state.token,
        curbside: this.state.isChecked ? 1 : 0,
        distance : nearBySlider.value*1000,
        fromSearchFilter : true
      })
    }).catch((e) => {
      this.setState({buttonLoader : false})
      console.log('error in Filterss-->> ', e)
    });
  }

  SelectCategory = (item) => {
    let id = item.id
    if (this.state.categoriesSelected.find(x => x == id)) {
      this.state.categoriesSelected = this.state.categoriesSelected.filter(item => item !== id)
    } else {
      this.state.categoriesSelected.push(id)
    }
    let foundItem = CategoriesAPI.find(x => x.id == id)
    CategoriesAPI.map((item) => {
      item.id == foundItem.id ? this.setState({ [item.name]: !this.state[item.name], selectedCategory: item.id }) : null
    })
  }

  SelectFoodGroups = (item) => {
    let id = item.id
    if (this.state.foodGroupSelected.find(x => x == id)) {
      this.state.foodGroupSelected = this.state.foodGroupSelected.filter(item => item !== id)
    } else {
      this.state.foodGroupSelected.push(id)
    }
    let foundItem = FoodGroupsAPI.find(x => x.id == id)
    FoodGroupsAPI.map((item) => {
      item.id == foundItem.id ? this.setState({ [item.name]: !this.state[item.name], selectedFoodGroup: item.id }) : null
    })
  }

  SelectRating = (rate) => {
    let id = rate.id
    if (this.state.rating.find(x => x == id)) {
      this.state.rating = this.state.rating.filter(item => item !== id)
      this.setState({ selectedRating: this.state.rating })
    } else {
      this.state.rating.push(id)
      this.setState({ selectedRating: this.state.rating })
    }
    return rating.map((item) => {
      if (item.id == rate.id) {
        item.isSelected = !item.isSelected
        item.isSelected ? item.type = `${item.id} \u2605` : item.type = `${item.id} \u2606`
      }
    })
  }

  SelectPriceRange = (range) => {
    let id = range.id
    if (this.state.priceRange.find(x => x == id)) {
      this.state.priceRange = this.state.priceRange.filter(item => item !== id)
      this.setState({ selectedPriceRange: this.state.priceRange })
    } else {
      this.state.priceRange.push(id)
      this.setState({ selectedPriceRange: this.state.priceRange })
    }
    return priceRange.map((item) => {
      if (item.id == range.id) {
        item.isSelected = !item.isSelected
      }
    })
  }


  //    < -----PULL TO REFRESH----->
  onRefresh = () => {
    this.setState({ refresh: true })
    this.forceUpdate
    const formData = {}
    CategoriesAPI = []
    FoodGroupsAPI = []

    axios.post(path.GET_FILTER_CATEGORIES_API, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      let data = resp.data.data.list
      data.map((item) => {
        CategoriesAPI.push(item)
      })
      this.setState({ categories: data, loaderCategories: false })
    }).catch((e) => {
      console.log(e);
    });
    CategoriesAPI.map((item, index) => {
      index == 0 ? this.setState({ [item.name]: true, selectedCategory: item.id }) : this.setState({ [item.name]: false })
    })


    axios.post(path.GET_FILTER_FOOD_GROUPS_API, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      let data = resp.data.data.list
      data.map((item) => {
        FoodGroupsAPI.push(item)
      })
      this.setState({ foodGroup: data, loaderFoodGroups: false })
    }).catch((e) => {
      console.log(e);
    });
    FoodGroupsAPI.map((item, index) => {
      index == 0 ? this.setState({ [item.name]: true, selectedFoodGroup: item.id }) : this.setState({ [item.name]: false })
    })



    this.setState({ refresh: false })

  }

  changeDiscountValue = (low, high) => {
    discountSlider.low = low
    discountSlider.high = high
  }

  changeNearbyValue = (value) => {
    nearBySlider.value = value
    // this.setState({nearbyValue : value}) 
    // this.state.nearbyValue = value
    // this.setStateOfNearBy(value)
    // console.log(value);
  }
  // setStateOfNearBy = (value) =>{
  //   this.setState({nearbyValue : value})
  // }

  render() {
    // this.props.navigation.addListener('focus', () => {
    //   this.forceUpdate
    // })
    const { isChecked } = this.state;
    return (
      <Container >
        <SafeAreaView>
          <View style={styles.header}>
            <Icon
              name="close"
              onPress={() => this.props.navigation.replace('Home')}
              style={styles.close}
            />
            <Text style={styles.heading}>Filter</Text>
          </View>
        </SafeAreaView>
        <Content
          style={{
            width: '100%',
            flex: 1,
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={this.onRefresh}
            />
          }
        >
          <View
            style={{
              flex: 0.8,
              marginTop: 2,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <View style={styles.column}>
              <Text
                style={{
                  ...styles.heading,
                  fontSize: 15,
                  textAlign: 'left',
                  width: '90%',
                  alignSelf: 'center',
                }}>
                Curbside Pickup
              </Text>
              <View style={styles.row}>
                <CheckBox
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 5,
                  }}
                  checked={this.state.isChecked}
                  color={this.state.isChecked ? Colors.AppColor : '#9A9A9A'}
                  onPress={() => this.setState({ isChecked: !isChecked })}
                />
                <Text style={styles.checkText}>
                  Curbside pickup restaurants only
                </Text>
              </View>
            </View>
            <View style={styles.column}>
              <Text
                style={{
                  ...styles.heading,
                  fontSize: 15,
                  textAlign: 'left',
                  width: '90%',
                  alignSelf: 'center',
                }}>
                Categories
              </Text>
              {this.state.loaderCategories ? <ActivityIndicator
                animating={true}
                // style={{marginVertical : 50}}
                size={Platform.OS === 'android' ? 50 : 'large'}
                color={Colors.AppColor}
              /> : null}
              <View style={styles.row}>
                {CategoriesAPI.map((item, index) => (
                  <Filter
                    filter={item.name}
                    isSelected={this.state[item.name]}
                    index={index}
                    onPress={() => this.SelectCategory(item)}
                  />
                ))}
              </View>
            </View>
            <View style={styles.column}>
              <Text
                style={{
                  ...styles.heading,
                  fontSize: 15,
                  textAlign: 'left',
                  width: '90%',
                  alignSelf: 'center',
                }}>
                Food Groups
              </Text>
              {this.state.loaderFoodGroups ? <ActivityIndicator
                animating={true}
                size={Platform.OS === 'android' ? 50 : 'large'}
                color={Colors.AppColor}
              /> : null}
              <View style={styles.row}>
                {FoodGroupsAPI.map((item, index) => (
                  <Filter
                    filter={item.name}
                    isSelected={this.state[item.name]}
                    index={index}
                    onPress={() => this.SelectFoodGroups(item)}
                  />
                ))}
              </View>
            </View>
            <View style={styles.column}>
              <Text
                style={{
                  ...styles.heading,
                  fontSize: 15,
                  textAlign: 'left',
                  width: '90%',
                  alignSelf: 'center',
                }}>
                Ratings
              </Text>
              <View style={styles.row}>
                {rating.map((item, index) => (
                  <Filter
                    onPress={() => this.SelectRating(item)}
                    isRating
                    filter={item.type}
                    isSelected={item.isSelected}
                    iscombined={true}
                    index={index}
                    isLast={rating?.length - 1 === index}
                  />
                ))}
              </View>
            </View>
            <View style={styles.column}>
              <Text
                style={{
                  ...styles.heading,
                  fontSize: 15,
                  textAlign: 'left',
                  width: '90%',
                  alignSelf: 'center',
                }}>
                Price Range
              </Text>
              <View style={styles.row}>
                {priceRange.map((item, index) => (
                  <Filter
                    onPress={() => this.SelectPriceRange(item)}
                    isRating
                    filter={item.type}
                    isSelected={item.isSelected}
                    iscombined={true}
                    index={index}
                    isLast={priceRange?.length - 1 === index}
                  />
                ))}
              </View>
            </View>
            <View style={styles.sliderView}>
              <Text
                style={{
                  ...styles.heading,
                  fontSize: 15,
                  textAlign: 'left',
                  width: '90%',
                  alignSelf: 'center',
                }}>
                Nearby
              </Text>
              <Text style={{ marginLeft: 20, marginTop: 10, fontFamily: semiBold, position: 'absolute', zIndex: 10, top: 10 }}>{this.state.nearbyValue}km</Text>
              <Slider
                style={{ ...styles.slider, marginTop: 40 }}
                min={0}
                max={5}
                step={1}
                defaultLow={10}
                defaultHigh={10}
                disableRange={true}
                floatingLabel={true}
                allowLabelOverflow={true}
                renderThumb={() => <Thumb />}
                renderRail={() => <Rail />}
                renderRailSelected={() => <RailSelected />}
                renderLabel={(value) => <Label text={value} suffix={'km'} />}
                onValueChanged={(value) => {
                  this.changeNearbyValue(value)
                  if (this.state.nearbyValue !== value) {
                    this.setState({ nearbyValue: value })
                  }
                }}
              />
            </View>
            <View style={styles.sliderView}>
              <Text
                style={{
                  ...styles.heading,
                  fontSize: 15,
                  textAlign: 'left',
                  width: '90%',
                  alignSelf: 'center',
                }}>
                Discount
              </Text>
              {/* <SliderScreen
                defaultLow={10}
                defaultHigh={30}
                min={0}
                max={100}
                suffix={'%'}
              /> */}
              <Text style={{ marginLeft: 20, marginTop: 10, fontFamily: semiBold, position: 'absolute', zIndex: 10, top: 10 }}>{this.state.discountMinValue}% - {this.state.discountMaxValue}%</Text>
              <Slider
                style={styles.slider}
                min={0}
                max={100}
                step={1}
                defaultLow={10}
                defaultHigh={10}
                disableRange={false}
                allowLabelOverflow={true}
                renderThumb={() => <Thumb />}
                renderRail={() => <Rail />}
                renderRailSelected={() => <RailSelected />}
                renderLabel={(value) => <Label text={value} suffix={'%'} />}
                onValueChanged={(low, high) => {
                  this.changeDiscountValue(low, high)
                  if (this.state.discountMinValue !== low) {
                    this.setState({ discountMinValue: low })
                  }
                  if (this.state.discountMaxValue !== high) {
                    this.setState({ discountMaxValue: high })
                  }
                }}
              />
            </View>
            <View style={{ marginBottom: 10 }}>
            {this.state.buttonLoader ? <ActivityIndicator
                animating={true}
                // style={{marginVertical : 50}}
                size={Platform.OS === 'android' ? 50 : 'large'}
                color={Colors.AppColor}
              /> : null}
              <CustomButton
                text="Apply Filters"
                onPress={this.HitFilters}
                style={styles.close}
              />
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
    marginVertical: 10,
  },
  close: {
    // width: '10%',
    marginTop: 20,
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
  slider: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
});

export default SearchFilters;
