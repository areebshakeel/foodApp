import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../config/colors';
import deal from '../images/deal.png'
import Distance from './distance';
import Duration from './duration';
import CarImage from '../images/car.png'
import AsyncStorage from '@react-native-async-storage/async-storage';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const Item = ({ title, item }) => {
  const [cuurencySet, setCurrency] = useState('')
  useEffect(() => {
    (async () => {
      let data = await AsyncStorage.getItem('Currency')  
      let currency = JSON.parse(data)
      setCurrency(currency)
    })();
  }, []);
    return (
        <View style={styles.item}>
            <Image style={styles.image} source={{ uri:item.img }} />
            <View style={styles.row}>
                <Text style={styles.title}>{item.restaurant}</Text>
                <Text style={styles.title}>{cuurencySet+" "+Math.round(item.avgPrice)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.subTitle}>{item.restaurant}</Text>
                <Image source={item.isCurbPickup==="on"?CarImage:""  } resizeMode="contain" style={{width:28,height:10}} />
            </View>
            <View style={styles.row}>
                <View style={styles.subRow}>
                    <Icon name="star" style={styles.star} />
                    <Text style={styles.title}>{Math.round(item.rating)}</Text>
                </View>
                <View style={{ ...styles.subRow, width: 100, justifyContent: 'space-between' }}>
                    <Distance distance={Math.round( item.distance) +'m'} />
                    <Duration duration={Math.round( item.time) +'m'} />
                </View>
            </View>
        </View>
    )
}

const DealsList = ({ horizontal, numColumns, data }) => {
    // console.log('New Deals dataa-->> ', dealsData)
    let DATA = ""
    !data ? DATA = [
        {
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            title: 'First Item',
            img: "https://thumbor.forbes.com/thumbor/711x474/https://specials-images.forbesimg.com/dam/imageserve/a3efc4000e5c449a8bc413a2087a59c9/960x0.jpg?fit=scale",
            distance: "00m",
            time: "00min",
            rating: "0",
            avgPrice:'AED 00'
        },
        {
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            title: 'Second Item',
            img: "https://thumbor.forbes.com/thumbor/711x474/https://specials-images.forbesimg.com/dam/imageserve/a3efc4000e5c449a8bc413a2087a59c9/960x0.jpg?fit=scale",
            distance: "00m",
            time: "00min",
            rating: "0",
            avgPrice:'AED 00'
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            title: 'Third Item',
            img: "https://thumbor.forbes.com/thumbor/711x474/https://specials-images.forbesimg.com/dam/imageserve/a3efc4000e5c449a8bc413a2087a59c9/960x0.jpg?fit=scale",
            distance: "00m",
            time: "00min",
            rating: "0",
            avgPrice:'AED 00'

        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d74',
            title: 'Third Item',
            img: "https://thumbor.forbes.com/thumbor/711x474/https://specials-images.forbesimg.com/dam/imageserve/a3efc4000e5c449a8bc413a2087a59c9/960x0.jpg?fit=scale",
            distance: "00m",
            time: "00min",
            rating: "0",
            avgPrice:'AED 00'

        },
    ] : DATA = data


    const renderItem = ({ item }) => (
        <Item title={item.title} item={item} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                showsHorizontalScrollIndicator={false}
                data={DATA}
                numColumns={numColumns}
                horizontal={horizontal}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListEmptyComponent={()=>{return(<View>
                  <Text style={{textAlign:'center'}} >No Data</Text>
                  </View>)}}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    // padding: 20,
    height: Dimensions.get('window').height / 2.8,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#F3F4F4',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: '100%',
    height: '70%',
    marginBottom: 2,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 20,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F4',
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
    fontSize: 12,
    alignSelf: 'center',
  },
  subTitle: {
    color: '#979797',
    fontFamily: regular,
    fontSize: 8,
  },
  car: {
    transform: [{rotateY: '180deg'}],
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

export default DealsList;
