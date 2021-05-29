// import { Icon } from 'native-base';
import { Icon } from 'native-base';
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
  Dimensions,
  Pressable,
  ImageBackground,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import img1 from '../images/deal.png';
import img2 from '../images/img-2.png';
import img3 from '../images/img-3.png';
import img4 from '../images/img-4.png';
import car from '../images/car.png';
import Distance from './distance';
import Duration from './duration';
import Colors from '../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DiscountBadge from '../images/discount-badge.png'

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';



const Restaurants = ({ horizontal, numColumns, navigator, data, location }) => {
const [latLongState, setLatLongState] = useState('')
console.log('Lat Long state -->', latLongState );
  let DATA = '';

  DATA = data





  // const renderItem = ({ item, location }) =>  {
  //   console.log('Tabs Locations-->> ', location)
  //   return <Item title={item.name} navigator={navigator} item={item} />;
  // };


  const [cuurencySet, setCurrency] = useState('')
  useEffect(() => {
    (async () => {
      let data = await AsyncStorage.getItem('Currency')
      let currency = JSON.parse(data)
      setCurrency(currency)
      let latLong= await AsyncStorage.getItem('location')
      let latLongParsed = JSON.parse(latLong)
      setLatLongState(latLongParsed)
      // console.log('meraa Latii-->>', latLongState)
    })();
  }, []);
  function shortDesc(str) {
    let length_temp = 10;
    let temp_ret = str.length > length_temp ? (str.substring(0, length_temp) + "...") : (str);
    return temp_ret;
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style = {{
          // zIndex : 99
        }}
        showsHorizontalScrollIndicator={false}
        data={DATA}
        numColumns={2}
        horizontal={horizontal}
        ListFooterComponent={()=>{
         return  <View style={{marginTop:50}} >

          </View>
        }}
        renderItem={({ item }) => {
          return (
            <Pressable onPress={() => navigator.push('Menu',
            { restaurantId: item.restaurantId, })} style={styles.item}>
              <Image style={styles.image} source={{ uri: item.img }} />
              <ImageBackground source={DiscountBadge} style={{
                width: 70,
                height: 40,
                position: 'absolute',
                left: -7,
                alignItems: 'center',
                justifyContent: 'center'
              }} >
                <Text style={{ color: '#FFF', fontFamily: semiBold }}>50%</Text>
              </ImageBackground>
              <View style={styles.row}>
                <View style={{ flex: 0.7 }}>
                  <Text style={styles.title}>{shortDesc(item.name)}</Text>
                </View>
                <View style={{ flex: 0.4 }}>
                  <Text style={styles.title}>{cuurencySet?cuurencySet:"AED"}{" " + (item.avgPrice ? item.avgPrice:"0")}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <Text style={styles.subTitle}>{shortDesc(item.restaurant)}</Text>
                {item.isCurbPickup == "on" ? <Image source={car} style={{ height: 10, width: 28 }} /> : null}
              </View>
              <View style={styles.row}>
                <View style={styles.subRow}>
                  <Icon name="star" style={styles.star} />
                  <Text style={styles.title}>{Math.round(item.rating)}</Text>
                </View>
                <View
                  style={{
                    ...styles.subRow,
                    width: 100,
                    justifyContent: 'space-between',
                  }}>
                  <Distance distance={item.distance ? ((Math.round(item.distance >= 1000 ? (item.distance / 1000) : item.distance)) + (item.distance >= 1000 ? 'km' : 'm')) : '0m'} />
                  <View style={{ width: 2 }} />
                  <Duration duration={Math.round(item.time) + "m"} />
                </View>
              </View>
            </Pressable>
          )
        }}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => {
          return (
            <View style={{
              width: Dimensions.get('screen').width,
            }}>
              <Text style={{ fontFamily: semiBold, fontSize: 15, textAlign: 'center', marginTop : 20 }}>No restaurants found! 😟</Text>
            </View>
          )
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    // width: '95%',
    // alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#FFFFF',
    // padding: 20,
    // width:"40%",
    marginVertical: 5,
    marginHorizontal: 2.5,
    backgroundColor: '#F3F4F4',
    borderRadius: 10,
    // borderBottomRightRadius: 10,
  },
  image: {
    width: Dimensions.get('window').width / 2.2,
    height: 113,
    borderRadius: 10,
  },
  row: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 155,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F4',
    marginTop: 4,
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 30,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F4',
    paddingBottom: 5,
    marginTop: 4,
  },
  title: {
    color: '#464951',
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


});

export default Restaurants;
