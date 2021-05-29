import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
// import Logo from '../asse';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {set} from 'react-native-reanimated';
import IonIcon from 'react-native-vector-icons/Zocial';
import ReachDestination from './reachDestination';
import OrderReceived from './orderReceived';
import OrderReady from './orderReady';
import PaymentConfirm from './paymentConfirm';
import OrderCompeletd from './orderComplete';
import Dispute from './dispute';
import Colors from '../config/colors';

// import { white } from 'react-native-paper/lib/typescript/styles/colors';
const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';
export default function Payment({navigation}) {
  const [flag, setFlag] = useState(true);
  const [badge, setBadge] = useState(true);
  const [tag, setTag] = useState(true);
  const [isorderDone, setIsOrderDone] = useState(false);

  function flagFalse() {
    setFlag(!flag);
  }
  function badgeFalse() {
    setBadge(!badge);
  }

  function tagFalse() {
    setTag(!tag);
  }

  function orderDone() {
    setIsOrderDone(true);
    // alert(isorderDone);/
  }
  return (
    <ScrollView style={{backgroundColor: '#FFFFFF'}}>
      <View style={styles.container}>
        {tag ? (
          <PaymentConfirm navigation={navigation} />
        ) : !tag && !isorderDone ? (
          <Dispute
            tagFalse={tagFalse}
            orderDone={orderDone}
            navigation={navigation}
          />
        ) : (
          <OrderCompeletd navigation={navigation} />
        )}

        {flag && badge ? (
          <ReachDestination flagFalse={flagFalse} />
        ) : !flag && badge ? (
          <OrderReceived navigation={navigation} badgeFalse={badgeFalse} />
        ) : !flag && !badge && tag ? (
          <OrderReady tagFalse={tagFalse} />
        ) : (
          <Text></Text>
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    lineHeight: 300,
    flexDirection: 'column',
  },
  logoText: {
    color: Colors.AppColor,
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 8,
  },
  imageContainer: {
    borderWidth: 2,
    borderStyle: 'solid',

    borderColor: 'blue',
    height: '100%',
    width: '100%',
  },
  orderText: {
    alignItems: 'center',
    marginTop: 20,
  },
  reach: {
    backgroundColor: '#989898',
    width: 330,
    padding: 15,
    borderRadius: 10,
  },
  noButton: {
    width: 180,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#464951',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  yesButton: {
    width: 180,
    borderColor: '#464951',
    backgroundColor: Colors.AppColor,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  yesNoContainer: {
    // flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 400,
    marginTop: 20,
  },
  waitText: {
    textAlign: 'center',
    color: '#3D3D3D',
    width: 310,
    marginTop: 20,
    fontWeight: 'bold',
  },
  contact: {
    // flex:0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
    marginTop: 25,
  },
  contactText: {
    color: Colors.AppColor,
    fontSize: 30,
    fontWeight: 'bold',
  },
  disputeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D3D3D',
    textAlign: 'center',
    marginTop: 10,
  },
  disputeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 350,
  },

  disputeButton: {
    width: 170,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#464951',
    borderRadius: 8,
    padding: 18,
  },
  waitButton: {
    width: 170,
    backgroundColor: Colors.AppColor,
    padding: 18,
    borderRadius: 8,
  },
  receiveButton: {
    width: 350,
    backgroundColor: Colors.AppColor,
    padding: 18,
    borderRadius: 8,
    marginTop: 10,
  },
});
