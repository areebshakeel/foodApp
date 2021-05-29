import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import OrderCard from './orderCard';
import Icon from 'react-native-vector-icons/AntDesign';
import Colors from '../../config/colors';
import axios from 'axios';
import { path } from '../../config/path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import Geolocation from '@react-native-community/geolocation';
import { Content } from 'native-base';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function OrderHistory({ navigation }) {

  const [orderHistory, setOrderHistory] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [latitude, setLongitude] = useState('')
  const [longitude, setLatitdue] = useState('')
  const [loader, setLoader] = useState(false)
  const [token, setToken] = useState('')

  useEffect(() => {
    (async () => {

      setLoader(true)
      let token = await AsyncStorage.getItem('Token')
      const TokenValue = JSON.parse(token)
      setToken(TokenValue)
      const form = new FormData()
      form.append('lat', 32271.2344)
      form.append('long', 232323.3232)
      // console.log(TokenValue);
      let history = axios.post(path.GET_ORDER_HISTORY_API, form, {
        headers: {
          'Authorization': 'Bearer ' + TokenValue,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      })
      history.then((resp) => {
        setOrderHistory(resp.data.data.list)
        console.log('My Order History today',orderHistory)
        setLoader(false)
      }).catch((e) => {
        console.log(JSON.stringify(e.message))
        setLoader(false)
      })
    })();
  }, []);
  onRefresh = async () => {
    setRefresh(true)
    let token = await AsyncStorage.getItem('Token')
    const TokenValue = JSON.parse(token)
    const form = new FormData()
    form.append('lat', 32271.2344)
    form.append('long', 232323.3232)

    let history = axios.post(path.GET_ORDER_HISTORY_API, form, {
      headers: {
        'Authorization': 'Bearer ' + TokenValue,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    })
    history.then((resp) => {
      setOrderHistory(resp.data.data.list)
    }).catch((e) => {
      console.log(JSON.stringify(e))
    })
    setRefresh(false)
  }
  return (
    <View style={{ backgroundColor: '#fff', padding: 10, flex: 1 }}>
      <SafeAreaView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <View onTouchEnd={() => navigation.goBack()} style={styles.arrow}>
            <Icon name="arrowleft" size={30} />
          </View>
          <View>
            <Text style={styles.headingText}>Order History</Text>
          </View>
          <View>
            <Text></Text>
          </View>
        </View>

        {loader &&
          <ActivityIndicator
            animating={loader}
            style={{ marginVertical: 50 }}
            size={Platform.OS === 'android' ? 50 : 'large'}
            color={Colors.AppColor}
          />
        }
        {console.log(JSON.stringify(orderHistory)) }
        <FlatList
          data={orderHistory}
          ListFooterComponent={() => {
            return <View style={{ marginBottom: 30 }}></View>
          }}
          ListEmptyComponent={
            () => {
              return <View style={{ justifyContent: 'center', paddingVertical: 100, display: loader ? 'none' : 'flex' }}>
                <Text style={{ fontFamily: semiBold, fontSize: 15, textAlign: 'center' }}>No previous orders found in your list! 😟</Text>
              </View>
            }
          }
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => onRefresh()}
            />}
          renderItem={((item) => (
            <View style={{ marginTop: 20 }}>
              <OrderCard navigation={navigation} data={item} token={token} />
              <View style={styles.line}></View>
            </View>
          ))}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  headingText: {
    color: Colors.AppColor,
    fontSize: 20,
    fontFamily: semiBold,
    // alignSelf:'center'
  },
  arrow: {
    alignSelf: 'flex-start',
  },
  line: {
    borderTopWidth: 2,
    borderColor: '#7F7E7F',
  },
});
