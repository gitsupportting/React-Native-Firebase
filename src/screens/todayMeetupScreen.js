import React from 'react'
import {Container, Header, Content, Text} from 'native-base'
import { View, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import 'firebase/firestore'
import firestore from '@react-native-firebase/firestore'
var s = require('../assets/css/styles')
import more from '../assets/icons/more.png'
import home1 from '../assets/icons/home.png'

export default class TodayMeetupScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      active: false,
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
          this.getMeetupData(this.state.phone)
        },
      )
    })
  }

  getMeetupData = async phone => {
    await firestore()
      .collection('meetups')
      .where('phone', '==', phone)
      .get()
      .then(querySnapshot => {
        this.setState({
          meetups: querySnapshot.docs,
          isLoading: false,
        })
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
      <View style={[styles.card, s.shadowStyle, s.spaceBetween]}>
        <Text style={[s.ft14BoldBlack, s.flex20]}>{data.item._data.name}</Text>
        <Text style={[s.ft14300Gray, s.flex40]}>{data.item._data.stime}-{data.item._data.etime}</Text>
        <Text style={[s.ft14300Gray, s.flex30]}>{data.item._data.address}</Text>
        <TouchableOpacity onPress={this.onJoin(data.item.id)}>
          <Text style={{ fontSize: 14, color: '#2684ff', fontWeight: 'bold' }}>Join</Text>
        </TouchableOpacity>
      </View>
    )
  }

  onJoin =  id => {
    this.props.navigation.navigate('MeetupDetail', {id})
  }

  render () {
    return (
      <Container style={s.container}>
        <Header style={s.headerContent}>
          <View style={s.spaceBetween}>
            <TouchableOpacity
              style={s.headerLeft}
              onPress={() => this.props.navigation.navigate('Home')}
              activeOpacity={1}>
              <Image source={home1} style={s.icon30} />
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
              {this.state.meetups ? (
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
    flexDirection: 'row',
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
