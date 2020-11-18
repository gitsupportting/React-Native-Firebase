import React from 'react';
import { GiftedChat, Bubble, Send, SystemMessage } from 'react-native-gifted-chat';
import { Form, Item, Picker } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import { Container, Header, Content, Text, Footer, FooterTab, Button } from 'native-base';
import { View, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
var s = require('../assets/css/styles');
import Icon from 'react-native-vector-icons/Ionicons';
import backBtn from '../assets/icons/backBtn.png';
import home from '../assets/icons/home1.png'

export default class SingleChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      messages: [],
      users: [{
        phone: null,
        firstName: 'Select User',
        lastName: ''
      }],
      selectedUser: this.props.navigation.state.params.phone,
      name: this.props.navigation.state.params.name,
    };
  }

  async componentDidMount() {
    AsyncStorage.getItem('userData').then(res => {
      this.setState({
        phone: JSON.parse(res).phone,
        firstName: JSON.parse(res).firstName,
        lastName: JSON.parse(res).lastName,
        url: JSON.parse(res).url,
      }, async()=>{
        await this.getChannelId(this.state.phone, this.state.selectedUser);
      })
    })
    
  } 

  async getMessages() {
    const messagesListener = firestore()
      .collection('chats')
      .doc(this.state.id)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData
          };

          if (!firebaseData.system) {
            data.users = {
              ...firebaseData.users,
            };
          }

          return data;
        });
        this.setState({
          messages: messages,
          isLoading: false
        })
      });

    // Stop listening for updates whenever the component unmounts
    return () => messagesListener();
  }   

  async getChannelId (phone, selectedUser) { 
    
    await firestore()
      .collection('chats')
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.map(item=>{
          if (item._data.users.includes(phone) && item._data.users.includes(selectedUser)) {
            this.setState({id: item.id}, async()=>{
              await this.getMessages(); 
            })
          }
        })
        
      }) 
  }

  async handleSend(messages) {
    const text = messages[0].text;
    firestore()
      .collection('chats')
      .doc(this.state.id)
      .collection('messages')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: this.state.phone,
          name: this.state.firstName,
          avatar: this.state.url,
        }
      });
    await firestore()
      .collection('chats')
      .doc(this.state.id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime()
          }
        },
        { merge: true }
      );
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
              style={{width:40, marginRight: 15}}
              activeOpacity={1}>
              <Image source={backBtn} style={s.backIcon}/>
            </TouchableOpacity>
            <Text style={s.title}>{this.state.name}</Text>
            <TouchableOpacity
              style={s.moreIcon}
              onPress={() =>this.onLogout()}
              activeOpacity={1}>
              <Icon name='log-out' size={24} color='#173147' />
            </TouchableOpacity>
          </View>            
        </Header> 
        {this.state.isLoading ? (
            <View style={s.loader}>
              <ActivityIndicator size='large' color='#0c9' />
            </View>
          ) : (
            <View style={ styles.chatMain}>
              <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.handleSend(messages)}
                user={{ _id: this.state.phone,}}
              />
            </View>
          )}        
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
  chatMain: {
    padding: 20,
    flex: 1,
    marginTop: 1
  }
})
