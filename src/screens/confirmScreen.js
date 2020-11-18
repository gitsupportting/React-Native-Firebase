import React from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, Text, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
var s = require('../assets/css/styles');
import backBtn from '../assets/icons/backBtn.png';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

export default class ConfirmScreen extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      verificationCode: '',
      phone: this.props.navigation.state.params.phone,
      confirmResult: this.props.navigation.state.params.confirmResult,
      fromLogin: this.props.navigation.state.params.fromLogin,
      isLoading: false
    };
  }

  componentDidMount () {
    messaging().getToken().then(token => {
      this.setState({tokens: firestore.FieldValue.arrayUnion(token)._elements[0][1]});
    });
  }

  /** upload image to Google Storage
  *
  * convert file into blob for Google Cloud Storage: 
  *    create a new XMLHttpRequest and set its responseType to 'blob',
  * then open the connection and retrieve the URI's data (the image) with GET
  *
  * @async
  *  @type {InnerFunctions.uploadImage}
  *  @param {string} uri
  *  @returns {object}
  * 
  * 
  */
  uploadImage = async(uri) => {
    try {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                resolve(xhr.response);
            };
            xhr.onerror = (e) => {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        /* create a reference to a file you want to operate on.  "storage" 
        is the Google Storage parent container for all our files there.
        */
      let imageName = 'profilePic' + new Date();
        const ref = storage().ref().child(imageName);
        await ref.put(blob);

        blob.close();
        
        return await storage().ref(imageName).getDownloadURL();
    } catch(error) {
        console.log(error);
    }
  };

  handleVerifyCode = () => {
    // Request for OTP verification
    this.setState({isLoading: true})
    const { confirmResult, verificationCode, tokens } = this.state;
    
    if (verificationCode.length == 6) {
      confirmResult
        .confirm(verificationCode)
        .then(async(user) => {
          this.setState({ 
            uid: user.user._user.uid,
           });
          if (this.state.fromLogin) {
            var isReg = false;
            let userData = {};

            await firestore().collection('users')
            .where('phone', '==', this.state.phone)
            .get()
            .then(querySnapshot => {
                querySnapshot.docs.map((doc) => {                  
                  let user = doc.data();
                  isReg = true;
                  userData = {
                    'firstName': user.firstName,
                    'lastName': user.lastName,
                    'phone': user.phone,
                    'url': user.avatarSource
                  }
                  firestore().collection("users").doc(doc.id).update({tokens: tokens})
                  .then(()=>{
                    AsyncStorage.setItem('userData', JSON.stringify(userData)).then(() => {
                      this.props.navigation.navigate('Home');
                    });
                  })
                });
            });
            
            if (!isReg) {
              this.props.navigation.navigate('Signup', {signupFromLogin: false, phone: this.state.phone, tokens: this.state.tokens});
            }
            
          } else {
            const url = await this.uploadImage(this.props.navigation.state.params.avatarSource);
            let userDatas = {
              phone: this.props.navigation.state.params.phone,
              avatarSource: url,
              nickname: this.props.navigation.state.params.nickname,
              school: this.props.navigation.state.params.school,
              firstName: this.props.navigation.state.params.firstName,
              lastName: this.props.navigation.state.params.lastName,
              favorite: this.props.navigation.state.params.favorite,
              tokens: tokens
            }
            firestore()
              .collection('users')
              .add(userDatas)
              .then(() => {
                alert("successfully registered");
                let userData = {	
                  'firstName': this.props.navigation.state.params.firstName,	
                  'lastName': this.props.navigation.state.params.lastName,	
                  'phone': this.props.navigation.state.params.phone,
                  'url': url
                }	
                AsyncStorage.setItem('userData', JSON.stringify(userData)).then(() => {	
                  this.props.navigation.navigate('Home');	
                });	
              })
              .catch(err=>{
                alert(err);
              })
          }
          // alert(`Verified! ${user.user._user.uid}`);
        })
        .catch(error => {
          alert(error.message);
          this.setState({isLoading: false});
        })
    } else {
      alert('Please enter a 6 digit OTP code.');
      this.setState({isLoading: false});
    }
  }

  onBack =()=> {
    this.props.navigation.navigate('Login');
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
        <TouchableOpacity
          style={styles.backBtn}
          onPress={this.onBack}
          activeOpacity={1}>
          <Image source={backBtn} style={s.backIcon}/>
        </TouchableOpacity>
        <Text style={s.title}>ENTER CONFIRMATION CODE</Text>
        <TextInput
          placeholder="confirm code"
          onChangeText={(verificationCode) => this.setState({ verificationCode })}
          autoCapitalize='none'
          value={this.state.verificationCode}
          style={ [s.inputText, s.mv60] }
        />        
        <TouchableOpacity
          style={s.btnActive}
          onPress={this.handleVerifyCode}
          activeOpacity={1}>
          <Text style={ s.activeTxt}>Submit</Text>
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
  backBtn: {
    position: 'absolute',
    left: 25,
    top: 40,
  }
})
