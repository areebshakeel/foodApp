// import { Icon } from 'native-base';
import { Icon, Toast } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import deal from '../images/deal.png';
import car from '../images/car.png';
import Distance from './distance';
import Duration from './duration';
import Filter from './Filter';
import Colors from '../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { path } from '../config/path';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const RestaurantDetails = ({
  horizontal,
  numColumns,
  navigator,
  isItem,
  navigation,
  data,
  restaurantId,
  favorite
}) => {
  const [cuurencySet, setCurrency] = useState('')
  const [mark, setmark] = useState(favorite)
  const [loading, setLoading] = useState(false)
  // console.log('Favorite Resturant-->> ', favorite)

  useEffect(() => {
    (async () => {
      let data = await AsyncStorage.getItem('Currency')
      let currency = JSON.parse(data)
      setCurrency(currency)
      // console.log('Rest ID-->> ', restaurantId)
    })();
  }, []);

  async function markFav() {
    setLoading(true)
    try {
      let token = await AsyncStorage.getItem('Token')
      const TokenValue = JSON.parse(token)
      if (TokenValue) {
        const form = new FormData()
        form.append('restaurantId', restaurantId)
        await axios.post(path.MARK_FAV_API, form, {
          headers: {
            'Authorization': 'Bearer ' + TokenValue,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
          },
        }).then((res) => {
          setLoading(false)
          Toast.show({
            text: res.data.data.Message,
            type: 'success',
            position: 'top',
            style: {
              marginTop: 40
            }
          })
          // console.log('Favorite Marked ', res)
          setmark(true)
        }).catch((e) => {
          setLoading(false)
          Toast.show({
            text: e.response.data,
            type: 'danger',
            position: 'top',
            style: {
              marginTop: 40
            }
          })
          console.log('Error in Marking favorite -->>', e.response.data)
        })
      } else {
        Alert.alert(
          "Login Required",
          "Kindly log in to your account to view profile details",
          [
            {
              text: "No",
              onPress: () => console.log('Stay on the same Page'),
              style: "cancel"
            },
            { text: "Yes", onPress: () => navigation.navigate('Login') }
          ],
          { cancelable: false }
        )

      }
    } catch (error) {
      console.log(error)
    }
  }

  async function removeFav() {
    setLoading(true)
    try {
      let token = await AsyncStorage.getItem('Token')
      const TokenValue = JSON.parse(token);
      const form = new FormData()
      form.append('restaurantId', restaurantId)
      await axios.post(path.REMOVE_FAV_API, form, {
        headers: {
          'Authorization': 'Bearer ' + TokenValue,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }).then((res) => {
        setLoading(false)
        Toast.show({
          text: res.data.data.Message,
          type: 'success',
          position: 'top',
          style: {
            marginTop: 40
          }
        })
        // console.log('Favorite Removed ', res)
        setmark(false)
      }).catch((e) => {
        Toast.show({
          text: e.response.data,
          type: 'danger',
          position: 'top',
          style: {
            marginTop: 40
          }
        })
        setLoading(false)
        Alert.alert('Couldnt mark fav')
      })
    } catch (error) {
      console.log('Error in Removing favorite Details-->>', error)
    }
  }
  function shortDesc(str) {
    length_temp = 13;
    let temp_ret = str.length > length_temp ? (str.substring(0, length_temp) + "...") : (str);
    return temp_ret;
  }

  const buttonPress = () => {
    // !loading && mark ? () => removeFav() : () => markFav()
    if(!loading && mark) {
      removeFav()
    } else if (!loading && !mark) {
      markFav()
    }
  }
  return (
    <View
      onPress={() => navigation.navigate('ItemDetails')}
      style={styles.item}>
      {/* <Image style={styles.image} source={deal} /> */}
      <View style={styles.row}>
        {/* {console.log(data)} */}
        {isItem ? (
          <Text style={{ ...styles.heading }}>{shortDesc(data.itemTitle)}</Text>
        ) : (
          <View style={{ flex: 0.8 }} >
            <TouchableOpacity onPress={() => {
              navigation.push('RestaurantDetails', { restaurantId })
            }}>
              <Text style={styles.heading}>{shortDesc(data.name)}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>$$-Burger-Western</Text>
          </View>
        )}
        <View style={{ ...styles.subRow, paddingBottom: 10 }}>
          {/* <MaterialCommunityIcons style={styles.car} name="car-sports" /> */}
          {data.isCurbPickup == "on" ? <Image source={car} resizeMode="contain" /> : <Image resizeMode="contain" />}

          <Icon onPress={buttonPress} name={favorite == 0 || favorite == 1 ? "heart" : ""} style={styles.heart} style={mark ? { color: "red" } : { color: "grey" }} />
        </View>
      </View>
      <View style={styles.row}></View>
      <View style={styles.row}>
        {isItem ? (
          <View style={styles.subRow1}>
            {
              data.specialPrice == data.price || data.specialPrice == 0 ?
                <>
                  <Text style={{ ...styles.heading, fontSize: 20 }}>{cuurencySet ? cuurencySet : "AED "}{data.price}</Text>
                </> :
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={{ ...styles.heading, fontSize: 20, textDecorationLine: 'line-through', color: 'grey', fontSize: 14 }}> {cuurencySet ? cuurencySet : "AED "}{data.price}</Text>
                  </View>
                  <View style={{ justifyContent: 'center' }}>
                    <Text style={{ ...styles.heading, fontSize: 20, }}> {cuurencySet ? cuurencySet : "AED "}{data.specialPrice}</Text>
                  </View>
                </View>
            }
          </View>
        ) : (
          <View style={styles.subRow}>
            <Icon name="star" style={styles.star} />
            <Text style={styles.title}>{parseFloat(data.rating).toFixed(1)}</Text>
            <TouchableOpacity
              onPress={() => navigation.push('Reviews', { rid: restaurantId, })}
              style={styles.main}>
              <Text style={styles.text}>{data.reviewCounts} Ratings</Text>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{ ...styles.subRow, width: 100, justifyContent: 'flex-end' }}>

          {data == undefined ? null : <Duration duration={data.time ? Math.round(data.time) + "m" : '0m'} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flex: 1,
    marginTop: 30,
    marginVertical: 5,
    // marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  image: {
    width: 166,
    height: 113,
    borderRadius: 10,
  },

  row: {

    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 0,
    margin: 0,
  },
  subRow: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: 50,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingBottom: 5,
  },
  heading: {
    color: Colors.AppColor,
    fontFamily: semiBold,
    fontSize: 30,
    lineHeight: 40,
    // alignSelf: 'center',
  },
  title: {
    color: '#707070',
    fontFamily: semiBold,
    fontSize: 12,
    // alignSelf: 'center',
  },
  subTitle: {
    color: '#979797',
    fontFamily: regular,
    fontSize: 8,
  },
  car: {
    transform: [{ rotateY: '180deg' }],
    fontSize: 50,
    alignSelf: 'center',
    textAlign: 'left',
    // width: 25,
    alignItems: 'center',
    color: '#464951',
  },
  star: {
    color: Colors.AppColor,
    fontSize: 15,
    alignSelf: 'center',
    paddingBottom: 5,
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 5,
    height: 20,
    elevation: 1,
    minWidth: 100,
    margin: 3,
  },
  text: {
    color: '#464951',
    fontFamily: semiBold,
    fontSize: 11,
    alignSelf: 'center',
    textAlign: 'center',
  },
  heart: {
    fontSize: 40,
    color: '#DC471A',
    alignSelf: 'center',
  },
});

export default RestaurantDetails;
