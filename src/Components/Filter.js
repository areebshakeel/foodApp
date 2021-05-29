import {Icon} from 'native-base';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const Filter = ({
  filter,
  iscombined,
  index,
  isLast,
  onPress,
  isSelected,
  isRating,
  
}) => {
  return iscombined ? (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.maniCombined,
        borderTopLeftRadius: index === 0 ? 10 : 0,
        borderBottomLeftRadius: index === 0 ? 10 : 0,
        borderTopRightRadius: isLast ? 10 : 0,
        borderBottomRightRadius: isLast ? 10 : 0,
        backgroundColor: isSelected ? Colors.AppColor : '#F8F8F8',
      }}>
      <Text
        style={{
          ...styles.text,
          color: isSelected ? '#FFFFFF' : '#464951',
          fontSize: isRating ? 16 : 12,
        }}>
        {filter}
      </Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.main,
        backgroundColor: isSelected ? Colors.AppColor : '#F8F8F8',
      }}>
      <Text style={{...styles.text, color: isSelected ? '#FFFFFF' : '#464951'}}>
        {filter}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    height: 33,
    elevation: 1,
    minWidth: 80,
    margin: 3,
  },
  maniCombined: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    height: 33,
    elevation: 1,
    minWidth: Dimensions.get('window').width / 6,
    marginVertical: 3,
  },
  location: {
    fontSize: 16,
    color: '#ffffff',
  },
  text: {
    color: '#464951',
    fontFamily: semiBold,
    fontSize: 12,
    alignSelf: 'center',
    textAlign: 'center',
  },
});
export default Filter;
