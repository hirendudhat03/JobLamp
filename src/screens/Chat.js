import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  Dimensions,
  TextInput,
  InputAccessoryView,
  Modal,
  KeyboardAvoidingView,
} from 'react-native'
import Moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ImagePicker from 'react-native-image-crop-picker'
import DocumentPicker from 'react-native-document-picker'

import {API_ROOT, IMG_PREFIX_URL} from '../config/constant'
import {Height, Width} from '../config/dimensions'
import strings from '../config/LanguageStrings'

import firebase from 'firebase'
import {SafeAreaView} from 'react-navigation'
import {ScrollView} from 'react-native-gesture-handler'

const icback = require('../../assets/images/ic_back.png')
const icsend = require('../../assets/images/ic_msg_send.png')
const defaultuser = require('../../assets/images/ic_default_user_black.png')
const icplus = require('../../assets/images/ic_plus_red.png')
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

let deviceWidth = Dimensions.get('window').width

class Chat extends Component {
  constructor (props) {
    super(props)
    this.messagefield = null
    ;(this.state = {
      messages: [],
      device_token: '',
      user_id: '',
      showloading: false,
      inputheight: Height(4),
      Msg: '',
      KeyboardVisible: false,
      receiver_id: props.navigation.state.params.receiver_id,
      chat_url: props.navigation.state.params.chat_url,
      receiver_photo: props.navigation.state.params.receiver_photo,
      receiver_name: props.navigation.state.params.receiver_name,
      showaction: false,
    }),
      (this.onInputFocus = this.onInputFocus.bind(this))
    this.onInputBlur = this.onInputBlur.bind(this)
    this._didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload => {
        this.loadData()
      },
    )
  }

  async componentDidMount () {
    //alert('hiii')
    await AsyncStorage.getItem('user_id').then(value => {
      this.setState({user_id: value})
    })

    await AsyncStorage.getItem('device_token').then(value => {
      this.setState({device_token: value})
    })

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        this.setState({KeyboardVisible: true}) // or some other action
      },
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        this.setState({KeyboardVisible: false}) // or some other action
      },
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }

  loadData () {
    firebase
      .database()
      .ref('messages/' + this.state.chat_url)
      .on('child_added', snapshot => {
        if (snapshot.val() != null) {
          console.log('Message: ' + snapshot.val().message)
          if (snapshot.val() != null) {
            if (this.state.messages.length > 0) {
              let arrmsgs = this.state.messages
              arrmsgs.push(snapshot.val())
              this.setState({messages: arrmsgs})
            } else {
              let arrmsgs = []
              arrmsgs.push(snapshot.val())
              this.setState({messages: arrmsgs})
            }
          }
          //this.setState({messages:})
        }
      })
  }

  onMenuPressed () {
    this.props.navigation.goBack()
  }

  onInputFocus () {
    // this.scroll.scrollToEnd()
  }

  onInputBlur () {}

  choosePhoto () {
    ImagePicker.openPicker({
      width: Width(100),
      cropping: true,
    }).then(image => {
      //console.log(image);
      //alert(image.path)

      if (image.path != undefined && image.path != '' && image.path != null) {
        this.uploadAttachment(image.path, 'photo')
      }
    })
  }

  async chooseDocument () {
    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.zip,
        ],
      })
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      )

      if (res.uri != null && res.uri != '') {
        this.uploadAttachment(res.uri, res.type)
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }

  onPlusPressed () {
    this.setState({showaction: true})
  }

  onPressedsendMessage () {
    if (this.state.Msg != '') {
      this.sendMessage('text', this.state.Msg)
      this.setState({Msg: ''})
    }
  }

  sendMessage (msg_type, strmessage) {
    if (
      this.state.receiver_id != null &&
      this.state.receiver_id != undefined &&
      this.state.chat_url != undefined &&
      this.state.chat_url != null
    ) {
      let url = this.state.chat_url
      //let message = this.state.Msg
      var current = new Date()

      var date = Moment.utc(current).format('ll')
      var time = Moment.utc(current).format('LT')

      firebase
        .database()
        .ref('messages/' + url)
        .push({
          message: strmessage,
          type: msg_type,
          sender_id: this.state.user_id,
          receiver_id: this.state.receiver_id,
          date: date,
          time: time,
        })
    }
  }

  uploadAttachment (attachmenturl, type) {
    var data = new FormData()

    if (type == 'photo') {
      data.append('file', {
        name: 'event.jpg',
        type: 'image/jpg',
        uri:
          Platform.OS === 'android'
            ? attachmenturl
            : attachmenturl.replace('file://', ''),
      })
    } else if (type == 'application/pdf') {
      data.append('file', {
        name: 'sample.pdf',
        type: 'application/pdf',
        uri:
          Platform.OS === 'android'
            ? attachmenturl
            : attachmenturl.replace('file://', ''),
      })
    } else if (type.includes('.document')) {
      data.append('file', {
        name: 'sample.pdf',
        type: type,
        uri:
          Platform.OS === 'android'
            ? attachmenturl
            : attachmenturl.replace('file://', ''),
      })
    }

    // alert(JSON.stringify(data))
    // return

    fetch(API_ROOT + 'save-chat-file', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.status == true) {
          if (
            responseData.file_name != undefined &&
            responseData.file_name != null &&
            responseData.file_name != ''
          ) {
            if (type == 'photo') {
              this.sendMessage('image', responseData.file_name)
            } else {
              this.sendMessage('file', responseData.file_name)
            }
          }
        } else {
          this.setState({showloading: false})
          alert(responseData.message)
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        alert(error)
      })
  }

  onPressedChoosePhoto () {
    this.setState({showaction: false})
    setTimeout(() => this.choosePhoto(), 1000)
  }

  onPressedChooseFile () {
    this.setState({showaction: false})
    setTimeout(() => this.chooseDocument(), 1000)
  }

  renderTopBar () {
    return (
      <View
        style={{
          backgroundColor: '#c80025',
          height: 80,
          width: '100%',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 15,
            marginTop: 45,
            height: 25,
            width: 25,
            justifyContent: 'center',
          }}
          onPress={() => this.onMenuPressed()}>
          <Image source={icback} resizeMode='contain' />
        </TouchableOpacity>
        {this.state.receiver_photo != null &&
        this.state.receiver_photo != '' ? (
          <Image
            source={{uri: this.state.receiver_photo}}
            style={{
              width: 30,
              height: 30,
              marginTop: 45,
              marginLeft: 50,
              borderRadius: 15,
            }}></Image>
        ) : (
          <Image
            source={defaultuser}
            style={{
              width: 30,
              height: 30,
              marginTop: 45,
              marginLeft: 50,
            }}></Image>
        )}
        <Text
          style={{
            marginTop: 50,
            width: '70%',
            height: 35,
            textAlign: 'left',
            color: '#fff',
            fontSize: 15,
            fontWeight: '500',
            marginLeft: 7,
          }}>
          {this.state.receiver_name}
        </Text>
      </View>
    )
  }

  renderActionSheet () {
    return (
      <Modal
        visible={this.state.showaction}
        style={{margin: 0, backgroundColor: 'transparent'}}
        animationType='slide'
        transparent={true}>
        <TouchableOpacity
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            position: 'absolute',
            opacity: 0.4,
          }}
          onPress={() => this.setState({showaction: false})}></TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: Width(100),
            height: Height(19),
            position: 'absolute',
            bottom: 30,
            backgroundColor: 'transparent',
            borderRadius: 10,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: Width(94),
              height: Height(19),
              position: 'absolute',
              bottom: 0,
              backgroundColor: '#fff',
              borderRadius: 10,
            }}>
            <TouchableOpacity
              style={{
                width: Width(94),
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                bottom: 100,
                position: 'absolute',
              }}
              onPress={() => this.onPressedChoosePhoto()}>
              <Text
                style={{
                  width: Width(80),
                  height: 22,
                  color: '#000',
                  fontWeight: '500',
                  fontSize: 15,
                  textAlign: 'center',
                }}>
                {strings.ChoosePhoto}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: Width(94),
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderTopColor: '#E8E8E8',
                borderTopWidth: 1,
                bottom: 50,
                position: 'absolute',
              }}
              onPress={() => this.onPressedChooseFile()}>
              <Text
                style={{
                  width: Width(80),
                  height: 22,
                  color: '#000',
                  fontWeight: '500',
                  fontSize: 15,
                  textAlign: 'center',
                }}>
                {strings.ChooseFile}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: Width(94),
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                borderTopColor: '#E8E8E8',
                borderTopWidth: 1,
                bottom: 0,
                position: 'absolute',
              }}>
              <Text
                style={{
                  width: Width(80),
                  height: 22,
                  color: '#c80025',
                  fontWeight: '500',
                  fontSize: 15,
                  textAlign: 'center',
                }}>
                {strings.Cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  render () {
    return (
      <View style={{flex: 1, width: Width(100)}}>
        {/* <View style={
              this.state.KeyboardVisible
                ? {height: Height(40)}
                : {height: Height(80)}
            }> */}
        {/* <KeyboardAvoidingView style={{flex:1}}> */}
        {this.renderTopBar()}
        {this.renderActionSheet()}
        {/* <InputAccessoryView> */}
        <KeyboardAwareScrollView
          // keyboardDismissMode='interactive'
          // keyboardShouldPersistTaps="always"
          extraScrollHeight={20}
          contentContainerStyle={{height: Height(90), width: Width(100)}}
          >
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={this.state.messages}
            style={{}}
            ref={ref => {
              this.scroll = ref
            }}
            onContentSizeChange={() => this.scroll.scrollToEnd()}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={{
                    borderRadius: 5,
                    padding: 5,
                    backgroundColor: 'transparent',
                  }}
                  activeOpacity={0.9}
                  onPress={() => this.onPressedChat(item)}>
                  {/* <View style = {{backgroundColor:'#fff', width:deviceWidth - 30,borderRadius:10, paddingVertical:10, flexDirection:'row'}}>
                                            {item.receiver != null && item.receiver.profile_pic != null ? <Image source = {{uri:IMG_PREFIX_URL+'profile/'+item.receiver.profile_pic}} style = {{height:40, width:40,marginLeft:10,marginTop:5,borderRadius:20}} resizeMode='cover'/> 
                                            :<Image source = {defaultuser} style = {{height:40, width:40, marginLeft:10,borderRadius:20}} resizeMode='cover'/> }
                                            <View style = {{width:'80%', marginLeft:10, justifyContent:'center'}}>
                                                <Text style={{fontSize: 10,color: '#6e6e6e',fontWeight: '500',textAlign:'left',marginBottom:7,marginTop:7,fontSize:15}} numberOfLines = {1}>{item.receiver.first_name} {item.receiver.last_name}</Text>
                                                <Text style = {{fontSize:12,fontWeight:'300',color:'#6e6e6e',textAlign:'right', position:'absolute',right:8}} numberOfLines = {1}>{item.created_at != '' && item.created_at != null ? Moment(item.created_at).format('ll') : ''}</Text>
                                            </View>
                                        </View> */}
                  {this.state.user_id == item.sender_id ? (
                    <View
                      style={{
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                        width: Width(100),
                      }}>
                      <View style={{height: 30, width: Width(27)}}></View>
                      <View
                        style={{
                          width: Width(68),
                          backgroundColor: '#c80025',
                          borderRadius: 7,
                          marginRight: 15,
                        }}>
                        {item.type == 'image' ? (
                          <Image
                            style={{width: Width(66), height: 200}}
                            source={{uri: item.message}}></Image>
                        ) : (
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 15,
                              marginHorizontal: 7,
                              marginVertical: 3,
                            }}>
                            {item.type == 'text'
                              ? item.message
                              : item.message.replace('message/', '')}
                          </Text>
                        )}
                        <Text
                          style={{
                            color: '#D3D3D3',
                            fontSize: 8,
                            marginHorizontal: 7,
                            marginBottom: 5,
                          }}>
                          {item.date} {item.time}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: Width(100),
                      }}>
                      <View
                        style={{
                          width: Width(69),
                          backgroundColor: '#fff',
                          borderRadius: 7,
                          marginLeft: 10,
                        }}>
                        {item.type == 'image' ? (
                          <Image
                            style={{width: Width(66), height: 200}}
                            source={{uri: item.message}}></Image>
                        ) : (
                          <Text
                            style={{
                              color: '#000',
                              fontSize: 15,
                              marginHorizontal: 7,
                              marginVertical: 3,
                            }}>
                            {item.type == 'text'
                              ? item.message
                              : item.message.replace('message/', '')}
                          </Text>
                        )}
                        <Text
                          style={{
                            color: '#D3D3D3',
                            fontSize: 8,
                            marginHorizontal: 7,
                            marginBottom: 5,
                          }}>
                          {item.date} {item.time}
                        </Text>
                      </View>
                      <View style={{height: 30, width: Width(29)}}></View>
                    </View>
                  )}
                </TouchableOpacity>
              )
            }}
            keyExtractor={(item, index) => index}
          />
       

        {Platform.OS == 'ios' ? (
          // <InputAccessoryView>
          <View
            style={{
              backgroundColor: '#fff',
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 0.4,
              borderColor: '#EFEFF4',
              borderBottomWidth: 0,
              
            }}>
            <TouchableOpacity
              style={{
                height: Height(4),
                width: Height(4),
                borderRadius: Height(4),
                backgroundColor: 'transparent',
                left: 7,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => this.onPlusPressed()}>
              {/* <Ionicons color={colors.white} name='md-send'/> */}
              <Image style={{width: 30, height: 30}} source={icplus}></Image>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#F2F4F7',
                width: Width(75),
                marginLeft: Width(12),
                borderRadius: Height(3),
                alignItems: 'center',
                borderWidth: 0.3,
                borderColor: '#EFEFF4',
                marginTop: 8,
                marginBottom: 8,
              }}>
              <TextInput
                // inputAccessoryViewID = {inputAccessoryViewID}
                ref={ref => {
                  this.messagefield = ref
                }}
                onFocus={this.onInputFocus}
                onBlur={this.onInputBlur}
                value={this.state.Msg}
                onContentSizeChange={event => {
                  this.setState({
                    inputheight: event.nativeEvent.contentSize.height,
                  })
                }}
                style={
                  this.state.inputheight < Height(6)
                    ? {
                        marginLeft: 15,
                        marginRight: 5,
                        fontSize: 15,
                        textAlign: 'left',
                        marginBottom: 8,
                        marginTop: 3,
                        width: Width(70),
                      }
                    : {
                        marginLeft: 15,
                        marginRight: 5,
                        fontSize: 15,
                        textAlign: 'left',
                        marginBottom: 8,
                        marginTop: 3,
                        height: Height(6),
                        width: Width(70),
                      }
                }
                multiline={true}
                numberOfLines={3}
                placeholder='Message...'
                onChangeText={Msg => {
                  this.setState({Msg})
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                height: Height(4),
                width: Height(4),
                borderRadius: Height(4),
                backgroundColor: 'transparent',
                right: 7,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => this.onPressedsendMessage()}>
              {/* <Ionicons color={colors.white} name='md-send'/> */}
              <Image style={{width: 30, height: 30}} source={icsend}></Image>
            </TouchableOpacity>
          </View>
          // </InputAccessoryView>
        ) : (
          <View
            style={{
              backgroundColor: '#fff',
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 0.4,
              borderColor: '#EFEFF4',
              borderBottomWidth: 0,
            }}>
            <TouchableOpacity
              style={{
                height: Height(4),
                width: Height(4),
                borderRadius: Height(4),
                backgroundColor: 'transparent',
                left: 7,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => this.onPlusPressed()}>
              {/* <Ionicons color={colors.white} name='md-send'/> */}
              <Image style={{width: 30, height: 30}} source={icplus}></Image>
            </TouchableOpacity>
            <View
              style={
                this.state.inputheight < Height(10)
                  ? {
                      marginLeft: Width(12),
                      flexDirection: 'row',
                      backgroundColor: '#F2F4F7',
                      width: Width(75),
                      borderRadius: Height(3),
                      alignItems: 'center',
                      borderWidth: 0.3,
                      borderColor: '#EFEFF4',
                      marginTop: 8,
                      marginBottom: 8,
                      height: this.state.inputheight,
                    }
                  : {
                      marginLeft: Width(12),
                      flexDirection: 'row',
                      backgroundColor: '#F2F4F7',
                      width: Width(75),
                      borderRadius: Height(3),
                      alignItems: 'center',
                      borderWidth: 0.3,
                      borderColor: '#EFEFF4',
                      marginTop: 8,
                      marginBottom: 8,
                      height: Height(10),
                    }
              }>
              <TextInput
                ref={ref => {
                  this.messagefield = ref
                }}
                onFocus={this.onInputFocus}
                onBlur={this.onInputBlur}
                value={this.state.Msg}
                onContentSizeChange={event => {
                  this.setState({
                    inputheight: event.nativeEvent.contentSize.height,
                  })
                }}
                style={{
                  marginLeft: 15,
                  marginRight: 5,
                  fontSize: 15,
                  textAlign: 'left',
                  width: Width(70),
                }}
                multiline={true}
                placeholder='Message...'
                //onChangeText={(Msg)=>this.setState({Msg})}
                onChangeText={Msg => {
                  this.setState({Msg})
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                height: Height(4),
                width: Height(4),
                borderRadius: Height(4),
                backgroundColor: 'transparent',
                right: 7,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => this.onPressedsendMessage()}>
              <Image style={{width: 30, height: 30}} source={icsend}></Image>
            </TouchableOpacity>
          </View>
        )}
 </KeyboardAwareScrollView>
        {/* </InputAccessoryView> */}
      </View>
    )
  }
}
export default Chat
