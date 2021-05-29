import React from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/FontAwesome5';
import SamsungPayIcon from '../../images/samsung-pay.png';
import Button from '../../Components/Button/index';
import CreditrCardImage from '../../images/creditCard.png';
import AppleImage from '../../images/apple-icon.png';
import WalletImage from '../../images/wallet-icon.png';
import Icon from 'react-native-vector-icons/AntDesign';
// import { CheckBox } from 'native-base';
import CheckBox from '@react-native-community/checkbox';
import PaymentCards from '../paymentsCards';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Colors from '../../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function paymentAllCards({navigation}) {
  return (
    <View>
      <View style={styles.addMethodContainer}>
        <Text style={styles.paymentText}>Payment Method</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ScanYourCard')}>
          <Text style={styles.addMethodText}>Add Method</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <PaymentCards
          textColor="#464951"
          text="Credit Card"
          backgroundColor="#F8F8F8"
          icon={CreditrCardImage}
        />
      </View>
      <View style={styles.cardContainer}>
        <PaymentCards
          textColor="#FFFF"
          text="Apple Pay"
          backgroundColor="black"
          icon={AppleImage}
        />
      </View>
      <View style={styles.cardContainer}>
        <PaymentCards
          textColor="#464951"
          text="Wallet"
          backgroundColor="#F8F8F8"
          icon={WalletImage}
        />
      </View>
      <View style={styles.cardContainer}>
        <PaymentCards
          textColor="#464951"
          text="Samsung Pay"
          backgroundColor="#F8F8F8"
          icon={SamsungPayIcon}
        />
      </View>
      {/* <View
        onTouchEnd={() => navigation.replace('Cart')}
        style={styles.cardContainer}>
        <Button backgroundColor={Colors.AppColor} title="Next" color="#FFFF" />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems:'center',
    paddingTop: 30,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
  },
  addMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  paymentText: {
    color: Colors.AppColor,
    fontSize: 20,
    fontFamily: semiBold,
  },
  addMethodText: {
    color: Colors.AppColor,
    fontSize: 12,
    alignItems: 'center',
  },
  creditCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '40%',
    padding: 2,
    marginLeft: 8,
  },
  cardContainer: {
    marginTop: 10,
  },
  checkBox: {
    borderRadius: 20,
  },
  applePay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '40%',
    padding: 4,
    marginLeft: 8,
    // alignSelf:'flex-start'
  },
  applePayContainer: {
    backgroundColor: 'black',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  wallet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    alignItems: 'center',
    padding: 2,
    marginLeft: 8,
  },
  walletContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  arrow: {
    alignSelf: 'flex-start',
    // marginLeft: 10
  },
});
