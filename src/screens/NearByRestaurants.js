import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    Platform,
    StyleSheet,
    Image,
    TouchableOpacity,
    Pressable,
    FlatList,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Linking
} from 'react-native';
import { strings, setLanguage, isRTL } from '../../locales/i18n';
import BottomBar from '../Components/bottomBar';
import AddressBar from '../Components/addressBar';
import SearchBar from '../Components/searchbar';
import Offers from '../Components/offers';
import { Container, Content, Switch, Tabs, Tab, ScrollableTab, Icon } from 'native-base';
import CustomHeader from '../Components/Header';
import Restaurants from '../Components/restaurantsList';
import { connect } from 'react-redux';
import { getNearByResturantsRequest } from '../redux/getNearbyResturants/getNearByResturantsActions'
import { path } from '../config/path';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Distance from '../Components/distance'
import Duration from '../Components/duration'
import Car from '../images/car.png'
import Colors from '../config/colors';
import Geolocation from '@react-native-community/geolocation';

const LATITUDE_DELTA = 0.0062998339347544174 //Very high zoom level
const LONGITUDE_DELTA = 0.004023313891394764

const filters = [
    'food',
    'high Price',
    '5 Stars',
]
const regular = Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular';
const semiBold =
    Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold';
const medium = Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium';
const bold = Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold';

