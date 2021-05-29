import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Container, Content} from 'native-base';
import Colors from '../../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default function ProfileNotifications() {
  return (
    <Container>
      <Content>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: Colors.AppColor,
            padding: 8,
          }}>
          <View onTouchEnd={() => navigation.goBack()} style={styles.arrow}>
            <Icon color="#FFF" name="arrowleft" size={30} />
          </View>
          <View>
            <Text style={styles.headingText}>Profile</Text>
          </View>
          <View>
            <BellIcon
              onTouchEnd={() => alert('Notify')}
              name="bell"
              size={25}
              color="#FFF"
            />
          </View>
        </View>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  headingText: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: semiBold,
  },
  arrow: {
    alignSelf: 'flex-start',
  },
});
