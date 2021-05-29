import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native'
import Home from '../home'
import OrderCompelete from '../orderComplete'

const Tab = createMaterialTopTabNavigator();

export default function DisputeTab() {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="Order">
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Order" component={OrderCompelete} />

            </Tab.Navigator>
        </NavigationContainer>
    );
}