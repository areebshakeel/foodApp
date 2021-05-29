import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import CarImage from '../images/kfc3-1.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../config/colors';
import CarIcon from 'react-native-vector-icons/Ionicons'
// import styles from 'rn-range-slider/styles'
const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function VehicleEdit({ isSwiped, data, navigation }) {
  console.log('my cars-->> ', data.color)
  return (
    <View style={styles.container}>
      <View style={styles.carContainer}>
        <View style={{ backgroundColor: "#D3D3D3", paddingHorizontal: 5, borderRadius: 8 }} >
          <CarIcon name="md-car-sport" size={30} color={(data.color).toLowerCase()} />
          {/* <Image source={CarImage} style={{ width: 60 }} /> */}
        </View>
        <View style={{ padding: 10 }}>
          <Text
            style={{
              color: '#464951',
              fontFamily: semiBold,
              fontSize: 12,
            }}>
            {data.make} {data.model} {data.year}
          </Text>
          <Text
            style={{
              color: Colors.AppColor,
              fontFamily: semiBold,
              fontSize: 16,
            }}>
            {(data.plateNo).toUpperCase()}
          </Text>
        </View>
      </View>

      {!isSwiped && (
        <View>
          <MaterialIcons onPress={() => navigation.navigate('EditVehicle', { 'data': data })} name="edit" size={30} color={Colors.AppColor} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 4,
  },
  carContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // backgroundColor:'red',
  },
});
