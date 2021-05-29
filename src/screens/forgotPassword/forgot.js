import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, Platform, SafeAreaView } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import ForgotImage from '../../images/forget-password-img.png';
import Input from '../../Components/Input';
import Button from '../../Components/Button/index';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/AntDesign';
import Colors from '../../config/colors';
const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';


export default function ForgotPassword({ navigation }) {

  const [email, setEmail] = useState('')
  const [emailColor, setEmailColor] = useState(true)
  function submit() {
    if (email && email.includes('@' && '.')) {
      setEmailColor(true)
      navigation.navigate('OtpVerify')
    }
    else {
      setEmailColor(false)
    }
  }

  return (
    <ScrollView style={{ backgroundColor: '#FFFF' }}>
      <SafeAreaView>
        <View style={styles.container}>
          <View onTouchEnd={() => navigation.goBack()} style={styles.arrow}>
            <Icon name="arrowleft" size={30} />
          </View>
          <View style={styles.imageContainer}>
            <Image source={ForgotImage} />
          </View>
          <View style={styles.forgotPasswordHeading}>
            <Text style={styles.forgotPasswordHeadingText}>Forgot Password?</Text>
          </View>
          <View style={{ marginTop: 30, padding: 10 }}>
            <View>
              <Input onChangeText={(value) => setEmail(value)} borderColor={emailColor ? Colors.borderColor : 'red'} label="Enter your email address*" />
            </View>
            <View

              style={{ marginTop: 10 }}>
              <Button onPress={() => submit()} backgroundColor={Colors.AppColor} title="Submit" color="#FFFF" />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // width:'?%',
    padding: 4,
    // alignItems:'center',
    marginTop: 20,
    backgroundColor: '#FFFF',
  },
  imageContainer: {
    alignSelf: 'center',
  },
  forgotPasswordHeadingText: {
    color: Colors.AppColor,
    fontSize: 24,
    // textAlign:'left',
    fontFamily: bold,
  },
  forgotPasswordHeading: {
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginTop: 20,
    padding: 2,
  },
  arrow: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
});
