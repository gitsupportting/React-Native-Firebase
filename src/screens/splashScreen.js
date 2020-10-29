import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
var s = require('../assets/css/styles');
import Logo from '../assets/logo.png';
let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
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
        <Image
          source={Logo}
          style={ s.ImageIconStyle_logo }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ImageIconStyle_logo_: {
    padding: 12,
    margin: 5,
    height: deviceHeight * 0.11,
    width: deviceWidth * 0.6,
    resizeMode: 'stretch',
  },
  
})
