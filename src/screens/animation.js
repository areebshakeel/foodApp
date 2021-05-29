import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AnimatedTabBar from '@gorhom/animated-tabbar';
import Icon from 'react-native-vector-icons/AntDesign'
import HomeScreen from './home'
import LoginScreen from './login'
import SignupScreen from './signup'
import {
  
  View,
  Text,
  
} from 'react-native';

// const myIcon= <Icon name=""/>

const tabs = {
  Home: { // < Screen name
    labelStyle: {
      color: '#5B37B7',
    },
    icon: {
      component:()=> <Icon name="forward" size={30} color="black"/>,
      activeColor: 'rgba(91,55,183,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: 'rgba(223,215,243,1)',
      inactiveColor: 'rgba(223,215,243,0)',
    },
  },
  Profile: { // < Screen name
    labelStyle: {
      color: '#1194AA',
    },
    icon: {
      component:()=> <Icon name="table" size={30} color="black"/>,
      activeColor: 'rgba(17,148,170,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: 'rgba(207,235,239,1)',
      inactiveColor: 'rgba(207,235,239,0)',
    },
  },
};
const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
    <Tab.Navigator
      tabBar={props => (
        <AnimatedTabBar tabs={tabs} {...props} />
      )}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        name="Profile"
        component={LoginScreen}
      />
    </Tab.Navigator>
  </NavigationContainer>
  )
}