import React, { Component } from 'react'
import { Content, Container } from 'native-base'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Image,
    RefreshControl,
    Dimensions,
    FlatList,
    Pressable,
    ActivityIndicator
} from 'react-native'

import Colors from '../../config/colors'
import { Icon } from 'native-base';
import axios from 'axios';
import { path } from '../../config/path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Restaurants from '../../Components/restaurantsList';
import Distance from '../../Components/distance';
import Duration from '../../Components/duration';
import ReviewCard from '../../Components/ReviewCard';


const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
    Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

export default class RestaurantDetails extends Component {
    state = {
        restaurantId: "",
        Restaurant: [],
        Reviews: [],
        BestSeller: [],
        refresh: false,
        token: '',
        loader : true,
    }

    async componentDidMount() {
        const { restaurantId } = this.props.route.params
        let token = await AsyncStorage.getItem('Token')
        let TokenValue = JSON.parse(token)

        let location = await AsyncStorage.getItem('location')
        let longlat = JSON.parse(location)
        console.log(longlat);
        this.setState({ token: TokenValue })
        let form = new FormData()
        form.append('rid', restaurantId)
        form.append('lat', longlat.latitude)
        form.append('long', longlat.longitude)
        this.setState({ restaurantId })
        await axios.post(path.master_restaurants, form, {
            headers: {
                'Authorization': 'Bearer ' + TokenValue,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then((resp) => {
            this.setState({
                Restaurant: resp.data.data.list.Restaurant,
                Reviews: resp.data.data.list.Reviews,
                BestSeller: resp.data.data.list.BestSeller,
                loader : false,
                distance : resp.data.data.list.Restaurant[0].distance
            })
            console.log("Reviews",resp.data.data.list.Restaurant[0].distance);
        }).catch((e) => {
            console.log((e.message));
        })
    }
    onRefresh = async () => {
        this.setState({ refresh: true })
        let form = new FormData()
        form.append('rid', this.state.restaurantId)
        await axios.post(path.master_restaurants, form, {
            headers: {
                'Authorization': 'Bearer ' + this.state.token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then((resp) => {
            this.setState({
                Restaurant: resp.data.data.list.Restaurant,
                Reviews: resp.data.data.list.Reviews,
                BestSeller: resp.data.data.list.BestSeller
            })
        }).catch((e) => {
            console.log((e.message));
        })
        this.setState({ refresh: false })
    }
    render() {
        return (
            <Container>
                <Content style={{ width: '100%', flex: 1, flexDirection: 'column' }} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refresh}
                        onRefresh={this.onRefresh}
                    />
                }>
                    <View>
                        {this.state.Restaurant.map((item) => {
                            return (
                                <Image
                                    source={{ uri: item.img }}
                                    style={{
                                        marginTop: 0,
                                        height: Dimensions.get('window').height / 3.5,
                                        width: Dimensions.get('window').width,
                                    }}
                                />
                            )
                        })}
                        <View style={{ position: 'absolute', top: 10, backgroundColor: 'white', left: 10, padding: 10, borderRadius: 200 }}>
                            <Icon
                                style={{ color: '#000' }}
                                onPress={() => this.props.navigation.goBack()}
                                name="arrow-back-outline"
                            />
                        </View>
                    </View>
                    <View style={styles.body}>

                        {this.state.Restaurant.map((item) => {
                            return (
                                <>
                                    <Text style={styles.heading}>{item.name}</Text>
                                    <Text style={{
                                        fontSize: 15,
                                        color: Colors.borderColor,
                                        marginLeft: 20,
                                        marginTop: 10
                                    }}>{shortDesc(item.address)}</Text>
                                </>
                            )
                        })}
                        {this.state.Restaurant.map((item) => {
                            return item.rating ? (
                                <View style={{
                                    height: 45,
                                    width: 45,
                                    backgroundColor: '#00E0A0',
                                    position: 'absolute',
                                    zIndex: 10,
                                    top: -23,
                                    right: 23,
                                    borderTopLeftRadius: 10,
                                    borderBottomRightRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{ color: 'white', fontSize: 22, fontFamily: semiBold }}>
                                        {parseFloat(item.rating).toFixed(1)}
                                    </Text>
                                </View>
                            ) : null
                        })}
                        <View style={{
                            backgroundColor: '#F2F8FF',
                            paddingVertical: 15,
                            marginHorizontal: 15,
                            marginTop: 14,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#E8F0F9',
                            flexDirection: 'row'
                        }}>
                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                <View style={{
                                    alignSelf: 'center'
                                }}>
                                    <Icon
                                        name="time-outline"
                                        style={{
                                            color: "#00DE9C",
                                            marginBottom: 10
                                        }}
                                    />
                                </View>
                                <Text style={{ color: Colors.borderColor, textAlign: 'center' }}>
                                    10Am-11Pm
                                </Text>
                            </View>
                            <View style={{ flex: 0.4, justifyContent: 'center' }}>
                                <View style={{
                                    alignSelf: 'center'
                                }}>
                                    <Icon
                                        name="location"
                                        style={{
                                            color: Colors.AppColor,
                                            marginBottom: 10
                                        }}
                                    />
                                </View>
                                <Text style={{ color: Colors.borderColor, textAlign: 'center' }}>
                                    {(this.state.distance/1000).toFixed(2)}Km
                                </Text>
                            </View>
                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                <View style={{
                                    alignSelf: 'center'
                                }}>
                                    {this.state.Restaurant.map((item) => {
                                        return item.isCurbPickup == "on" ?
                                            <Image
                                                source={require('../../images/car_green.png')}
                                                style={{
                                                    marginBottom: 10
                                                }}
                                            /> :
                                            <Image
                                                source={require('../../images/car.png')}
                                                style={{
                                                    marginBottom: 10
                                                }}
                                            />
                                    })}
                                </View>
                                <Text style={{ color: Colors.borderColor, textAlign: 'center' }}>
                                    Curbside{'\n'}Pickup
                                </Text>
                            </View>
                        </View>
                        <View style={{ margin: 15 }}>
                            <Text style={{
                                fontFamily: semiBold,
                                fontSize: 20,
                                marginTop: 26
                            }}>
                                Details
                            </Text>
                            {this.state.Restaurant.map((item) => {
                                return (
                                    <>
                                        <Text style={{
                                            fontSize: 15,
                                            color: Colors.borderColor,
                                            marginTop: 9
                                        }}>{(item.description)}</Text>
                                    </>
                                )
                            })}
                            <Text style={{
                                fontFamily: semiBold,
                                fontSize: 20,
                                marginTop: 26,
                                marginBottom : 11
                            }}>
                                Popular Items
                            </Text>
                            {console.log(this.state.BestSeller)}
                            <FlatList
                                horizontal
                                data={this.state.BestSeller}
                                ListEmptyComponent = {
                                    ()=>{
                                        return <View style = {{width : Dimensions.get('window').width-30}}><Text style = {{textAlign : 'center', fontFamily : semiBold}}>No Popular Items Found</Text></View>
                                    }
                                }
                                renderItem={
                                    ({ item }) => {
                                        return (
                                            <Pressable onPress={() => this.props.navigation.push('ItemDetails', { itemId: item.itemId })} style={styles.item}>
                                                <Image style={styles.image} source={{ uri: item.img }} />
                                                <View style={styles.row}>
                                                    <View style={{ flex: 0.7 }}>
                                                        <Text style={styles.title}>{shortDesc(item.name)}</Text>
                                                    </View>
                                                    <View style={{ flex: 0.3 }}>
                                                        <Text style={styles.title}>{"AED " + item.avgPrice}</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.row}>
                                                    <Text style={styles.subTitle}>{shortDesc(item.restaurant)}</Text>
                                                    {item.isCurbPickup == "on" ? <Image source={require('../../images/car.png')} style={{ height: 10, width: 28 }} /> : null}
                                                </View>
                                                <View style={styles.row}>
                                                    <View style={styles.subRow}>
                                                        <Icon name="star" style={styles.star} />
                                                        <Text style={styles.title}>{Math.round(item.rating)}</Text>
                                                    </View>
                                                    <View
                                                        style={{
                                                            ...styles.subRow,
                                                            width: 100,
                                                            justifyContent: 'space-between',
                                                        }}>
                                                        <Distance distance={item.distance ? ((Math.round(item.distance >= 1000 ? (item.distance / 1000) : item.distance)) + (item.distance >= 1000 ? 'km' : 'm')) : '0m'} />
                                                        <View style={{ width: 2 }} />
                                                        <Duration duration={Math.round(item.time) + "m"} />
                                                    </View>
                                                </View>
                                            </Pressable>
                                        )
                                    }
                                }
                            />
                        </View>
                        <View style = {{marginHorizontal : 15}}>
                            <View style = {{flexDirection : 'row'}}>
                                <View style = {{flex : 0.8, justifyContent : 'center'}}>
                                    <Text style={{
                                        fontFamily: semiBold,
                                        fontSize: 20,
                                        marginBottom : 11
                                    }}>
                                        Reviews
                                    </Text>
                                </View>
                                <View style = {{flex : 0.2, justifyContent : 'center'}}>
                                    {this.state.Reviews.length > 0 &&
                                        <TouchableOpacity onPress = {()=>{
                                            this.props.navigation.push('Reviews', {rid : this.state.restaurantId})
                                        }}>
                                            <Text style={{
                                                color : Colors.borderColor,
                                                textAlign : 'right',
                                                textDecorationLine : 'underline'
                                            }}>
                                                View all
                                            </Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                            <FlatList
                                data = {this.state.Reviews}
                                ListEmptyComponent = {
                                    ()=>{
                                        return <View style = {{width : Dimensions.get('window').width-30}}><Text style = {{textAlign : 'center', fontFamily : semiBold}}>No Reviews Found</Text></View>
                                    }
                                }
                                renderItem = {({item, index})=>{
                                    if(index < 3){
                                        return(
                                            <ReviewCard
                                                title={item.name}
                                                description={item.comments}
                                                date={new Date((item.createdAt).replace(" ","T")).toLocaleDateString('en-US')}
                                                star={item.rating}
                                            />
                                        )
                                    } else {
                                        return
                                    }
                                }}
                            />
                        </View>
                    </View>
                    {this.state.loader ? <ActivityIndicator
                        animating={true}
                        style={{ marginVertical: 50 }}
                        size={Platform.OS === 'android' ? 50 : 'large'}
                        color={Colors.AppColor}
                    /> : null}
                </Content>
            </Container>
        )
    }
}

function shortDesc(str) {
    length_temp = 40;
    let temp_ret = str.length > length_temp ? (str.substring(0, length_temp) + "...") : (str);
    return temp_ret;
}

const styles = StyleSheet.create({
    favorite: {
        fontFamily: semiBold,
        fontSize: 15,
    },
    heading: {
        color: Colors.AppColor,
        fontFamily: semiBold,
        fontSize: 30,
        lineHeight: 40,
        marginHorizontal: 20,
        marginTop: 20
    },
    banner: {
        marginVertical: 5,
        marginBottom: 15,
        width: '95%',
        alignSelf: 'center',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 153,
        borderRadius: 10,
    },
    nearBy: {
        position: 'absolute',
        color: '#ffffff',
        fontSize: 15,
    },
    body: {
        flex: 0.8,
        marginTop: -20,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        width: '95%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    item: {
        backgroundColor: '#FFFFF',
        // padding: 20,
        // width:"50%",
        // marginVertical: 5,
        marginHorizontal: 2.5,
        backgroundColor: '#F3F4F4',
        borderRadius: 10,
        // borderBottomRightRadius: 10,
    },
    image: {
        width: Dimensions.get('window').width / 2.2,
        height: 113,
        borderRadius: 10,
    },
    row: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 155,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F4',
        marginTop: 4,
    },
    subRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: 30,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F4',
        paddingBottom: 5,
        marginTop: 4,
    },
    title: {
        color: '#464951',
        fontFamily: semiBold,
        fontSize: 12,
        // alignSelf: 'center',
    },
    subTitle: {
        color: '#979797',
        fontFamily: regular,
        fontSize: 8,
    },
    car: {
        transform: [{ rotateY: '180deg' }],
        fontSize: 25,
        alignSelf: 'center',
        textAlign: 'left',
        width: 25,
        alignItems: 'center',
        color: '#464951',
    },
    star: {
        color: Colors.AppColor,
        fontSize: 15,
        alignSelf: 'center',
        paddingBottom: 5,
    },

});