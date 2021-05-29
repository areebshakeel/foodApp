import axios from 'axios';
import { Icon } from 'native-base';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import Colors from '../config/colors';
import { path } from '../config/path';
import NotificationImage from '../images/notification-image.png';
import AvatarImage from '../images/logo.png';


const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const NotificationCard = ({ onPress, title, description, id, token,read, icon }) => {
  const [myReadStatus, setReadStatus] = useState(read)
  let markAsRead = async () => {
    let form = new FormData()
    form.append('id', id)
    await axios.post(path.markAsReadNotification, form, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
    }).then((res) => {
      console.log('Res in Mark Noti--> ', res.data);
      setReadStatus(1)
    }).catch((e) => {
      console.log('Error in marking Noti ', e.response.data);
    })
  }
  return (
    <TouchableOpacity onPress={() => markAsRead()} style={!myReadStatus ? { ...styles.main } : {
      backgroundColor: "#CECECE",
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      height: 80,
      width: '95%',
      marginVertical: 4,
      alignSelf: 'center',
      borderWidth: 1,
      borderColor: 'lightgrey',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 5,
    }}>
      {console.log("Status", myReadStatus)}
      
      {
        !icon ? 
        <Image resizeMode="contain" source={ AvatarImage } style={{ height: 40, width: 40, borderRadius: 40 }}  />
        :
        <Image source={{ uri: icon }} style={{ height: 40, width: 40, borderRadius: 40 }} />

      }
      <View style={styles.textWrapper}>
        <Text style={{ ...styles.text, }}>{title}</Text>
        <Text style={{ ...styles.description }}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    height: 80,
    width: '95%',
    marginVertical: 4,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'lightgrey',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  maniCombined: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    height: 33,
    elevation: 1,
    minWidth: Dimensions.get('window').width / 6,
    marginVertical: 3,
  },
  textWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '80%',
    paddingLeft: 10,
  },
  text: {
    color: '#464951',
    fontFamily: semiBold,
    fontSize: 12,
  },
  description: {
    color: '#707070',
    fontFamily: regular,
    fontSize: 12,
    width: '80%',
  },
});
export default NotificationCard;
