import React from 'react';
import { Dimensions, Text, View } from 'react-native'
import { Platform } from 'react-native';
import Colors from '../config/colors';
import Restaurants from './restaurantsList';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const { Tabs, ScrollableTab, Tab, Header } = require('native-base');

const RestaurantTabs = ({ data, navigation, location, hasActiveOrder }) => {
  console.log("hasActiveOrder", hasActiveOrder);
  return (

    <Tabs
      style={{ height: Platform.OS == 'ios' ? 500 : '100%', zIndex: 10, paddingBottom : hasActiveOrder ? 60 : 0 }}
      onChangeTab={() => {
        data.map((item) => {
          console.log(item.data.length)
        })
      }}
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
      {data.map((tab) => (
        <Tab
          key={tab.name}
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
          heading={tab.name}>
          <View style={{ alignSelf: 'flex-start', paddingLeft : 12}} >
            <Restaurants location={location} horizontal={false} numColumns={2} data={tab.data} navigator={navigation} />
          </View>
          <Text style={{ marginBottom: 40 }}></Text>
        </Tab>
      ))}
    </Tabs>
  );
};

export default RestaurantTabs;
