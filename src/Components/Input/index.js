import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function Input(props) {
  return (
    <View>
      <Text style={styles.labelText}>{props.label}</Text>
      <View style={{
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: props.borderColor ? props.borderColor : '#707070',
        paddingHorizontal: 5,
        paddingVertical: Platform.OS == "ios" ? 18 : 0,
        borderRadius: 10,
        backgroundColor: '#F8F8F8',
      }}>
        <TextInput
          onBlur={props.onBlur}
          maxLength={props.maxLength}
          keyboardType={props.keyboardType}
          autoCapitalize={props.noCapital ? false : true}
          style={styles.inputText}
          placeholder={props.placeholder}
          secureTextEntry={props.securityText}
          value={props.value}
          onChangeText={props.onChangeText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // inputContainer: {

  //   // minWidth:'50%'
  // },
  inputText: {
    minWidth: '90%',
    maxWidth: '90%',
  },
  labelText: {
    fontSize: 15,
    fontFamily: regular,
    color: '#464951',
    padding: 2,
  },
});
