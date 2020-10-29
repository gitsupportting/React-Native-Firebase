import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, TouchableOpacity, StyleSheet, TextInput, Text, KeyboardAvoidingView, ActivityIndicator, ScrollView, Image, Dimensions, PermissionsAndroid, Platform  } from 'react-native';
import { Form, Item, Picker } from 'native-base';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-picker';
// import Icon from 'react-native-ionicons'
import Ionicons from 'react-native-vector-icons/Ionicons';
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
      username: '',
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
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = { uri: response.uri };
    
        // You can also display the image using data:
        const source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.warn(source);
        this.setState({
          avatarSource: source,
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
    this.setState({isLoading: true});	
    const {firstName, lastName, email, phone, birthday, signupFromLogin} = this.state;	
    this.validation();	
    if (signupFromLogin) {	
      auth()	
      .signInWithPhoneNumber(phone)	
      .then(confirmResult => {	
        this.setState({ 	
          confirmResult: confirmResult	
        }, ()=>{	
          this.props.navigation.navigate('Confirm', {	
            phone: phone, 	
            firstName: firstName,	
            lastName: lastName,	
            birthday: birthday,	
            email: email,	
            confirmResult: this.state.confirmResult, 	
            fromLogin: false	
          });	
        });	
      })	
      .catch(error => {	
        alert(error.message);	
        this.setState({isLoading: false});	
        console.log(error);	
      });	
    } else {	
      await fetch('https://us-central1-smiledental-273502.cloudfunctions.net/createPatient', {	
        method: 'POST',	
        headers: {	
          'Accept': 'application/json',	
          'Content-Type': 'application/json'	
        },	
        body: JSON.stringify({	
          clinic_id : "74",	
          patient_first_name : firstName,	
          patient_last_name : lastName, 	
          patient_phone_number : phone,	
          patient_email : email,	
          patient_dob : birthday	
        })	
      })	
        .then((responseData) => {	
          if (responseData.status == 200) {	
            alert("successfully registered");	
            let userData = {	
              'firstName': firstName,	
              'lastName': lastName,	
              'phone': phone	
            }	
            AsyncStorage.setItem('userData', JSON.stringify(userData)).then(() => {	
              this.props.navigation.navigate('Home');	
            });	
          } else {	
            alert("something went wrong!");	
          }	
        })	
        .catch((error) => {	
          alert(error);	
          return;	
        })	
    }
  }

  validation =()=> {
    const { firstName, lastName, email, birthday, phone } = this.state;
    if (!phone || phone.length==0) {
      alert("Please insert phone number");
      return;
    }
    if (!firstName || firstName.length==0) {
      alert("Please insert first name");
      return;
    }
    if (!lastName || lastName.length==0) {
      alert("Please insert last name");
      return;
    }
    if (!birthday || birthday.length==0) {
      alert("Please insert birthday");
      return;
    }
    if (!email || email.length==0) {
      alert("Please insert email");
      return;
    }
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
              style={styles.button3}
              onPress={this.handleUploadPhoto}
            >
              <Text style={{ fontSize: 20, color: '#2684ff', fontWeight: 'bold' }}>Select Image</Text>
            </TouchableOpacity>
          }
          {this.state.avatarSource &&
            <TouchableOpacity
              style={styles.button3}
              onPress={this.handleUploadPhoto}
            >
              <Image source={{ uri: this.state.avatarSource }} style={{ width: screenWidth * 0.5, height: screenHeight * 0.12 }} />
            </TouchableOpacity>}
        </View>
        <ScrollView style={[s.mv15, s.w100]}>        
          <Text style={[s.ft12Black, s.mv15, styles.textLeft]}>First Name</Text>
          <TextInput
            placeholder="First Name"
            onChangeText={(firstName) => this.setState({ firstName })}
            autoCapitalize='none'
            value={this.state.firstName}
            style={ styles.inputText }
          />
          <Text style={[s.ft12Black, s.mv15, styles.textLeft]}>Last Name</Text>
          <TextInput
            placeholder="Last Name"
            onChangeText={(lastName) => this.setState({ lastName })}
            autoCapitalize='none'
            value={this.state.lastName}
            style={ styles.inputText }
          />
          <Text style={[s.ft12Black, s.mv15, styles.textLeft]}>Email</Text>
          <TextInput
            placeholder="Email"
            onChangeText={(email) => this.setState({ email })}
            autoCapitalize='none'
            value={this.state.email}
            style={ styles.inputText }
          />
          <Text style={[s.ft12Black, s.mv15, styles.textLeft]}>Nickname</Text>
          <TextInput
            placeholder="Nickname"
            onChangeText={(nickname) => this.setState({ nickname })}
            autoCapitalize='none'
            value={this.state.nickname}
            style={ styles.inputText }
          />
          <Text style={[s.ft12Black, s.mv15, styles.textLeft]}>School</Text>
          <TextInput
            placeholder="School"
            onChangeText={(school) => this.setState({ school })}
            autoCapitalize='none'
            value={this.state.school}
            style={ styles.inputText }
          />    
          <Text style={[s.ft12Black, s.mv15, styles.textLeft]}>Favorite</Text>
          <Form>
            <Item picker>
              <Picker
                mode="dropdown"
                style={{ width: undefined }}
                placeholder="Select Favorite Sport"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.favorite}
                onValueChange={this.onValueChange.bind(this)}
              >
                <Picker.Item label="Rugby" value="rugby" />
                <Picker.Item label="Cricket" value="cricket" />
                <Picker.Item label="Swimming" value="swimming" />
                <Picker.Item label="Footy" value="footy" />
                <Picker.Item label="Yoga" value="yoga" />
              </Picker>
            </Item>
          </Form>
          <Text style={[s.ft12Black, s.mv15, styles.textLeft]}>Password</Text>
          <TextInput
            placeholder="Password"
            onChangeText={(password) => this.setState({ password })}
            autoCapitalize='none'
            value={this.state.school}
            style={ styles.inputText }
          />    
        </ScrollView>
        <TouchableOpacity
          style={styles.btnActive}
          onPress={this.onSignup}
          activeOpacity={1}>
          <Text style={ styles.activeTxt}>Create Account</Text>
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
})
