import React from 'react';
import Orders from './Orders';
import {Platform} from 'react-native';
import Restaurants from './restaurantsList';
import Colors from '../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const {Tabs, ScrollableTab, Tab} = require('native-base');

const OrdersTabs = ({navigator, tabs}) => {
  return (
    <Tabs
      style = {{height : 500}}
      tabStyle={{backgroundColor: '#ffffff'}}
      renderTabBar={() => (
        <ScrollableTab
          style={{backgroundColor: '#ffffff'}}
          tabsContainerStyle={{
            backgroundColor: '#ffffff',
          }}
        />
      )}
      tabBarUnderlineStyle={{backgroundColor: Colors.AppColor}}>
      {
      tabs.map((tab)=>{
        return(
          <Tab
          // key={tab.name}
          textStyle={{
            color: '#ACACAC',
            fontFamily: semiBold,
            fontSize: 12,
          }}
          tabStyle={{backgroundColor: '#ffffff'}}
          activeTabStyle={{backgroundColor: '#ffffff'}}
          activeTextStyle={{
            color: '#464951',
            fontFamily: semiBold,
            fontSize: 12,
          }}
          heading={tab.name}>
          <Orders navigator={navigator} horizontal={false} numColumns={1}  data = {tab.data}/>
        </Tab>
        )
      })
      }
    </Tabs>
  )
};

export default OrdersTabs;
