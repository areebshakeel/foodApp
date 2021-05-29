import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Platform, SafeAreaView, FlatList, ScrollView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import WalletImage from '../../images/active-order.png';
import OrderItem from './orderItem';
import Button from '../../Components/Button/index';
import DownArrow from 'react-native-vector-icons/Entypo';
import Colors from '../../config/colors';
import axios from 'axios';
import { path } from '../../config/path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'native-base';


const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function ActiveOrder({ navigation, route, props }) {
  const [flag, setFlag] = useState(true);
  const [TokenValue, setTokenState] = useState('')
  const [activeOrders, setActiveOrders] = useState([])
  const [flagHandling, setFlagHandling] = useState()
  const [loader, setLoader] = useState(false)
  const [orderStatus, setOrderStatus] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [orderItemId, setOrderItemId] = useState()
  const [orderItemOrderNumber, setOrderItemOrderNumber] = useState()


  function flagFalse(id) {
    if (flagHandling == id) {
      setFlagHandling(0)

      setFlag(true)
    } else {
      setFlagHandling(id)
      orderStatus == "Order Placed" ?
        setFlag(true) : setFlag(false)

    }
  }

  useEffect(() => {
    getAllOrders()
    console.log('My Active-->> ', activeOrders);
  }, []);

  const onRefresh = () => {
    getAllOrders()
  }
  function ReachedDestination(id) {
    console.log('Id-->> ', id, TokenValue);
    navigation.replace('ReachedDestination', { orderId: id, token: TokenValue })
  }

  async function getAllOrders() {
    setLoader(true)
    let data = await AsyncStorage.getItem('Token')
    let token = JSON.parse(data)

    let location = await AsyncStorage.getItem('location')
    let coordinates = JSON.parse(location)

    setTokenState(token)
    let form = new FormData()
    form.append('long', coordinates.longitude)
    form.append('lat', coordinates.latitude)
    await axios.post(path.getActiveOrders, form, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      setLoader(false)
      // resp.data.data.list.length == 0 ? setLoader(false) : setLoader(true)
      let activeList = resp.data.data.list
      console.log("activeList", activeList);
      let tempOrderStatus = activeList[0].orderStatus
      setOrderStatus(tempOrderStatus)
      console.log('My datas-->> ', tempOrderStatus);
      setActiveOrders(activeList)
    }).catch((e) => {
      setLoader(false)
      console.log(JSON.stringify(e.response.data));
    })

  }
  // Cancel Order Work 2
  async function orderCancel() {
    Alert.alert(
      "Cancel Order",
      "Are you sure?",
      [
        {
          text: "No",
          onPress: () => {return},
          style: "cancel"
        },
        { text: "Yes", onPress: () => {orderCancel2()} }
      ],
      { cancelable: false }
    )
  }

  async function orderCancel2() {
    
    setLoader(true)
    console.log("orderItemId", orderItemId)
    console.log("orderItemOrderNumber", orderItemOrderNumber)
    let data = await AsyncStorage.getItem('Token')
    let token = JSON.parse(data)
    // return
    let form = new FormData()
    form.append('oid', orderItemId)
    form.append('orderNo', orderItemOrderNumber)
    form.append('status', 'Canceled')
    await axios.post(path.changeOrderStatus, form, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      console.log('Order Canceled ', resp.data);
      setLoader(false)

      if (resp.data.data.status == 200) {
        Toast.show({
          text: resp.data.data.Message,
          type: 'success',
          position: 'top',
          style: {
            marginTop: 40
          },
        })
        navigation.replace('Home')
      }
    }).catch((e) => {
      setLoader(false)

      console.log('Erro in Order Received JS', JSON.stringify(e));
    })
  }

  function shortDesc(str) {
    let length_temp = 40;
    let temp_ret = str.length > length_temp ? (str.substring(0, length_temp) + "...") : (str);
    return temp_ret;
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView>
        <ScrollView refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => onRefresh()}
          />} style={{ backgroundColor: '#FFFF' }}>
          <View style={styles.container}>
            <View onTouchEnd={() => navigation.replace('Home')} style={styles.arrow}>
              <Icon name="arrowleft" size={30} />
            </View>
            <View style={{ alignSelf: 'center' }}>
              <Text style={styles.headingText}>Active Orders</Text>
            </View>
            <View style={styles.imagContainer}>
              <Image resizeMode="contain" source={WalletImage} />
            </View>
            <View style={{ marginTop: 20 }}>
              <ActivityIndicator
                animating={loader}
                style={{ position: 'absolute', alignSelf: 'center', zIndex: 50 }}
                size={Platform.OS === 'android' ? 50 : 'large'}
                color={Colors.AppColor}
              />
              {console.log("My Actoive", activeOrders.length)}
              {activeOrders.length == 0 ? <View key={activeOrders} style={{ display: loader ? 'none' : 'flex' }}>
                <Text style={{ fontFamily: semiBold, textAlign: 'center', fontSize: 17 }}>No Active Orders</Text>
              </View> :
                null
              }

              <FlatList
                data={activeOrders}

                // ListEmptyComponent={() => {
                //   return <View style = {{display : loader ? 'none' : 'flex'}}>
                //     <Text style = {{fontFamily : semiBold, textAlign : 'center', fontSize : 17}}>No Active Orders</Text>
                //   </View>
                // }}
                ItemSeparatorComponent={
                  () => {
                    return <View style={{ height: 10 }} />
                  }
                }
                renderItem={
                  ({ item }) => {
                    return (
                      <OrderItem
                        backgroundColor={flagHandling !== item.orderId ? '#F9F9F9' : Colors.AppColor}
                        textColor={flagHandling !== item.orderId ? '#464951' : '#FFFF'}
                        time={item.TimeRemaining ? `${item.TimeRemaining} minutes` : "20 minutes"}
                        flagFalse={() => flagFalse(item.orderId)}
                        itemName={`${item.restaurant}`}
                        orderImage={item.img}
                        location={shortDesc(item.address)}

                        orderItemId={item.orderId}
                        setOrderItemId={setOrderItemId}
                        orderItemOrderNumber={item.orderNo}
                        setOrderItemOrderNumber={setOrderItemOrderNumber}
                      />
                    )
                  }
                }
              />
              {!flag ? (
                <View style={{ alignSelf: 'center' }}>
                  <DownArrow color="#464951" name="chevron-small-down" size={30} />
                </View>
              ) : (
                <Text></Text>
              )}
            </View>
            <View style={{ marginTop: 50 }}>
              {flag ? (
                // <View>
                <Button
                  disabled
                  backgroundColor="#C6E2F9"
                  color="#FFFF"
                  title="Reached Destination"
                />
                // </View>
              ) : (
                <View>
                  <View>
                    <Button
                      onPress={() => ReachedDestination(flagHandling)}
                      backgroundColor={Colors.AppColor}
                      color="#FFFF"
                      title="Reached Destination"
                    />
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <Button
                      backgroundColor={Colors.AppColor}
                      color="#FFFF"
                      title="Cancel Order"
                      onPress={() => { orderCancel() }}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#FFFF',
  },
  headingText: {
    color: Colors.AppColor,
    fontSize: 20,
    fontFamily: semiBold,
  },
  imagContainer: {
    marginTop: 20,
    alignSelf: 'center',
    borderBottomWidth: 2,
    borderColor: '#F8F8F8',
  },
  orderContainer: {},
  arrow: {
    // marginTop: 40,
  },
});



