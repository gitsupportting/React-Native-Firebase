import React from 'react';
import { Container, Header, Content, Text, Footer, FooterTab, Button } from 'native-base';
import { View, TouchableOpacity, StyleSheet, Image, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
var s = require('../assets/css/styles');
import home from '../assets/icons/home1.png'

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount () {       
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }



  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    // this.props.navigation.goBack(null);
    return true;
  };

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
              style={s.headerLeft}
              activeOpacity={1}>
            </TouchableOpacity>
            <Text style={s.title}>Home</Text>
            <TouchableOpacity
              style={s.moreIcon}
              onPress={() =>this.onLogout()}
              activeOpacity={1}>
              <Icon name='log-out' size={24} color='#173147' />
            </TouchableOpacity>
          </View>            
        </Header>
        <Content style={s.mainContainer}>
          <Text style={[s.mv60, s.title, s.txCenter]}>What do you want to do today?</Text>      
          <TouchableOpacity
            style={s.btnActive}
            onPress={()=>this.props.navigation.navigate('CreateMeetup')}
            activeOpacity={1}>
            <Text style={ s.activeTxt}>Create New Meet Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.btnActive}
            onPress={()=>this.props.navigation.navigate('TodayMeetup')}
            activeOpacity={1}>
            <Text style={ s.activeTxt}>Today's Meet Ups</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.btnActive}
            onPress={()=>this.props.navigation.navigate('MyMeetup')}
            activeOpacity={1}>
            <Text style={ s.activeTxt}>My Meet Ups</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.btnActive}
            onPress={()=>this.props.navigation.navigate('SingleChatList')}
            activeOpacity={1}>
            <Text style={ s.activeTxt}>My Friends</Text>
          </TouchableOpacity>
        </Content>
        <Footer>
          <FooterTab style={s.footerContent}>
            <Button onPress={() => this.props.navigation.navigate('Home')}><Image source={home} style={s.icon20}/></Button>
            <Button onPress={() => this.props.navigation.navigate('ProfileDetail')}><Icon name='person' size={24} color='#173147' /></Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },

})
