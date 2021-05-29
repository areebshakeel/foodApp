import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image, TouchableOpacity } from 'react-native';


const Offers = ({ navigation, data, location }) => {
  console.log('deals Data', data.restaurantId);
  console.log('deals type', data.type);


  return (
    <>
      {
        data.type == 'single' ?
          <TouchableOpacity
            onPress={() => navigation.push('Menu', { restaurantId: data.restaurantId })}
            style={styles.item}>
            <Image style={styles.image} source={{ uri: data.img }} />
          </TouchableOpacity>
          :
          <TouchableOpacity
            onPress={() => navigation.push('Nearby', { dealId: data.dealId, restaurants: 'Restaurants', location: location } )}
            style={styles.item}>
            <Image style={styles.image} source={{ uri: data.img }} />
          </TouchableOpacity>
      }
      {/* <TouchableOpacity
        onPress={() => navigation.push('Menu', { restaurantId: data.restaurantId })}
        style={styles.item}>
        <Image style={styles.image} source={{ uri: data.img }} />
      </TouchableOpacity> */}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  image: {
    width: 225,
    height: 153,
    borderRadius: 10
  }
})

export default Offers;
