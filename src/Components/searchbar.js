import React, { Component } from 'react';
import { View, Text, Button, Platform, StyleSheet, TextInput } from 'react-native';
import { Icon } from 'native-base';
import Colors from '../config/colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { path } from '../config/path';
import { search } from 'react-native-country-picker-modal/lib/CountryService';
// import { strings, setLanguage, isRTL } from '../locales/i18n';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: 'Daniel',
      lang: 'en',
      filterText: '',
      token: '',
      data: '',
      Location: ''
    };
  }
  async componentDidMount() {
    let token = await AsyncStorage.getItem('Token')
    let tokenValue = JSON.parse(token)

    this.setState({ token: tokenValue })
  }

  filterFunction = () => {
    if (this.state.filterText) {
      this.props.navigation.navigate('Filters', { text: this.state.filterText, fromHome: true, distance: 999999999999999, filterPlaceholder : this.state.filterText })
    } else {
      this.props.navigation.navigate('SearchFilters');
    }
  }

  render() {
    console.log('Filter Text ', this.state.filterText)
    return (
      <View style={styles.container}>
        <View style={styles.input}>
          <View style={styles.iconContainer}>
            <View
              style={{
                height: 25,
                width: 25,
                alignItems: 'center',
                paddingLeft: 5,
              }}>
              <Icon
                onPress={() => this.props.navigator('Filters:', { location: this.props.location })}
                name="search"
                style={styles.icon}
              />
            </View>
          </View>
          <View style={styles.textContainer}>
            {/* <Text style={styles.text}>Search for dishes or Restaurants</Text> */}
            <TextInput
              placeholder={this.props.placeholder ? this.props.placeholder : "Search for dishes or Restaurants"}
              onChangeText={this.props.search ? (value) => this.setState({ filterText: value }) : this.props.searchFunction}
            />
          </View>
          <View style={styles.filterIcon}>
            <Icon
              onPress={this.props.search ? () => this.filterFunction()
                : this.props.searchButtonOnpress}
              name="options-outline"
              style={styles.iconDown}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F8FF',
    width: '95%',
    alignSelf: 'center',
    borderRadius: 5,
    margin: 5,
    paddingVertical: 5,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: Colors.AppColor,
    alignSelf: 'center',
    fontSize: 23,
  },
  iconDown: {
    color: Colors.AppColor,
    alignSelf: 'center',
  },
  text: {
    color: '#7F7E7F',
    backgroundColor: '#F2F8FF',
    fontFamily: regular,
  },
  iconContainer: {
    flex: 0.1,
  },
  textContainer: {
    flex: 0.8,
    paddingLeft: 10,
  },
  filterIcon: {
    flex: 0.1,
    paddingRight: 5,
  },
});

export default SearchBar;
