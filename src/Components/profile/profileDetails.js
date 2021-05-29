import React from 'react';
import {StyleSheet, View, Text, Image, Platform} from 'react-native';
import UserIcon from 'react-native-vector-icons/AntDesign';
import UserImage from '../../../assets/profile-avatar.png';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function ProfileDetails(props) {
  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <Image source={props.icon} />
        <Text style={styles.text}>{props.text}</Text>
      </View>
      <View>
        <UserIcon name="right" color="#464951" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#464951',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '35%',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    // alignItems: "center"
  },
  text: {
    color: '#464951',
    fontSize: 10,
    fontFamily: medium,
    textAlign: 'center',
    alignSelf: 'center',
  },
});
