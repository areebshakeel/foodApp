import React, {Component} from 'react';
import {View, Text, Button, Platform} from 'react-native';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../config/colors';
// import { strings, setLanguage, isRTL } from '../locales/i18n';

class BottomBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: 'Daniel',
      lang: 'en',
    };
  }

  render() {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: Colors.AppColor,
          position: 'absolute',
          bottom: 0,
          height: 60,
        }}>
        <View>
          <Icon name="home" />
        </View>
      </View>
    );
  }
}

export default BottomBar;
