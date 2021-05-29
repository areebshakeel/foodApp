import React from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity, Alert } from 'react-native';
import MapImage from '../../images/map.png';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import StarIcon from 'react-native-vector-icons/FontAwesome';
import SmallButton from './smallButtons';
import axios from 'axios';
import { path } from '../../config/path';
import AsyncStorage from '@react-native-async-storage/async-storage';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function OrderCard(props) {

  const shortDesc = (str) => {
    length_temp = 12;
    let temp_ret = str.length > length_temp ? (str.substring(0, length_temp) + "...") : (str);
    return temp_ret;
  }
  const star = ['0', '1', '2', '3', '4']
  let imgUrl = (props.data.item.img).replace(' ', '')
  let reorder = props.data.item

  const viewReorder = async () => {
    console.log('REORDER -->> ', props.data.item);
    let form = new FormData()
    form.append('oid', props.data.item.oid)
    await axios.post(path.ORDER_DETAILS, form, {
      headers: {
        'Authorization': 'Bearer ' + props.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then(async (res) => {
      console.log('Res in View Details', res.data.data.list.orderItems);
      let cart = res.data.data.list.orderItems
      let val = cart.map((item) => {
        // console.log(item);
        return {
          price: item.currentPrice,
          id: item.itemId,
          count: item.quantity,
          img: item.img,
          title: item.itemTitle,
          restaurantId: item.restaurantId,
          restaurant: item.restaurant
        }
      })
      let cartItems = [...val]

      props.navigation.navigate('ReOrderScreen', { cartItems })
      console.log('Reorder View Old cart-->. ', cartItems)
    }).catch((e) => {
      console.log('Error in Reorder detail -->> ', e.response.data);
    })
  }

  const reorderItem = async () => {
    console.log('REORDER -->> ', props.data.item);
    let form = new FormData()
    form.append('oid', props.data.item.oid)
    await axios.post(path.ORDER_DETAILS, form, {
      headers: {
        'Authorization': 'Bearer ' + props.token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then(async (res) => {
      console.log('Res in ReOrder Details', res.data.data.list.orderItems);
      let cart = res.data.data.list.orderItems
      let val = cart.map((item) => {
        // console.log(item);
        return {
          price: item.currentPrice,
          id: item.itemId,
          count: item.quantity,
          img: item.img,
          title: item.itemTitle,
          restaurantId: item.restaurantId,
          restaurant: item.restaurant
        }
      })
      let cartItems = [...val]
      // console.log('Cart ITemssss',cartItems);
      let addToCart = () => {
        AsyncStorage.setItem('Cart', JSON.stringify(cartItems)).then(() => {
          props.navigation.navigate('CartTab')
        }).catch((e) => {
          console.log(e);
        })
      }
      let oldCart = await AsyncStorage.getItem('Cart')
      let parsedOldCart = JSON.parse(oldCart)
      parsedOldCart ? Alert.alert(
        "You have already selected the products form a different restaurant",
        "If you continue, your cart and selection will be removed, are you sure you want to continue ?",
        [
          {
            text: "Close",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Continue", onPress: () => addToCart() }
        ],
        { cancelable: false }
      ) : addToCart()
      console.log('Parsed Old cart-->. ', parsedOldCart)
    }).catch((e) => {
      console.log('Error in Reorder detail -->> ', e);
    })
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <View>
            <View style={{ height: 50, width: 50, }}>
              {
                imgUrl ? <Image source={{ uri: props.data.item.img }}
                  style={{ width: '100%', height: '100%', borderRadius: 10 }}
                /> :
                  <Image source={MapImage}
                    style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                  />
              }
            </View>
          </View>
          <View>
            <Text style={styles.itemText1}> {props.data.item.restaurant}</Text>
            <Text style={styles.itemText2}> AED {props.data.item.totalPayable}</Text>
          </View>
        </View>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <EntypoIcon color="#C6E2F9" name="location-pin" />
            <Text
              style={{
                color: '#7F7E7F',
                fontSize: 10,
                fontFamily: regular,
              }}>
              {' '}
              {shortDesc(props.data.item.address)}
            </Text>
          </View>

          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 5,
            }}>
            {star.map((item) => (
              <StarIcon name="star" size={15} color="#AEAEAE" />
            ))}
          </View>

          <View style={{
            alignItems: 'flex-end',
            justifyContent: 'flex-end'
          }}>
            <Text
              style={{
                color: '#7F7E7F',
                fontSize: 10,
                fontFamily: regular,
                alignItems: 'flex-end',
                justifyContent: 'flex-end'
              }}>
              {' '}
              {(props.data.item.orderStatus)}
            </Text>
          </View>
        </View>

      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '100%',
          marginTop: 10,
          marginBottom: 10,
        }}>
        <SmallButton
          navigation={props.navigation}
          route="Reviews"
          title="Reviews"
        />

        <TouchableOpacity onPress={() => reorderItem()} style={{
          backgroundColor: '#3097FF',
          paddingHorizontal: 20,
          paddingVertical: 5,
          borderRadius: 8,
        }}>
          <Text style={{
            color: '#FFFF',
            width: 60,
            textAlign: 'center',
            fontSize: 12
          }}>Reorder</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => viewReorder()} style={{
          backgroundColor: '#3097FF',
          paddingHorizontal: 20,
          paddingVertical: 5,
          borderRadius: 8,
        }}>
          <Text style={{
            color: '#FFFF',
            width: 60,
            textAlign: 'center',
            fontSize: 12
          }}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 4,

    // padding: 4,
    borderRadius: 8,
  },
  itemText1: {
    color: '#464951',
    fontFamily: semiBold,
    fontSize: 18,
  },
  itemText2: {
    color: '#464951',
    fontFamily: semiBold,
    fontSize: 14,
  },
  mainContainer: {
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    // padding:,
    borderRadius: 8,
  },
});
