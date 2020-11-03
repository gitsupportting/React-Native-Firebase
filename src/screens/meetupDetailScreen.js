import React from 'react';
import { StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Container, Header, Content, Text, View } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import  MapView,{Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import editBtn from '../assets/icons/editIcon.png';
import backBtn from '../assets/icons/backBtn.png';
var s = require('../assets/css/styles');

export default class MeetupDetailScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      id: this.props.navigation.state.params.id,
      fromMy: this.props.navigation.state.params.fromMy,
      fromToday: this.props.navigation.state.params.fromToday
    };
  }

  componentDidMount() {
    this.getMeetupData(this.state.id);
    setTimeout(() => {
      Geolocation.getCurrentPosition(
        (location) => {
          this.setState({
            region: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 1,
              longitudeDelta: 1, 
            },
            isMapReady: true,
            error:null,
          });
        },
        (error) => {
          this.setState({error: error.message}); 
          console.log('there', error)},
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 3600000 },
      )
    }, 1000);
  }

  getMeetupData =async(id)=> {
    await firestore().collection('meetups').doc(id)
    .get()
    .then(querySnapshot => {
      this.setState({
        meetupData: querySnapshot._data,
        isLoading: false
      })
    });
  }

  onLogout =()=> {
    AsyncStorage.setItem('userData', 'logout').then(() => {
      this.props.navigation.navigate('Login');
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={s.loader}>
          <ActivityIndicator size="large" color="#0c9" />
        </View>
      )
    }
    return (
      <Container style={s.container}>
        <Header style={s.headerContent}>
          <View style={s.spaceBetween}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{width:15}}
              activeOpacity={1}>
              <Image source={backBtn} style={s.backIcon}/>
            </TouchableOpacity>
            <Text style={s.title}>Meep Up Detail</Text>
            <View style={{width:15}}></View>
          </View>          
        </Header>
        <Content style={s.mainContainer}>
          <View style={[s.spaceBetween, s.mb20]}>
            <Text style={s.ft17Gray}>{this.state.meetupData.name}</Text>
            {/* <TouchableOpacity
              onPress={() => this.props.navigation.navigate('MeetupEdit', {id: this.state.id})}
              style={{width:15, marginRight:5}}
              activeOpacity={1}>
              <Image source={editBtn} style={s.icon20}/>
            </TouchableOpacity> */}
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={s.flex30}>
              <Text style={[s.ft14BoldBlack, s.mb10]}>Time</Text>
              <Text style={[s.ft14BoldBlack, s.mb10]}>Location</Text>
            </View>
            <View style={s.flex70}>
              <Text style={[s.ft14300Gray, s.mb10]}>{this.state.meetupData.stime} - {this.state.meetupData.etime}</Text>
              <Text style={[s.ft14300Gray, s.mb10]}>{this.state.meetupData.address}</Text>
            </View>
          </View>
          <View style={s.mb20}>
          {this.state.isMapReady && <MapView
              initialRegion={this.state.region}
              OnLayout={this.onMapLayout}
              style={ styles.mapStyle}
              mapType={Platform.OS == "android" ? "none" : "standard"}
            >
              <Marker 
                coordinate = {this.state.region} title={"I am here."}
                >
                <Image source={require('../assets/location.gif')} style={{height: 15, width:15 }} />
              </Marker>
            </MapView>}
            {!this.state.isMapReady && <MapView
              initialRegion={this.state.region}
              OnLayout={this.onMapLayout}
              style={ styles.mapStyle}
            >
            </MapView>}
          </View>
          <Text style={[s.ft14BoldBlack, s.mb100]}>Rules</Text>
          <Text style={[s.ft14300Gray, s.mb20]}>{this.state.meetupData.rules}</Text>
          {this.state.fromToday &&
          <View>
            <View style={s.splitLine}></View>
            <View style={{flexDirection: 'row', justifyContent:'flex-end', marginVertical: 20}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()} activeOpacity={1} style={s.flex20}>
                <Text style={s.ft14blue}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()} activeOpacity={1}>
                <Text style={s.ft14blue}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
          }
          
        </Content>
      </Container >
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: '100%',
    height: 200,
  },
})
