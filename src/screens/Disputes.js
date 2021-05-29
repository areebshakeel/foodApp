import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Platform, FlatList, Dimensions } from 'react-native';
import OrderItem from './activeOrder/orderItem';
import kfcImage from '../images/kfc.png';
import Mcdonalds from '../images/mcdonalds.png';
import Button from '../Components/Button/index';
import Colors from '../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { path } from '../config/path';


const {
  Tabs,
  ScrollableTab,
  Tab,
  Icon,
  Container,
  Content,
} = require('native-base');
const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const tabs = [
  {
    heading: 'Active',
  },
  // {
  //   heading: 'Completed',
  // },
];

const Disputes = ({ navigation }) => {
  const [flag, setFlag] = useState(true);
  const [disputeList, setDisputeList] = useState([])
  const [flagHandling, setFlagHandling] = useState()

  function flagFalse(id) {
    if (flagHandling == id) {
      setFlagHandling(0)
      setFlag(true);
    } else {
      setFlagHandling(id)
      setFlag(false);
    }
  }
  function shortDesc(str) {
    let length_temp = 30;
    let temp_ret = str.length > length_temp ? (str.substring(0, length_temp) + "...") : (str);
    return temp_ret;
  }
  useEffect(() => {
    getDisputes()
  }, [])
  const getDisputes = async () => {
    let token = await AsyncStorage.getItem('Token')
    let TokenValue = JSON.parse(token)
    let location = await AsyncStorage.getItem('location')
    let locationParsed = JSON.parse(location)
    let form = new FormData()
    form.append('lat', locationParsed.latitude)
    form.append('long', locationParsed.longitude)
    console.log('Location in Disputes', locationParsed);
    axios.post(path.getDisputedOrders, form, {
      headers: {
        'Authorization': 'Bearer ' + TokenValue,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      }
    }).then((res) => {
      const { list } = res.data.data
      setDisputeList(list)
      console.log('Get Disputessss -->> ', list);
    }).catch((e) => {
      console.log('Erro in etting disputes -->> ', e.response.data)
    })

  }


  navigation.addListener('focus', async () => {
    getDisputes()

  })
  return (
    <Container>
      <Content style={{ padding: 10 }}>
        <View style={styles.arrow}>
          <Icon
            Button
            name="arrow-back"
            size={30}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={{ alignSelf: 'center' }}>
          <Text style={styles.headingText}>Disputes</Text>
        </View>
        <Tabs
          tabStyle={{ backgroundColor: '#ffffff' }}
          renderTabBar={() => (
            <ScrollableTab
              style={{ backgroundColor: '#ffffff' }}
              tabsContainerStyle={{
                backgroundColor: '#ffffff',
              }}
            />
          )}
          tabBarUnderlineStyle={{ backgroundColor: Colors.AppColor }}>
          {tabs.map((tab) => (
            <Tab
              key={tab.heading}
              textStyle={{
                color: '#ACACAC',
                fontFamily: semiBold,
                fontSize: 12,
              }}
              tabStyle={{ backgroundColor: '#ffffff' }}
              activeTabStyle={{ backgroundColor: '#ffffff' }}
              activeTextStyle={{
                color: '#464951',
                fontFamily: semiBold,
                fontSize: 12,
              }}
              heading={tab.heading}>
              <View style={{ width: '95%', alignSelf: 'center', marginTop: 5 }}>
                <FlatList
                  data={disputeList}
                  ListEmptyComponent={({ }) => {
                    return (
                      <View style={{
                        paddingVertical: 20,
                        width: Dimensions.get('screen').width,
                      }}>
                        <Text style={{ fontFamily: semiBold, fontSize: 15, textAlign: 'center' }}>No Disputes found in your list! 😟</Text>
                      </View>
                    )
                  }}
                  renderItem={({ item }) => {

                    return <View>
                      <OrderItem
                        backgroundColor={flagHandling !== item.oid ? '#F9F9F9' : Colors.AppColor}
                        itemName={item.restaurant}
                        textColor={flagHandling !== item.oid ? '#464951' : '#FFFF'}
                        orderImage={item.img}
                        // time={Math.round(item.time) ? `${Math.round(item.time)} minutes` : "20 minutes"}
                        location={shortDesc(item.address)}
                        flagFalse={() => flagFalse(item.oid)}
                        fromDispute={true}

                      />
                      <View style={{ marginTop: 5 }} ></View>
                    </View>
                  }}
                />

              </View>
            </Tab>
          ))}

<Tab
              
              textStyle={{
                color: '#ACACAC',
                fontFamily: semiBold,
                fontSize: 12,
              }}
              tabStyle={{ backgroundColor: '#ffffff' }}
              activeTabStyle={{ backgroundColor: '#ffffff' }}
              activeTextStyle={{
                color: '#464951',
                fontFamily: semiBold,
                fontSize: 12,
              }}
              heading={"Completed"}
              >
              <View style={{ width: '95%', alignSelf: 'center', marginTop: 5 }}>
                
                      <View style={{
                        paddingVertical: 20,
                        width: Dimensions.get('screen').width,
                      }}>
                        <Text style={{ fontFamily: semiBold, fontSize: 15, textAlign: 'center' }}>No Disputes found in your list! 😟</Text>
                      </View>
                    
                

              </View>
            </Tab>
        </Tabs>
      </Content>
      <View style={{ marginBottom: 50, width: '90%', alignSelf: 'center' }}>
        <Button onPress={() => navigation.navigate('HomeScreen')} title="Continue" backgroundColor={Colors.AppColor} color="#FFFFFF" />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  headingText: {
    color: Colors.AppColor,
    fontSize: 20,
    fontFamily: semiBold,
  },
});

export default Disputes;
