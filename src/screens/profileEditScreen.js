import React from 'react';
import { StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Header, Content, Text, View, Form, Item, Picker } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import backBtn from '../assets/icons/backBtn.png';
var s = require('../assets/css/styles');

export default class ProfileEdit extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('userData').then((res) => {
      this.getUserData(JSON.parse(res).phone)
    });
  }

  getUserData =async(phone)=> {
    await firestore().collection('users')
    .where('phone', '==', phone)
    .get()
    .then(querySnapshot => {
        querySnapshot.docs.map(doc => {
          let user = doc.data();
          console.log(user.favorite)
          this.setState({
            phone: user.phone,
            avatarSource: user.avatarSource,
            nickname: user.nickname,
            school: user.school,
            firstName: user.firstName,
            lastName: user.lastName,
            favorite: user.favorite,
            isLoading: false
          })
          
        });
    });
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

  onLogout =()=> {
    AsyncStorage.setItem('userData', 'logout').then(() => {
      this.props.navigation.navigate('Login');
    });
  }

  onUpdate =()=> {
    const {phone, firstName, lastName, nickname, school, favorite, avatarSource} = this.state;
    let userDatas = {
      phone: phone,
      firstName: firstName,
      lastName: lastName,
      nickname: nickname,
      school: school,
      favorite: favorite,
      avatarSource: avatarSource
    };
    try {
      let that  = this;
      firestore().collection("users").where("phone", "==", phone)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              firestore().collection("users").doc(doc.id).update(userDatas)
              .then(() => {                
                let userData = {	
                  'firstName': firstName,	
                  'lastName': lastName,	
                  'phone': phone	
                }	
                AsyncStorage.setItem('userData', JSON.stringify(userData)).then(() => {	
                  alert("successfully updated");
                  that.props.navigation.navigate('ProfileDetail')
                });	
              })
              .catch(err=>{
                alert(err);
                that.setState({isLoading: false})
              })
            });
        })
    } catch (error) {
      alert(error);
    }
  }

  render() {
    // if (this.state.isLoading) {
    //   return (
    //     <View style={s.loader}>
    //       <ActivityIndicator size="large" color="#0c9" />
    //     </View>
    //   )
    // }
    return (
      <Container style={s.container}>
        <Header style={s.headerContent}>
          <View style={s.spaceBetween}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{width:15}}
              activeOpacity={1}>
              <Image source={backBtn} style={s.backIcon}/>
            </TouchableOpacity>
            <Text style={s.title}>Edit Profile</Text>
            <View style={{width:15}}></View>
          </View>          
        </Header>
        <Content style={s.mainContainer}>
          <View style={s.spaceBetween}>
            <Text style={s.ft17Gray}>{this.state.firstName} {this.state.lastName}</Text>
            <TouchableOpacity
              onPress={() => this.onUpdate()}
              style={{marginRight:5}}
              activeOpacity={1}>
              <Text style={s.ft14300Gray}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={[s.flexCenter, s.mt20]}>
            {!this.state.avatarSource &&
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
          <View style={s.mv25}>
            <View style={[styles.itemWrap]}>
              <Text style={[s.ft15RegularBlack, s.flex30]}>First Name</Text>
              <TextInput
                placeholder="First Name"
                onChangeText={(firstName) => this.setState({ firstName })}
                autoCapitalize='none'
                value={this.state.firstName}
                style={ [s.inputText, s.w70]}
              />  
            </View>
            <View style={[styles.itemWrap]}>
              <Text style={[s.ft15RegularBlack, s.flex30]}>Last Name</Text>
              <TextInput
                placeholder="Last Name"
                onChangeText={(lastName) => this.setState({ lastName })}
                autoCapitalize='none'
                value={this.state.lastName}
                style={ [s.inputText, s.w70]}
              />  
            </View>
            <View style={[styles.itemWrap]}>
              <Text style={[s.ft15RegularBlack, s.flex30]}>Nick Name</Text>
              <TextInput
                placeholder="Nick Name"
                onChangeText={(nickname) => this.setState({ nickname })}
                autoCapitalize='none'
                value={this.state.nickname}
                style={ [s.inputText, s.w70]}
              />  
            </View>            
            <View style={[styles.itemWrap]}>
              <Text style={[s.ft15RegularBlack, s.flex30]}>Phone</Text>
              <TextInput
                placeholder="Phone"
                onChangeText={(phone) => this.setState({ phone })}
                autoCapitalize='none'
                value={this.state.phone}
                style={ [s.inputText, s.w70]}
              />  
            </View>
            <View style={[styles.itemWrap]}>
              <Text style={[s.ft15RegularBlack, s.flex30]}>School</Text>
              <TextInput
                placeholder="School"
                onChangeText={(school) => this.setState({ school })}
                autoCapitalize='none'
                value={this.state.school}
                style={ [s.inputText, s.w70 ]}
              />  
            </View>
            <View style={[styles.itemWrap]}>
              <Text style={[s.ft15RegularBlack, s.flex30]}>Favorite Sport</Text>
              <Form style={s.flex70}>
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
            </View>
          </View>
          <View style={s.splitLine}></View>
          <TouchableOpacity style={{marginVertical: 25}} onPress={this.onLogout} activeOpacity={1}>
            <Text style={s.ft17Gray}>Log Out</Text>
          </TouchableOpacity>
        </Content>
      </Container >
    );
  }
}

const styles = StyleSheet.create({
  
  itemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%'
  }
  
})
