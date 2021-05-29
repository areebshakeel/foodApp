import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Platform} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/AntDesign';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function SecurityInput(props) {
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
    borderColor: props.borderColor?props.borderColor: '#707070',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS==="ios" ? 10 :0,}}>
        {/* <EntypoIcon name="eye" size={30} color='#707070' /> */}
        <IonIcon name="lock" size={30} color="#707070" />
        <TextInput textContentType = {'oneTimeCode'} autoCapitalize = {props.noCapital} onChangeText={props.onChangeText} style={styles.input} secureTextEntry={isHidden} />
        {isHidden ? (
          <EntypoIcon
            onPress={() => setIsHidden(!isHidden)}
            name="eye-with-line"
            size={30}
            color="#707070"
          />
        ) : (
          <EntypoIcon
            onPress={() => setIsHidden(!isHidden)}
            name="eye"
            size={30}
            color="#707070"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
    
  //   // padding:5
  // },
  input: {
    minWidth: '80%',
    maxWidth: '80%',
  },
  labelText: {
    fontSize: 15,
    fontFamily: regular,
    color: '#464951',
    padding: 2,
  },
});
