import React from 'react';
import { StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container, Header, Content, Text, View } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import editBtn from '../assets/icons/editIcon.png';
import backBtn from '../assets/icons/backBtn.png';
var s = require('../assets/css/styles');

export default class ProfileDetail extends React.Component {

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

  onLogout =()=> {
    AsyncStorage.setItem('userData', 'logout').then(() => {
      this.props.navigation.navigate('Login');
    });
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
            <Text style={s.title}>My Profile</Text>
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
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('ProfileEdit')}
                  style={{width:15, marginRight:5}}
                  activeOpacity={1}>
                  <Image source={editBtn} style={s.icon20} />
                </TouchableOpacity>
              </View>
              {this.state.avatarSource && <View style={[s.flexCenter, s.mt20]}>
                <Image source={{ uri: this.state.avatarSource }} style={s.avatar} />
              </View>}
              <View style={{flexDirection: 'row', marginVertical:30}}>
                <View style={s.flex30}>
                  <Text style={[s.ft14BoldBlack, s.mb15]}>First Name</Text>
                  <Text style={[s.ft14BoldBlack, s.mb15]}>Last Name</Text>
                  <Text style={[s.ft14BoldBlack, s.mb15]}>Nick Name</Text>
                  <Text style={[s.ft14BoldBlack, s.mb15]}>Phone</Text>
                  <Text style={[s.ft14BoldBlack, s.mb15]}>School</Text>
                  <Text style={[s.ft14BoldBlack, s.mb15]}>Favorite Sport</Text>
                </View>
                <View style={s.flex70}>
                  <Text style={[s.ft14300Gray, s.mb15]}>{this.state.firstName}</Text>
                  <Text style={[s.ft14300Gray, s.mb15]}>{this.state.lastName}</Text>
                  <Text style={[s.ft14300Gray, s.mb15]}>{this.state.nickname}</Text>
                  <Text style={[s.ft14300Gray, s.mb15]}>{this.state.phone}</Text>
                  <Text style={[s.ft14300Gray, s.mb15]}>{this.state.school}</Text>
                  <Text style={[s.ft14300Gray, s.mb15]}>{this.state.favorite}</Text>
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

})
