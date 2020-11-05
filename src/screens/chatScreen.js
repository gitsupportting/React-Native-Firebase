import React from 'react';
import { Container, Header, Content, Text, Footer, FooterTab, Button } from 'native-base';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
var s = require('../assets/css/styles');
import home from '../assets/icons/home1.png'
import chat from '../assets/icons/chat1.png'
import more from '../assets/icons/more.png';

export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
  }

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
            <Text style={s.title}>Chat</Text>
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
          <Text style={[s.mv60, s.title, s.txCenter]}>This is chat screen</Text>
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
