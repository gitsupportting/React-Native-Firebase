import { createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'

import splashScreen from './screens/splashScreen'
import loginScreen from './screens/loginScreen'
import confirmScreen from './screens/confirmScreen'
import signupScreen from './screens/signupScreen'
import profileDetailScreen from './screens/profileDetailScreen'
import profileEditScreen from './screens/profileEditScreen'
import homeScreen from './screens/homeScreen'
import CreateMeetupScreen from './screens/createMeetupScreen'
import TodayMeetupScreen from './screens/todayMeetupScreen'

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
  ProfileDetail: {
    screen: profileDetailScreen
  },
  ProfileEdit: {
    screen: profileEditScreen
  },
  Home: {
    screen: homeScreen
  },
  CreateMeetup: {
    screen: CreateMeetupScreen
  },
  TodayMeetup: {
    screen: TodayMeetupScreen
  },
}, {
  initialRouteName: 'Splash',
  headerMode: 'none'
});

const Root = createAppContainer(Navigation);

export default Root;