import {Container, Content} from 'native-base';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Colors from '../config/colors';
import HTML from "react-native-render-html";
import axios from 'axios';
import { path } from '../config/path';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';



export default function TermsAndConditions({navigation}) {

  const [termsAndCondition, setTermsAndCondition] = useState('')

  useEffect(() => {
    let getTermsAndCondition = axios.post(path.TERMS_AND_CONDITION, {})
    getTermsAndCondition.then((resp)=>{
      setTermsAndCondition(resp.data.data)
    })
  }, [])

  return (
    <Container>
      <Content style={{flex: 1, marginTop: 10}}>
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
            <Text style={styles.headingText}>Terms & Conditions</Text>
          </View>
          <View>
            <Text style={styles.headingText}></Text>
          </View>
        </View>
        <View
          style={{
            padding: 20,
            borderRadius: 5,
            elevation: 5,
            width: '95%',
            // marginVertical: 4,
            flex: 1,
            alignSelf: 'center',
            backgroundColor : 'white',
            marginVertical : 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
            <HTML source={{ html: termsAndCondition }}  />
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
