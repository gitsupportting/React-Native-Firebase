import { createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'

import splashScreen from './screens/splashScreen'
import loginScreen from './screens/loginScreen'
import confirmScreen from './screens/confirmScreen'
import signupScreen from './screens/signupScreen'
import homeScreen from './screens/homeScreen'

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
}, {
  initialRouteName: 'Splash',
  headerMode: 'none'
});

const Root = createAppContainer(Navigation);

export default Root;
