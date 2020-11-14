import React from 'react';
import { StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform, FlatList } from 'react-native';
import { Container, Header, Content, Text, View, FooterTab, Footer, Button } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import  MapView,{Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import home from '../assets/icons/home1.png'
import chat from '../assets/icons/chat1.png'
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
      fromToday: this.props.navigation.state.params.fromToday,
      nonRegUsers: []
    };
  }

  componentDidMount() {
    this.getMeetupData(this.state.id);
    AsyncStorage.getItem('userData').then(res => {
      this.setState({
        phone: JSON.parse(res).phone,
        firstName: JSON.parse(res).firstName,
        lastName: JSON.parse(res).lastName,
      })
    });
    // setTimeout(() => {
    //   Geolocation.getCurrentPosition(
    //     (location) => {
    //       this.setState({
    //         region: {
    //           latitude: location.coords.latitude,
    //           longitude: location.coords.longitude,
    //           latitudeDelta: 0.01,
    //           longitudeDelta: 0.01, 
    //         },
    //         isMapReady: true,
    //         error:null,
    //       });
    //     },
    //     (error) => {
    //       this.setState({error: error.message}); 
    //       console.log('there', error)},
    //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 3600000 },
    //   )
    // }, 2000);
  }

  getMeetupData =async(id)=> {    
    await firestore().collection('meetups').doc(id)
    .get()
    .then(querySnapshot => {
      this.setState({
        meetupData: querySnapshot._data,
      }, ()=>{
        this.setState({          
          region: {
            latitude: Number(this.state.meetupData.coordinates.split(',')[0]),
            longitude: Number(this.state.meetupData.coordinates.split(',')[1]),
            latitudeDelta: 0.0005,
            longitudeDelta: 0.0005, 
          },
          isMapReady: true,
          error:null,
        })
        this.getUsers(this.state.meetupData.players)
      })
    });
  }

  getUsers = async (players) => {
    let count = 0;
    this.setState({nonRegUsers: []})
    await firestore().collection('users')
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.map(doc => {
          let user = doc.data();
          let nonReg = true;
          console.warn(user);
          players.map(player=>{
            if (user.phone == player.phone) {
              nonReg = false;
            }
          })
          if (nonReg == true) {
            this.state.nonRegUsers.push({
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone,
              isActive: false
            })
          }
          count++;
        });
        if (count == querySnapshot.docs.length) {
          this.setState({isLoading: false})
        }
      });
  }

  onLogout =()=> {
    AsyncStorage.setItem('userData', 'logout').then(() => {
      this.props.navigation.navigate('Login');
    });
  }

  renderRegItem = data => {
    return (
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <Text style={[s.ft14300Gray, s.flex40]}>{data.item.firstName} {data.item.lastName}</Text>
      </View>
    )
  }

  onAdd =(player, flag)=> {
    const {id} = this.state;
    this.setState({isLoading: true});
    this.state.meetupData.players.push(player);
    firestore().collection("meetups").doc(id).update(this.state.meetupData)
      .then(() => {   
        this.getMeetupData(id);   
        if (flag == true) {
          alert("successfully added");
        } else {
          alert("successfully joined");
          this.props.navigation.navigate('MyMeetup');
        }
        
      })
      .catch(err=>{
        alert(err);
        this.setState({isLoading: false})
      })
  }

  renderNonRegItem = data => {
    return (
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <Text style={[s.ft14300Gray, s.flex40]}>{data.item.firstName} {data.item.lastName}</Text>
        <TouchableOpacity onPress={()=>this.onAdd(data.item, true)}>
          <Text style={s.ft14blue}>Add</Text>
        </TouchableOpacity>
      </View>
    )
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
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Chat', {id: this.state.id, name: this.state.meetupData.name, date: this.state.meetupData.date})}
              activeOpacity={1}>
              <Image source={chat} style={s.icon30}/>
            </TouchableOpacity>
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
          <View style={s.mv15}>
          {this.state.isMapReady && <MapView
              initialRegion={this.state.region}
              OnLayout={this.onMapLayout}
              style={ styles.mapStyle}
              mapType={Platform.OS == "android" ? "none" : "standard"}
            >
              <Marker 
                coordinate = {this.state.region} title='We have a meet up in here'
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
          {this.state.meetupData.players.length>0 &&
            <Text style={[s.ft14BoldBlack, s.mb10, ]}>Added players</Text>
          }          
          <View>
            <FlatList data={this.state.meetupData.players} renderItem={item => this.renderRegItem(item)}/>
          </View>
          {this.state.nonRegUsers.length>0 &&
          <Text style={[s.ft14BoldBlack, s.mb10, ]}>Which player do you want to add ?</Text>
          }
          <View>
            <FlatList data={this.state.nonRegUsers} renderItem={item => this.renderNonRegItem(item)}/>
          </View>
          <Text style={[s.ft14BoldBlack, s.mb10]}>Rules</Text>
          <Text style={[s.ft14300Gray, s.mb20]}>{this.state.meetupData.rules}</Text>
          {this.state.fromToday &&
          <View>
            <View style={s.splitLine}></View>
            <View style={{flexDirection: 'row', justifyContent:'flex-end', marginVertical: 20}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()} activeOpacity={1} style={s.flex20}>
                <Text style={s.ft14blue}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>this.onAdd({firstName: this.state.firstName, lastName: this.state.lastName, phone: this.state.phone, isActive: false}, false)} activeOpacity={1}>
                <Text style={s.ft14blue}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
          }
        </Content>
        <Footer>
          <FooterTab style={s.footerContent}>
            <Button onPress={() => this.props.navigation.navigate('Home')}><Image source={home} style={s.icon20}/></Button>
            <Button onPress={() => this.props.navigation.navigate('SingleChat')}><Image source={chat} style={s.icon30}/></Button>
          </FooterTab>
        </Footer>
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
