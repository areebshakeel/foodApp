import React from 'react';
import Burger from '../../images/burger.png';
import ThankYou from '../../images/thankYou.png';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import Colors from '../../config/colors';
import { Container } from 'native-base';
import Button from '../../Components/Button/index';
import { ScrollView } from 'react-native-gesture-handler';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

function OrderCompleteView({ navigation }) {
  return (
    <SafeAreaView>
      <ScrollView>
        <Container style={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <Image
              source={Burger}
              resizeMode="contain"
              style={{ width: 300, height: 250, marginTop: 8 }}
            />
            <Image
              resizeMode="contain"
              source={ThankYou}
              style={{ width: 230, height: 150, marginTop: 8 }}
            />
            <Text
              style={{
                fontSize: 20,
                color: '#464951',
                textAlign: 'center',
                fontFamily: semiBold,
                //   marginTop: 10,
                width: 250,
              }}>
              Enjoy your meal
        </Text>
            <View style={{ marginTop: 10 }} >
              <Button onPress={() => navigation.replace('Home')} title="Continue Shopping" backgroundColor={Colors.AppColor} color="#FFFF" />
            </View>
          </View>
        </Container>
      </ScrollView>
    </SafeAreaView>
  )
}


export default OrderCompleteView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  receiveButton: {
    // width: 350,
    backgroundColor: Colors.AppColor,
    // padding: 18,
    paddingVertical: 20,
    paddingHorizontal: 100,
    borderRadius: 8,
    marginTop: 80,
  },
});
