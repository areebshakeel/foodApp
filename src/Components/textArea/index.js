import React from 'react';
import {View, Text, TextInput, StyleSheet, Platform} from 'react-native';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function TextArea(props) {
  return (
    <View>
      <Text style={styles.labelText}>{props.label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          multiline={true}
          numberOfLines={5}
          style={styles.inputText}
          placeholder={props.placeholder}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#707070',
    // paddingHorizontal: 100,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    // paddingVertical:15,
    // minWidth:'50%'
  },
  inputText: {
    minWidth: '100%',
    maxWidth: '100%',
    alignSelf: 'flex-start',
    paddingVertical: 50,
  },
  labelText: {
    fontSize: 15,
    fontFamily: regular,
    color: '#464951',
    padding: 2,
  },
});
