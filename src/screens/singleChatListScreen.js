import React from 'react';
import { Form, Item, Picker } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import { Container, Header, Content, Text, Footer, FooterTab, Button } from 'native-base';
import { View, TouchableOpacity, StyleSheet, Image, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
var s = require('../assets/css/styles');
import Icon from 'react-native-vector-icons/Ionicons';
import backBtn from '../assets/icons/backBtn.png';
import home from '../assets/icons/home1.png'
import chat from '../assets/icons/chat1.png'
import more from '../assets/icons/more.png';

export default class SingleChatListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      active: false,
      chats: [],
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
    this.getChatData();
  }

  getUsersData = () => {
    firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.map(item=>{
          if (item._data.phone != this.state.phone) {
            this.state.users.push(item._data);
          }
        })
      })
  }

  getUserbyPhone =(phone, latestMessage)=> {
    let user = this.state.users.filter(item=> item.phone == phone);
    if (latestMessage) {
      user[0].latestMessage = latestMessage
    }
    this.state.chats.push(user[0]);
  }

  getChatData = () => {
    firestore()
      .collection('chats')
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.map(item=> {
          const index = item._data.users.indexOf(this.state.phone);
          if (index > -1) {
            this.getUserbyPhone(item._data.users.splice(index-1, 1)[0], item._data.latestMessage ? item._data.latestMessage : null)
          }
        }) 
        this.setState({isLoading: false})
      })
  }

  onValueChange (value) {
    this.setState({
      selectedUser: value
    });
  }

  timeSince(timeStamp) {
    var d = new Date(timeStamp);
    var now = new Date();
    let secondsPast = (now.getTime() - timeStamp) / 1000;
    if (secondsPast < 60) {
      return parseInt(secondsPast) + 's ago';
    }
    if (secondsPast < 3600) {
      return parseInt(secondsPast / 60) + 'm ago';
    }
    if (secondsPast <= 86400) {
      return parseInt(secondsPast / 3600) + 'h ago';
    }
    if (secondsPast > 86400) {
      let day = d.getDate();
      let month = d.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
      let year = d.getFullYear() == now.getFullYear() ? "" : " " + d.getFullYear();
      return day + " " + month + year;
    }
  }
  
  renderOptions () {
    return this.state.users.map((dt, i) => {
      return (
        <Picker.Item label={dt.firstName + ' ' + dt.lastName} value={dt.phone} key={i}/>
      )
    })
  } 

  onChat =  (phone, firstName, lastName) => {
    let name = firstName + ' ' + lastName;
    this.setState({isLoading: false}, ()=>{
      this.props.navigation.navigate('SingleChat', {phone: phone, name: name})
    })    
  }

  onDelete = async(selectedUser)=> { 
    this.setState({isLoading: true});
    const {phone} = this.state;
    await firestore()
      .collection('chats')
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.map(item=>{
          if (item._data.users.includes(phone) && item._data.users.includes(selectedUser)) {
            firestore()
              .collection('chats')
              .doc(item.id)
              .delete()
              .then(() => {
                this.state.chats.map(item=> {                  
                  if (item.phone == selectedUser) {
                    const index = this.state.chats.indexOf(item);
                    this.state.chats.splice(index, 1);
                    this.setState({isLoading: false});   
                  }
                })
                  alert('Successfully deleted!');
              });
          }
        })        
      })     
  }

  validation = () => {
    let enable = true;
    if (!this.state.selectedUser) {
      alert('Please select user');
      enable = false;
    }
    if (enable == true) {
      this.state.chats.map(item=>{
        if (item.phone == this.state.selectedUser) {
          alert('Already Existing');
          enable = false;
        }
      })
    }
    
    return enable;
  }

  onAdd =()=> {
    if (this.validation()) {
      this.setState({isLoading: true});
      const { phone, selectedUser } = this.state;

      firestore()
        .collection('chats')
        .add({users: [phone, selectedUser]})
        .then((res) => {
          this.setState({chats: []}, ()=> {
            this.getChatData();
          })          
        })
        .catch(err=>{
          alert(err);
        })
    }       
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

  renderItem = data => {
    return (
      <View style={[styles.card, s.shadowStyle]}>
        <View style={[s.spaceBetween]}>
          <Image source={{uri:data.item.avatarSource}} style={styles.avatar30}/>
          <View style={s.flex80}>
            <View style={[s.spaceBetween]}>
              <Text style={[s.ft14BoldBlack, s.flex80]}>{data.item.firstName} {data.item.lastName}</Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={()=>this.onChat(data.item.phone, data.item.firstName, data.item.lastName)} style={{marginRight: 10}}>
                  <Image source={chat} style={s.icon25}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.onDelete(data.item.phone)}>
                  <Icon name='trash-outline' size={20} color='#173147' />
                </TouchableOpacity>                
              </View>              
            </View>   
            {data.item.latestMessage && 
            <View style={[s.spaceBetween, s.mt10]}>
              <Text style={[s.ft14300Gray, s.flex80]}>{data.item.latestMessage.text}</Text>
              <Text style={[s.ft14300Gray]}>{this.timeSince(data.item.latestMessage.createdAt)}</Text>
            </View>
            }  
          </View>          
        </View>
      </View>
    )
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
                <Form style={s.w70}>
                  <Item picker>
                    <Picker
                      mode="dropdown"
                      placeholder=""
                      placeholderStyle={s.inputText}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.selectedUser}
                      onValueChange={this.onValueChange.bind(this)}
                    >                
                      {this.renderOptions()}
                    </Picker>
                  </Item>
                </Form>
                <TouchableOpacity onPress={()=>this.onAdd()}>
                  <Text style={s.ft14blue}>Add</Text>
                </TouchableOpacity>
              </View>        
              }              
              <View>
                {this.state.chats.length>0 ? (
                  <FlatList
                    data={this.state.chats}
                    renderItem={item => this.renderItem(item)}
                  />
                ) : (
                  <Text style={[s.txCenter, s.ft17Gray, s.mt20]}>
                    No previous chat
                  </Text>
                )}
              </View>        
            </View>
          )}        
        <Footer>
          <FooterTab style={s.footerContent}>
            <Button onPress={() => this.props.navigation.navigate('Home')}><Image source={home} style={s.icon20}/></Button>
            <Button onPress={() => this.props.navigation.navigate('SingleChatList')}><Image source={chat} style={s.icon30}/></Button>
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
  card: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 18,
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
  avatar30: {
    width: 40, 
    height: 40, 
    borderRadius: 20
  }
})
