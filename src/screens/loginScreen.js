import React from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, Text, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import Zocial from 'react-native-vector-icons/Zocial';
var s = require('../assets/css/styles');
import bg from '../assets/bg.png'
let deviceHeight = Dimensions.get('window').height
let deviceWidth = Dimensions.get('window').width

export default class LoginScreen extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      phone: '',
      isLoading: false
    };
  }

  validatePhoneNumber = () => {
    return this.state.phone && this.state.phone.length>0 ? true : false;
  }

  onSendCode =async()=> {
    this.setState({isLoading: true});
    if (this.validatePhoneNumber()) {
      auth()
        .signInWithPhoneNumber(this.state.phone)
        .then(confirmResult => {
          this.setState({ confirmResult }, ()=> {
            this.setState({
              isLoading: false
            }, ()=>{
              this.props.navigation.navigate('Confirm', {phone: this.state.phone, confirmResult: this.state.confirmResult, fromLogin: true});
            })
          });
        })
        .catch(error => {
          alert(error.message);
          this.setState({isLoading: false});
        });
    } else {
      this.setState({isLoading: false})
      alert('Invalid Phone Number')
    }
  }

  onSignup =()=> {
    this.props.navigation.navigate('Signup', {signupFromLogin: true});
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={s.loader}>
          <ActivityIndicator size="large" color="#0c9" />
        </View>
      )
    }
    return (
      <ImageBackground style={[s.loader, s.padding20, s.image]}>
        <View style={{height: 0.4*deviceHeight, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          <Zocial name='meetup' size={0.3*deviceWidth} color='#173147' style={{width: 0.5*deviceWidth, textAlign: "center"}}/>
          <View><Text style={[s.title]}>Login to meetup</Text></View>
        </View>
        <View style={{height: 0.5*deviceHeight, width: deviceWidth*0.9}}>
          <Text style={[s.ft14300Gray, styles.textLeft, {marginBottom: 10}]}>Enter your Phone number</Text>
          <TextInput
            placeholder="+"
            onChangeText={(phone) => this.setState({ phone })}
            autoCapitalize='none'
            value={this.state.phone}
            style={[s.inputText, s.mb20] }
          />        
          <TouchableOpacity
            style={s.btnActive}
            onPress={this.onSendCode}
            activeOpacity={1}>
            <Text style={ s.activeTxt}>Send Code</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.onSignup}
            style={{marginTop: 0.2*deviceHeight, textAlign: 'center'}}
            activeOpacity={1}>
            <Text style={styles.lineBtnTxt}>New here? Create an account.</Text>
          </TouchableOpacity>
        </View>        
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  textLeft: {
    textAlign:'left',
    width: '100%',
    paddingLeft: 10,
  },
  
  lineBtnTxt: {
    borderBottomColor: '#B2B2B2',
    textAlign: 'center',
    borderBottomWidth: 1,
  },
})