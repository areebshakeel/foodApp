// import { Icon } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'native-base';
import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import Colors from '../config/colors';
import deal from '../images/deal.png';
import { cartActionTypes } from '../redux/cart/cartActionTypes';
import AddIcon from './AddIcon';
import CartButtons from './CartButtons';
import Distance from './distance';
import Duration from './duration';
import CartReducer from '../redux/cart/cartReducer'
import { incrementCounter } from '../redux/cart/cartActions'
import { dispatch } from 'redux-thunk'


const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    count: 1,
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
    count: 2,
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
    count: 1,
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d74',
    title: 'Third Item',
    count: 1,
  },
];

const Item = ({ title, navigator, isCart, count, image, description, price, itemId, currency, reduxData, increment, decrement, specialPrice }) => {
  // console.log('Increment Item--> ', increment)       
  const [counter, setCounter] = useState(count)
  // console.log('My redux-->> ', reduxData)
  function increaseCounter() {
    setCounter(counter + 1)
    console.log('Props Increment->>', increment)
  }
  function decreaseCounter() {
    setCounter(counter - 1)
    // decrement()

  }
  return (
    <View style={styles.item}>
      {isCart ? (
        <View style={styles.row}>
          <View
            style={{
              height: 50,
              width: 50,
              borderRadius: 7,
              overflow: 'hidden',
            }}>
            <Image style={styles.image} source={{ uri: image }} />
          </View>
          <View style={styles.column}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subTitle}>{currency} {price}</Text>
          </View>
          {/* <View style={styles.buttons}> */}
          {/* <CartButtons
            decrement={() => console.log('')}
            increment={() => console.log('')}
            count={count}
          /> */}
          <View style={styles.cartButttonsItem}>
            <AddIcon
              isDetails={true}
              navigator={() => decreaseCounter()}
              icon="minus"
              backgroundColor="primary"
            />
            <Text style={styles.countItem}>{count < 0 ? 0 : counter}</Text>
            <AddIcon
              isDetails={true}
              navigator={() => { increaseCounter(), reduxData(counter) }}
              icon="plus"
              backgroundColor="primary"
            />
          </View>
        </View>
        // </View>
      ) : (
        <TouchableOpacity activeOpacity={9} style={styles.row} onPress={() => navigator(itemId)}>
          <View
            style={{
              height: 50,
              width: 50,
              borderRadius: 7,
              overflow: 'hidden',
            }}>
            <Image style={styles.image} source={{ uri: image }} />
          </View>
          <View style={styles.column}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>
              {description}
            </Text>
            {
              specialPrice == price || specialPrice == 0 ? 
              <>
              <Text style={styles.subTitle}> {currency} {price}</Text>
              </> : 
               <View style = {{flexDirection : 'row'}}>
               <View style = {{justifyContent : 'center'}}>
                 <Text style={{...styles.subTitle, textDecorationLine : 'line-through', color : 'grey', fontSize : 14}}> {currency} {price}</Text>
               </View>
               <View style = {{justifyContent : 'center'}}>
                 <Text style={styles.subTitle}> {currency} {specialPrice}</Text>
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
      )}
    </View>
  )
}

const Orders = ({ horizontal, numColumns, navigator, isCart, data, updateCount, increment, decrement }) => {
  console.log('data-->> ', data[0])

  // console.log('My increment --> ', increment)
  // updateCount(data)




  const renderItem = ({ item, increment, decrement }) => {
    console.log('Increment in Render-->> ', item)
    return (
      <Item
        increment={increment}
        decrement={decrement}
        title={item.itemTitle ? item.itemTitle : item.title}
        navigator={navigator}
        isCart={isCart}
        count={item.count}
        image={item.img}
        description={item.description}
        currency={"AED"}
        reduxData={updateCount}
        price={item.price}
        itemId={item.itemId}
        specialPrice={item.specialPrice}
      />
    )
  }


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={data}
        increment={increment}
        decrement={decrement}
        numColumns={1}
        horizontal={false}
        renderItem={renderItem}
        ListEmptyComponent={() => {
          return (
            <View style={{
              paddingVertical: 20,
              // width : Dimensions.get('screen').width,
            }}>
              <Text style={{ fontFamily: semiBold, fontSize: 15, textAlign: 'center' }}>Items not available.</Text>
            </View>
          )
        }}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  const counter = state.cartReducer
  console.log('cart Reducer-->> ', counter)
  return { counter }
}


const mapDispatchProps = (dispatch) => {

  return {
    updateCount: (counter) => (dispatch)(incrementCounter(counter))
  }

}

export default connect(mapStateToProps, mapDispatchProps)(Orders)

const styles = StyleSheet.create({
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
  image: {
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
    fontSize: 8,
    paddingVertical: 5
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


