import { createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'

import splashScreen from './screens/splashScreen'
import loginScreen from './screens/loginScreen'
import confirmScreen from './screens/confirmScreen'
import signupScreen from './screens/signupScreen'
import profileDetailScreen from './screens/profileDetailScreen'
import profileEditScreen from './screens/profileEditScreen'
import homeScreen from './screens/homeScreen'
import chatScreen from './screens/chatScreen'
import CreateMeetupScreen from './screens/createMeetupScreen'
import MeetupDetailScreen from './screens/meetupDetailScreen'
import TodayMeetupScreen from './screens/todayMeetupScreen'
import MyMeetupScreen from './screens/myMeetupScreen'

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
  Chat: {
    screen: chatScreen
  },
  CreateMeetup: {
    screen: CreateMeetupScreen
  },
  MeetupDetail: {
    screen: MeetupDetailScreen
  },
  TodayMeetup: {
    screen: TodayMeetupScreen
  },
  MyMeetup: {
    screen: MyMeetupScreen
  },
}, {
  initialRouteName: 'Splash',
  headerMode: 'none'
});

const Root = createAppContainer(Navigation);

export default Root;
