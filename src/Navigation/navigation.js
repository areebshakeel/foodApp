import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native'
// import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Home from '../screens/Home';
import NearByRestaurants from '../screens/NearByRestaurants';
import Favorites from '../screens/Favorites';
import Filters from '../screens/Filters';
import { Icon } from 'native-base';
import AnimatedTabBar from '@gorhom/animated-tabbar';
// import { tabs } from './tab';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Deals from '../screens/DealsAndOffers';
import SearchFilters from '../screens/SearchFilters';
import Menu from '../screens/Menu';
import ItemDetails from '../screens/ItemDetails';
import RestaurantDetails from '../screens/RestaurantDetails'
import Cart from '../screens/Cart';
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddIcon from '../Components/AddIcon';
import Login from '../screens/login';
import Payment from '../screens/PaymentScreen';
import Welcome from '../screens/welcomeScreen';
import Signup from '../screens/createProfile/personalInfo';
import MobileVerification from '../screens/createProfile/mobileVerification';
import VehicleRegistration from '../screens/createProfile/vehicleRegistration';
import ForgotPassword from '../screens/forgotPassword/forgot';
import ResetPassword from '../screens/forgotPassword/reset';
import PaymentMethod from '../screens/paymentMethod/addMethod';
import ScanYourCard from '../screens/paymentMethod/scanYourCard';
import Profile from '../screens/profile/index';
import MyWallet from '../screens/Wallet';
import OrderHistory from '../screens/orderHistory/index';
import Review from '../screens/addReview';
import MyVehicles from '../screens/myVehicles';
import Notifications from '../screens/Notifications';
import AccountInformation from '../screens/accountInformation';
import ChangePassword from '../screens/ChangePassword';
import Reviews from '../screens/Reviews';
import Map from '../screens/Map';
import ActiveOrders from '../screens/activeOrder';
import Dispute from '../screens/dispute';
import Disputes from '../screens/Disputes';
import StartDispute from '../screens/dispute';
import home from '../images/home.png';
import homeFocused from '../images/home-focused.png';
import cart from '../images/cart.png';
import cartFocused from '../images/cart-focused.png';
import location from '../images/location.png';
import locationFocused from '../images/location-focused.png';
import user from '../images/user.png';
import userFocused from '../images/user-focused.png';
import { Image } from 'react-native';
import TermsAndConditions from '../screens/TermsAndConditions';
import PrivacyPolicy from '../PrivacyPolicy';
import Colors from '../config/colors';
import ReachDestination from '../screens/reachDestination'
import OrderReceived from '../screens/orderReceived'
import OrderReady from '../screens/orderReady'
import OrderCompleteView from '../screens/orderComplete';
import OtpVerify from '../screens/otpVerify'
import EditVehicle from '../screens/editVehicle'
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetStartedScreen from '../screens/GetStartedScreen'
import SaveAddress from '../screens/SaveAddress'
import ReOrderScreen from '../screens/ReOrder'
import Restaurants from '../Components/restaurantsList';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="SaveAddress"
        component={SaveAddress}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="VehicleRegistration"
        component={VehicleRegistration}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="OrderHistory"
        component={OrderHistory}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ReOrderScreen"
        component={ReOrderScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Favorites"
        component={Favorites}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Filters"
        component={Filters}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Nearby"
        component={NearByRestaurants}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Menu"
        component={Menu}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Deals"
        component={Deals}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ItemDetails"
        component={ItemDetails}
      />
       <Stack.Screen
        options={{ headerShown: false }}
        name="RestaurantDetails"
        component={RestaurantDetails}
      />
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled : false }}
        name="SearchFilters"
        component={SearchFilters}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Notifications"
        component={Notifications}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Reviews"
        component={Reviews}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ActiveOrders"
        component={ActiveOrders}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ScanYourCard"
        component={ScanYourCard}
      />
    </Stack.Navigator>
  );
}

