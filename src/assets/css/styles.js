'use strict'

var React = require('react-native')
import { Dimensions } from 'react-native';
let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;
var {StyleSheet} = React

module.exports = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(250, 250, 250, 0.9)',
  },

  headerContent: {
    backgroundColor: 'white',
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },

  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  headerLeft: {
    width: 77,
    height: 28,
    padding: 3,
  },

  moreIcon: {
    width: 80,
    height:10,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },

  footerContent: {
    alignSelf: 'center',
    backgroundColor: 'rgba(250, 250, 250, 0.9)',
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  loader: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },

  txCenter: {
    width:'100%', 
    textAlign: 'center'
  },

  ImageIconStyle_logo: {
    padding: 12,
    margin: 5,
    height: deviceHeight * 0.13,
    width: deviceWidth * 0.6,
    resizeMode: 'stretch',
  },

  icon30: {
    width: 30,
    height: 30
  },

  backIcon: {
    height: 18,
    width: 10
  },

  icon20: {
    width: 20,
    height: 20
  },

  icon15: {
    width: 15,
    height: 15
  },

  w100: {
    width: '100%'
  },

  w70: {
    width: '70%'
  },

  flex30: {
    width: '30%'
  },

  flex70: {
    width: '70%'
  },

  mainContainer: {
    padding: 20,
    marginBottom: 20,
  },

  margin20: {
    margin: 20
  },

  mt20: {
    marginTop: 20
  },

  mv25: {
    marginVertical: 25,
  },

  mv15: {
    marginVertical: 15,
  },

  padding20: {
    padding: 20
  },

  mb5: {
    marginBottom: 5
  },

  mb10: {
    marginBottom: 10,
  },

  mb15: {
    marginBottom: 15,
  },

  mb20: {
    marginBottom: 20,
  },

  posAbsolute: {
    position: 'absolute'
  },

  posRelative: {
    position: 'relative'
  },

  shadowBtn: {
    backgroundColor: '#fff',
    shadowColor: "rgba(157, 157, 157, 0.2);",
    shadowOffset: {
      width: 1,
      height: 5
    },
    shadowRadius: 8,
    shadowOpacity: 1.0,
    elevation: 2,
    width: 100,
    height: 60,
    borderRadius: 8,
    textAlign: 'center',
    position:'absolute', 
    right:20, 
    top: 0,
  },

  splitLine: {
    backgroundColor: '#D5D6D7',
    height: 1,
    width: '100%'
  },

  profileBtn: {
    height:30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderBottomColor: '#D5D6D7', 
    borderBottomWidth:1
  },

  formBtn: {
    height:30, 
    justifyContent: 'center', 
    alignItems: 'center'
  },

  ft20Black: {
    fontFamily: 'Lato-Light',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 20,
    lineHeight: 22,
    color: '#000000',
  },

  title: {
    fontSize: 17,
    color: '#2F2F2F',
    fontFamily: 'Lato-Light',
    fontWeight: 'bold',
    lineHeight: 20,
    fontStyle: 'normal',
    letterSpacing: 0.5,
  },

  ft17Gray: {
    fontSize: 17,
    color: '#2F2F2F',
    fontFamily: 'Lato-Light',
    fontWeight: 'normal',
    lineHeight: 20,
    fontStyle: 'normal',
  },

  ft15RegularBlack: {
    fontFamily: 'Lato-Light',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 15,
    lineHeight: 18,
    color: '#000000',
  },

  ft14BoldBlack: {
    fontFamily: 'Lato-Light',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0.5,
    color: '#28282B',
  },

  ft14300Gray: {
    fontFamily: 'Lato-Light',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0.5,
    color: '#2F2F2F',
  },

  ft12Gray: {
    fontFamily: 'Lato-Light',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 16,
    color: '#8A817C',
  },

  ft12Black: {
    fontFamily: 'Lato-Light',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 12,
    lineHeight: 16,
    color: '#173147',
  },

  ft10Gray: {
    fontFamily: 'NunitoSans-Light',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 10,
    lineHeight: 14,
    color: '#AAAAAA'
  },

})
