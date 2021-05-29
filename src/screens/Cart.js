import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
  Alert,
  FlatList,
  Linking
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
  Icon,
  Picker,
  Toast
} from 'native-base';
import RNPickerSelect from 'react-native-picker-select';
import CustomHeader from '../Components/Header';
import Restaurants from '../Components/restaurantsList';
import Orders from '../Components/Orders';
import creditCard from '../images/creditCard.png';
import promo from '../images/promo.png';
import map from '../images/map.png';
import loyalty from '../images/Loyality.png';
import Discount from '../images/discount.png';
import AddIcon from '../Components/AddIcon';
import Colors from '../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../Components/Button/index'
import IconDown from 'react-native-vector-icons/AntDesign';
import Geolocation from '@react-native-community/geolocation';

// import {
//   initiateCardPayment,
//   initiateSamsungPay,
//   initiateApplePay,
// } from '@network-international/react-native-ngenius';
import axios from 'axios';
import { path } from '../config/path';
import { withNavigation, NavigationEvents } from 'react-navigation'
import { TextInput } from 'react-native-gesture-handler';
import { sub } from 'react-native-reanimated';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const LATITUDE_DELTA = 0.0062998339347544174 //Very high zoom level
const LONGITUDE_DELTA = 0.004023313891394764

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: 'Daniel',
      lang: 'en',
      cart: [],
      refresh: false,
      loader: false,
      vehicleData: [],
      car: 'Select vehicle',
      amount: 0,
      count: 1,
      restaurantName: '',
      cartCount: [],
      abcd: 0,
      count2: 0,
      renderState: 1,
      region: {
        latitude: '25.076798',
        longitude: '55.210413',
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      restLat: 0,
      restLong: 0,
      curbPickup: false,
      modal: false,
      token: '',
      myLong: "",
      myLat: "",
      placeName: 'Loading...',
      curbSide: '',
      total: 0,
      rerender: 0,
      cartFlag: 1,
      rerenderFlag: false,
      promoCode: '',
      discountType: '',
      discountValue: 0,
      showPromoStatus: false

    }
    // this.props.navigation.addListener = this.props.navigation.addListener.bind(this)
  }

  async componentDidMount() {
    Geolocation.getCurrentPosition((resp) => {

      const region = {
        latitude: resp.coords.latitude,
        longitude: resp.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }
      this.setState({ region })
    })
    // this.setState({ loader: true })

    let i = 1
    if (i === 1) {
      this.onFocus = this.props.navigation.addListener('focus', async () => {
        // this.forceUpdate();
        this.getVehicle()
        this.flagging()
        this.setState({ rerender: this.state.rerender + 1 })
        const token = await AsyncStorage.getItem('Token')
        const TokenValue = JSON.parse(token)
        let form = new FormData()
        form.append('promoCode', this.state.promoCode)
        console.log('Promo token -->> ', TokenValue);
        console.log('Promo Codesss -->> ', this.state.promoCode);
        await axios.post(path.verifyPromoCode, form, {
          headers: {
            'Authorization': 'Bearer ' + TokenValue,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        }).then((res) => {
          console.log('Res in Promo ->> ', res.data.data);
          this.setState({ promoCode: '' })
          let { type, discount, Message } = res.data.data
          this.setState({ discountType: type, discountValue: discount })
          console.log('Fix valuee -->> ', type);
          // Toast.show({
          //   text: Message,
          //   type: "warning",
          //   position: 'top',
          //   style: {
          //     marginTop: 40
          //   }
          // })

        }).catch((e) => {
          console.log('Error in Promo ', e.response.data);
          this.setState({ promoCode: '' })
        })
        i = 0
        !token ?
          this.props.navigation.navigate('Login') :
          null
      })
    }
    //ye wapsi uncomment krdena
    this.getVehicle()

    let total = 0
    this.state.cart.map(async (item) => {
      // return total += (item.price * item.count)
      total += (item.price * item.count)
      await this.setState({ total: total })
    })

    this.setState({ total: parseFloat(total), loader: false })

    let itemsCount = 0
    // this.state.cart.map((item) => {
    //   this.state.cartCount.push(item.count)
    // })
  }

  // async componentDidUpdate(preProps){
  //   let cart = await AsyncStorage.getItem('Cart')
  //   let parsedCart = JSON.parse(cart)

  //   console.log("parsedCart", parsedCart)
  //   if (parsedCart.length == 0) {
  //     await this.setState({ showPromoStatus: false })
  //   }
  //   else{
  //     await this.setState({ showPromoStatus: true })
  //   }
  // }

  increment = (index) => {
    console.log({ index });
    console.log("cart count ", this.state.cartCount);
    this.state.cartCount[index] = this.state.cartCount[index] + 1
    this.setState({ abcd: this.state.abcd + 1 })
    this.state.cart[index].count = this.state.cartCount[index]


    const { cart } = this.state
    cart[index].count = this.state.cartCount[index]

    // let total = 0
    // this.state.cart.map((item) => {

    //   return total += (item.price * item.count)
    // })
    let total = 0
    this.state.cart.map(async (item) => {
      total += (item.price * item.count)
      await this.setState({ total: total, loader: false })
    })

    this.setState({ amount: parseFloat(total) })

    let itemsCount = 0
    this.state.cart.map((item) => {
      this.state.cartCount.push(item.count)
    })

    this.updateCart(this.state.cart)

  }

  updateCart = async (cart) => {
    if (this.state.cart.length == 0) {
      await this.setState({ showPromoStatus: false })
    }
    else {
      await this.setState({ showPromoStatus: true })
    }

    AsyncStorage.removeItem('Cart').then(() => {
      AsyncStorage.setItem('Cart', JSON.stringify(cart)).then(() => {
        console.log('Cart Updated => ', this.state.cart);
      })
    })
  }

  decrement = (index) => {
    console.log(this.state.cart);
    //alert(JSON.stringify(this.state.cartCount))
    // if(this.state.cart[index].count == 1){
    //   this.deleteSpecificItem(index)
    //   return
    // }
    if (this.state.cart[index].count > 1) {
      this.state.cartCount[index] = this.state.cartCount[index] - 1
      this.setState({ abcd: this.state.abcd - 1 })
      this.state.cart[index].count = this.state.cartCount[index]
      const { cart } = this.state
      cart[index].count = this.state.cartCount[index]

      // let total = 0
      // this.state.cart.map((item) => {

      //   return total += (item.price * item.count)
      // })

      let total = 0
      this.state.cart.map(async (item) => {
        total += (item.price * item.count)
        await this.setState({ total: total, loader: false })
        console.log(this.state.total);
      })

      this.setState({ amount: parseFloat(total) })

      let itemsCount = 0
      // this.state.cart.map((item) => {
      this.state.cartCount[index] = this.state.cart[index].count
      // })
    }
    this.updateCart(this.state.cart)
  }

  flagging = async () => {
    let cart = await AsyncStorage.getItem('Cart')
    let parsedCart = JSON.parse(cart)
    if (parsedCart) {
      await this.setState({ cart: parsedCart })
      // alert(JSON.stringify(parsedCart))
      let temp = []
      await parsedCart.map((item) => {
        temp.push(item.count)
      })
      await this.setState({ cartCount: temp, abcd: this.state.abcd + 1, rerenderFlag: !this.state.rerenderFlag })
    } else {
      this.setState({ cart: [], loader: false })
    }
  }


  getVehicle = async () => {
    //alert('chala')
    this.state.count2++
    console.log('vehicle', this.state.count2)
    this.setState({ loader: true })
    // await this.onRefresh()

    let cart = await AsyncStorage.getItem('Cart')
    let parsedCart = JSON.parse(cart)

    console.log("parsedCart", parsedCart)
    if (parsedCart.length == 0) {
      await this.setState({ showPromoStatus: false })
    }
    else {
      await this.setState({ showPromoStatus: true })
    }

    // alert(JSON.stringify(parsedCart))
    await this.setState({ cart: parsedCart })
    // console.log({parsedCart});
    // parsedCart && await this.setState({ cart: parsedCart.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) })
    // console.log("Carttt ", parsedCart);
    var countTemp = this.state.cartCount
    this.state.cart.map((item) => {
      // alert(item.count)
      countTemp.push(item.count)
      this.state.cartCount.push(item.count)
    })
    // alert("COUNT1 " + JSON.stringify(countTemp))
    let total = 0
    this.state.cart.map(async (item) => {
      total += (item.price * item.count)
      await this.setState({ total: total, loader: false })
      console.log(this.state.total);
    })

    let token = await AsyncStorage.getItem('Token')
    const TokenValue = JSON.parse(token)

    await axios.post(path.GET_VEHICLE_API, {}, {
      headers: {
        'Authorization': 'Bearer ' + TokenValue,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
      let data = res.data.data
      this.setState({ vehicleData: data })
      this.setState({ loader: false })
    }).catch((e) => {
      this.setState({ loader: false })
    })

    Geolocation.getCurrentPosition(pos => {
      this.setState({
        myLat: pos.coords.latitude,
        myLong: pos.coords.longitude
      })
    })

    let rid = this.state.cart[0].restaurantId
    let form = new FormData()
    form.append('rid', rid)
    axios.post(path.master_restaurants, form, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      this.setState({
        restLat: resp.data.data.list.Restaurant[0].latitude,
        restLong: resp.data.data.list.Restaurant[0].longitude,
        curbSide: resp.data.data.list.Restaurant[0].allowCurbSidePickup,
        restaurantName: resp.data.data.list.Restaurant[0].restaurant
      })
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${resp.data.data.list.Restaurant[0].latitude},${resp.data.data.list.Restaurant[0].longitude}&sensor=true&key=AIzaSyAqC5og7feEmdPWUfi05lcXsZnmtWf99SY`).then((resp) => {
        this.setState({ placeName: resp.data.results[0].formatted_address });
      })
    })
    // console.log(this.state.cart);
  }



  placeOrder = async (grandTotal) => {
    this.setState({ loader: true })
    try {
      let token = await AsyncStorage.getItem('Token')
      const TokenValue = JSON.parse(token)
      if (TokenValue == null || TokenValue == undefined) {
        this.props.navigation.navigate('Login')
      } else {
        const form = new FormData()
        form.append('item_object', JSON.stringify(this.state.cart))
        form.append('pay_method', 'samsung_pay')
        form.append('pay_status', 'success')
        form.append('item_total', this.state.cart ? this.state.cart.length : 0)
        form.append('promocode', this.state.promoCode ? this.state.promoCode : 'none')
        form.append('promocode_discount', this.state.discountValue ? this.state.discountValue : 0)
        form.append('discount', this.state.discountValue ? this.state.discountValue : 0)
        form.append('inapp_discount', 0)
        form.append('loyalty_discount', 0)
        form.append('total_amount', this.state.cart ? grandTotal : 0)
        form.append('total_discount', this.state.discountValue ? this.state.discountValue : 0)
        form.append('pickup_location', 1)
        form.append('vehicle_id', '45')
        await axios.post(path.PLACE_ORDER_API, form, {
          headers: {
            'Authorization': 'Bearer ' + TokenValue,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        }).then((resp) => {
          Toast.show({
            text: resp.data.data.Message,
            type: 'success',
            position: 'top',
            style: {
              marginTop: 40
            }
          })
          AsyncStorage.removeItem('Cart').then(() => {
            this.setState({ cart: [] })
            this.props.navigation.navigate('ReachedDestination', { orderId: resp.data.data.OrderId, token: TokenValue })
          })
        }).catch((e) => {
          console.log('Error in placing order-->> ', JSON.stringify(e.response.data))
          Toast.show({
            text: e.message,
            type: 'danger',
            position: 'top',
            style: {
              marginTop: 40
            }
          })
        })
      }
    } catch (error) {
      console.log('Catch error-->> ', error)
    }
    this.setState({ loader: false })
  }

  deleteSpecificItem = async (index) => {
    console.log("MY CART delte func, ", this.state.cart)
    console.log("index", index);

    var tempCart = this.state.cart;
    var removed = tempCart.splice(index, 1);
    console.log("MY CART delte after, ", tempCart);
    this.setState(tempCart)
    if (tempCart.length == 0) {
      AsyncStorage.removeItem('Cart')
      await this.setState({ showPromoStatus: false })

      return
    }
    this.updateCart(tempCart)
  }


  authneticate = async () => {
    this.setState({ loader: true })
    let form = new FormData()
    form.append('orderRequest', this.state.cart)
    // console.log('my data-->> ', form)
    try {

      await axios.post('https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token', {
        data: {
          grant_type: 'client_credentials',
          realm: 'ni',
        }
      },

        {

          headers: {
            'Content-Type': 'application/vnd.ni-identity.v1+json',
            'Authorization': `Basic ${"MWUxNzMxOTUtYjk2Yi00MmM2LWE3ZjctNTQyYzY3OWIxOWIyOjlmYmM0MGZhLWIxNGQtNGJlZS05ZDU3LWFiM2E4YjYyNzg4Ng=="}`
          },

        }).then(async (res) => {
          // console.log('res in API--->> ', res.data.access_token)
          await axios.post('https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/15596d66-e592-4713-acb6-bb5a7b611e9c/orders',
            {
              "action": "SALE",
              "amount": {
                "currencyCode": "AED",
                "value": 2300
              }
            },
            {
              headers: {
                'Authorization': `Bearer ${res.data.access_token}`,
                'Content-Type': 'application/vnd.ni-payment.v2+json',
                'Accept': 'application/vnd.ni-payment.v2+json'
              },
            }).then(async (res) => {
              // console.log('Response in second API-->> ', res.data)
              this.setState({ loader: false })

              try {
                const resp = await initiateCardPayment(res.data)
                resp.then((res) => {

                  // console.log('Payment Success ', res)
                }).catch((e) => {
                  console.log('Erorr in Payment', e)
                })
                console.log('Order Resp-->> ', resp)
              } catch (err) {
                console.log('',);
              }
            }).catch((e) => {
              console.log('Error in Second-->> ', e.response.data)
            })
        }).catch((e) => {
          console.log('error APII---)))) ', e)
        })


    } catch (error) {
      console.log('Catch Error -->> ', error)
    }
  }

  clearCart = async () => {
    await AsyncStorage.removeItem('Cart').then(() => {
      alert('Done')
      this.setState({ loader: false })
    })
  }

  verifyPromoCode = async () => {

    let token = await AsyncStorage.getItem('Token')
    let TokenValue = JSON.parse(token)
    let form = new FormData()
    form.append('promoCode', this.state.promoCode)
    console.log('Promo token -->> ', TokenValue);
    console.log('Promo Codesss -->> ', this.state.promoCode);
    await axios.post(path.verifyPromoCode, form, {
      headers: {
        'Authorization': 'Bearer ' + TokenValue,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
      console.log('Res in Promo ->> ', res.data.data);
      this.setState({ promoCode: '' })
      let { type, discount, Message } = res.data.data
      this.setState({ discountType: type, discountValue: discount })
      console.log('Fix valuee -->> ', type);
      Toast.show({
        text: Message,
        type: "warning",
        position: 'top',
        style: {
          marginTop: 40
        }
      })

    }).catch((e) => {
      console.log('Error in Promo ', e.response.data.data);
      this.setState({ promoCode: '' })
    })

  }

  render() {
    // this.props.navigation.addListener('focus', ()=>{
    //   // this.getVehicle()
    // })

    let total = 0
    let percent = this.state.discountType
    let discount = this.state.discountValue
    let subTotal = 0
    let exclVAT = 0
    let tax = 0
    let grandTotal = 0
    return (
      <Container key={this.state.rerender}>
        <Content style={{ width: '100%', flex: 1, flexDirection: 'column', paddingHorizontal: 5 }} refreshControl={
          <RefreshControl
            refreshing={this.state.refresh}
            onRefresh={this.onRefresh}
          />} >

          <View style={{ marginTop: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name="arrow-back-outline"
                onPress={() => this.props.navigation.goBack()}
                style={styles.close}
              />
              <AddressBar navigation={this.props.navigation} disable={true} />
            </View>
          </View>
          <View
            style={{
              flex: 0.8,
              marginTop: 2,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('OrderHistory')}>
              <CustomHeader heading={this.state.restaurantName ? ('Orders from ' + this.state.restaurantName) : "Orders"} />
            </TouchableOpacity>

            <ActivityIndicator
              animating={this.state.loader}
              style={{ position: 'absolute', alignSelf: 'center', }}
              size={Platform.OS === 'android' ? 30 : 'large'}
              color={Colors.AppColor}
            />
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={this.state.cart}
              // increment={increment}
              // decrement={decrement}
              extraData={this.state}
              numColumns={1}
              horizontal={false}
              renderItem={({ item, index }) => {
                // console.log('Indexes-->> ', item.count)

                return (
                  <TouchableOpacity disabled onPress={() => this.props.navigation.navigate('ItemDetails', { itemId: item.id })} style={styles.item}>
                    {this.state.cart ? (
                      <View style={styles.row1}>
                        <View
                          style={{
                            height: 50,
                            width: 50,
                            borderRadius: 7,
                            overflow: 'hidden',
                          }}>
                          <Image style={styles.image}
                            source={{ uri: item.img }}
                          />
                        </View>
                        <View style={styles.column1}>
                          <Text style={styles.title}>{item.title}</Text>
                          <Text style={styles.subTitle}>{"AED"} {item.price}</Text>
                        </View>
                        {/* <View style={styles.buttons}> */}
                        {/* <CartButtons
                        decrement={() => console.log('')}
                        increment={() => console.log('')}
                        count={count}
                      /> */}
                        <View key={this.state.abcd} style={styles.cartButttonsItem}>
                          <AddIcon
                            // isDetails={true}
                            navigator={() => this.decrement(index)}
                            icon="minus"
                            backgroundColor="primary"
                          />
                          <View style={{ width: 70 }}>
                            <Text key={this.state.abcd} style={styles.countItem}>{item.count}</Text>
                          </View>
                          <AddIcon
                            // isDetails={true}
                            navigator={() => this.increment(index)}
                            icon="plus"
                            backgroundColor="primary"
                          />

                          <TouchableOpacity onPress={() => { this.deleteSpecificItem(index) }}
                            style={styles.deleteCartIcon}
                          >
                            {/* <Text>DELETE</Text> */}
                            <IconDown name={'delete'} color={'white'} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      // </View>
                    ) : (
                      <View style={styles.row1}>
                        <View
                          style={{
                            height: 50,
                            width: 50,
                            borderRadius: 7,
                            overflow: 'hidden',
                          }}>
                          <Image style={styles.image} />
                        </View>
                        <View style={styles.column1}>
                          <Text style={styles.title}>{item.title}</Text>
                          <Text style={styles.description}>
                            {"description"}
                          </Text>
                          <Text style={styles.subTitle}> {item.price}</Text>
                        </View>
                        <View>
                          <AddIcon
                            isDetails
                            // navigator={() => navigator(itemId)}
                            icon={'plus'}
                            backgroundColor={'primary'}
                          />
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                )
              }}
              ListEmptyComponent={() => {
                return (
                  <View style={{
                    paddingVertical: 20,
                    // width : Dimensions.get('screen').width,
                  }}>
                    <Text style={{ fontFamily: semiBold, fontSize: 15, textAlign: 'center' }}>Items not available...</Text>
                  </View>
                )
              }}
              keyExtractor={(item) => item.id}
            />

            <View>
              {/* <Button onPress={() => this.clearCart()} backgroundColor={Colors.AppColor} title="Clear Cart" color="#FFFF" /> */}
            </View>

            {
              this.state.showPromoStatus == true ?
                <View style={styles.promoCode}>
                  <View style={styles.subRow}>
                    <Image source={promo} style={{ height: 30, width: 40 }} />
                    <TextInput autoCapitalize="none" value={this.state.promoCode} onChangeText={(value) => this.setState({ promoCode: value })} style={styles.promoText} placeholder="Add Promo code" />
                  </View>
                  <Icon onPress={() => this.verifyPromoCode()} name="arrow-forward" />
                </View>
                :
                <View style={styles.borderBottomLine}></View>
            }
            {/* <View style={styles.promoCode}>
              <View style={styles.subRow}>
                <Image source={promo} style={{ height: 30, width: 40 }} />
                <TextInput autoCapitalize="none" value={this.state.promoCode} onChangeText={(value) => this.setState({ promoCode: value })} style={styles.promoText} placeholder="Add Promo code" />
              </View>
              <Icon onPress={() => this.verifyPromoCode()} name="arrow-forward" />
            </View> */}

            <View
              style={{
                alignSelf: 'center',
                width: '95%',
                borderBottomColor: '#464951',
                borderBottomWidth: 2,
                marginVertical: 2,
                paddingVertical: 10,
              }}>
              <View style={styles.paymentMathod}>
                <Text style={styles.paymentText}>Payment Method</Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('PaymentMethod')
                  }>
                  <Text style={styles.changeMethod}>Change method</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.creditCard}>
                <View style={styles.subRow}>
                  <Image source={creditCard} style={{ height: 30, width: 40 }} />
                  <Text
                    style={{
                      ...styles.promoText,
                      fontFamily: semiBold,
                    }}>
                    Credit Card
                  </Text>
                </View>
                <AddIcon backgroundColor="primary" icon="check" />
              </View>
            </View>
            <View style={styles.paymentMathod}>
              <Text style={{ ...styles.paymentText, fontFamily: semiBold }}>
                Item Total
              </Text>
              <Text style={{ ...styles.paymentText, fontFamily: semiBold }}>
                {!this.state.cart ? "Cart is empty" : this.state.cart.length <= 10 ? "0" + this.state.cart.length : this.state.cart.length}
              </Text>
            </View>
            <View style={styles.paymentMathod}>
              <Text style={{ ...styles.paymentText, fontFamily: semiBold }}>
                Sub Total
              </Text>
              <Text style={{ ...styles.paymentText, fontFamily: semiBold }}>
                AED  {this.state.cart && this.state.cart.map((item) => {
                total += (item.price * item.count)


              })
                }{(total).toFixed(2)}
              </Text>

              <Text style={{ display: "none" }} >{subTotal = total}</Text>

            </View>
            <View style={styles.paymentMathod}>
              <Text style={{ ...styles.paymentText, fontFamily: semiBold }}>
                Discount
              </Text>
              <Text style={{ ...styles.paymentText, fontFamily: semiBold }}>
                {1 == 2 && <Text style={{ display: "none", }}> {this.state.discountValue && this.state.discountType == "percent" ? discount = total * discount / 100 :
                  (this.state.discountValue && this.state.discountType == "fixed" ? discount = discount : "0.00")}</Text>}
                AED {this.state.discountValue && this.state.discountType == "percent" ? discount = total * discount / 100 :
                  (this.state.discountValue && this.state.discountType == "fixed" ? discount = discount : "0.00")}
              </Text>
            </View>
            <View style={styles.paymentMathod}>
              <Text style={{ ...styles.paymentText, fontFamily: semiBold }}>
                Total Excl. VAT
              </Text>
              <Text style={{ display: 'none' }} > {exclVAT = (((subTotal - discount) * 100) / 105).toFixed(2)}</Text>
              <Text style={{ ...styles.paymentText, fontFamily: semiBold }}>
                AED {(((subTotal - discount) * 100) / 105).toFixed(2)}
              </Text>
            </View>
            <View style={styles.paymentMathod}>
              <Text style={{ ...styles.paymentText, fontFamily: semiBold }}>
                TAX (5% VAT)
              </Text>
              <Text style={{ display: "none" }} >{tax = ((subTotal - discount) - exclVAT).toFixed(2)}</Text>
              <Text style={{ ...styles.paymentText, fontFamily: semiBold }}>

                AED {((subTotal - discount) - exclVAT).toFixed(2)}
              </Text>
            </View>
            <View style={styles.paymentMathod}>
              <ImageBackground source={Discount} style={styles.banner}>
                <Text
                  style={{
                    ...styles.paymentText,
                    fontFamily: medium,
                    color: '#FFFFFF',
                    fontSize: 16,
                  }}>
                  In App Discount
                  <Text
                    style={{
                      ...styles.paymentText,
                      color: '#FFFFFF',
                      fontSize: 16,
                      alignSelf: 'flex-end',
                      fontFamily: medium,
                    }}>
                    {' '}
                    AED 0.00
                  </Text>
                </Text>
              </ImageBackground>
            </View>
            <View style={styles.paymentMathod}>

              <ImageBackground source={loyalty} style={styles.banner}>
                <Text
                  style={{
                    ...styles.paymentText,
                    color: '#FFFFFF',
                    marginBottom: 5,
                    fontSize: 16,
                    marginLeft: 10,
                    fontFamily: medium,
                  }}>
                  Loyalty Program
                  <Text
                    style={{
                      ...styles.paymentText,

                      color: '#FFFFFF',
                      fontSize: 16,
                      alignSelf: 'flex-end',
                      fontFamily: medium,
                    }}>
                    {' '}
                    AED 0.00
                  </Text>
                </Text>
              </ImageBackground>
            </View>
            <View style={styles.promoCode}>
              <Text
                style={{
                  ...styles.paymentText,
                  fontFamily: semiBold,
                  fontSize: 20,
                }}>
                Grand TOTAL
              </Text>
              <Text style={{ display: "none" }} >{grandTotal = (parseFloat(tax) + parseFloat(exclVAT)).toFixed(2)} </Text>
              <Text
                style={{
                  ...styles.paymentText,
                  fontFamily: semiBold,
                  fontSize: 24,
                }}>

                AED {parseFloat(tax) + parseFloat(exclVAT)}
              </Text>
            </View>
            {console.log(this.state.placeName)}
            <TouchableOpacity disabled={this.state.placeName == "Loading..." ? true : false} onPress={() => {
              // this.setState({ modal: true })
              const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
              const latLng = `${this.state.restLat},${this.state.restLong}`;
              const label = this.state.restaurantName;
              const url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`
              });


              Linking.openURL(url);

            }} style={{ ...styles.creditCard, display: this.state.cart ? this.state.cart.length > 0 ? 'flex' : 'none' : 'none' }}>
              <Image
                source={map}
                style={{ height: 40, width: 40, borderRadius: 10 }}
              />
              <View style={styles.column}>
                <Text
                  style={{
                    ...styles.promoText,
                    fontFamily: semiBold,
                    marginLeft: 10,
                  }}>
                  Pickup From
                </Text>
                <View style={styles.input}>
                  <Icon name="ios-location-outline" style={styles.icon} />
                  <Text style={styles.text}>{this.state.placeName}</Text>
                </View>
              </View>
            </TouchableOpacity>
            {/* <Modal isVisible={this.state.modal} style={{ margin: 0 }}>
              <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column' }}>
                <View style={{ marginTop: Platform.OS == "ios" ? 50 : 20, marginLeft: 20 }}>
                  <Icon name="close" onPress={() => { this.setState({ modal: false }) }} />
                </View>
                <View style={{ flex: 1 }}>
                  <WebView source={{ uri: `https://www.google.es/maps/dir/'${this.state.myLat},${this.state.myLong}'/'${this.state.restLat},${this.state.restLong}'` }} />
                </View>
              </View>
            </Modal> */}
            <View style={{ display: this.state.curbSide == 'on' ? 'flex' : 'none' }}>
              <View style={{ paddingHorizontal: 10 }}>
                <Text style={{ fontFamily: semiBold }}>Do you want Curbside Pickup ?</Text>
              </View>
              <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 10, paddingHorizontal: 10 }} >
                <Text style={{ color: this.state.curbPickup ? '#ACACAC' : Colors.AppColor, fontFamily: semiBold }} >
                  No
                </Text>
                <Switch
                  value={this.state.curbPickup}
                  onValueChange={() => { this.setState({ curbPickup: !this.state.curbPickup }) }}
                  trackColor={{ false: '#ACACAC', true: Colors.AppColor }}
                  thumbColor={'#ffffff'}
                  style={{
                    marginHorizontal: 10,
                  }}
                />
                <Text style={{ color: !this.state.curbPickup ? '#ACACAC' : Colors.AppColor, fontFamily: semiBold }}>Yes</Text>
              </View>
            </View>
            <View style={styles.vehicleSelection}>
              <Text style={styles.paymentText}>Vehicle Selection*</Text>
              {Platform.OS === "android" ?
                <View style={styles.picker1}>
                  <Picker
                    style={styles.pickerText}
                    mode="dialog"
                    selectedValue={this.state.car}
                    onValueChange={(value) => this.setState({ car: value })}
                  >
                    {this.state.vehicleData.length > 0 ? this.state.vehicleData.map((item) => (
                      <Picker.Item label={item.make + " " + item.model} value={item.id} />
                    )) : <Picker.Item label={"No Cars Found"} value={''} />}

                  </Picker>
                </View> :
                <TouchableOpacity onPress={() => {
                  this.picker.togglePicker()
                }} style={styles.vehicleDropDown}>
                  <View style={{
                    flex: 0.8,
                    justifyContent: 'center'
                  }}>
                    <RNPickerSelect
                      ref={e => this.picker = e}
                      style={styles.inputAndroid}
                      onValueChange={(car) => this.setState({ car })}
                      items={this.state.vehicleData.length > 0 ? this.state.vehicleData.map(item => (
                        { label: `${item.make} ${item.model} ${item.plateNo}`, value: item.id }
                      )) : { label: `No Cars Found`, value: 0 }}
                      useNativeAndroidPickerStyle={true}
                      placeholder={{ label: 'Select Vehicle', value: null }} />
                  </View>
                  <View style={{
                    flex: 0.2,
                    justifyContent: 'center',
                    alignItems: 'flex-end'
                  }}>
                    <IconDown
                      name="caretdown"
                      color={Colors.borderColor}
                      onPress={() => {
                        this.picker.togglePicker()
                      }}
                    />
                  </View>
                </TouchableOpacity>
              }
            </View>
            <ActivityIndicator
              animating={this.state.loader}
              style={{ position: 'absolute', alignSelf: 'center', marginTop: '150%' }}
              size={Platform.OS === 'android' ? 60 : 'large'}
              color={Colors.AppColor}
            />
            <View style={{ marginVertical: 5 }}>

              <TouchableOpacity
                // onPress={() => this.authneticate()}
                onPress={this.state.cart ? this.state.cart.length !== 0 ? () => this.placeOrder(grandTotal) : () => { this.props.navigation.navigate('Nearby', { restaurants: 'Restaurants', location: this.state.region }) } : () => { this.props.navigation.navigate('Nearby', { restaurants: 'Restaurants', location: this.state.region }) }}
                style={styles.container}>
                {this.state.cart ? this.state.cart.length !== 0 ?
                  <>
                    <Icon name="cart-outline" style={styles.cartIcon} />
                    <Text style={styles.buttonText}>Pay Now</Text>
                    <Text style={styles.buttonText}>AED {grandTotal}</Text>
                  </>
                  : <>
                    <Text style={styles.buttonText}></Text>
                    <Text style={{ ...styles.buttonText }}>Nearby</Text>
                    <Text style={styles.buttonText}></Text>
                  </>
                  : <>
                    <Text style={styles.buttonText}></Text>
                    <Text style={{ ...styles.buttonText }}>Nearby</Text>
                    <Text style={styles.buttonText}></Text>
                  </>
                }

              </TouchableOpacity>
            </View>

          </View>
        </Content>
      </Container >
    )
  }
}


