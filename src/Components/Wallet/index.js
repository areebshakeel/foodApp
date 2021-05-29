import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import WalletImage from '../../../assets/wallet.png';
import BackgroundImage from '.././../../assets/background.png';
import PaymentCards from '../paymentsCards';
import PromocodeImage from '../../../assets/promo-code-grey.png';
import PaymentAllcards from '../payment method/paymentAllCards';
import Colors from '../../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function Wallet() {
  return (
    <ScrollView style={{backgroundColor: '#FFFF'}}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={styles.arrow}>
            <Icon name="arrowleft" size={30} />
          </View>
          <View>
            <Text style={styles.headingText}>My Wallet</Text>
          </View>
          <View>
            <Text style={styles.headingText}></Text>
          </View>
        </View>
        <View style={styles.imagContainer}>
          <Image resizeMode="contain" source={WalletImage} />
        </View>
        <View style={{marginTop: 10}}>
          <ImageBackground
            source={BackgroundImage}
            style={styles.balanceContainer}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 14,
                fontFamily: regular,
              }}>
              Your Current Balance
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 30,
                fontFamily: semiBold,
              }}>
              AED 20.00
            </Text>
          </ImageBackground>
        </View>
        <View style={{marginTop: 20}}>
          <PaymentCards
            textColor="#464951"
            text="Codes & Vouchers"
            backgroundColor="#F8F8F8"
            icon={PromocodeImage}
          />
        </View>
        <View>
          <PaymentAllcards />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFF',
    padding: 10,
    marginTop: 10,
    // alignItems: 'center'
  },
  headingText: {
    color: Colors.AppColor,
    fontSize: 20,
    fontFamily: semiBold,
  },
  arrow: {
    alignSelf: 'flex-start',
  },
  imagContainer: {
    marginTop: 20,
    alignSelf: 'center',
    borderBottomWidth: 2,
    borderColor: '#F8F8F8',
  },
  balanceContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    resizeMode: 'cover',
    overflow: 'hidden', // resizeMode:'contain'
  },
});
