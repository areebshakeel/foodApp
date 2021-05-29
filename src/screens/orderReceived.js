import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import PaymentLogo from '../images/paymentConfirm.png';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { set } from 'react-native-reanimated';
import IonIcon from 'react-native-vector-icons/Zocial';
import Colors from '../config/colors';
import { Container, Toast } from 'native-base';
import OrderReady from './orderReady';
import OrderCompleteView from './orderComplete';
import { path } from '../config/path';
import axios from 'axios';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function OrderReceived({ navigation, route }) {
  const [orderId, setOrderId] = useState(route.params.orderId)
  const [token, setToken] = useState(route.params.token)
  const [orderNo, setOrderNo] = useState(route.params.orderNo)
  console.log('My Order No', orderNo);
  const orderComplete = async () => {
    let form = new FormData()
    form.append('oid', orderId)
    form.append('orderNo', orderNo)
    form.append('status', 'Order received')
    await axios.post(path.changeOrderStatus, form, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((resp) => {
      console.log('Order Compleetd', resp.data);

      if (resp.data.data.status == 200) {
        Toast.show({
          text: "Great! Enjoy your meal!'",
          type: 'success',
          position: 'top',
          style: {
            marginTop: 40
          },
        })
        navigation.replace('OrderComplete')
      }
    }).catch((e) => {
      console.log('Erro in Order Received JS', JSON.stringify(e));
    })
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#FFF' }} >
      <ScrollView >
        <Container style={styles.container}>
          <View onTouchEnd={() => navigation.goBack()} style={styles.arrow}>
            <MaterialIcon
              Button
              name="arrow-back"
              size={30}

            />
          </View>
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
                width: 200,
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
                #{route.params.orderNo}
              </Text>{' '}
          has been placed
        </Text>
          </View>

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
              }}>
              {route.params.prepTime} Min...
        </Text>
          </Text>
          <Text
            style={{
              color: Colors.AppColor,
              fontSize: 20,
              fontFamily: semiBold,
              textAlign: 'center',
              marginTop: 35,
            }}>
            Order received?
      </Text>
          <View style={styles.yesNoContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('OrderReady', {
                token: token,
                orderId: orderId,
                orderNo: orderNo
              })}
              style={styles.noButton}>
              <Text style={{ color: '#464951', fontFamily: semiBold }}>NO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.yesButton}
              onPress={() => orderComplete()}>
              <Text style={{ color: 'white', fontFamily: semiBold }}>Yes</Text>
            </TouchableOpacity>
          </View>

        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    lineHeight: 300,
    flexDirection: 'column',
    backgroundColor: '#FFFF',
    // padding:10,

  },
  arrow: {
    alignSelf: "flex-start",
    padding: 5
  },
  logoText: {
    color: Colors.AppColor,
    fontSize: 30,
    fontFamily: semiBold,
    marginTop: 8,
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
    width: 330,
    padding: 15,
    borderRadius: 10,
  },
  noButton: {
    width: '45%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#464951',
    // padding: 18,
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yesButton: {
    width: '45%',
    borderColor: '#464951',
    backgroundColor: Colors.AppColor,
    // padding: 18,
    paddingVertical: 0,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yesNoContainer: {
    // flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '95%',
    marginTop:10
    // marginVertical: 20,
    // marginBottom:10
  },
  waitText: {
    textAlign: 'center',
    color: '#3D3D3D',
    width: 310,
    marginTop: 20,
    fontFamily: semiBold,
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
    fontFamily: semiBold,
  },
  disputeText: {
    fontSize: 20,
    fontFamily: semiBold,
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
