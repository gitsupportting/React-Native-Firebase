import React from 'react';
import { StyleSheet, Image, TouchableOpacity, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Header, Content, Text, View, Form, Item, Picker } from 'native-base';
import ImagePicker from 'react-native-image-picker';
import 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import backBtn from '../assets/icons/backBtn.png';
var s = require('../assets/css/styles');
import Icon from 'react-native-vector-icons/Ionicons';
let deviceWidth = Dimensions.get('window').width;

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
      quality:1,
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
        this.setState({avatarSource: response.uri});
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

  onUpdate =async()=> {
    const {phone, firstName, lastName, nickname, school, favorite, avatarSource} = this.state;
    const url = await this.uploadImage(avatarSource);
    let userDatas = {
      phone: phone,
      firstName: firstName,
      lastName: lastName,
      nickname: nickname,
      school: school,
      favorite: favorite,
      avatarSource: url
    };
    
    try {
      let that  = this;
      firestore().collection("users").where("phone", "==", phone)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              firestore().collection("users").doc(doc.id).update(userDatas)
              .then(() => {  
                firestore().collection("meetups").get()
                .then(function (meetups) {
                  meetups.forEach(function (meetup) {
                    let ischanged = false;
                    meetup._data.players.map(player=>{
                      if (player.phone == phone) {
                        player.firstName = firstName;
                        player.lastName = lastName;
                        ischanged = true;
                      }                      
                    })
                    if (ischanged == true) {
                      firestore().collection("meetups").doc(meetup.id).update(meetup._data);
                    }                    
                  })

                  let userData = {	
                    'firstName': firstName,	
                    'lastName': lastName,	
                    'phone': phone,
                    'url': url
                  }	
                  AsyncStorage.setItem('userData', JSON.stringify(userData)).then(() => {	
                    alert("successfully updated");
                    that.props.navigation.navigate('Home')
                  });	
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
        {this.state.isLoading ? (
            <View style={s.loader}>
              <ActivityIndicator size='large' color='#0c9' />
            </View>
          ) : (
            <Content style={s.mainContainer}>
              <View style={s.spaceBetween}>
                <Text style={s.ft17Gray}>{this.state.firstName} {this.state.lastName}</Text>
                <TouchableOpacity onPress={() => this.onUpdate()}>
                  <Icon name='save' size={24} color='#173147' />
                </TouchableOpacity>
              </View>
              <View style={[s.flexCenter, s.mt20]}>
                {!this.state.avatarSource &&
                  <TouchableOpacity style={s.avatar} onPress={this.handleUploadPhoto}>
                    <Icon name='person-add' size={deviceWidth*0.25} color='#173147' />
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
                {/* <View style={[styles.itemWrap]}>
                  <Text style={[s.ft15RegularBlack, s.flex30]}>Phone</Text>
                  <TextInput
                    placeholder="Phone"
                    onChangeText={(phone) => this.setState({ phone })}
                    autoCapitalize='none'
                    value={this.state.phone}
                    style={ [s.inputText, s.w70]}
                  />  
                </View> */}
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
              <TouchableOpacity style={{marginVertical: 15}} onPress={this.onLogout} activeOpacity={1}>
                <Text style={s.ft16blue}>Log Out</Text>
              </TouchableOpacity>
            </Content>
        )}
        
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
