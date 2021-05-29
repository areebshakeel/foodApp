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
  TextInput,
  RefreshControl,
  ActivityIndicator,
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
import DealsList from '../Components/DealsList';
import deal from '../images/deal.png';
import RestaurantTabs from '../Components/RestaurantTabs';
import RestaurantDetails from '../Components/RestaurantDetails';
import OrdersTabs from '../Components/OrdersTabs';
import AddIcon from '../Components/AddIcon';
import { Directions } from 'react-native-gesture-handler';
import CustomButton from '../Components/Button';
import CartButtons from '../Components/CartButtons';
import { path } from '../config/path';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../config/colors';
import Cart from './Cart';

const filters = ['food', 'high Price', '5 Stars'];
const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
      token: '',
      itemId: '',
      data: [],
      refresh: false,
      loader: false,
      cartArray: [],
      orderEnable: true
    };
  }
  async componentDidMount() {
    const { itemId } = this.props.route.params
    // await AsyncStorage.removeItem('Cart').then(()=>{
    //   alert('done')
    // }).catch((e)=>{
    //   alert(e);
    // })
    let token = await AsyncStorage.getItem('Token')
    const TokenValue = JSON.parse(token);
    this.setState({ token: TokenValue, itemId: itemId, loader: true })

    const formData = new FormData()
    formData.append("itemId", this.state.itemId)

    await axios.post(path.ITEM_DETAILS_API, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      console.log('Menu Rest-->> ', resp.data.data)
      this.setState({ data: resp.data.data, loader: false });
    })
  }
  addToCart = async () => {


    // let fullCart = []
    if (this.state.token) {
      let CartObj = {
        price: this.state.data[0].specialPrice ? this.state.data[0].specialPrice : this.state.data[0].price,
        id: this.state.data[0].id,
        count: this.state.count,
        img: this.state.data[0].img,
        title: this.state.data[0].name,
        restaurantId: this.state.data[0].restaurantId,
        restaurant: this.state.data[0].restaurant
      }
      let cartdata = await AsyncStorage.getItem('Cart')
      let cartParsed = JSON.parse(cartdata)

      //   // console.log(cartParsed.length);
      //   if (cartParsed.length == 0) {
      //     fullCart.push(CartObj)
      //     AsyncStorage.setItem('Cart', JSON.stringify(fullCart)).then(() => {
      //       console.log('Item Added ', fullCart);
      //       this.props.navigation.navigate('Cart')
      //     })
      //   } else {
      //     // console.log("Dataaaa ",this.state.data[0]);
      //     let cart = await AsyncStorage.getItem('Cart')
      //     let cartParsed = JSON.parse(cart)
      //     // console.log("Cart Parsed ", cartParsed);
      //     let item = cartParsed.find(x => x.id == this.state.data[0].id)
      //     if ([item].length == 1) {
      //       let CartObj = {
      //         price: this.state.data[0].price,
      //         id: this.state.data[0].id,
      //         count: this.state.count,
      //         img: this.state.data[0].img,
      //         title: this.state.data[0].name,
      //         restaurantId: this.state.data[0].restaurantId,
      //         restaurant: this.state.data[0].restaurant
      //       }
      //       item = CartObj
      //       console.log(item);
      //       cartParsed.forEach((element, index) => {
      //         if (element.id === item.id) {
      //           cartParsed[index] = item;
      //         }
      //       });
      //       AsyncStorage.setItem('Cart', JSON.stringify(cartParsed)).then(()=>{
      //         console.log('Item count navigated and saved');
      //         this.props.navigation.navigate('Cart')
      //       })
      //     }
      //   }


      if (cartParsed == null || (cartParsed && cartParsed[0].restaurantId == CartObj.restaurantId)) {
        this.setState({ cartArray: CartObj })
        // this.props.navigation.navigate('Cart')     
        try {
          if (cartParsed == null) {
            AsyncStorage.setItem('Cart', JSON.stringify([CartObj]))
              .then(() => {
                this.props.navigation.navigate('CartTab')
              })
          } else {
            var flag2 = true
            await cartParsed.map((item, index)=>{
              if(item.id == CartObj.id){
                let newCount = Number(item.count) + Number(this.state.count)
                item.count = newCount
                cartParsed[index] = item
                flag2 = false
                AsyncStorage.setItem('Cart',JSON.stringify(cartParsed)).then(()=>{
                  this.props.navigation.navigate('CartTab')
                })
                 
              } 
            })
            if(flag2){
              let newCarts = [...cartParsed, CartObj]
              console.log(newCarts);
              AsyncStorage.setItem('Cart', JSON.stringify(newCarts)).then(()=>{
                this.props.navigation.navigate('CartTab')
              })
            }
            

           
          //   let newCart = cartValue.map((item) => {
          //     if (item.id == CartObj.id) {
          //       let count = this.state.count
          //       item.count = count
          //       return item
          //     } else {
          //       let arrayToBeInserted = []
          //       cartValue.push(CartObj)
          //       arrayToBeInserted = cartValue
          //       return (arrayToBeInserted)
          //     }
          //   })
          //   let man = false
          //   try {
          //     man = newCart[0].map((item) => { return item ? true : false })
          //     if (man) {
          //       AsyncStorage.removeItem('Cart').then(() => {
          //         AsyncStorage.setItem('Cart', JSON.stringify(newCart[0]))
          //           .then(() => {
          //             this.props.navigation.navigate('CartTab')
          //           })
          //       })
          //     }
          //   } catch (error) {
          //     man = false
          //     if (!man) {
          //       AsyncStorage.removeItem('Cart').then(() => {
          //         AsyncStorage.setItem('Cart', JSON.stringify(newCart))
          //           .then(() => {
          //             this.props.navigation.navigate('CartTab')
          //           })
          //       })
          //     }
          //   }
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        Alert.alert(
          "Add To Cart",
          "You need to remove previous restaurant items to order from this restaurants. Do you want to remove?",
          [
            {
              text: "No",
              onPress: () => console.log('Cart'),
              style: "cancel"
            },
            {
              text: "Yes", onPress: () => AsyncStorage.removeItem("Cart").then(() => {
                this.addToCart()
              })
            }
          ]
        );
      }
    } else {
      this.props.navigation.navigate('Login')
    }
  }

  navigator = (restaurantsType) => {
    this.props.navigation.navigate('Nearby', { restaurants: restaurantsType });
  }

  onRefresh = () => {
    const formData = new FormData()
    formData.append("itemId", this.state.itemId)
    axios.post(path.ITEM_DETAILS_API, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      this.setState({ data: resp.data.data });
    })
  }
  render() {
    this.props.navigation.addListener('focus', async () => {
      let token = await AsyncStorage.getItem('Token')
      const TokenValue = JSON.parse(token);
      this.setState({ token: TokenValue })
    })
    const { count } = this.state;
    return (
      <Container>
        <Content style={{ width: '100%', flex: 1, flexDirection: 'column' }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={this.onRefresh}
            />
          }>
          <View>
            {this.state.data.map((item) => {
              return (
                <Image
                  resizeMode="cover"
                  source={{ uri: item.img }}
                  style={{
                    marginTop: 0,
                    height: Dimensions.get('window').height / 3.5,
                    width: Dimensions.get('window').width,
                  }}
                />
              )
            })}
            <View style={{ position: 'absolute', top: 10, backgroundColor: 'white', left: 10, padding: 10, borderRadius: 200 }}>
              <Icon
                style={{ color: '#000' }}
                onPress={() => this.props.navigation.goBack()}
                name="arrow-back-outline"
              />
            </View>
          </View>
          <View style={styles.body}>
            <View style={{ marginLeft: -10 }}>
              {/* <CustomHeader heading={heading} filters={heading === "Filters:" ? filters : []} />
                          <DealsList numColumns={1} horizontal={false} /> */}
              {this.state.data.map((item) => {
                return (
                  <RestaurantDetails navigator={this.navigator} isItem data={item} />
                )
              })}
            </View>
            <View style={styles.detailsView}>
              <Text style={styles.details}>Details</Text>
              {this.state.data.map((item) => {
                return (
                  <Text style={styles.detailsText}>
                    {item.description}
                  </Text>
                )
              })}
            </View>
            <View style={styles.detailsView}>
              <Text style={styles.instruction}>Special Instructions</Text>
              <TextInput
                placeholder="Add a note (Extra sauce, no onions, etc)."
                style={styles.detailsText}
              />
            </View>
            {this.state.loader ? <ActivityIndicator
              animating={true}
              style={{ marginVertical: 50 }}
              size={Platform.OS === 'android' ? 50 : 'large'}
              color={Colors.AppColor}
            /> : null}
            <CartButtons
              isDetails
              decrement={() => {
                count > 1 ? this.setState({ count: this.state.count - 1 }) : null
              }}
              increment={() => {
                this.setState({ count: this.state.count + 1 })
              }}
              count={count}
            />
            <View style={{}}>
              <CustomButton
                text="Add to Cart"
                onPress={this.addToCart}
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
  nearBy: {
    position: 'absolute',
    color: '#ffffff',
    fontSize: 15,
  },
  body: {
    flex: 0.8,
    marginTop: -20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  detailsView: {
    width: '95%',
    alignSelf: 'center',
  },
  details: {
    color: '#464951',
    fontFamily: semiBold,
    fontSize: 20,
  },
  detailsText: {
    color: '#464951',
    fontFamily: regular,
    fontSize: 12,
    marginVertical: 10,
    borderBottomColor: '#707070',
    borderBottomWidth: 1.3,
    paddingBottom: 5
  },
  instruction: {
    color: Colors.AppColor,
    fontFamily: semiBold,
    fontSize: 12,
  },
  cartButttons: {
    marginTop: 50,
    width: '95%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    width: Dimensions.get('window').width / 3,
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
  },
  count: {
    color: '#464951',
    fontSize: 35,
    padding: 10,
  },
});

export default ItemDetails;
