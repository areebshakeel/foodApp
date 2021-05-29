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
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  FlatList
} from 'react-native';
import {
  Container,
  Content,
  Icon,
} from 'native-base';
import deal from '../images/banner-img.png';
import RestaurantDetails from '../Components/RestaurantDetails';
import OrdersTabs from '../Components/OrdersTabs';
import { path } from '../config/path';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../config/colors';
import Geolocation from '@react-native-community/geolocation'
import AddIcon from '../Components/AddIcon';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: 'Daniel',
      lang: 'en',
      restaurantId: '',
      token: '',
      MenuHeaders: [],
      Restaurant: [],
      refresh: false,
      loader: false,
      favorite: '',
      region: {
        latitude: '0',
        longitude: '0',
      },
    };
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
    console.log(viewableItems[0].index);
    this.flatlist.scrollToIndex({ animated: true, index: viewableItems[0].index });
    this.setState({ selected: viewableItems[0].index })
  };
  navigator = (itemId) => {
    this.props.navigation.push('ItemDetails', { itemId: itemId });
  }

  async componentDidMount() {
    try {
      let token = await AsyncStorage.getItem('Token')
      const TokenValue = JSON.parse(token);
      this.setState({ token: TokenValue, loader: true })

      const { restaurantId } = this.props.route.params
      this.setState({ restaurantId: restaurantId })

      this.getPosition().then(() => {
        this.getData()
      })

    } catch (error) {
      alert(error)
    }
  }

  getPosition = async () => {
    let location = await AsyncStorage.getItem('location')
    let formattedLocation = JSON.parse(location)

    if (formattedLocation) {
      this.setState({ region: formattedLocation })
    } else {
      Geolocation.getCurrentPosition((position) => {
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        this.setState({ region: region })
      })
    }
  }

  getData = async () => {
    const formData = new FormData()
    formData.append("restaurantId", this.state.restaurantId)
    formData.append("lat", this.state.region.latitude)
    formData.append("long", this.state.region.longitude)
    console.log('My data-->> ', formData)
    await axios.post(this.state.token ? path.MENU_AUTHENTICATED_API : path.MENU_API, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      let response = resp.data.data
      let { MenuHeaders, Restaurant, isfavorite } = response
      this.setState({ MenuHeaders: MenuHeaders, Restaurant: Restaurant, loader: false, favorite: Restaurant[0].isfavorite })
    }).catch((e) => {
      console.log('Error in Menu API -->> ', e.response.data.data);
      this.setState({ loader: false })
    })
  }


  onRefresh = () => {
    const formData = new FormData()
    formData.append("restaurantId", this.state.restaurantId)
    formData.append("lat", this.state.region.latitude)
    formData.append("long", this.state.region.longitude)
    axios.post(this.state.token ? path.MENU_AUTHENTICATED_API : path.MENU_API, formData, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      let response = resp.data.data
      let { MenuHeaders, Restaurant } = response
      // console.log("MenuHeaders ", MenuHeaders);
      this.setState({ MenuHeaders: MenuHeaders, Restaurant: Restaurant })
    }).catch((e) => {
      console.log('Error in Menu API -->> ', e.response.data.data);
    });
  }
  render() {
    return (
      <Container>
        <Content style={{ width: '100%', flex: 1, flexDirection: 'column' }} refreshControl={
          <RefreshControl
            refreshing={this.state.refresh}
            onRefresh={this.onRefresh}
          />
        }>
          <View>
            {this.state.Restaurant.map((item) => {
              return (
                <Image
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
            {this.state.Restaurant.map((item) => {
              console.log(this.state.Restaurant);
              return (
                <RestaurantDetails favorite={this.state.favorite} restaurantId={this.state.restaurantId} navigation={this.props.navigation} data={item} />
              )
            })}
            <View style={{ marginTop: 10 }}>
              <ScrollView>
              <OrdersTabs navigator={this.navigator} tabs={this.state.MenuHeaders} />
              </ScrollView>
              {/* <View style={{}}>
                <View style={{ height: 400 }}>
                  <View style={{ height: 50, width: '100%' }}>
                    <FlatList
                      ref={flatlist => this.flatlist = flatlist}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={this.state.MenuHeaders}
                      renderItem={({ item, index }) => {
                        return (
                          <TouchableOpacity onPress={async () => {
                            this.setState({ selected: index })
                            this.flatlist.scrollToIndex({ animated: true, index: index });
                            this.flatListRef.scrollToIndex({ animated: true, index: index });
                          }} style={{ paddingHorizontal: 30, paddingVertical: 15, borderBottomWidth: 5, borderBottomColor: this.state.selected == index ? Colors.AppColor : 'transparent', height: 50 }}>
                            <Text style={{ fontFamily: semiBold, color: this.state.selected == index ? 'black' : 'grey' }}>{item.name}</Text>
                          </TouchableOpacity>
                        )
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <FlatList
                      data={this.state.MenuHeaders}
                      nestedScrollEnabled={true}
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
                            <Text style={{
                              marginTop: 20,
                              marginBottom: 10,
                              fontSize: 21,
                              fontFamily: semiBold,
                              marginLeft: 15
                            }}>{item.name}</Text>
                            <FlatList
                              data={item.data}
                              ListEmptyComponent={() => {
                                return (
                                  <View>
                                    <Text style={{ fontFamily: semiBold, marginLeft: 20 }}>No Items</Text>
                                  </View>
                                )
                              }}
                              renderItem={({ item }) => {
                                console.log(item.img);
                                return (
                                  <TouchableOpacity activeOpacity={9} style={styles.row} onPress={() => this.props.navigation.push('ItemDetails', { itemId: item.id })}>
                                    <View
                                      style={{
                                        height: 50,
                                        width: 50,
                                        borderRadius: 7,
                                        overflow: 'hidden',
                                      }}>
                                      <Image style={styles.image2} source={{ uri: item.img }} />
                                    </View>
                                    <View style={styles.column}>
                                      <Text style={styles.title}>{item.name}</Text>
                                      <Text style={styles.description}>
                                        {item.description}
                                      </Text>
                                      {
                                        item.specialPrice == item.price || item.specialPrice == 0 ?
                                          <>
                                            <Text style={styles.subTitle}>AED {item.price}</Text>
                                          </> :
                                          <View style={{ flexDirection: 'row' }}>
                                            <View style={{ justifyContent: 'center' }}>
                                              <Text style={{ ...styles.subTitle, textDecorationLine: 'line-through', color: 'grey', fontSize: 14 }}>AED {item.price}</Text>
                                            </View>
                                            <View style={{ justifyContent: 'center' }}>
                                              <Text style={styles.subTitle}>AED {item.specialPrice}</Text>
                                            </View>
                                          </View>
                                      }
                                    </View>
                                    <View>
                                      <AddIcon
                                        isDetails
                                        // navigator={() => navigator(itemId)}
                                        icon={'plus'}
                                        backgroundColor={'primary'}
                                      />
                                    </View>
                                  </TouchableOpacity>
                                )
                              }}
                            />
                          </>
                        )
                      }}
                    />
                  </View>
                </View>
              </View> */}
            </View>
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
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    // backgroundColor: '#f9c2ff',
    // padding: 20,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#F3F4F4',
    borderRadius: 10,
    padding: 5,
  },
  image2: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F4',
    padding: 10,
    marginVertical: 2.5,
    borderRadius: 8
  },
  subRow: {
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
  column: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 10
    // minWidth: '50%',
    // backgroundColor:"red"
  },
  description: {
    color: '#979797',
    fontFamily: regular,
    fontSize: 10,
    paddingVertical: 2.5
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
    margin: 0
  },
});

export default Menu;
