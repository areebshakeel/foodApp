import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Input from '../Input';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Colors from '../../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function PasswordInput(props) {
  const [isHidden, setIsHidden] = useState(true);
  return (
    <View>
      <Text style={styles.labelText}>{props.label}</Text>
      <View style={{
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: props.borderColor? props.borderColor :Colors.borderColor,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === 'ios' ? 10 : 0,
      }}>
        {/* <EntypoIcon name="eye" size={30} color='#707070' /> */}

        <TextInput onChangeText={props.onChangeText} style={styles.input} secureTextEntry={isHidden} />
        {isHidden ? (
          <EntypoIcon
            onPress={() => setIsHidden(!isHidden)}
            name="eye-with-line"
            size={30}
            color="#707070"
            style={{ marginLeft: 10 }}
          />
        ) : (
            <EntypoIcon
              onPress={() => setIsHidden(!isHidden)}
              name="eye"
              size={30}
              color="#707070"
              style={{ marginLeft: 10 }}
            />
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#707070',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    // padding:5
  },
  input: {
    minWidth: '85%',
    maxWidth: '85%',
  },
  labelText: {
    fontSize: 15,
    fontFamily: regular,
    color: '#464951',
    padding: 2,
  },
});
