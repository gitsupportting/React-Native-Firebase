import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, TouchableOpacity, StyleSheet, TextInput, Text, KeyboardAvoidingView, ActivityIndicator, ScrollView, Image, Dimensions, PermissionsAndroid, Platform  } from 'react-native';
import { Form, Item, Picker } from 'native-base';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-ionicons'
import Ionicons from 'react-native-vector-icons/Ionicons';
import 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
var s = require('../assets/css/styles');
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

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
      favorite: null,
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
              'firstName': this.props.navigation.state.params.firstName,	
              'lastName': this.props.navigation.state.params.lastName,	
              'phone': this.props.navigation.state.params.phone	
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
        <Image source={this.state.avatarSource} style={styles.uploadAvatar} />
        <Text style={s.title}>Create Profile</Text>
        <View style={{ marginTop:15, marginBottom:15, alignItems: 'center', justifyContent: 'center' }}>
          {!this.state.buttonVisable &&
            <TouchableOpacity
              style={styles.avatar}
              onPress={this.handleUploadPhoto}
            >
              <Text style={{ fontSize: 20, color: '#2684ff', fontWeight: 'bold' }}>Avatar</Text>
            </TouchableOpacity>
          }
          {this.state.avatarSource &&
            <TouchableOpacity
              style={styles.avatar}
              onPress={this.handleUploadPhoto}
            >
              <Image source={{ uri: this.state.avatarSource }} style={styles.avatar} />
            </TouchableOpacity>}
        </View>
        <ScrollView style={[s.mv15, s.w100]}>        
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>First Name</Text>
          <TextInput
            placeholder="First Name"
            onChangeText={(firstName) => this.setState({ firstName })}
            autoCapitalize='none'
            value={this.state.firstName}
            style={ styles.inputText }
          />
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>Last Name</Text>
          <TextInput
            placeholder="Last Name"
            onChangeText={(lastName) => this.setState({ lastName })}
            autoCapitalize='none'
            value={this.state.lastName}
            style={ styles.inputText }
          />
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>Nickname</Text>
          <TextInput
            placeholder="Nickname"
            onChangeText={(nickname) => this.setState({ nickname })}
            autoCapitalize='none'
            value={this.state.nickname}
            style={ styles.inputText }
          />
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>Phone</Text>
          <TextInput
            placeholder="Phone number"
            onChangeText={(phone) => this.setState({ phone })}
            autoCapitalize='none'
            value={this.state.phone}
            style={ styles.inputText }
          />
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>School</Text>
          <TextInput
            placeholder="School"
            onChangeText={(school) => this.setState({ school })}
            autoCapitalize='none'
            value={this.state.school}
            style={ styles.inputText }
          />    
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>Favorite Sport</Text>
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                style={{ width: undefined }}
                placeholder="Select Favorite Sport"
                placeholderStyle={styles.inputText}
                placeholderIconColor="#007aff"
                selectedValue={this.state.favorite}
                onValueChange={this.onValueChange.bind(this)}
              >
                <Picker.Item label="Rugby" value="rugby"/>
                <Picker.Item label="Cricket" value="cricket" />
                <Picker.Item label="Swimming" value="swimming" />
                <Picker.Item label="Footy" value="footy" />
                <Picker.Item label="Yoga" value="yoga" />
              </Picker>
            </Item>
          </Form>
        </ScrollView>
        <TouchableOpacity
          style={styles.btnActive}
          onPress={this.onSignup}
          activeOpacity={1}>
          <Text style={ styles.activeTxt}>Create Profile</Text>
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
  inputText: {
    borderRadius: 8,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    paddingLeft:10,
    width: '100%',
    fontFamily: 'NunitoSans-Light',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 19,
    // color: '#173147',
    backgroundColor: '#fff',
  },
  btnActive: {
    height: 50,
    backgroundColor: '#173147',
    borderRadius: 8,
    borderColor: '#173147',
    borderWidth: 1,
    marginVertical: 20,
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
    width: '100%',
    marginRight: 20,
    textAlign: "right",
  },
  pr40: {
    paddingRight: 50,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    width: screenWidth * 0.4,
    height: screenWidth * 0.4,
    borderRadius: screenWidth * 0.2,
    borderWidth: 3,
    borderColor: '#F1F1F1',
    textAlign: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
})
