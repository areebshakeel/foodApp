import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import WalletImage from '../../images/wallet.png';
import BackgroundImage from '../../images/background.png';
import PaymentCards from '../paymentsCards';
import PromocodeImage from '../../images/promo-code-grey.png';
import PaymentAllcards from '../paymentMethod/paymentAllCards';
import Colors from '../../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function Wallet({navigation}) {
  return (
    <SafeAreaView style={{backgroundColor:"#FFF"}} > 
    <ScrollView style={{backgroundColor: '#FFFF'}}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // marginTop:10 ,
            padding:2
          }}>
          <View style={styles.arrow}>
            <Icon onPress={() => navigation.goBack()} name="arrowleft" size={30} />
          </View>
          <View style={styles.heading}>
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
          <PaymentAllcards navigation={navigation} />
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFF',
    padding: 10,
    marginTop: 10,
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
