import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Linking,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import DocumentPicker from 'react-native-document-picker'
import strings from '../config/LanguageStrings'

const icback = require('../../assets/images/ic_back.png')
const icattachment = require('../../assets/images/ic_attachment.png')

let deviceWidth = Dimensions.get('window').width
import {Height, Width} from '../config/dimensions'
import {API_ROOT, IMG_PREFIX_URL} from '../config/constant'
import {TouchableHighlight} from 'react-native-gesture-handler'

class DeliverJob extends Component {
  constructor (props) {
    super(props)
    this.state = {
      login_id: '',
      device_token: '',
      job_id: props.navigation.state.params.job_id,
      showloading: false,
      attachment_name: '',
      covertext: '',
      attachment_url: '',
      attachment_type: '',
      view_delivery: props.navigation.state.params.view_delivery,
    }
  }

  async componentDidMount () {
    console.log('status : ', this.state.view_delivery)

    await AsyncStorage.getItem('user_id').then(value => {
      this.setState({login_id: value})
    })

    await AsyncStorage.getItem('device_token').then(value => {
      this.setState({device_token: value})
    })

    if (this.state.view_delivery == true) {
      this.getDeliveryDetailsAPICall()
    }
  }

  onBackPressed () {
    this.props.navigation.goBack()
  }

