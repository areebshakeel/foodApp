import React from 'react';
import {Text, StyleSheet, Dimensions, View, Platform} from 'react-native';
import AddIcon from './AddIcon';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const CartButtons = ({isDetails, count, increment, decrement}) => {
  return isDetails ? (
    <View style={styles.cartButttons}>
      <View style = {{flexDirection : 'row'}}>
        <View style = {{flex : 0.3, justifyContent : 'center', backgroundColor : 'transparent', alignItems : 'center'}}><AddIcon isDetails={isDetails} navigator={decrement} icon="minus" /></View>
        <View style = {{flex : 0.4, backgroundColor : 'transparent', alignItems : 'center'}}><Text style={{...styles.count, justifyContent : 'center'}}>{count < 0 ? 0 : count}</Text></View>
        <View style = {{flex : 0.3, justifyContent : 'center', backgroundColor : 'transparent', alignItems : 'center'}}>
          <AddIcon
            isDetails={isDetails}
            navigator={increment}
            icon="plus"
            backgroundColor="primary"
          />
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.cartButttonsItem}>
      <AddIcon
        isDetails={isDetails}
        navigator={decrement}
        icon="minus"
        backgroundColor="primary"
      />
      <Text style={styles.countItem}>{count < 0 ? 0 : count}</Text>
      <AddIcon
        isDetails={isDetails}
        navigator={increment}
        icon="plus"
        backgroundColor="primary"
      />
    </View>
  );
};

export default CartButtons;

const styles = StyleSheet.create({
  cartButttons: {
    marginVertical: 20,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: Dimensions.get('window').width / 3,
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
  },
  count: {
    color: '#464951',
    fontFamily: regular,
    // paddingHorizontal : 20,
    textAlign : 'center',
    fontSize : 35
  },
  cartButttonsItem: {
    width: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
  },
  countItem: {
    color: '#464951',
    fontFamily: regular,
    fontSize: 35,
    padding: 5,
    paddingBottom: 0,
    margin : 0
  },
});
