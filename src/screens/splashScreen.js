import React from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
var s = require('../assets/css/styles');

export default class SplashScreen extends React.Component {

  componentDidMount() {
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
