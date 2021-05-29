import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import WalletImage from '../../images/wallet.png';
import kfcImage from '../../images/kfc.png';
// import mcdonaldsImage from '../../../assets/macdonalds.png'
import OrderItem from '../../screens/activeOrder/orderItem';
import Button from '../../Components/Button/index';
import StarIcon from 'react-native-vector-icons/FontAwesome';
import TextArea from '../../Components/textArea';
import Colors from '../../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function AddReview({ navigation }) {
  const [flag, setFlag] = useState(true);
  const [review, setReview] = useState(3);

  // const [star1, setstar1] = useState(true)
  // const [star2, setstar2] = useState(true)
  // const [star3, setstar3] = useState(true)
  // const [star4, setstar4] = useState(true)
  // const [star5, setstar5] = useState(true)

  function flagFalse() {
    setFlag(false);
  }
  const stars = [1, 2, 3, 4, 5];

  return (
    <ScrollView style={{ backgroundColor: '#FFFF', flex: 1 }}>
      <SafeAreaView>
        <View style={styles.container}>
          <View
            onTouchEnd={() => navigation.navigate('Home')}
            style={styles.arrow}>
            <Icon name="arrowleft" size={30} />
          </View>
          <View style={{ alignSelf: 'center' }}>
            <Text style={styles.headingText}>Add Review</Text>
          </View>
          <View style={styles.imagContainer}>
            <Image resizeMode="contain" source={WalletImage} />
          </View>
          <View style={{ marginTop: 20 }}>
            <View>
              <OrderItem
                backgroundColor="#F9F9F9"
                flagFalse={flagFalse}
                itemName=" KFC"
                orderImage={kfcImage}
                location="Burj Khalifa, Dubai"
              />
            </View>
          </View>
          <View style={styles.starIconCOntainer}>
            {/* <StarIcon onPress={() => setstar1(!star1)} name="star" size={25} color={star1 ? "#AEAEAE" : Colors.AppColor} />
                    <StarIcon onPress={() => setstar2(!star2)} name="star" size={25} color={star2 ? "#AEAEAE" : Colors.AppColor} />
                    <StarIcon onPress={() => setstar3(!star3)} name="star" size={25} color={star3 ? "#AEAEAE" : Colors.AppColor} />
                    <StarIcon onPress={() => setstar4(!star4)} name="star" size={25} color={star4 ? "#AEAEAE" : Colors.AppColor} />
                    <StarIcon onPress={() => setstar5(!star5)} name="star" size={25} color={star5 ? "#AEAEAE" : Colors.AppColor} /> */}
            {stars.map((star) => (
              <StarIcon
                onPress={() => setReview(star)}
                name="star"
                size={25}
                color={star > review ? '#AEAEAE' : Colors.AppColor}
              />
            ))}
          </View>
          <View style={{ marginTop: 10 }}>
            <TextArea placeholder="" label="Write a Review" />
          </View>
          <View
            onTouchEnd={() => navigation.navigate('HomeScreen')}
            style={{ marginTop: 10 }}>
            <Button backgroundColor={Colors.AppColor} color="#FFFF" title="Submit" />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#FFFF',
  },
  headingText: {
    color: Colors.AppColor,
    fontSize: 20,
    fontFamily: semiBold,
  },
  imagContainer: {
    marginTop: 30,
    alignSelf: 'center',
    borderBottomWidth: 2,
    borderColor: '#F8F8F8',
  },
  orderContainer: {},
  starIconCOntainer: {
    marginTop: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // backgroundColor:'red',
    width: '50%',
    alignItems: 'center',
  },
});
