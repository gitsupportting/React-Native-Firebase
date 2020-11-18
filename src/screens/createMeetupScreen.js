import React from 'react'
import {Container, Header, Content, Text, Footer, FooterTab, Button} from 'native-base'
import {CheckBox} from 'react-native-elements'
import { View, TouchableOpacity, StyleSheet, Image, TextInput, KeyboardAvoidingView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import AsyncStorage from '@react-native-community/async-storage'
import 'firebase/firestore'
import firestore from '@react-native-firebase/firestore'
import moment from 'moment';
var s = require('../assets/css/styles');
import home from '../assets/icons/home1.png'

export default class CreateMeetupScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      date: new Date(),
      stime: new Date(),
      etime: new Date(),
      showd: false,
      showe: false,
      shows: false,
      byo: false,
      provided: false,
      players: []
    }
  }

  componentDidMount () {
    AsyncStorage.getItem('userData').then(res => {
      this.setState({
        phone: JSON.parse(res).phone,
        firstName: JSON.parse(res).firstName,
        lastName: JSON.parse(res).lastName,
      })
    })
  }

  onLogout = () => {
    AsyncStorage.setItem('userData', 'logout').then(() => {
      this.props.navigation.navigate('Login')
    })
  }

  validation = () => {
    const {name, address, stime, etime, date} = this.state
    if (!name || name.length == 0) {
      alert('Please insert name')
      return false
    }
    if (!address || address.length == 0) {
      alert('Please insert location')
      return false
    }
    if (!date || date.length == 0) {
      alert('Please insert date')
      return false
    }
    if (!stime || stime.length == 0) {
      alert('Please insert start time')
      return false
    }
    if (!etime || etime.length == 0) {
      alert('Please insert end time')
      return false
    }
    return true
  }

  onCreate = async () => {
    // this.state.players.push({
    //   phone: this.state.phone, 
    //   firstName: this.state.firstName,
    //   lastName: this.state.lastName,
    //   isActive: true
    // });
    const { name, address, date, stime, etime, players, maxPlayers, rules, byo, provided, phone, coordinates } = this.state
    if (this.validation()) {
      let meetupData = {
        phone: phone,
        name: name,
        address: address,
        coordinates: coordinates,
        date: moment(date).format('DD/MM/YYYY'),
        stime: moment(stime).format('HH:mm'),        
        etime: moment(etime).format('HH:mm'),
        players: players,
        maxPlayers: maxPlayers,
        rules: rules,
        byo: byo,
        provided: provided,
      }
      firestore()
        .collection('meetups')
        .add(meetupData)
        .then(() => {
          alert('successfully created')
          this.props.navigation.navigate('TodayMeetup')
        })
        .catch(err => {
          alert(err)
        })
    }
  }

  _handleDatePicked =(date, mode)=> {
    if (mode == 'date') {
      this.setState({
        date: date,
        showd: false
      })
    } else if (mode == 'stime') {
      this.setState({
        stime: date,
        shows: false
      })
    } else if (mode == 'etime') {
      this.setState({
        etime: date,
        showe: false
      })
    }
  }

  showDMode = () => {
    this.setState({
      showd: !this.state.showd
    })
  };

  showSMode = () => {
    this.setState({
      shows: !this.state.shows
    })
  };

  showEMode = () => {
    this.setState({
      showe: !this.state.showe
    })
  };

  render () {
    return (
      <Container style={s.container}>
        <Header style={s.headerContent}>
          <View style={s.spaceBetween}>
            <TouchableOpacity
              style={s.headerLeft}
              activeOpacity={1}>
            </TouchableOpacity>
            <Text style={s.title}>Create Meetup</Text>
            <TouchableOpacity
              style={s.moreIcon}
              onPress={() =>this.onLogout()}
              activeOpacity={1}>
              <Icon name='log-out' size={24} color='#173147' />
            </TouchableOpacity>
          </View>
        </Header>
        <Content style={s.mainContainer}>
          <Text style={[s.ft17Gray, s.txCenter]}>Create your Meet Up now!</Text>
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>Name</Text>
          <TextInput
            onChangeText={name => this.setState({name})}
            autoCapitalize='none'
            value={this.state.name}
            style={[s.inputText, s.mb20]}
          />
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>Location</Text>
          <GooglePlacesAutocomplete
            placeholder='Location'
            fetchDetails={true}
            onPress={(data, details = null) => {
              console.log(data, details)
              this.setState({
                address: data.description, // selected address
                coordinates: `${details.geometry.location.lat},${details.geometry.location.lng}`, // selected coordinates
              })
            }}
            query={{
              key: 'AIzaSyA3MIA-mKWq_60q1K0zOHguraxT-1QPxNU',
              language: 'en',
            }}
            style={[s.inputText, s.mb20]}
          />          
          <Text style={[s.ft14300Gray, styles.mt25, styles.textLeft]}>Date</Text>
          <View style={styles.itemWrap}>
            <TextInput
              placeholder="Date"              
              autoCapitalize='none'
              editable={false}
              style={ [s.inputText, s.flex90]}
              value={moment(this.state.date).format('DD/MM/YYYY')}
            />
            <TouchableOpacity
              onPress={()=>this.showDMode()}
              activeOpacity={1}>
              <Text><Icon name="calendar" size={24} color="#173147"/></Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={this.state.showd}
            mode="date"
            onConfirm={(date)=>this._handleDatePicked(date, 'date')}
            onCancel={()=>this.showDMode()}
          />
          <Text style={[s.ft14300Gray, styles.mt25, styles.textLeft]}>Start Time</Text>
          <View style={styles.itemWrap}>
            <TextInput
              placeholder="Start Time"              
              autoCapitalize='none'
              editable={false}
              style={ [s.inputText, s.flex90]}
              value={moment(this.state.stime).format('HH:mm')}
            />
            <TouchableOpacity
              onPress={()=>this.showSMode()}
              activeOpacity={1}>
              <Text><Icon name="calendar" size={24} color="#173147"/></Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={this.state.shows}
            mode="time"
            onConfirm={(date)=>this._handleDatePicked(date, 'stime')}
            onCancel={()=>this.showSMode()}
          />
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>End Time</Text>
          <View style={styles.itemWrap}>
            <TextInput
              placeholder="End Time"
              autoCapitalize='none'
              editable={false}
              style={ [s.inputText, s.flex90]}
              value={moment(this.state.etime).format('HH:mm')}
            />
            <TouchableOpacity
              onPress={()=>this.showEMode()}
              activeOpacity={1}>
              <Text><Icon name="calendar" size={24} color="#173147"/></Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={this.state.showe}
            mode="time"
            onConfirm={(date)=>this._handleDatePicked(date, 'etime')}
            onCancel={()=>this.showEMode()}
          />
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>
            Max Players(Optional)
          </Text>
          <TextInput
            onChangeText={maxPlayers => this.setState({maxPlayers})}
            autoCapitalize='none'
            value={this.state.maxPlayers}
            style={[s.inputText, s.mb20]}
          />
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>
            Rules(Optional)
          </Text>
          <TextInput
            onChangeText={rules => this.setState({rules})}
            autoCapitalize='none'
            value={this.state.rules}
            style={[s.inputText, s.mb20]}
          />
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>
            Equipment(Optional)
          </Text>
          <CheckBox
            left
            title='Provided'
            checked={this.state.provided}
            onPress={() => this.setState({provided: !this.state.provided})}
          />
          <CheckBox
            left
            title='BYO'
            checked={this.state.byo}
            onPress={() => this.setState({byo: !this.state.byo})}
          />
          <TouchableOpacity
            style={s.btnActive}
            onPress={this.onCreate}
            activeOpacity={1}>
            <Text style={s.activeTxt}>Create New Meet Up</Text>
          </TouchableOpacity>
        </Content>
        <Footer>
          <FooterTab style={s.footerContent}>
            <Button onPress={() => this.props.navigation.navigate('Home')}><Image source={home} style={s.icon20}/></Button>
            <Button onPress={() => this.props.navigation.navigate('ProfileDetail')}><Icon name='person' size={24} color='#173147' /></Button>
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
  itemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  mt25: {
    marginTop: 35,
    marginBottom: 15,
  },
})
