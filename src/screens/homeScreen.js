import React from 'react';
import { Container, Header, Content, Text, Footer, FooterTab, Button } from 'native-base';
import { View, TouchableOpacity, StyleSheet, Image, BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Zocial from 'react-native-vector-icons/Zocial'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
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
          {/* <Text style={[s.mv40, s.title, s.txCenter]}>What do you want to do today?</Text>    */}
          <Text style={[s.mb20, s.txCenter]}><Zocial name='meetup' size={60} color='#173147'/></Text>
          <TouchableOpacity style={[styles.card, s.shadowStyle, s.spaceBetween]} onPress={()=>this.props.navigation.navigate('CreateMeetup')}>            
            <FontAwesome name='meetup' size={50} color='#173147' style={s.flex20}/>
            <View style={s.flex80}>
              <Text style={[s.ft15BoldBlack]}>Create New Meet Up</Text>
              <Text style={[s.ft14300Gray]}>Create a new event, set the location, time and invite your friends</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.card, s.shadowStyle, s.spaceBetween]} onPress={()=>this.props.navigation.navigate('TodayMeetup')}>
            <Icon name='today' size={38} color='#173147' style={s.flex20}/>
            <View style={s.flex80}>
              <Text style={[s.ft15BoldBlack]}>Today’s Meet Ups</Text>
              <Text style={[s.ft14300Gray]}>View a list of the Events happening today. View the details and join the event</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.card, s.shadowStyle, s.spaceBetween]} onPress={()=>this.props.navigation.navigate('MyMeetup')}>
            <MaterialIcons name='meeting-room' size={45} color='#173147' style={s.flex20}/>
            <View style={s.flex80}>
              <Text style={[s.ft15BoldBlack]}>My Meet Ups</Text>
              <Text style={[s.ft14300Gray]}>View a list of the events that I have joined. View the details invite others to join</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.card, s.shadowStyle, s.spaceBetween]} onPress={()=>this.props.navigation.navigate('SingleChatList')}>
            <FontAwesome5 name='user-friends' size={34} color='#173147' style={s.flex20}/>
            <View style={s.flex80}>
              <Text style={[s.ft15BoldBlack]}>My Friends</Text>
              <Text style={[s.ft14300Gray]}>View a list of friends. Add friends and chat with them</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
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
  ft15BoldBlack: {
    fontFamily: 'Lato-Bold',
    fontSize: 15,
    lineHeight: 22,
    color: '#000000',
    marginBottom: 8
  },
  card: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
    backgroundColor: '#fff',
    shadowColor: 'rgba(157, 157, 157, 0.2);',
    shadowOffset: {
      width: 1,
      height: 5,
    },
    shadowRadius: 8,
    shadowOpacity: 1.0,
    elevation: 2,
  },
})
