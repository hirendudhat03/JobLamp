import React, {Component} from 'react'
import {
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Image,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import RNFirebase from 'react-native-firebase'
import I18n from 'react-native-i18n'

import {Height, Width} from '../config/dimensions'
import {API_ROOT} from '../config/constant'
import strings from '../config/LanguageStrings'

const loginlogo = require('../../assets/images/splash_logo.png')
const icusername = require('../../assets/images/ic_username.png')
const icpassword = require('../../assets/images/ic_password.png')
const icchecked = require('../../assets/images/ic_checkmark.png')
const icunchecked = require('../../assets/images/ic_uncheck.png')

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      showloading: false,
      ischecked: false,
    }
  }

  async componentDidMount () {
    let local = I18n.currentLocale()

    if (
      local != '' &&
      local != undefined &&
      local != null &&
      global.language == ''
    ) {
      strings.setLanguage(local)
    } else {
      strings.setLanguage(global.language)
    }
    this.setupFirebase()
  }

  setupFirebase () {
    RNFirebase.messaging()
      .requestPermission()
      .then(async () => {
        const fcmToken = await RNFirebase.messaging().getToken()
        if (fcmToken) {
          console.log('fcmToken', fcmToken)
          //alert(fcmToken)
          if (Platform.OS === 'android') {
            global.device_token = fcmToken
            //alert(global.device_token)
            const channel = new RNFirebase.notifications.Android.Channel(
              'channelId',
              'Channel Name',
              RNFirebase.notifications.Android.Importance.Max,
            ).setDescription('A natural description of the channel')
            RNFirebase.notifications().android.createChannel(channel)

            self.notificationListener = RNFirebase.notifications().onNotification(
              notification => {
                const notification1 = new RNFirebase.notifications.Notification(
                  {
                    sound: 'default',
                    show_in_foreground: true,
                  },
                )
                  .setNotificationId(notification.notificationId)
                  .setTitle(notification.title)
                  .setBody(notification.body)
                  .setData(notification.data)
                  .android.setChannelId('channelId')
                  .android.setPriority(
                    RNFirebase.notifications.Android.Priority.High,
                  )

                //alert(JSON.stringify(notification1))
                RNFirebase.notifications().displayNotification(notification1)
              },
            )
          } else if (Platform.OS === 'ios') {
            global.device_token = fcmToken

            //alert(global.device_token)

            self.notificationListener = RNFirebase.notifications().onNotification(
              notification => {
                const localNotification = new RNFirebase.notifications.Notification(
                  {
                    sound: 'default',
                    show_in_foreground: false,
                  },
                )
                  .setNotificationId(notification.notificationId)
                  .setTitle(notification.title)
                  .setBody(notification.body)
                  .setData(notification.data)

                //alert('Notification: '+localNotification.data)

                RNFirebase.notifications()
                  .displayNotification(localNotification)
                  .catch(err => alert(JSON.stringify(err)))
              },
            )
          }
          self.notificationDisplayedListener = RNFirebase.notifications().onNotificationDisplayed(
            notification => {
              // Process your notification as required
              // alert(JSON.stringify(notification.data))
              // ANDROID: Remote notifications do not contain
              // the channel ID. You will have to specify this manually if you'd like to re-display the notification.
            },
          )
          self.notificationOpenedListener = RNFirebase.notifications().onNotificationOpened(
            notificationOpen => {
              // Get the action triggered by the notification being opened
              RNFirebase.notifications().removeDeliveredNotification(
                notificationOpen.notification.notificationId,
              )
              //alert(JSON.stringify(notificationOpen.notification.data));
              const action = notificationOpen.action
              // Get information about the notification that was opened
              const notification = notificationOpen.notification

              const data = notification.data
              //alert(JSON.stringify(data))

              // if(global.noti_count > 0)
              // {
              //   global.noti_count = store.getState().auth.notification_count - 1
              // }

              //this.onNotificationClick(data)

              // setTimeout( () => {
              //     this.onNotificationClick(data)
              // },500);
            },
          )
          //self.notificationDisplayedListener()
          //self.notificationListener()
          //self.notificationOpenedListener()
          RNFirebase.notifications()
            .getInitialNotification()
            .then(notificationOpen => {
              if (notificationOpen) {
                //alert(JSON.stringify(notificationOpen.notification.data));
                // App was opened by a notification
                // Get the action triggered by the notification being opened
                const action = notificationOpen.action
                // Get information about the notification that was opened
                const notification = notificationOpen.notification

                //alert(JSON.stringify(notification.data))
                const data = notification.data
                //this.onNotificationClick(data)
                // setTimeout( () => {
                //     this.onNotificationClick(data)
                // },500);
              }
            })
        } else {
          // user doesn't have a device token yet
        }
      })
      .catch(error => {
        // User has rejected permissions
      })
  }

  onPressForgotPass () {
    this.props.navigation.navigate('ForgotPass')
  }

  onLoginPressed () {
    this.validateFields()
  }

  onSignUpPressed () {
    //strings.setLanguage('es')
    //this.setState({ischecked:false})
    this.props.navigation.navigate('SignUpStep1')
  }

  onPressedCheckMark () {
    if (this.state.ischecked == true) {
      this.setState({ischecked: false})
    } else {
      this.setState({ischecked: true})
    }
  }

  onEULAPressed () {
    this.props.navigation.navigate('Eula')
  }

  onPressedPrivacy () {
    this.props.navigation.navigate('PrivacyPolicy')
  }

  onPressedTerms () {
    this.props.navigation.navigate('TermsConditions')
  }

  validateFields () {
    if (this.validate(this.state.email.trim()) == false) {
      alert(strings.EnterValiEmail)
      return false
    } else if (this.state.password == '') {
      alert(strings.EnterPass)
      return false
    } else {
      this.loginAPICall()
    }
  }

  validate = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (reg.test(text) === false) {
      return false
    }
    return true
  }

  loginAPICall () {
    console.log('loginAPICall')
    this.setState({showloading: true})

    var data = new FormData()
    data.append('email', this.state.email)
    data.append('password', this.state.password)
    data.append('device_token', global.device_token)

    fetch(API_ROOT + 'login', {
      method: 'post',
      body: data,
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('responseData : ',responseData)
        if (responseData.status == true) {
          this.setState({showloading: false})

          //alert(JSON.stringify(responseData))
          // console.log('responseData : ',responseData);
          // console.log('String(responseData.data.device_token) : ',String(responseData.data.device_token));

          AsyncStorage.setItem('user_id', String(responseData.data.id))
          AsyncStorage.setItem(
            'first_name',
            String(responseData.data.first_name),
          )
          AsyncStorage.setItem('last_name', String(responseData.data.last_name))
          AsyncStorage.setItem('email', String(responseData.data.email))
          AsyncStorage.setItem('user_type', String(responseData.data.user_type))
          AsyncStorage.setItem(
            'mobile_number',
            String(responseData.data.mobile_number),
          )
          AsyncStorage.setItem('device_token', String(responseData.token))
          
          AsyncStorage.setItem('check_status', String(responseData.status))

          if (
            responseData.data.profile_pic == null ||
            responseData.data.profile_pic == undefined ||
            responseData.data.profile_pic == ''
          ) {
            AsyncStorage.setItem('profilepic', '')
          } else {
            AsyncStorage.setItem(
              'profilepic',
              String(responseData.data.profile_pic),
            )
          }

          AsyncStorage.setItem('loggedin', 'true')
          this.props.navigation.navigate('App')
        } else {
          this.setState({showloading: false})
          alert(responseData.message)
        }
      })
      .catch(error => {
        console.log('error : ',error)
        this.setState({showloading: false})
        //alert(error)
      })
  }

  renderTopBar () {
    return (
      <View
        style={{
          backgroundColor: '#3B5998',
          height: 80,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        {/* <TouchableOpacity style={styles.menubutton} onPress={() => this.onMenuPressed()}>
                        <Image source = {icmenu} resizeMode= 'contain'/>
                    </TouchableOpacity> */}
        <Text
          style={{
            marginTop: 45,
            width: '70%',
            height: 35,
            textAlign: 'center',
            color: '#fff',
            fontSize: 20,
            fontWeight: '600',
          }}>
          Login
        </Text>
        {/* <TouchableOpacity style={styles.cartbutton} onPress={() => this.onCartPressed()}>
                        <Image source = {iccart} resizeMode= 'contain'/>
                    </TouchableOpacity> */}
      </View>
    )
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center'}}>
        <StatusBar barStyle='light-content' backgroundColor='#c80025' />
        {/* {this.renderTopBar()} */}
        <SafeAreaView />
        {this.state.showloading == true ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              zIndex: 2,
              width: Width(100),
              height: Height(100),
              position: 'absolute',
            }}>
            <ActivityIndicator size='large' color='#3B5998' />
          </View>
        ) : null}

        <KeyboardAwareScrollView
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='always'
          contentContainerStyle={{alignItems: 'center'}}
          getTextInputRefs={() => {
            return [this.txtemail, this.txtpassword]
          }}>
          {/* <View style = {{width:Width(90), marginTop:60}}>
                    <Text style = {{fontSize:10,color:'#8F8F90', marginTop:5}}>Email</Text>
                    <TextInput style = {{color:'#000',fontSize:14, marginBottom:5, marginTop:5,height:Height(3)}} placeholder = "Email Address" onChangeText = {(email) => this.setState({email:email})} ref={(r) => { this.txtemail = r; }} returnKeyType={'next'}></TextInput>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#3A4759'}}></View>
                </View> */}
          <View
            style={{
              zIndex: -1,
              marginTop: 80,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={loginlogo}
              resizeMode='contain'
              style={{width: 120, height: 120, borderRadius: 15}}></Image>
            <Text
              style={{
                fontSize: 35,
                fontWeight: '700',
                color: '#000',
                marginTop: 20,
              }}>
              JobLamp
            </Text>
          </View>
          <View
            style={{
              backgroundColor: 'transparent',
              height: 50,
              marginTop: 70,
              width: Width(90),
            }}>
            <View
              style={{
                backgroundColor: 'transparent',
                height: 50,
                width: Width(90),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={icusername}
                resizeMode='contain'
                style={{width: 20, height: 20, marginLeft: 10}}></Image>
              <TextInput
                style={{
                  marginTop: 5,
                  height: 50,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  marginLeft: 15,
                  fontSize: 15,
                }}
                placeholder={strings.EmailAddress}
                onChangeText={email => this.setState({email: email})}
                ref={r => {
                  this.txtemail = r
                }}
                returnKeyType={'next'}></TextInput>
            </View>
            <View
              style={{
                height: 1,
                width: Width(90),
                backgroundColor: '#C0C0C3',
              }}></View>
          </View>
          <View
            style={{
              backgroundColor: 'transparent',
              height: 50,
              marginTop: 20,
              width: Width(90),
            }}>
            <View
              style={{
                backgroundColor: 'transparent',
                height: 50,
                width: Width(90),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={icpassword}
                resizeMode='contain'
                style={{width: 20, height: 20, marginLeft: 10}}></Image>
              <TextInput
                style={{
                  marginTop: 5,
                  height: 50,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  marginLeft: 15,
                  fontSize: 15,
                }}
                placeholder={strings.Password}
                secureTextEntry={true}
                onChangeText={pass => this.setState({password: pass})}
                secureTextEntry={true}
                ref={r => {
                  this.txtpassword = r
                }}
                returnKeyType={'next'}></TextInput>
            </View>
            <View
              style={{
                height: 1,
                width: Width(90),
                backgroundColor: '#C0C0C3',
              }}></View>
          </View>
          {/* <View style = {{marginTop:30, alignItems:'center',justifyContent:'center', marginHorizontal:20}}>
                        <View style = {{flexDirection:'row'}}>
                            <TouchableOpacity style = {{width:25, height:25,backgroundColor:'transparent', alignItems:'center',justifyContent:'center'}} onPress = { () => this.onPressedCheckMark()} activeOpacity = {0.9}>
                                {
                                    this.state.ischecked == true ?
                                    <Image source = {icchecked} style = {{height:25, width:25}}></Image>
                                    :
                                    <Image source = {icunchecked} style = {{height:25, width:25}}></Image>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity style = {{backgroundColor:'transparent',justifyContent:'center', marginLeft:10}} onPress = { () => this.onEULAPressed()}>
                                <Text style = {{fontSize:13,fontWeight:'400',color:'#000'}}>End User License Agreement</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style = {{backgroundColor:'transparent',justifyContent:'center'}} onPress = { () => this.onPressedPrivacy()}>
                                <Text style = {{fontSize:13,fontWeight:'400',color:'#000'}}>, Privacy Policy</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style = {{backgroundColor:'transparent',justifyContent:'center', alignSelf:'center'}} onPress = { () => this.onPressedTerms()}>
                            <Text style = {{fontSize:13,fontWeight:'400',color:'#000'}}>and Terms & Conditions </Text>
                        </TouchableOpacity>
                    </View> */}
          <TouchableOpacity
            style={{
              width: Width(90),
              height: 50,
              backgroundColor: '#c80025',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 50,
              borderRadius: 25,
            }}
            onPress={() => this.onLoginPressed()}>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
              {strings.Login}
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: '#938F8F',
              fontSize: 15,
              width: Width(80),
              alignSelf: 'flex-end',
              marginTop: 30,
              marginRight: Width(5),
              textAlign: 'right',
              fontWeight: '200',
            }}
            onPress={() => this.onPressForgotPass()}>
            {strings.ForgotPass}
          </Text>
          <TouchableOpacity
            style={{
              height: 40,
              marginBottom: 20,
              width: Width(80),
              flexDirection: 'row',
              height: 30,
              backgroundColor: 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 35,
            }}
            onPress={() => this.onSignUpPressed()}>
            <Text
              style={{
                height: 40,
                fontSize: 16,
                fontWeight: '300',
                color: '#938F8F',
                textAlign: 'center',
              }}>
              {strings.DontHaveAccount}
              <Text style={{fontSize: 16, fontWeight: '400', color: '#c80025'}}>
                {' '}
                {strings.SIGNUP}
              </Text>
            </Text>
          </TouchableOpacity>
          {/* {
                    Platform.OS == 'ios' ? */}

          {/* :
                    null
                } */}
        </KeyboardAwareScrollView>
      </View>
    )
  }
}
export default Login
