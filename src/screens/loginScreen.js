import React from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, Text, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
var s = require('../assets/css/styles');

export default class LoginScreen extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      phone: '12345678',
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
          this.setState({ confirmResult }, ()=>{
            this.props.navigation.navigate('Confirm', {phone: this.state.phone, confirmResult: this.state.confirmResult, fromLogin: true});
          });
        })
        .catch(error => {
          alert(error.message);
          this.setState({isLoading: false});
          console.log(error)
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
      <View style={[s.loader, s.padding20]}>
        <Text style={s.title}>LOGIN</Text>
        <Text style={[s.ft12Black, s.mv25, styles.textLeft]}>Phone</Text>
        <TextInput
          placeholder="+1"
          onChangeText={(phone) => this.setState({ phone })}
          autoCapitalize='none'
          value={this.state.phone}
          style={ styles.inputText }
        />        
        <TouchableOpacity
          style={styles.btnActive}
          onPress={this.onSendCode}
          activeOpacity={1}>
          <Text style={ styles.activeTxt}>Send Code</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.onSignup}
          activeOpacity={1}>
          <Text style={styles.lineBtnTxt}>New here? Create an account.</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textLeft: {
    textAlign:'left',
    width: '100%',
    paddingLeft: 10,
  },
  inputText: {
    borderRadius: 8,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    padding:5,
    width: '100%',
    fontFamily: 'NunitoSans-Light',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 19,
    color: '#173147',
    backgroundColor: '#fff',
  },
  btnActive: {
    height: 50,
    backgroundColor: '#173147',
    borderRadius: 8,
    borderColor: '#173147',
    borderWidth: 1,
    marginVertical: 30,
    width: '100%',
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeTxt: {
    fontFamily: 'Lato-Light',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 17,
    color:'#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  lineBtnTxt: {
    borderBottomColor: '#B2B2B2',
    marginTop: 20,
    borderBottomWidth: 1
  },
  pr40: {
    paddingRight: 50,
  },
})