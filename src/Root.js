import { createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'

import splashScreen from './screens/splashScreen'
import loginScreen from './screens/loginScreen'
import confirmScreen from './screens/confirmScreen'
import signupScreen from './screens/signupScreen'
import homeScreen from './screens/homeScreen'
import profileDetailScreen from './screens/profileDetailScreen'
import profileEditScreen from './screens/profileEditScreen'

const Navigation = createStackNavigator({
  Splash: {
    screen: splashScreen
  },
  Login: {
    screen: loginScreen
  },
  Confirm: {
    screen: confirmScreen
  },
  Signup: {
    screen: signupScreen
  },
  Home: {
    screen: homeScreen
  },
  ProfileDetail: {
    screen: profileDetailScreen
  },
  ProfileEdit: {
    screen: profileEditScreen
  },
}, {
  initialRouteName: 'Splash',
  headerMode: 'none'
});

const Root = createAppContainer(Navigation);

export default Root;
