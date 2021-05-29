import { TabsConfig, BubbleTabBarConfig } from '@gorhom/animated-tabbar';
import { Icon } from 'native-base'
import Icons from './icon'
export const tabs: TabsConfig<BubbleTabBarConfig> = {
  Home: {
    labelStyle: {
      color: '#5B37B7',
    },
    icon: {
      component: Icons,
      activeColor: 'rgba(91,55,183,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: 'rgba(223,215,243,1)',
      inactiveColor: 'rgba(223,215,243,0)',
    },
    navigationOptions: {
      tabBarOnPress: ({navigation})=>{
          return navigation.push("Nearby")
      },
      title:"abc"
  },
    
  },
  Favorites: {
    labelStyle: {
      color: '#1194AA',
    },
    icon: {
      component: Icons,
      activeColor: 'rgba(17,148,170,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: 'rgba(207,235,239,1)',
      inactiveColor: 'rgba(207,235,239,0)',
    },
    navigationOptions: {
      tabBarOnPress: ({navigation})=>{
          return navigation.push("Nearby")
      },
      title:"abc"
  },
  },
  Nearby: {
    labelStyle: {
      color: '#1194AA',
    },
    icon: {
      component: Icons,
      activeColor: 'rgba(17,148,170,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: 'rgba(207,235,239,1)',
      inactiveColor: 'rgba(207,235,239,0)',
    },
    navigationOptions: {
      tabBarOnPress: ({navigation})=>{
          return navigation.push("Nearby")
      },
      title:"abc"
  },
  },
  Filters: {
    labelStyle: {
      color: '#1194AA',
    },
    icon: {
      component: Icons,
      activeColor: 'rgba(17,148,170,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: 'rgba(207,235,239,1)',
      inactiveColor: 'rgba(207,235,239,0)',
    },
    navigationOptions: {
      tabBarOnPress: ({navigation})=>{
          return navigation.push("Nearby")
      },
      title:"abc"
  },
  },
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarOnPress: ({ navigation, defaultHandler }) => {
      console.log('onPress:', navigation.state.routeName);
      defaultHandler()
    },
  }),
};