import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import PaymentLogo from '../images/paymentConfirm.png';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Zocial';
import Colors from '../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function PaymentConfirm({navigation}) {
  
  return (
    <View style={{alignItems: 'center'}}>
      <View onTouchEnd={() => navigation.goBack()} style={styles.arrow}>
        <MaterialIcon
          Button
          name="arrow-back"
          size={30}
          style={{marginRight: 360, marginTop: 20}}
        />
      </View>
      <Text style={styles.logoText}>Payment confirmed</Text>
      <View>
        <Image
          resizeMode="contain"
          source={PaymentLogo}
          style={{width: 250, height: 230, marginTop: 8}}
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
    </View>
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
    marginTop: 8,
    fontFamily: semiBold,
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
  arrow: {
    marginTop: 40,
  },
});
