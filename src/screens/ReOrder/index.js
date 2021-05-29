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
import AddressBar from '../../Components/addressBar';
import SearchBar from '../../Components/searchbar';
import Offers from '../../Components/offers';
import {
  Container,
  Content,
  Switch,
  Icon,
  Picker,
  Toast
} from 'native-base';
import RNPickerSelect from 'react-native-picker-select';
import CustomHeader from '../../Components/Header';
import Restaurants from '../../Components/restaurantsList';
import Orders from '../../Components/Orders';
import creditCard from '../../images/creditCard.png';
import promo from '../../images/promo.png';
import map from '../../images/map.png';
import loyalty from '../../images/Loyality.png';
import Discount from '../../images/discount.png';
import AddIcon from '../../Components/AddIcon';
import Colors from '../../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../Components/Button/index'
import IconDown from 'react-native-vector-icons/AntDesign';
import Geolocation from '@react-native-community/geolocation';

// import {
//   initiateCardPayment,
//   initiateSamsungPay,
//   initiateApplePay,
// } from '@network-international/react-native-ngenius';
import axios from 'axios';
import { path } from '../../config/path';
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

class ReOrderScreen extends Component {
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
      discountValue: 0

    }
    // this.props.navigation.addListener = this.props.navigation.addListener.bind(this)
  }

  async componentDidMount() {
    Geolocation.getCurrentPosition((resp) => {
        console.log('My reorder Cart->> ',this.props.route.params);
        this.setState({cart:this.props.route.params.cartItems})
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
        //this.getVehicle()
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

 
  updateCart = (cart) => {
    AsyncStorage.removeItem('Cart').then(() => {
      AsyncStorage.setItem('Cart', JSON.stringify(cart)).then(() => {
        console.log('Cart Updated => ', this.state.cart);
      })
    })
  }

 



  render() {
  

    let total = 0
    let percent = this.state.discountType
    let discount = this.state.discountValue
    let subTotal = 0
    let exclVAT = 0
    let tax= 0
    let grandTotal =0
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
              <CustomHeader heading="Order History Details" />
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
                          
                          <View style={{ width: 70 }}>
                            <Text key={this.state.abcd} style={styles.countItem}>{item.count}</Text>
                          </View>
                         
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
              
              <Text style={{display:"none"}} >{subTotal=total}</Text>
            
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
              <Text style={{display:'none'}} > {exclVAT = (((subTotal - discount) * 100) / 105).toFixed(2)}</Text>
              <Text style={{ ...styles.paymentText, fontFamily: semiBold }}>
                AED {(((subTotal - discount) * 100) / 105).toFixed(2)}
              </Text>
            </View>
            <View style={styles.paymentMathod}>
              <Text style={{ ...styles.paymentText, fontFamily: semiBold }}>
                TAX (5% VAT)
              </Text>
              <Text style={{display:"none"}} >{tax=((subTotal - discount) - exclVAT).toFixed(2)}</Text>
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
              <Text style={{display:"none"}} >{grandTotal=parseFloat (tax)+parseFloat(exclVAT)}</Text>
              <Text
                style={{
                  ...styles.paymentText,
                  fontFamily: semiBold,
                  fontSize: 24,
                }}>
              
                AED {parseFloat (tax)+parseFloat(exclVAT)}
              </Text>
            </View>
            {console.log(this.state.placeName)}
            
           
            
          
            <ActivityIndicator
              animating={this.state.loader}
              style={{ position: 'absolute', alignSelf: 'center', marginTop: '150%' }}
              size={Platform.OS === 'android' ? 60 : 'large'}
              color={Colors.AppColor}
            />
            
          </View>
        </Content>
      </Container >
    )
  }
}


export default ReOrderScreen
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

})