import React from 'react'
import {Container, Header, Content, Text} from 'native-base'
import {CheckBox} from 'react-native-elements'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker'
import DateTimePicker from '@react-native-community/datetimepicker'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import AsyncStorage from '@react-native-community/async-storage'
import 'firebase/firestore'
import firestore from '@react-native-firebase/firestore'
var s = require('../assets/css/styles')
import more from '../assets/icons/more.png'
import home1 from '../assets/icons/home.png'

export default class CreateMeetupScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: false,
      stime: new Date(),
      etime: new Date(),
      byo: false,
      provided: false,
    }
  }

  componentDidMount () {
    AsyncStorage.getItem('userData').then(res => {
      this.setState({
        phone: JSON.parse(res).phone,
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

  validation = () => {
    const {name, address, stime, etime} = this.state
    if (!name || name.length == 0) {
      alert('Please insert name')
      return false
    }
    if (!address || address.length == 0) {
      alert('Please insert location')
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
    // this.props.navigation.navigate('TodayMeetup');
    const {
      name,
      address,
      stime,
      etime,
      players,
      rules,
      byo,
      provided,
      phone,
      coordinates,
    } = this.state
    if (this.validation()) {
      let meetupData = {
        phone: phone,
        name: name,
        address: address,
        coordinates: coordinates,
        stime: stime,
        etime: etime,
        players: players,
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

  onSTimeChange = (event, selectedDate) => {
    console.log(selectedDate);
    const currentDate = selectedDate || this.state.stime;
    if (Platform.OS === 'ios') {
      this.setState({
        shows: true,
        stime: currentDate
      })
    }
  };

  onETimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.etime;
    if (Platform.OS === 'ios') {
      this.setState({
        showe: true,
        etime: currentDate
      })
    }
  };

  showSMode = (currentMode) => {
    this.setState({
      shows: true,
      mode: currentMode
    })
  };

  showEMode = (currentMode) => {
    this.setState({
      showe: true,
      mode: currentMode
    })
  };

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
            <Text style={s.title}>Create Meetup</Text>
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
          <Text style={[s.title, s.txCenter]}>Create your game now!</Text>
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
          {/* <Text style={[s.ft14300Gray, styles.mt25, styles.textLeft]}>
            Select Date
          </Text> */}
          {/* <DatePicker
            style={{width: '100%', marginBottom: 20}}
            date={this.state.stime}
            mode='date'
            format='YYYY-MM-DD'
            confirmBtnText='Confirm'
            cancelBtnText='Cancel'
            customStyles={{
              dateInput: {
                borderRadius: 4,
                borderWidth: 0,
                // borderBottomColor: '#E0E0E0',
                // borderBottomWidth: 1,
                paddingLeft: 10,
                width: '100%',
                fontFamily: 'NunitoSans-Light',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontSize: 14,
                lineHeight: 19,
                color: '#173147',
                backgroundColor: 'white',
              },
            }}
            onDateChange={date => {
              this.setState({date: date})
            }}
          /> */}
          <Text style={[s.ft14300Gray, styles.mt25, styles.textLeft]}>Start Time</Text>
          <View style={styles.itemWrap}>
            <TextInput
              placeholder="Start Time"
              onChangeText={(stime) => this.setState({ stime })}
              autoCapitalize='none'
              value={this.state.stime}
              style={ [s.inputText, s.flex90]}
            />
            <TouchableOpacity
              onPress={()=>this.showSMode('time')}
              activeOpacity={1}>
              <Text><Icon name="calendar" size={20} color="black"/></Text>
            </TouchableOpacity>
          </View>
          
          {this.state.shows && (
            <DateTimePicker
              testID="dateTimePicker"
              value={this.state.stime}
              mode={this.state.mode}
              is24Hour={true}
              display="default"
              onChange={this.onSTimeChange}
            />
          )}
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>End Time</Text>
          <View style={styles.itemWrap}>
            <TextInput
              placeholder="End Time"
              onChangeText={(etime) => this.setState({ etime })}
              autoCapitalize='none'
              value={this.state.etime}
              style={ [s.inputText, s.flex90]}
            />
            <TouchableOpacity
              onPress={()=>this.showEMode('time')}
              activeOpacity={1}>
              <Text><Icon name="calendar" size={20} color="black"/></Text>
            </TouchableOpacity>
          </View>
          
          {this.state.showe && (
            <DateTimePicker
              testID="dateTimePicker"
              value={this.state.etime}
              mode={this.state.mode}
              is24Hour={true}
              display="default"
              onChange={this.onETimeChange}
            />
          )}
          <Text style={[s.ft14300Gray, s.mv15, styles.textLeft]}>
            Max Players(Optional)
          </Text>
          <TextInput
            onChangeText={players => this.setState({players})}
            autoCapitalize='none'
            value={this.state.players}
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
