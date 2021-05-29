import React, { Component } from 'react';
import { View, Text, Button, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import Colors from '../config/colors';
// import { strings, setLanguage, isRTL } from '../locales/i18n';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const CustomHeader = ({ heading, filters, categoryIds = [], foodGroupIds = [], ratingIds = [], price = [] }) => {
  let obj = ""
  let str = []
  // filters.map((item)=>{
  //   if(typeof item == 'object') {
  //     // console.log((typeof item) + " " +item);
  //     try {
  //       obj.push(item)
  //     } catch (error) {
  //       obj = item
  //     }
  //   } else if (typeof item == "string") {
  //     str.map((items)=>{
  //       str.push(items)
  //     })
  //   }
  // })
  str = [str.toString(), ...obj]
  // console.log(str);
  console.log({
    categoryIds, foodGroupIds, ratingIds, price
  });
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <View style={styles.wraper}>
        {filters &&
          filters.map((filter) => {
           
            return ( 
              <TouchableOpacity style={styles.filter}>
                <Text style={styles.text}>{filter}</Text>
                <Icon style={styles.icon} name="close-outline" />
              </TouchableOpacity>
              )
            }) 
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    margin: 5,
    borderBottomWidth: 2,
    borderBottomColor: Colors.AppColor,
  },
  heading: {
    marginVertical: 10,
    fontSize: 16,
    fontFamily: semiBold,
    color: Colors.AppColor,
    alignSelf: 'flex-start',
  },
  filter: {
    backgroundColor: Colors.AppColor,
    margin: 1.5,
    paddingHorizontal: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#ffffff',
    fontFamily: semiBold,
    fontSize: 12,
  },
  icon: {
    color: '#ffffff',
    fontSize: 20,
  },
  wraper: {
    flexDirection: 'row',
    width: '85%',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
});

export default CustomHeader;
