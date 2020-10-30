import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, TouchableOpacity, StyleSheet, TextInput, Text, KeyboardAvoidingView, ActivityIndicator, ScrollView, Image, Dimensions, PermissionsAndroid, Platform  } from 'react-native';
import { Form, Item, Picker } from 'native-base';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-picker';
import 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
var s = require('../assets/css/styles');

export default class SignupScreen extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      isLoading: false,
      signupFromLogin: this.props.navigation.state.params.signupFromLogin,	
      phone: this.props.navigation.state.params.phone,
      avatarSource: null,
      firstName: '',
      lastName: '',
      nickname: '',
      school: '',
      favorite: 'Rugby',
    };
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA, {
              'title': 'Camera App Permission',
              'message': 'Camera App needs access to your camera '
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('GRANTED')
          } else {
            alert("CAMERA permission denied");
          }
        } catch (err) {
          alert("Camera permission err", err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    }
  }

  handleUploadPhoto = () => {
    this.setState({
      buttonVisable: true
    })
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    
    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */

    ImagePicker.showImagePicker(options, (response) => {
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          avatarSource: 'data:image/jpeg;base64,' + response.data,
        });
      }
    });
  }

  onValueChange(value) {
    this.setState({
      favorite: value
    });
  }

  onSignup = async () => {	
    
    const {firstName, lastName, nickname, avatarSource, favorite, phone, school, signupFromLogin} = this.state;	
    if (this.validation()) {
      this.setState({isLoading: true});
      if (signupFromLogin) {	
        auth()	
        .signInWithPhoneNumber(phone)	
        .then(confirmResult => {	
          this.setState({ 	
            confirmResult: confirmResult	
          }, ()=>{	
            this.props.navigation.navigate('Confirm', {	
              buttonVisable: false,
              phone: phone, 	
              firstName: firstName,	
              lastName: lastName,	
              nickname: nickname,	
              favorite: favorite,
              school: school,
              avatarSource: avatarSource,
              confirmResult: this.state.confirmResult, 	
              fromLogin: false	
            });	
          });	
        })	
        .catch(error => {	
          alert(error.message);	
          this.setState({isLoading: false});	
        });	
      } else {
        let userDatas = {
          phone: phone,
          avatarSource: avatarSource,
          nickname: nickname,
          school: school,
          firstName: firstName,
          lastName: lastName,
          favorite: favorite        
        }

        firestore()
          .collection('users')
          .add(userDatas)
          .then(() => {
            alert("successfully registered");
            let userData = {	
              'firstName': firstName,	
              'lastName': lastName,	
              'phone': phone
            }	
            AsyncStorage.setItem('userData', JSON.stringify(userData)).then(() => {	
              this.props.navigation.navigate('Home');	
            });	
          })
          .catch(err=>{
            alert(err);
            this.setState({isLoading: false})
          })
        
      }
    }
  }

  validation =()=> {
    const { firstName, lastName, avatarSource, nickname, school, favorite, phone } = this.state;
    if (!phone || phone.length==0) {
      alert("Please insert phone number");
      return false;
    }
    if (!firstName || firstName.length==0) {
      alert("Please insert first name");
      return false;
    }
    if (!lastName || lastName.length==0) {
      alert("Please insert last name");
      return false;
    }
    if (!nickname || nickname.length==0) {
      alert("Please insert nickname");
      return false;
    }
    if (!school || school.length==0) {
      alert("Please insert school");
      return false;
    }
    if (!favorite || favorite.length==0) {
      alert("Please insert favorite sport");
      return false;
    }
    return true;
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
      <KeyboardAvoidingView style={[s.loader, s.padding20]}>        
        <Text style={s.title, s.mt20}>Create Profile</Text>
        <View style={{ marginTop:15, marginBottom:15, alignItems: 'center', justifyContent: 'center' }}>
          {!this.state.buttonVisable &&
            <TouchableOpacity
              style={s.avatar}
              onPress={this.handleUploadPhoto}
            >
              <Text style={{ fontSize: 20, color: '#2684ff', fontWeight: 'bold' }}>Avatar</Text>
            </TouchableOpacity>
          }
          {this.state.avatarSource &&
            <TouchableOpacity
              style={s.avatar}
              onPress={this.handleUploadPhoto}
            >
              <Image source={{ uri: this.state.avatarSource }} style={s.avatar} />
            </TouchableOpacity>}
        </View>
        <ScrollView style={[s.mv15, s.w100]}>        
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>First Name</Text>
          <TextInput
            placeholder="First Name"
            onChangeText={(firstName) => this.setState({ firstName })}
            autoCapitalize='none'
            value={this.state.firstName}
            style={ s.inputText }
          />
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>Last Name</Text>
          <TextInput
            placeholder="Last Name"
            onChangeText={(lastName) => this.setState({ lastName })}
            autoCapitalize='none'
            value={this.state.lastName}
            style={ s.inputText }
          />
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>Nickname</Text>
          <TextInput
            placeholder="Nickname"
            onChangeText={(nickname) => this.setState({ nickname })}
            autoCapitalize='none'
            value={this.state.nickname}
            style={ s.inputText }
          />
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>Phone</Text>
          <TextInput
            placeholder="Phone number"
            onChangeText={(phone) => this.setState({ phone })}
            autoCapitalize='none'
            value={this.state.phone}
            style={ s.inputText }
          />
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>School</Text>
          <TextInput
            placeholder="School"
            onChangeText={(school) => this.setState({ school })}
            autoCapitalize='none'
            value={this.state.school}
            style={ s.inputText }
          />    
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>Favorite Sport</Text>
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                placeholder="Select Favorite Sport"
                placeholderStyle={s.inputText}
                placeholderIconColor="#007aff"
                selectedValue={this.state.favorite}
                onValueChange={this.onValueChange.bind(this)}
              >
                <Picker.Item label="Rugby" value="Rugby"/>
                <Picker.Item label="Cricket" value="Cricket" />
                <Picker.Item label="Swimming" value="Swimming" />
                <Picker.Item label="Footy" value="Footy" />
                <Picker.Item label="Yoga" value="Yoga" />
              </Picker>
            </Item>
          </Form>
        </ScrollView>
        <TouchableOpacity
          style={s.btnActive}
          onPress={this.onSignup}
          activeOpacity={1}>
          <Text style={ s.activeTxt}>Create Profile</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  textLeft: {
    textAlign:'left',
    width: '100%',
    paddingLeft: 10,
  },
})
