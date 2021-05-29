import React from 'react';
import { View, Text, StyleSheet, Image, Platform, SafeAreaView } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/AntDesign';
// import { CheckBox } from 'native-base';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import PaymentAllCards from '../paymentMethod/paymentAllCards';
import Colors from '../../config/colors';
import Button from '../../Components/Button/index'

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function AddMethod({ navigation }) {
  return (
    <ScrollView style={{ backgroundColor: '#FFFFFF' }}>
      <SafeAreaView>
        <View style={styles.container}>
          <View onTouchEnd={() => navigation.goBack()} style={styles.arrow}>
            <Icon name="arrowleft" size={30} />
          </View>

          <View>
            <PaymentAllCards navigation={navigation} />
          </View>
          <View
            style={styles.cardContainer}>
            <Button onPress={()=>navigation.navigate('CartTab')} backgroundColor={Colors.AppColor} title="Next" color="#FFFF" />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems:'center',
    // paddingTop: 30,
    padding: 5,
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
    marginTop: 10,
  },
});
