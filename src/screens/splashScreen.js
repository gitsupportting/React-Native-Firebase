import React from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
var s = require('../assets/css/styles');

export default class SplashScreen extends React.Component {

  async componentDidMount() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
    };    
    AsyncStorage.getItem('userData').then((res)=>{
      if (res =="logout" || !res) {
        this.props.navigation.navigate('Login');
      } else {
        this.props.navigation.navigate('Home');
      }
    });
  }

  render() {
    return (
      <View style={s.loader}>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
})
