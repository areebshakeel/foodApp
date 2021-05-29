import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
  RefreshControl
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Zocial';
import Colors from '../config/colors';
import Button from '../Components/Button/index'
import PaymentLogo from '../images/paymentConfirm.png';
import { Container, Content } from 'native-base';
import axios from 'axios';
import { path } from '../config/path';
import AsyncStorage from '@react-native-async-storage/async-storage';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function ReachDestination({ navigation, route }) {
  const [orderId, setOrderId] = useState(0)
  const [TokenValue, setTokenValue] = useState(route.params.token)
  const [orderNumber, setOrderNumber] = useState(0)
  const [preparationTime, setPreprationTime] = useState('')
  const [orderStatus, setOrderStatus ] = useState('')
const [refresh, setRefresh] = useState(false)
  useEffect(() => {
    console.log('order ', route.params)
    let TokenValue = route.params.token
    async function orderDetails() {
      let form = new FormData()
      form.append('oid', route.params.orderId)
      await axios.post(path.ORDER_DETAILS, form, {
        headers: {
          'Authorization': 'Bearer ' + TokenValue,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }).then((res) => {
        console.log('Order Details Response-->> ', res.data.data.list)
        let { list } = res.data.data
        let status =list.order[0].status
        setOrderStatus(status)
        console.log('Order Changed-->> ', orderStatus)
        let order = list.order[0].orderNo
        let preTime = list.order[0].preparationTime
        setOrderNumber(list.order[0].orderNo)
        setPreprationTime(preTime)
      }).catch((e) => {
        console.log('Order Detail Error->> ', e)
      })
    }
    orderDetails()
    navigation.addListener('focus', async () => {
      
       orderDetails()
     
    })

  })
  const onRefresh = ()=>{
    
    async function orderDetails() {
      let form = new FormData()
      form.append('oid', route.params.orderId)
      await axios.post(path.ORDER_DETAILS, form, {
        headers: {
          'Authorization': 'Bearer ' +TokenValue ,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
      }).then((res) => {
        console.log('Order Details Response-->> ', res.data.data.list)
        let { list } = res.data.data
        let status =list.order[0].status
        setOrderStatus(status)
        console.log('Order Changed-->> ', orderStatus)
        let order = list.order[0].orderNo
        let preTime = list.order[0].preparationTime
        setOrderNumber(list.order[0].orderNo)
        setPreprationTime(preTime)
      }).catch((e) => {
        console.log('Order Detail Error->> ', e)
      })
    }
    orderDetails()
  }
  return (
    <SafeAreaView style={{  backgroundColor: '#FFFF', flex: 1 }} >
      <ScrollView refreshControl={ <RefreshControl
                    refreshing={refresh}
                    onRefresh={()=>onRefresh()}
                  />} >
        <Container styles={styles.container} >
          <TouchableOpacity onPress={() => navigation.replace('Home')} style={styles.arrow}>
            <MaterialIcon
              Button
              name="arrow-back"
              size={30}

            />
          </TouchableOpacity>
          <Text style={styles.logoText}>Payment confirmed</Text>
          <View>
            <Image
              resizeMode="contain"
              source={PaymentLogo}
              style={{ width: 250, height: 230, marginTop: 8 }}
            />
          </View>
          <View style={styles.orderText}>
            <Text
              style={{
                fontSize: 18,
                color: '#3D3D3D',
                width: '50%',
                textAlign: 'center',
                fontFamily: semiBold,
              }}>
              Your order{' '}
              <Text
                style={{
                  color: Colors.AppColor,
                  fontStyle: 'italic',
                  fontFamily: semiBold,
                  textDecorationLine: 'underline',
                }}>
                #{orderNumber}
              </Text>{'  '}
          has been placed
        </Text>
          </View>
          {
            orderStatus=="Order Placed"?<View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: semiBold,
                color: '#3D3D3D',
                textAlign: 'center',
                marginTop: 10,
                width: 250,
              }}>
              Waiting for Restaurant to Accept your order
             
            </Text>
          </View>:
            <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: semiBold,
                color: '#3D3D3D',
                textAlign: 'center',
                marginTop: 10,
                width: 250,
              }}>
              Your order will be ready in{' '}
              <Text
                style={{
                  color: Colors.AppColor,
                  fontSize: 30,
                  fontFamily: semiBold,
                  textAlign: 'center',
                }}>
                {!preparationTime ? 20 : preparationTime} mins...

        </Text>
            </Text>
          </View> 
          
          }
          
          <View style={{ marginTop: 20, alignSelf:'center', width:'90%',}} >
            {orderStatus=="Order Placed" ? <Button disabled title="Reached Destination" backgroundColor= "#989898" color="#FFFF" /> :
              <Button  onPress={() => navigation.push( 'OrderReceived', {orderNo : orderNumber, 
                prepTime : !preparationTime ? 20 : preparationTime,
                orderId:route.params.orderId,token:route.params.token
                })} title="Reached Destination" backgroundColor= {Colors.AppColor} color="#FFFF" />
              } 
            
          </View>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    lineHeight: 300,
    flexDirection: 'column',
  },
  arrow: {
    marginTop: 10
  },
  logoText: {
    color: Colors.AppColor,
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
    marginTop: 20
  },
  imageContainer: {
    borderWidth: 2,
    borderStyle: 'solid',

    borderColor: 'blue',
    height: '100%',
    width: '100%',
  },
  orderText: {
    alignItems: 'center',
    marginTop: 20,
  },
  reach: {
    backgroundColor: '#989898',
    // width: 330,
    paddingVertical: 20,
    // paddingHorizontal:120,
    width: '95%',
    borderRadius: 10,
    marginTop: 20,
  },
  noButton: {
    width: 180,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#464951',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  yesButton: {
    width: 180,
    borderColor: '#464951',
    backgroundColor: Colors.AppColor,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  yesNoContainer: {
    // flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 400,
    marginTop: 20,
  },
  waitText: {
    textAlign: 'center',
    color: '#3D3D3D',
    width: 310,
    marginTop: 20,
    fontWeight: 'bold',
  },
  contact: {
    // flex:0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
    marginTop: 25,
  },
  contactText: {
    color: Colors.AppColor,
    fontSize: 30,
    fontWeight: 'bold',
  },
  disputeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D3D3D',
    textAlign: 'center',
    marginTop: 10,
  },
  disputeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 350,
  },

  disputeButton: {
    width: 170,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#464951',
    borderRadius: 8,
    padding: 18,
  },
  waitButton: {
    width: 170,
    backgroundColor: Colors.AppColor,
    padding: 18,
    borderRadius: 8,
  },
  receiveButton: {
    width: 350,
    backgroundColor: Colors.AppColor,
    padding: 18,
    borderRadius: 8,
    marginTop: 10,
  },
});
