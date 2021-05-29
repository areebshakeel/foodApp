import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
// import Logo from '../../assets/logo.png';
import PaymentLogo from '../images/paymentConfirm.png';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { set } from 'react-native-reanimated';
import IonIcon from 'react-native-vector-icons/Zocial';
import Colors from '../config/colors';
import { Container,Toast } from 'native-base';
import axios from 'axios';
import { path } from '../config/path';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function Dispute({navigation, route}) {
  const [orderId, setOrderid] = useState(route.params.orderId)
  const [token, setToken] = useState (route.params.token)
 
  const orderComplete = async ()=>{
    let form = new FormData()
    form.append('oid', orderId)
    form.append('status', 'Order received')
  await  axios.post(path.changeOrderStatus, form, {
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
      console.log('Erro in Order Received JS',JSON.stringify(e));
    })
  }
const addToDispute =async ()=>{
  let form = new FormData()
  form.append('oid', orderId)
  form.append('status', 'Dispute')

  await  axios.post(path.changeOrderStatus, form, {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
  }).then((res)=>{
    console.log('res in Dispute-->>', res.data.data)
    navigation.replace('Disputes')

  }).catch((e)=>{
    console.log('Error in Dispute -->> ', e.response.data);
  })
}
  return (
    <Container style={{ alignItems: 'center', justifyContent:'center', flex:1}}>
      <View>
      <Image
        resizeMode="contain"
        source={PaymentLogo}
        style={{ width: 250, height: 220, marginTop: 5 }}
      />
      </View>
      <View style={{ margin: 5 }}>
        <Text style={styles.disputeText}>
          Do you want to wait 5 more minutes
        </Text>
        <Text style={styles.disputeText}>or</Text>
        <Text style={styles.disputeText}>start a dispute</Text>
      </View>
      <View style={{ marginTop: 60 }}>
        <View style={styles.disputeContainer}>
          <TouchableOpacity
            onPress={() =>addToDispute()}
            style={styles.disputeButton}>
            <Text style={{ textAlign: 'center', fontFamily: semiBold }}>
              Dispute
            </Text>
          </TouchableOpacity>
          <Text> </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('OrderReady')}
            style={styles.waitButton}>
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontFamily: semiBold,
              }}>
              Wait
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => orderComplete()}
          style={styles.receiveButton}>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontFamily: semiBold,
            }}>
            Order received
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    lineHeight: 300,
    flexDirection: 'column',
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
    // width: 350,
  },

  disputeButton: {
    // width: 170,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#464951',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 60,
  },
  waitButton: {
    // width: 170,
    backgroundColor: Colors.AppColor,
    paddingVertical: 10,
    paddingHorizontal: 65,
    borderRadius: 8,
  },
  receiveButton: {
    // width: 350,
    backgroundColor: Colors.AppColor,
    // padding: 18,
    paddingVertical: 20,
    // paddingHorizontal: 130,
    borderRadius: 8,
    marginTop: 10,
  },
});