  async onPressAttachment () {
    console.log('onPressAttachment')

    if (this.state.view_delivery == true) {
      console.log('if', this.state.view_delivery)
      if (
        this.state.attachment_url != null &&
        this.state.attachment_url != ''
      ) {
        console.log('if', this.state.view_delivery)
        let fileurl = IMG_PREFIX_URL + this.state.attachment_url
        //let fileurl = this.state.attachment_url
        Linking.openURL(fileurl)
      }
    } else {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.zip],
        })
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size,
        )

        if (res.uri != null && res.uri != '') {
          this.setState({
            attachment_name: res.name,
            attachment_url: res.uri,
            attachment_type: res.type,
          })
        }
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err
        }
      }
    }
  }

  validateFields () {
    if (this.state.covertext == '') {
      alert(strings.EnterDeliveryDetails)
    } else {
      this.deliverJobAPICall()
    }
  }

  deliverJobAPICall () {
    this.setState({showloading: true})

    var data = new FormData()
    data.append('user_id', this.state.login_id)
    data.append('job_id', this.state.job_id)
    data.append('delivery_text', this.state.covertext)

    if (this.state.attachment_url != null && this.state.attachment_url != '') {
      data.append('delivery_file', {
        name: 'sample.zip',
        type: this.state.attachment_type,
        uri:
          Platform.OS === 'android'
            ? this.state.attachment_url
            : this.state.attachment_name.replace('file://', ''),
      })
    }

    fetch(API_ROOT + 'submit-job', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.status == true) {
          //alert(JSON.stringify(responseData))
          this.setState({showloading: false})
          this.props.navigation.goBack()
        } else {
          this.setState({showloading: false})
          alert(responseData.message)
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        console.log('error : ', error)
        alert(error)
      })
  }

  approveJob () {
    this.setState({showloading: true})

    var data = new FormData()
    data.append('user_id', this.state.login_id)
    data.append('job_id', this.state.job_id)

    fetch(API_ROOT + 'request-job-approve', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('approveJob : ', responseData)
        if (responseData.status == true) {
          //alert(JSON.stringify(responseData))
          this.setState({showloading: false})
          this.props.navigation.goBack()
        } else {
          this.setState({showloading: false})
          alert(responseData.message)
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        console.log('error : ', error)
        alert(error)
      })
  }

  requestModification () {
    this.setState({showloading: true})

    var data = new FormData()
    data.append('user_id', this.state.login_id)
    data.append('job_id', this.state.job_id)

    fetch(API_ROOT + 'request-job-modification', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('requestModification : ', responseData)
        if (responseData.status == true) {
          //alert(JSON.stringify(responseData))
          this.setState({showloading: false})
          this.props.navigation.goBack()
        } else {
          this.setState({showloading: false})
          alert(responseData.message)
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        console.log('error : ', error)
        alert(error)
      })
  }

  getDeliveryDetailsAPICall () {
    this.setState({showloading: true})

    var data = new FormData()
    data.append('job_id', 2)
    data.append('delivery_id', 1)

    fetch(API_ROOT + 'get-delivery-details', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('responseData New : ', responseData)
        if (responseData.status == true) {
          //alert(JSON.stringify(responseData))
          this.setState({
            showloading: false,
            covertext: responseData.data.delivery_text,
            attachment_name: responseData.data.delivery_file,
            attachment_url: responseData.data.delivery_file,
          })
        } else {
          this.setState({showloading: false})
          //alert(responseData.message)
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        console.log('error : ', error)
        alert(error)
      })
  }

  renderTopBar () {
    return (
      <View
        style={{
          backgroundColor: '#c80025',
          height: 80,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
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
          onPress={() => this.onBackPressed()}>
          <Image source={icback} resizeMode='contain' />
        </TouchableOpacity>
        {/* <Image source = {toplogo} resizeMode= 'contain' style = {{marginTop:45, width:'70%', height:25}}/> */}
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
          {strings.DeliverJob}
        </Text>
        {/* <TouchableOpacity style={styles.cartbutton} onPress={() => this.onCartPressed()}>
                        <Image source = {iccart} resizeMode= 'contain'/>
                    </TouchableOpacity> */}
      </View>
    )
  }
  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#f0f0f0', alignItems: 'center'}}>
        {this.renderTopBar()}

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
          contentContainerStyle={{alignItems: 'center', flex: 1}}>
          <View
            style={{
              backgroundColor: '#fff',
              height: 150,
              marginTop: 10,
              width: Width(90),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <View
              style={{
                backgroundColor: 'transparent',
                height: 150,
                width: Width(87),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TextInput
                style={{
                  height: 140,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  fontSize: 15,
                }}
                placeholder={strings.DeliveryNotes}
                multiline={true}
                editable={this.state.view_delivery == true ? false : true}
                onChangeText={covertext =>
                  this.setState({covertext: covertext})
                }
                secureTextEntry={false}
                returnKeyType={'next'}>
                {this.state.view_delivery == true ? this.state.covertext : ''}
              </TextInput>
            </View>
          </View>

          <View
            style={{
              backgroundColor: '#fff',
              height: 50,
              marginTop: 30,
              width: Width(90),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'transparent',
                height: 50,
                width: Width(87),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => this.onPressAttachment()}>
              <Image
                style={{width: 25, height: 25, marginLeft: 10}}
                source={icattachment}></Image>
              <Text
                style={{
                  height: 20,
                  backgroundColor: 'transparent',
                  width: Width(75),
                  fontSize: 15,
                  marginLeft: 15,
                }}>
                {this.state.attachment_name == null ||
                this.state.attachment_name == ''
                  ? strings.Attachment
                  : this.state.attachment_name.replace(
                      'job-delivery-file/',
                      '',
                    )}
              </Text>
            </TouchableOpacity>
          </View>
          {this.state.view_delivery == true ? (
            <>
              <TouchableOpacity
                style={{
                  width: Width(90),
                  height: 50,
                  backgroundColor: '#c80025',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 70,
                  borderRadius: 25,
                }}
                onPress={() => this.approveJob()}>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: '500'}}>
                  {strings.ApproveJob}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: Width(90),
                  height: 50,
                  backgroundColor: '#c80025',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                  borderRadius: 25,
                }}
                onPress={() => this.requestModification()}>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: '500'}}>
                  {strings.RequestModification}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={{
                width: Width(90),
                height: 50,
                backgroundColor: '#c80025',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 70,
                borderRadius: 25,
              }}
              onPress={() => this.validateFields()}>
              <Text style={{color: '#fff', fontSize: 20, fontWeight: '500'}}>
                {strings.Deliver}
              </Text>
            </TouchableOpacity>
          )}
        </KeyboardAwareScrollView>
      </View>
    )
  }
}
export default DeliverJob
