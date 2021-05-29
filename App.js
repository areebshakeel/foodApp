/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  LogBox
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { createAppContainer } from 'react-navigation';
import AppNavigator from './src/Navigation/navigation';
// const AppContainer = createAppContainer(AppNavigator);
// import LoginScreen from './src/screens/Login';
import Home from './src/screens/Home';
import NearByRestaurants from './src/screens/NearByRestaurants';
import Favorites from './src/screens/Favorites';
import Filters from './src/screens/Filters';
import { Container, Root } from 'native-base';
import SplashScreen from 'react-native-splash-screen'
import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Provider} from 'react-redux'
import {store} from './src/redux/store'

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
const App = () => {
  useEffect(
      ()=>SplashScreen.hide(),
    [],
  );
  return (
    <Provider store={store} >
    <SafeAreaProvider>
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Container style={{ flex: 1, backgroundColor: '#fffff' }}>
          <Root>
            <AppNavigator />
          </Root>
        </Container>
      </>
    </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
