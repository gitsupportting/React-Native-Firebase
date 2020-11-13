import React from 'react';
import { GiftedChat, Bubble, Send, SystemMessage } from 'react-native-gifted-chat';
import { Form, Item, Picker } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import { Container, Header, Content, Text, Footer, FooterTab, Button } from 'native-base';
import { View, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
var s = require('../assets/css/styles');
import home from '../assets/icons/home1.png'
import chat from '../assets/icons/chat1.png'
import more from '../assets/icons/more.png';

export default class SingleChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      active: false,
      messages: [],
      users: [{
        phone: null,
        firstName: 'Select User',
        lastName: ''
      }],
      selectedUser: null
    };
  }

  async componentDidMount() {
    AsyncStorage.getItem('userData').then(res => {
      this.setState({
        phone: JSON.parse(res).phone,
        firstName: JSON.parse(res).firstName,
        lastName: JSON.parse(res).lastName,
        url: JSON.parse(res).url,
      })
    })
    await this.getUsersData();    
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
        })
      });

    // Stop listening for updates whenever the component unmounts
    return () => messagesListener();
  }  

  getUsersData = async () => {
    await firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.map(item=>{
          if (item._data.phone != this.state.phone) {
            this.state.users.push(item._data);
          }
        })
        this.setState({isLoading : false})
      })
  }

  onValueChange (value) {
    this.setState({
      selectedUser: value
    }, async()=>{
      if (this.state.selectedUser) {
        await this.getChannelId(this.state.phone, this.state.selectedUser);
      }      
    });
  }

  renderOptions () {
    return this.state.users.map((dt, i) => {
      return (
        <Picker.Item label={dt.firstName + ' ' + dt.lastName} value={dt.phone} key={i}/>
      )
    })
  } 

  async getChannelId (phone, selectedUser) { 
    let count = 0;   
    let isExisting = false;
    await firestore()
      .collection('chats')
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.map(item=>{
          if (item._data.users.includes(phone) && item._data.users.includes(selectedUser)) {
            isExisting = true;
            this.setState({id: item.id}, async()=>{
              await this.getMessages(); 
            })
          }
          count++;         
        })
        if (querySnapshot.docs.length == 0 || (count == querySnapshot.docs.length && isExisting == false)) {
          firestore()
            .collection('chats')
            .add({users: [phone, selectedUser]})
            .then((res) => {
              this.setState({id: res.id}, async()=>{
                await this.getMessages(); 
              })
            })
            .catch(err=>{
              alert(err);
            })
        }       
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
        {this.state.isLoading ? (
            <View style={s.loader}>
              <ActivityIndicator size='large' color='#0c9' />
            </View>
          ) : (
            <View style={ styles.chatMain}>
              {this.state.users.length>0 && 
              <View style={[s.spaceBetween, s.mb20]}>
                <Text style={[s.ft14300Gray, s.w30, styles.textLeft]}>Chat With</Text>
                <Form style={s.w70}>
                  <Item picker>
                    <Picker
                      mode="dropdown"
                      placeholder="Select Favorite Sport"
                      placeholderStyle={s.inputText}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.selectedUser}
                      onValueChange={this.onValueChange.bind(this)}
                    >                
                      {this.renderOptions()}
                    </Picker>
                  </Item>
                </Form>
              </View>        
              }            
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
            <Button onPress={() => this.props.navigation.navigate('SingleChat')}><Image source={chat} style={s.icon30}/></Button>
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
