import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
// import PaymentLogo from '../../assets/paymentConfirm.png'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { set } from 'react-native-reanimated';
import IonIcon from 'react-native-vector-icons/Zocial';
import PhoneImage from '../images/phone-call.png'
import Colors from '../config/colors';
import PaymentLogo from '../images/paymentConfirm.png';
import { Container, Content } from 'native-base';
const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function OrderReady({ navigation, route }) {
  const [orderId, setOrderid] = useState(route.params.orderId)
  const [token, setToken] = useState(route.params.token)
  const [orderNo, setOrderNo] = useState(route.params.orderNo)

  return (
    <Container style={styles.container}>
      <Content>
        <View onTouchEnd={() => navigation.goBack()} style={styles.arrow}>
          <MaterialIcon
            Button
            name="arrow-back"
            size={30}

          />
        </View>
        <View style={{ alignSelf: "center" }} >
          <Text style={styles.logoText}>Payment confirmed</Text>
        </View>
        <View style={{ alignSelf: "center" }}>
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
              #004333
          </Text>{' '}
          has been placed
        </Text>
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#3D3D3D',
            textAlign: 'center',
            marginTop: 10,
            width: '80%',
            alignSelf: 'center'
          }}>
          Your order will be ready in{' '}
          <Text
            style={{
              color: Colors.AppColor,
              fontSize: 30,
              fontWeight: 'bold',
            }}>
            5 Mins...
          </Text>
        </Text>
        <Text style={styles.waitText}>
          We have sent a notification to your resturant. Lets Wait 5 more
          minutes to compelete or call the resturant
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Dispute', { orderId: orderId, token: token, orderNo:orderNo })}
          style={styles.contact}>
          <Image source={PhoneImage} resizeMode="contain" />
          <Text style={styles.contactText}>+71123 568 7980</Text>
        </TouchableOpacity>
      </Content>
    </Container>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    lineHeight: 300,
    flexDirection: 'column',
    padding: 10
  },
  arrow: {
    alignSelf: 'flex-start'
  },
  logoText: {
    color: Colors.AppColor,
    fontSize: 30,
    fontWeight: 'bold',
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
    // alignItems: 'center',
    alignSelf: "center",
    marginTop: 20,
  },
  reach: {
    backgroundColor: '#989898',
    width: 330,
    padding: 15,
    borderRadius: 10,
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
    alignSelf: "center",
    color: '#3D3D3D',
    width: 310,
    marginTop: 20,
    fontWeight: 'bold',
  },
  contact: {
    // flex:0.1,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
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