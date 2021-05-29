import axios from 'axios';
import { Container, Content } from 'native-base';
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Value } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/AntDesign';
import Colors from './config/colors';
import { path } from './config/path';

import HTML from "react-native-render-html";

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function PrivacyPolicy({ navigation }) {
  
const [privacyPolicy, setPrivacyPolicy] = useState('')

useEffect(() => {
  let getPrivacyPolicyData = axios.post(path.PRIVACY_POLICY, {})
  getPrivacyPolicyData.then((resp)=>{
    setPrivacyPolicy(resp.data.data)
  })
}, [])
  return (
    <Container>
      <Content style={{ flex: 1, marginTop: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View onTouchEnd={() => navigation.goBack()} style={styles.arrow}>
            <Icon name="arrowleft" size={30} />
          </View>
          <View>
            <Text style={styles.headingText}>Privacy Policy</Text>
          </View>
          <View>
            <Text style={styles.headingText}></Text>
          </View>
        </View>
        <View
          style={{
            paddingBottom: 10,
            borderRadius: 5,
            elevation: 5,
            width: '95%',
            flexDirection: 'column',
            // marginVertical: 4,
            flex: 1,
            justifyContent: 'space-between',
            alignSelf: 'center',
            backgroundColor: 'white',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            marginVertical: 20,
            padding: 20
          }}>
            <HTML source={{ html: privacyPolicy }}  />
        </View>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  headingText: {
    color: Colors.AppColor,
    fontSize: 20,
    fontFamily: semiBold,
  },
  arrow: {
    alignSelf: 'flex-start',
  },
});
