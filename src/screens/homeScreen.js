import React from 'react';
import { Container, Header, Content, Text, Footer, FooterTab, Button } from 'native-base';
import { View, TouchableOpacity, StyleSheet, Image, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
var s = require('../assets/css/styles');
import home from '../assets/icons/home1.png'
import chat from '../assets/icons/chat1.png'
import Logo from '../assets/logo.png';
import more from '../assets/icons/more.png';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
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

  onProfile =()=> {
    this.setState({
      active: false
    });
    this.props.navigation.navigate('ProfileDetail')
  }

  onLogout =()=> {
    this.setState({
      active: false
    });
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
              onPress={() => this.setState({ active: !this.state.active })}
              activeOpacity={1}>
              <Image source={more}/>
            </TouchableOpacity>
            {this.state.active && 
              <View style={s.shadowBtn}>
                <TouchableOpacity
                  style={s.profileBtn}
                  onPress={() =>this.onProfile()}
                  activeOpacity={1}>
                  <Text style={s.ft15RegularBlack}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.formBtn}
                  onPress={() =>this.onLogout()}
                  activeOpacity={1}>
                  <Text style={s.ft15RegularBlack}>Logout</Text>
                </TouchableOpacity>
              </View>
            }
          </View>            
        </Header>
        <Content style={s.mainContainer}>
          <Image source={Logo}/>
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
        </Content>
        <Footer>
          <FooterTab style={s.footerContent}>
            <Button onPress={() => this.props.navigation.navigate('Home')}><Image source={home} style={s.icon20}/></Button>
            <Button onPress={() => this.props.navigation.navigate('Chat')}><Image source={chat} style={s.icon30}/></Button>
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
