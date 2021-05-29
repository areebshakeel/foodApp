import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import CardImage from '../../images/add-card-img.png';
import Button from '../../Components/Button/index';
import Input from '../../Components/Input';
import {Picker} from 'native-base';

import { CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io'
const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

import Icon from 'react-native-vector-icons/AntDesign';
import {useEffect} from 'react';
import Colors from '../../config/colors';

export default function ScanYourCard({navigation}) {
  const [monthValue, setMonthValue] = useState('MM');
  const [yearValue, setYearValue] = useState('YYYY');
  const [cardNum, setCardNum] = useState('')
  const [cvv, setCvv] = useState('')
  const months = [
    'mm',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];
  const years = [
    'yyyy',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
    '2026',
    '2027',
    '2028',
    '2029',
    '2030',
  ];
  scanCard=()=> {
    let config = {
      hideCardIOLogo : true
    }
    CardIOModule.scanCard(config)
      .then(card => {
        console.log(card);
        setCardNum(data.cardNumber)
        setMonthValue(data.expiryMonth)
        setYearValue(data.expiryYear)
        setCvv(data.cvv)
      })
      .catch(() => {
        // the user cancelled
      })
  }
  return (
    <ScrollView style={{backgroundColor: '#FFFF'}}>
      <SafeAreaView>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.arrow}>
            <Icon name="arrowleft" size={30} />
          </TouchableOpacity>
          <View>
            <Text style={styles.paymentMethodtext}>Add a Payment Method</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image resizeMode="contain" source={CardImage} />
          </View>

          <View style={{marginTop: 10}}>
            <Button
              onPress={() => scanCard()}
              title="Scan Your Card"
              backgroundColor={Colors.AppColor}
              color="#FFFFFF"
            />
          </View>
          <View style={{marginTop: 10, alignSelf: 'center'}}>
            <Text style={styles.orText}>OR</Text>
          </View>
          <View>
            <Input placeholder="" label="Carholder Name*" />
          </View>
          <View style={{marginTop: 10}}>
            <Input placeholder="" label="Carholder Number*" value = {cardNum} />
          </View>

          <View style={{marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '80%',
                // alignSelf: 'center',
                padding: 2,
              }}>
              <Text>End Date</Text>
              <Text>CCV</Text>
            </View>
            <View style={styles.pickerCotainer}>
              <View style={styles.picker1}>
                <Picker
                  
                  style={styles.pickerText}
                  mode="dialog"
                  selectedValue={monthValue}
                  onValueChange={(itemValue, itemIndex) =>
                    setMonthValue(itemValue)
                  }>
                  {months.map((item) => (
                    <Picker.Item label={item} value={item} />
                  ))}
                </Picker>
              </View>
              <View style={styles.picker2}>
                <Picker
                  style={styles.pickerText}
                  mode="dialog"
                  selectedValue={yearValue}
                  onValueChange={(itemValue) => setYearValue(itemValue)}>
                  {years.map((item) => (
                    <Picker.Item label={item} value={item} />
                  ))}
                </Picker>
              </View>
              <View style={styles.cvv}>
                <TextInput value = {cvv} />
              </View>
            </View>
          </View>
          <View
            onTouchEnd={() => navigation.navigate('PaymentMethod')}
            style={{marginTop: 10}}>
            <Button
              title="Add Method"
              backgroundColor={Colors.AppColor}
              color="#FFFFFF"
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginTop: 10,
    // alignItems: 'center',
    backgroundColor: '#FFFF',
    padding: 5,
    flex:1
  },
  imageContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  paymentMethodtext: {
    color: Colors.AppColor,
    fontSize: 20,
    fontFamily: semiBold,
    textAlign: 'center',
  },
  orText: {
    color: '#464951',
    fontFamily: bold,
    fontSize: 20,
  },

  cvv: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#707070',
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    width: '30%',
    // paddingHorizontal: 15,
  },
  pickerCotainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  picker1: {
    width: '26%',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#707070',
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
  },
  picker2: {
    width: '30%',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#707070',
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
  },
  pickerText: {
    color: '#3d3d3d',
    fontSize: 15,
  },
  arrow: {
    marginTop: 10,
  },
});
