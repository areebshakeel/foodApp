import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import UserIcon from 'react-native-vector-icons/AntDesign';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function ProfileDetails(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        ...styles.container,
        borderBottomWidth: props.index + 1 !== props.dataLength ? 1 : 0,
      }}>
      <View style={{flex: 0.1, paddingLeft: 5}}>
        <Image source={props.icon} />
      </View>
      <View style={{flex: 0.8}}>
        <Text style={styles.text}>{props.text}</Text>
      </View>
      <View style={styles.iconContainer}>
        <UserIcon name="right" color="#464951" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingVertical: 20,
    borderColor: '#464951',
  },
  details: {
    flexDirection: 'row',
  },
  text: {
    color: '#464951',
    fontFamily: medium,
    marginLeft: 10,
  },
  iconContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
});