export default Cart
const styles = StyleSheet.create({
  favorite: {
    fontFamily: semiBold,
    fontSize: 15,
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
  picker1: {
    width: '100%',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#707070',
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    alignSelf: 'center'
    // alignItems:'center'
  },
  pickerText: {
    color: '#3d3d3d',
    fontSize: 15,
  },
  borderBottomLine: {
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    // padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#464951',
    borderTopWidth: 2,
    borderBottomColor: '#464951',
    // borderBottomWidth: 2,
  },
  promoCode: {
    marginVertical: 2,
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#464951',
    borderTopWidth: 2,
    borderBottomColor: '#464951',
    borderBottomWidth: 2,
  },
  inputAndroid: {
    borderBottomWidth: 2,
    padding: 10,
    paddingLeft: 0,
    borderColor: 'green',
    borderLeftWidth: 1,
    marginHorizontal: 15,
    width: '100%'
  },
  paymentMathod: {
    marginVertical: 2,
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  changeMethod: {
    fontFamily: regular,
    fontSize: 12,
    color: Colors.AppColor,
  },
  promoText: {
    fontFamily: regular,
    fontSize: 14,
    color: '#3D3D3D',
    textAlign: 'left',
    width: '80%',
    marginLeft: 20,
  },
  paymentText: {
    fontFamily: regular,
    fontSize: 14,
    color: '#3D3D3D',
    textAlign: 'left',
  },
  creditCard: {
    marginVertical: 2,
    flexDirection: 'row',
    width: '95%',
    alignSelf: 'center',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
  },
  column: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  input: {
    flexDirection: 'row',
    // width: '60%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 5,
  },
  icon: {
    fontSize: 15,
    color: Colors.AppColor,
    alignSelf: 'center',
  },
  banner: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    alignSelf: 'center',
    color: '#7F7E7F',
    backgroundColor: '#F8F8F8',
    textAlign: 'left',
    width: '70%',
    fontSize: 10,
    fontFamily: regular,
  },
  vehicleSelection: {
    marginVertical: 2,
    width: '100%',
    alignSelf: 'center',
    padding: 10,
    justifyContent: 'space-between',
  },
  vehicleDropDown: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#707070',
  },
  container: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    height: 57,
    justifyContent: 'space-between',
    borderRadius: 10,
    margin: 5,
    backgroundColor: Colors.AppColor,
  },
  cartIcon: {
    color: '#FFFFFF',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: semiBold,
    color: '#FFFFFF',
    textAlign: 'center',
  },


  // FLatList Styling 

  item: {
    // backgroundColor: '#f9c2ff',
    // padding: 20,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#F3F4F4',
    borderRadius: 10,
    padding: 5,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F4',
  },
  subRow1: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 30,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F4',
    paddingBottom: 5,
  },
  title: {
    color: '#464951',
    fontFamily: semiBold,
    fontSize: 14,
    alignSelf: 'flex-start',
  },
  subTitle: {
    color: Colors.AppColor,
    fontFamily: semiBold,
    fontSize: 16,
  },
  car: {
    transform: [{ rotateY: '180deg' }],
    fontSize: 25,
    alignSelf: 'center',
    textAlign: 'left',
    width: 25,
    alignItems: 'center',
    color: '#464951',
  },
  star: {
    color: Colors.AppColor,
    fontSize: 15,
    alignSelf: 'center',
    paddingBottom: 5,
  },
  column1: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 10
    // minWidth: '50%',
    // backgroundColor:"red"
  },
  description: {
    color: '#979797',
    fontFamily: regular,
    fontSize: 8,
    width: 150,
  },
  buttons: {
    // backgroundColor:'red',
    width: '20%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  cartButttonsItem: {
    // width: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
  },
  countItem: {
    color: '#464951',
    fontFamily: regular,
    fontSize: 35,
    padding: 5,
    paddingBottom: 0,
    margin: 0,
    justifyContent: 'center',
    textAlign: 'center'
  },

  deleteCartIcon: {
    // backgroundColor: Colors.AppColor,
    backgroundColor: 'red',
    width: 23, height: 23,
    justifyContent: 'center', alignItems: 'center', borderRadius: 50,
    marginLeft: 10
  }

})