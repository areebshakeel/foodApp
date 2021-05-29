import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Switch} from 'native-base';
import Colors from '../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const FavoriteSwitch = ({navigator}) => {
  const [isfav, setFav] = useState(false);
  const toggleSwitch = () => setFav((previousState) => !previousState);
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 10,
        alignItems: 'baseline',
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={{
            ...styles.favorite,
            color: `${isfav ? '#ACACAC' : Colors.AppColor}`,
          }}>
          Reorder
        </Text>
        <Switch
          value={isfav}
          onValueChange={toggleSwitch}
          trackColor={{false: '#ACACAC', true: Colors.AppColor}}
          thumbColor={'#ffffff'}
          style={{
            marginHorizontal: 10,
          }}
        />
        <Text
          style={{
            ...styles.favorite,
            color: `${isfav ? Colors.AppColor : '#ACACAC'}`,
          }}>
          Favorite
        </Text>
      </View>
      <Text
        onPress={() => navigator(isfav ? 'Favorites' : 'Favorites')}
        style={styles.showAll}>
        Show All
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  favorite: {
    fontFamily: semiBold,
    fontSize: 15,
  },
  showAll: {
    fontFamily: regular,
    fontSize: 15,
    textDecorationLine: 'underline',
    textDecorationColor: '#ACACAC',
  },
});
export default FavoriteSwitch;
