import React from 'react'
import {Container, Header, Content, Text, Button, FooterTab, Footer} from 'native-base'
import { View, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import 'firebase/firestore'
import firestore from '@react-native-firebase/firestore'
import moment from 'moment';
var s = require('../assets/css/styles')
import more from '../assets/icons/more.png'
import home from '../assets/icons/home1.png'
import chat from '../assets/icons/chat1.png'

export default class TodayMeetupScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      active: false,
      meetups: [],
      currentDate: moment(new Date()).format('DD/MM/YYYY'),
    }
  }

  componentDidMount () {
    AsyncStorage.getItem('userData').then(res => {
      this.setState(
        {
          phone: JSON.parse(res).phone,
          firstName: JSON.parse(res).firstName,
          lastName: JSON.parse(res).lastName,
        },
        () => {
          this.getMeetupData(this.state.phone, this.state.currentDate)
        },
      )
    })
  }

  getMeetupData = async (phone, date) => {
    let count = 0;
    await firestore()
      .collection('meetups')
      .where('date', '==', date)
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.map(item=>{
          let isEnable = true;
          item._data.players.map(player=>{
            if (player.phone == phone) {
              isEnable = false;
            }
          })
          if (isEnable == true) {
            this.state.meetups.push(item);
          }          
          count++;          
        })
        if (querySnapshot.docs.length==count) {
          this.setState({isLoading: false})
        }
      })
  }

  onProfile = () => {
    this.setState({
      active: false,
    })
    this.props.navigation.navigate('ProfileDetail')
  }

  onLogout = () => {
    this.setState({
      active: false,
    })
    AsyncStorage.setItem('userData', 'logout').then(() => {
      this.props.navigation.navigate('Login')
    })
  }

  renderItem = data => {
    return (
      <View style={[styles.card, s.shadowStyle]}>
        <View style={[s.spaceBetween, s.mb10]}>
          <Text style={[s.ft14BoldBlack, s.flex80]}>{data.item._data.name}</Text>
          <TouchableOpacity onPress={()=>this.onJoin(data.item.id)}>
            <Text style={s.ft14blue}>Join</Text>
          </TouchableOpacity>
        </View>     
        <Text style={[s.ft14300Gray, s.mb10]}>Duration:  {data.item._data.stime}-{data.item._data.etime}</Text>
        <Text style={[s.ft14300Gray]}>Location:  {data.item._data.address}</Text>
      </View>
    )
  }

  onJoin =  id => {
    this.props.navigation.navigate('MeetupDetail', {id: id, fromToday: true, fromMy: false})
  }

  render () {
    return (
      <Container style={s.container}>
        <Header style={s.headerContent}>
          <View style={s.spaceBetween}>
            <TouchableOpacity
              style={s.headerLeft}
              activeOpacity={1}>
            </TouchableOpacity>
            <Text style={s.title}>Today Meet ups</Text>
            <TouchableOpacity
              style={s.moreIcon}
              onPress={() => this.setState({active: !this.state.active})}
              activeOpacity={1}>
              <Image source={more} />
            </TouchableOpacity>
            {this.state.active && (
              <View style={s.shadowBtn}>
                <TouchableOpacity
                  style={s.profileBtn}
                  onPress={() => this.onProfile()}
                  activeOpacity={1}>
                  <Text style={s.ft15RegularBlack}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.formBtn}
                  onPress={() => this.onLogout()}
                  activeOpacity={1}>
                  <Text style={s.ft15RegularBlack}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Header>
        <Content style={s.mainContainer}>
          <Text style={[s.title, s.mb20]}>
            Hello {this.state.firstName} {this.state.lastName}
          </Text>
          <Text style={[s.ft17Gray, s.mb15]}>
            What do you want to do today?
          </Text>
          {this.state.isLoading ? (
            <View style={s.loader}>
              <ActivityIndicator size='large' color='#0c9' />
            </View>
          ) : (
            <View>
              {this.state.meetups.length>0 ? (
                <FlatList
                  data={this.state.meetups}
                  renderItem={item => this.renderItem(item)}
                />
              ) : (
                <Text style={[s.txCenter, s.ft17Gray, s.mt20]}>
                  No data to display
                </Text>
              )}
            </View>
          )}
        </Content>
        <Footer>
          <FooterTab style={s.footerContent}>
            <Button onPress={() => this.props.navigation.navigate('Home')}><Image source={home} style={s.icon20}/></Button>
            <Button onPress={() => this.props.navigation.navigate('SingleChatList')}><Image source={chat} style={s.icon30}/></Button>
          </FooterTab>
        </Footer>
      </Container>
    )
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
})
