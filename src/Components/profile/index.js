import React from 'react';
import {View, Image, StyleSheet, Text, Platform} from 'react-native';
import ProfileImage from '../../../assets/user-image.png';
import CameraIcon from '../../../assets/camera-icon.png';
import CLoseImage from 'react-native-vector-icons/AntDesign';
import ProfileDetails from './profileDetails';
import UserImage from '../../../assets/profile-avatar.png';
import OrdersImage from '../../../assets/my-order-icon.png';
import WalletImage from '../../../assets/wallet-icon-new.png';
import DisputeImage from '../../../assets/information.png';
import LogoutImage from '../../../assets/logout.png';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function Profile() {
  const profiDetails = [
    {image: UserImage, text: 'My Profile'},
    {image: OrdersImage, text: 'Orders'},
    {image: OrdersImage, text: 'Orders'},
    {image: WalletImage, text: 'My Wallet'},
    {image: DisputeImage, text: 'Orders'},
    {image: LogoutImage, text: 'Logout'},
  ];
  return (
    <View style={styles.container}>
      <View>
        <CLoseImage name="close" size={30} />
      </View>
      <View style={styles.imageContainer}>
        <Image source={ProfileImage} style={{borderRadius: 100}} />
        <Image
          source={CameraIcon}
          style={{
            alignSelf: 'center',
            position: 'absolute',
            right: 1,
            top: 120,
          }}
        />
      </View>
      <View style={{marginTop: 30}}>
        {profiDetails.map((item) => {
          return <ProfileDetails text={item.text} icon={item.image} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignSelf: 'center',
  },
  container: {
    padding: 10,
    backgroundColor: '#FFFF',
  },
  line: {
    // borderTopWidth:1,
    borderColor: '#464951',
    // marginTop:5
  },
});
