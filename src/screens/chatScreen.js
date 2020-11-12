import React from 'react';
import { GiftedChat, Bubble, Send, SystemMessage } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { Container, Header, Content, Text, Footer, FooterTab, Button } from 'native-base';
import { View, TouchableOpacity, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
var s = require('../assets/css/styles');
import home from '../assets/icons/home1.png'
import chat from '../assets/icons/chat1.png'
import more from '../assets/icons/more.png';
let {height, width} = Dimensions.get('window');

export default class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      messages: [],
      id: this.props.navigation.state.params.id
    };
  }

  async handleSend(messages) {
    const text = messages[0].text;

    firestore()
      .collection('meetups')
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

    // await firestore()
    //   .collection('meetups')
    //   .doc(this.state.id)
    //   .set(
    //     {
    //       latestMessage: {
    //         text,
    //         createdAt: new Date().getTime()
    //       }
    //     },
    //     { merge: true }
    //   );
  }

  componentDidMount() {
    AsyncStorage.getItem('userData').then(res => {
      this.setState({
        phone: JSON.parse(res).phone,
        firstName: JSON.parse(res).firstName,
        lastName: JSON.parse(res).lastName,
        url: JSON.parse(res).url,
      })
    })
    const messagesListener = firestore()
      .collection('meetups')
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
            data.user = {
              ...firebaseData.user,
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

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    const text = messages[0].text;

    firestore()
      .collection('meetups')
      .doc(this.state.id)
      .collection('messages')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          phone: this.state.phone,
          name: this.state.firstName,
          avatar: this.state.url,
        }
      });
  }

  renderBubble() {
    return (
      <Bubble
        wrapperStyle={{
          right: {
            backgroundColor: '#6646ee'
          }
        }}
        textStyle={{
          right: {
            color: '#fff'
          }
        }}
      />
    );
  }

  renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#6646ee' />
      </View>
    );
  }

  renderSend() {
    return (
      <Send>
        <View style={styles.sendingContainer}>
          <Icon name='send' size={32} color='#6646ee' />
        </View>
      </Send>
    );
  }

  scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <Icon name='ios-chevron-down-circle-sharp' size={36} color='#6646ee' />
      </View>
    );
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
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
        <View style={ styles.chatMain}>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.handleSend(messages)}
            user={{ _id: this.state.phone,}}
          />
        </View>
        {/* <GiftedChat
          messages={this.state.messages}
          onSend={()=>this.handleSend()}
          user={{ _id: this.state.phone }}
          placeholder='Type your message here...'
          alwaysShowSend
          showUserAvatar
          scrollToBottom
          renderBubble={this.renderBubble}
          renderLoading={this.renderLoading}
          renderSend={this.renderSend}
          scrollToBottomComponent={this.scrollToBottomComponent}
          renderSystemMessage={this.renderSystemMessage}
        /> */}
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
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  systemMessageWrapper: {
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  }
})
