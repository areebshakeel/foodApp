import {Icon} from 'native-base';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import NotificationImage from '../images/notification-image.png';
import StarIcon from 'react-native-vector-icons/FontAwesome';
import Colors from '../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const reviews = [1, 2, 3, 4, 5];
const ReviewCard = ({title, description, date, star}) => {
  return (
    <View style={{...styles.main}}>
      <Image source={NotificationImage} />
      <View style={styles.textWrapper}>
        <Text style={{...styles.text}}>{title}</Text>
        <View style={styles.stars}>
          {reviews.map((review) => (
            <StarIcon
              name="star"
              size={15}
              color={review > star ? '#AEAEAE' : Colors.AppColor}
            />
          ))}
        </View>
        <Text style={{...styles.description}}>{description}</Text>
      </View>
      <Text style={{...styles.date}}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    // height: 125,
    marginVertical : 20,
    width: '100%',
    alignSelf: 'center',
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
  textWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '55%',
    paddingLeft: 10,
  },
  text: {
    color: '#464951',
    fontFamily: semiBold,
    fontSize: 12,
  },
  stars: {
    flexDirection: 'row',
  },
  description: {
    color: '#707070',
    fontFamily: regular,
    fontSize: 12,
    width: '100%',
  },
  date: {
    color: Colors.AppColor,
    fontSize: 15,
    fontStyle: 'italic',
  },
});
export default ReviewCard;
