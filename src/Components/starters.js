import React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  Platform,
  TouchableOpacity
} from 'react-native';
import soup from '../images/soup.png';
import salad from '../images/salad.png';
import burrito from '../images/burrito.png';
import steaks from '../images/steaks.png';
import Colors from '../config/colors';

const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
  Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Buritto',
    img: burrito,
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Steaks',
    img: steaks,
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Soup',
    img: soup,
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d73',
    title: 'Salad',
    img: salad,
  },
];



const Item = ({ title, img, id, navigation }) => {
  const onpress = ({ id, navigation }) => {
    navigation.navigate('Nearby', {
      restaurants: `Items with ${id}`, location: {
        latitude: '25.076798',
        longitude: '55.210413',
        latitudeDelta: 0.0062998339347544174,
        longitudeDelta: 0.004023313891394764,
      }
    });
  }
  return (
    <TouchableOpacity style={styles.item} onPress={() => onpress(id)}>
      <View style={styles.starter}>
        <View style={{ height: 45, width: 45 }}>
          <Image source={{ uri: img }} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
        </View>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
};

const Starters = (data, navigation) => {
  // const renderItem = ({ item }) => <Item title={item.name} img={item.img} id={item.id} navigation={navigation} />;
console.log(navigation);
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={data.data}
        horizontal={true}
        renderItem={({item,navigation}) => {
          const onpress = (id) => {
            navigation.navigate('Nearby', {
              restaurants: `Items with ${id}`, location: {
                latitude: '25.076798',
                longitude: '55.210413',
                latitudeDelta: 0.0062998339347544174,
                longitudeDelta: 0.004023313891394764,
              }
            });
          }
          return (
            <TouchableOpacity style={styles.item} onPress={() => onpress(item.id)}>
              <View style={styles.starter}>
                <View style={{ height: 45, width: 45 }}>
                  <Image source={{ uri: item.img }} style={{ height: '100%', width: '100%', resizeMode: 'contain' }} />
                </View>
                <Text style={styles.text}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  starter: {
    width: 93,
    height: 103,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.AppColor,
  },
  salad: {
    width: 60,
    height: 40,
  },
  image2: {
    width: 45,
    height: 51,
  },
  text: {
    marginTop: 10,
    color: '#232E4E',
    fontFamily: semiBold,
    fontSize: 13,
  },
});

export default Starters;
