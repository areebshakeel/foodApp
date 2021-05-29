import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import Colors from '../../config/colors';

export default class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.animating,
    };
  }
  componentDidMount() {
    console.log(this.props.animating);
  }
  render() {
    return (
      <ActivityIndicator
        animating={this.state.animating}
        style={{position: 'absolute', alignSelf: 'center', marginTop: '60%'}}
        size={Platform.OS === 'android' ? 300 : 'large'}
        color={Colors.AppColor}
      />
    );
  }
}