class NearByRestaurants extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'Daniel',
            lang: 'en',
            token: '',
            data: '',
            animate: true,
            refresh: false,
            currency: '',
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
            },
            error: null,
            refreshing: 0,
            empty: 'No Restaurants Found!'
        };
    }

    async componentDidMount() {
        const { data } = this.props.route.params
        await this.getPosition()
        if (this.props.route.params.dealId) {
            this.getDealItems()
            console.log("called okoko")
            return
        }

        if (!data) {
            console.log("called 21")

            try {
                let token = await AsyncStorage.getItem('Token')
                const TokenValue = JSON.parse(token);
                let data = await AsyncStorage.getItem('Currency')
                const currency = JSON.parse(data);
                this.setState({ token: TokenValue, currency: currency })

                const formData = new FormData()
                formData.append("lat", this.state.region.latitude)
                formData.append("long", this.state.region.longitude)
                await axios.post(path.GET_NEAR_BY_RESTURANTS_API, formData, {
                    headers: {
                        'Authorization': 'Bearer ' + this.state.token,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                    },
                }).then(async (resp) => {
                    let response = resp.data.data
                    let { list } = response
                    // console.log('res in Nearbyy-->> ',list)
                    await this.setState({ data: list, animate: false, empty: list.length == 0 && "No nearby restaurants found!" })
                }).catch((e) => {
                    Alert.alert("Server Error", (e.message), [
                        { text: "OK", onPress: () => this.props.navigation.goBack() }
                    ],
                        { cancelable: false });
                });
            } catch (error) {
                alert(error)
            }
        } else {
            // this.setState({ data: data.list, animate: false })
            console.log(this.state.region);
            let id = this.props.route.params.category
            this.setState({ starterLoader: true })
            const formData = new FormData()
            formData.append("category", id)
            formData.append("lat", this.state.region.latitude)
            formData.append("long", this.state.region.longitude)
            axios.post(path.GET_FILTER_RESTAURANT, formData, {
                headers: {
                    'Authorization': 'Bearer ' + this.state.token,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
            }).then((resp) => {
                let { list } = resp.data.data
                this.setState({ data: list, animate: false, empty: list.length == 0 && "No restaurants found!" })
            }).catch((e) => {
                console.log(e);
            })
        }

    }

    getDealItems = async () => {
        try {
            await this.getPosition()
            if (!this.state.region.latitude) {
                DeviceInfo.isLocationEnabled().then(async (resp) => {
                    if (!resp) {
                        Alert.alert(
                            "Location",
                            "Kindly allow location for best results",
                            [
                                { text: "OK", onPress: () => Linking.openSettings() }
                            ]
                        );
                    }
                })
            } else {
                let token = await AsyncStorage.getItem('Token')
                let TokenValue = JSON.parse(token);
                await this.setState({ token: TokenValue })
                // await this.getPosition()
                console.log('My Token3-->> ', this.props.route.params.dealId)

                const formData = new FormData()
                formData.append("id", this.props.route.params.dealId)
                formData.append("lat", this.state.region.latitude)
                formData.append("long", this.state.region.longitude)

                console.log("formData", formData);
                await axios.post(path.getDealItems, formData, {
                    headers: {
                        'Authorization': 'Bearer ' + TokenValue,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                    },
                }).then(async (resp) => {
                    let response = resp.data.data
                    // alert(JSON.stringify(response))
                    console.log("Irfan response", response.list);
                    await this.setState({ data: response.list, animate: false, empty: response.list.length == 0 && "No nearby restaurants found!" })

                    return
                    await this.setState({ data: response.data })
                    console.log("this.state.reorder", this.state.reorder);
                    this.setState({ loader: false })
                }).catch((e) => {
                    this.setState({ loader: false })
                    console.log('Erro in Home-->> ', e)
                })
            }
        } catch (error) {
            console.log(error)
            alert('Bad Network Connection')
            this.setState({ loader: false })

        }
    }

    getData = async (val) => {


        await this.onRefresh()
        await this.onRefresh()
        this.setState({ refreshing: val + 1 })
    }
    // componentDidUpdate(prevState, prevProps) {
    //     this.state.region != this.state.region

    // }

    gotoFilters = () => {
        this.props.navigation.navigate('SearchFilters')
    }
    navigator = (restaurantsType) => {
        this.props.navigation.navigate('Nearby', { restaurants: restaurantsType })
    }
    toMenu = (restaurantsType) => {
        this.props.navigation.navigate('Menu', { restaurants: "" })
    }

    onRefresh = async () => {
        this.setState({ animate: true })

        if (this.props.route.params.dealId) {
            this.getDealItems()
            console.log("called okoko")
            return
        }

        this.setState({ animate: true })
        const { data } = this.props.route.params
        await this.getPosition()
        if (!data) {
            try {
                let token = await AsyncStorage.getItem('Token')
                const TokenValue = JSON.parse(token);
                let data = await AsyncStorage.getItem('Currency')
                const currency = JSON.parse(data);
                this.setState({ token: TokenValue, currency: currency })

                const formData = new FormData()
                formData.append("lat", this.state.region.latitude)
                formData.append("long", this.state.region.longitude)
                await axios.post(path.GET_NEAR_BY_RESTURANTS_API, formData, {
                    headers: {
                        'Authorization': 'Bearer ' + this.state.token,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                    },
                }).then(async (resp) => {
                    let response = resp.data.data
                    let { list } = response
                    // console.log('res in Nearbyy-->> ',list)
                    await this.setState({ data: list, animate: false, empty: list.length == 0 && "No nearby restaurants found!" })
                }).catch((e) => {
                    Alert.alert("Server Error", (e.message), [
                        { text: "OK", onPress: () => this.props.navigation.goBack() }
                    ],
                        { cancelable: false });
                });
            } catch (error) {
                alert(error)
            }
        } else {
            // this.setState({ data: data.list, animate: false })
            let id = this.props.route.params.category
            this.setState({ starterLoader: true })
            const formData = new FormData()
            formData.append("category", id)
            formData.append("lat", this.state.region.latitude)
            formData.append("long", this.state.region.longitude)
            await axios.post(path.GET_FILTER_RESTAURANT, formData, {
                headers: {
                    'Authorization': 'Bearer ' + this.state.token,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
            }).then(async (resp) => {
                let { list } = resp.data.data
                await this.setState({ data: list, animate: false })
            }).catch((e) => {
                console.log(e);
            })
        }
        this.setState({ animate: false })
    }

    // Getting Location

    getPosition = async () => {
        let location = await AsyncStorage.getItem('location')
        let formattedLocation = JSON.parse(location)

        if (formattedLocation) {
            this.setState({ region: formattedLocation })
        } else {
            Geolocation.getCurrentPosition((position) => {
                // let region = {
                //     latitude: position.coords.latitude,
                //     longitude: position.coords.longitude
                // }
                this.setState({ region: position })
            })
        }
    }

    searchFilter = async (val) => {
        this.setState({ loader: true })
        let formData = new FormData()
        formData.append("category", 0)
        formData.append("foodGroup", 0)
        formData.append("rating", 0)
        formData.append("priceSt", 0)
        formData.append("priceEnd", 0)
        formData.append("discount", 0)
        formData.append("lat", this.state.Location.latitude)
        formData.append("long", this.state.Location.longitude)
        formData.append("distanceSt", "0")
        formData.append("distanceEnd", "9999999999999999")
        formData.append('text', val ? val : "")
        if (this.props.route.params.text || this.state.searchText) {
            console.log('Filter Filled=>')
            await axios.post(path.GET_FILTER_RESTAURANT, formData, {
                headers: {
                    'Authorization': 'Bearer ' + this.state.token,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },
            }).then(async (response) => {
                this.setState({ loader: false })
                console.log('Response in search bar', response.data.data.list)
                await this.setState({
                    data: response.data.data.list
                })
                // this.props.navigation.replace('Filters', {
                //   filters: [this.state.filterText],
                //   data: response.data.data.list,
                //   categoryIds: 0,
                //   selectedCategory: 0,
                //   foodGroupIds: 0,
                //   FoodGroups: 0,
                //   ratingIds: 0,
                //   rating: 0,
                //   price: 0,
                //   PriceRange: 0,
                //   token: this.state.token,
                //   curbside: -1,
                //   distance: "9999999999999999"
                // })
            }).catch((e) => {
                this.setState({ loader: true })
                console.log('Error Search Text Filter', e);
            })
            this.setState({ loader: false })
        } else {
        }

    }

    render() {
        // console.log('Statee Dataa-->> ', this.state.list)
        const heading = this.props.route.params.restaurants
        this.props.navigation.addListener('focus', () => {
            this.forceUpdate()
        })
        return (
            <Container key={this.state.refreshing}>
                <Content style={{ width: '100%', flex: 1, flexDirection: 'column' }} refreshControl={<RefreshControl refreshing={this.state.refresh} onRefresh={this.onRefresh} />}>
                    <View style={{ marginTop: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon onPress={() => this.props.navigation.replace('Home')} name='arrow-back-outline' />
                            <AddressBar sendData={this.getData} list={this.props.data} navigation={this.props.navigation} />
                        </View>
                        {/* <SearchBar navigation={this.props.navigation} search searchFunction={(val) => { this.setState({ searchText: val }) }}
                            searchButtonOnpress={() => this.searchFilter(this.state.searchText)}
                            navigator={this.navigator} gotoFilters={this.gotoFilters} /> */}
                    </View>
                    <View style={{ flex: 0.8, marginTop: 2, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <CustomHeader heading={heading} filters={heading === "Filters:" ? filters : []} />
                        {/* <Restaurants restaurantsData={this.state.list} navigator={this.toMenu} numColumns={2} horizontal={false} /> */}
                        {this.state.animate ? <ActivityIndicator size="large" color={Colors.AppColor} style={{ zIndex: 99 }} /> : <View style={{ marginHorizontal: 10 }}>
                            <FlatList
                                showsHorizontalScrollIndicator={false}
                                data={this.state.data}
                                extraData={this.state.refreshing}
                                numColumns={2}
                                horizontal={false}
                                ListEmptyComponent={() => {
                                    return (
                                        <View style={{
                                            paddingVertical: 20,
                                            width: Dimensions.get('screen').width,
                                        }}>
                                            <Text style={{ fontFamily: semiBold, fontSize: 15, textAlign: 'center' }}>{this.state.empty} 😟</Text>
                                        </View>
                                    )
                                }}
                                renderItem={({ item }) => {
                                    // console.log('isfavorite-->> ', item)
                                    function shortDesc(str) {
                                        length_temp = 15;
                                        let temp_ret = str.length > length_temp ? (str.substring(0, length_temp) + "...") : (str);
                                        return temp_ret;
                                    }
                                    return (
                                        <Pressable onPress={() => this.props.navigation.push('Menu',
                                            { restaurantId: item.restaurantId, lat: this.state.region.latitude, long: this.state.region.longitude })}
                                            style={styles.item}>
                                            <Image style={styles.image1} source={{ uri: item.img }} />
                                            <View style={styles.row}>
                                                <Text style={styles.title}>{shortDesc(item.name)}</Text>
                                                <Text style={styles.title}>{(this.state.currency ? this.state.currency : "AED") + " " + item.avgPrice}</Text>
                                            </View>
                                            <View style={styles.row}>
                                                <Text style={styles.subTitle}>{item.name}</Text>
                                                {item.isCurbPickup == "on" ? <Image source={Car} style={{ height: 10, width: 28 }} /> : null}
                                            </View>
                                            <View style={styles.row}>
                                                <View style={styles.subRow}>
                                                    <Icon name="star" style={styles.star} />
                                                    <Text style={styles.title}>{item.rating ? parseFloat(item.rating).toFixed(1) : 0}</Text>
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
                                }}
                                keyExtractor={(item) => item.id}
                            />
                        </View>}
                    </View>
                </Content>
            </Container>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateNearby: (token) => dispatch(getNearByResturantsRequest(token))
    }
}

function mapStateToProps(state, ownProps) {
    // Getting The User Token
    const userData = state.userReducer.user || {};
    const { profile, token } = userData
    // console.log()
    const userError = state.userReducer.error
    // console.log('user Token inside Resturants-->> ', userData)


    // Getting data from near By Reducer
    const nearbyData = state.getNearByResturantsReducer
    const { data } = nearbyData
    // const {list}= data
    // console.log('Dataa from Nearby Reducer', data)
    return { userData, userError, data }
}

const styles = StyleSheet.create({
    favorite: {
        fontFamily: semiBold,
        fontSize: 15,
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
        // width:"40%",
        marginVertical: 5,
        // marginHorizontal: 2.5,
        backgroundColor: '#F3F4F4',
        borderRadius: 10,
        // borderBottomRightRadius: 10,
    },
    image: {
        width: Dimensions.get('window').width / 2.2,
        height: 113,
        borderRadius: 10,
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
        alignSelf: 'center',
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

    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        // width: '95%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    item: {
        backgroundColor: '#FFFFF',
        // padding: 20,
        // width:"40%",
        marginVertical: 5,
        marginHorizontal: 2.5,
        backgroundColor: '#F3F4F4',
        borderRadius: 10,
        // borderBottomRightRadius: 10,
    },
    image1: {
        width: Dimensions.get('window').width / 2.2,
        height: 113,
        borderRadius: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // width: 155,
        // alignSelf: 'center',
        // alignItems: 'center',
        marginHorizontal: 4,
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
        alignSelf: 'center',
    },
    subTitle: {
        color: '#979797',
        fontFamily: regular,
        fontSize: 8,
    },
    // car: {
    //   transform: [{rotateY: '180deg'}],
    //   fontSize: 25,
    //   alignSelf: 'center',
    //   textAlign: 'left',
    //   width: 25,
    //   alignItems: 'center',
    //   color: '#464951',
    // },
    star: {
        color: Colors.AppColor,
        fontSize: 15,
        alignSelf: 'center',
        paddingBottom: 5,
    },
});


export default connect(mapStateToProps, mapDispatchToProps)(NearByRestaurants);