function ProfleStack() {
  const [tokenState, setTokenState] = useState('')
  const getToken = async () => {

    let token = await AsyncStorage.getItem('Token')
    const TokenValue = JSON.parse(token)
    setTokenState(TokenValue)
    // console.log('Token in Navigation-->> ', TokenValue)
  }


  getToken()


  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={Profile}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="MyWallet"
        component={MyWallet}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="OrderHistory"
        component={OrderHistory}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="MyVehicles"
        component={MyVehicles}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="AccountInformation"
        component={AccountInformation}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="VehicleRegistration"
        component={VehicleRegistration}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="EditVehicle"
        component={EditVehicle}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ChangePassword"
        component={ChangePassword}
      />
    </Stack.Navigator>
  );
}

const Tabs = AnimatedTabBarNavigator();
function TabsScreen() {
  return (
    <Tabs.Navigator
      tabBarOptions={{
        activeTintColor: Colors.AppColor,
        inactiveTintColor: '#fff',
        activeTabBackgrounds: '#be0000',
        tabStyle: { backgroundColor: Colors.AppColor },
      }}
      appearence={{
        activeTabBackgrounds: '#fff',
        dotCornerRadius: 15,
        dotSize: 'small',
      }}>
      <Tabs.Screen
        name="HomeScreen"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (

            <Image source={focused ? homeFocused : home} />
          ),
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="Location"
        component={Map}
        options={{
          tabBarIcon: ({ focused, color, size }) => (

            <Image source={focused ? locationFocused : location} />
          ),
          title: 'Location',
        }}
      />
      <Tabs.Screen
        name="CartTab"
        component={Cart}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View>
              {/* <View
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  right: -10,
                  top: -16,
                  backgroundColor: 'red',
                  borderRadius: 200,
                  height: 20,
                  width: 20,
                }}>
                <Text style={{
                  color: 'white',
                  textAlign: 'center'
                }}>0</Text>
              </View> */}
              <Image source={focused ? cartFocused : cart} />
            </View>
          ),
          title: 'Cart',
        }}
      />
      
      <Tabs.Screen
        name="Profile"
        component={ProfleStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (

            <Image source={focused ? userFocused : user} />
          ),
          title: 'Profile',
        }}
      />
    </Tabs.Navigator>
  );
}

function App() {

  useEffect(()=>{

    getToken()
  },[])
  const [tokenState, setTokenState] = useState('')
  const getToken = async () => {

    let token = await AsyncStorage.getItem('Token')
    const TokenValue = JSON.parse(token)
    setTokenState(TokenValue)
    // console.log('Token in Navigation-->> ', TokenValue)
  }


  getToken()

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          options={{ headerShown: false }}
          name="GetStartedScreen"
          component={GetStartedScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Welcome"
          component={Welcome}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerShown: false, gestureEnabled : false }}
          name="Home"
          
          component={TabsScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Payments"
          component={Payment}
        />
        <Stack.Screen options={{ headerShown: false }}
          name="ReachedDestination"
          component={ReachDestination} />

        <Stack.Screen
          options={{ headerShown: false }}
          name="OrderReceived"
          component={OrderReceived}
        />

        <Stack.Screen
          options={{ headerShown: false }}
          name="OrderReady"
          component={OrderReady}
        />

        <Stack.Screen
          options={{ headerShown: false }}
          name="Dispute"
          component={Dispute}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="OrderComplete"
          component={OrderCompleteView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Signup"
          component={Signup}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="MobileVerification"
          component={MobileVerification}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="OtpVerify"
          component={OtpVerify}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="VehicleRegistration"
          component={VehicleRegistration}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ForgotPassword"
          component={ForgotPassword}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ResetPassword"
          component={ResetPassword}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ScanYourCard"
          component={ScanYourCard}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="PaymentMethod"
          component={PaymentMethod}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Review"
          component={Review}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Disputes"
          component={Disputes}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="StartDispute"
          component={StartDispute}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="TermsAndConditions"
          component={TermsAndConditions}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Privacy"
          component={PrivacyPolicy}
        />
         
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
