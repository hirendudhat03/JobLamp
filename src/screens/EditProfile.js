import React, {Component} from 'react'
import {
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Image,
  Modal,
  FlatList,
  TouchableHighlight,
} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker'
import Moment from 'moment'
import ImagePicker from 'react-native-image-crop-picker'
import strings from '../config/LanguageStrings'

import {Height, Width} from '../config/dimensions'
import {API_ROOT, IMG_PREFIX_URL} from '../config/constant'

const icback = require('../../assets/images/ic_back.png')
const userpic = require('../../assets/images/ic_default_user_black.png')
const icdownarroow = require('../../assets/images/ic_down_arrow.png')
const loginlogo = require('../../assets/images/splash_logo.png')

class EditProfile extends Component {
  constructor (props) {
    super(props)
    ;(this.state = {
      email: '',
      device_token: '',
      password: '',
      firstname: '',
      lastname: '',
      mobile: '',
      address_line1: '',
      address_line2: '',
      pincode: '',
      city: '',
      country: '',
      state: '',
      user_type: 'customer',
      showloading: false,
      show: false,
      arrcountries: [],
      arrstates: [],
      arrcities: [],
      countryid: '',
      stateid: '',
      cityid: '',
      showcountry: false,
      showstate: false,
      showcity: false,
      user_id: '',
      userdetails: props.navigation.state.params.userdetails,
      profile_pic: '',
      about_me: '',
      objbirthdate: new Date(),
      birth_date: '',
      showstartdate: false,
    }),
      (this._didFocusSubscription = props.navigation.addListener(
        'didFocus',
        payload => {
          this.loadData()
        },
      ))
  }

  async componentDidMount () {
    await AsyncStorage.getItem('user_id').then(value => {
      this.setState({user_id: value})
    })

    await AsyncStorage.getItem('device_token').then(value => {
      this.setState({device_token: value})
    })

    if (this.state.userdetails != undefined && this.state.userdetails != null) {
      this.setState({
        firstname: this.state.userdetails.first_name,
        lastname: this.state.userdetails.last_name,
        profile_pic:
          this.state.userdetails.profile_pic != null &&
          this.state.userdetails.profile_pic != ''
            ? IMG_PREFIX_URL + this.state.userdetails.profile_pic
            : '',
        mobile: this.state.userdetails.mobile_number,
        email: this.state.userdetails.email,
        country: this.state.userdetails.country,
        state: this.state.userdetails.state,
        city: this.state.userdetails.city,
        countryid: this.state.userdetails.country_id,
        stateid: this.state.userdetails.state_id,
        cityid: this.state.userdetails.city_id,
        address_line1: this.state.userdetails.address_line_1,
        address_line2: this.state.userdetails.address_line_2,
        pincode: this.state.userdetails.pincode,
        birth_date: this.state.userdetails.date_of_birth,
      })
    }
  }

  loadData () {
    this.getCountriesAPICall()
  }

  onBackPressed () {
    this.props.navigation.goBack()
  }

  onNextPressed () {
    this.validateFields()
  }

  onLoginPressed () {
    this.props.navigation.goBack()
  }

  onPressedCountryDD () {
    if (
      this.state.arrcountries != undefined &&
      this.state.arrcountries != null &&
      this.state.arrcountries.length > 0
    ) {
      this.setState({showcountry: true, showstate: false, showcity: false})
    }
  }

  onPressedStateDD () {
    if (
      this.state.arrstates != undefined &&
      this.state.arrstates != null &&
      this.state.arrstates.length > 0
    ) {
      this.setState({showcountry: false, showstate: true, showcity: false})
    }
  }

  onPressedCityDD () {
    if (
      this.state.arrcities != undefined &&
      this.state.arrcities != null &&
      this.state.arrcities.length > 0
    ) {
      this.setState({showcountry: false, showstate: false, showcity: true})
    }
  }

  onPressedTaskWorker () {
    this.setState({user_type: 'service_provider'})
  }

  onPressedTaskGiver () {
    this.setState({user_type: 'customer'})
  }

  onPressedBirthDate () {
    this.setState({showstartdate: true})
  }

  onPressCountry (item) {
    this.setState(
      {country: item.name, countryid: item.id, showcountry: false},
      () => this.getStatesAPICall(item.id),
    )
    //this.getStatesAPICall(item.id)
  }

  onPressState (item) {
    this.setState({state: item.name, stateid: item.id, showstate: false}, () =>
      this.getCitiesAPICall(item.id),
    )
  }

  onPressCity (item) {
    this.setState({city: item.name, cityid: item.id, showcity: false})
  }

  onPressedProfilePic () {
    ImagePicker.openPicker({
      width: Width(100),
      cropping: true,
    }).then(image => {
      //console.log(image);
      //alert(image.path)
      this.setState({profile_pic: image.path})
    })
  }

  validateFields () {
    if (this.state.firstname == '') {
      alert(strings.EnterFirstName)
    } else if (this.state.lastname == '') {
      alert(strings.EnterLastName)
    } else if (this.validate(this.state.email) == false) {
      alert(strings.EnterValiEmail)
      return false
    } else if (this.state.mobile == '') {
      alert(strings.EnterMobile)
      return false
    } else if (this.state.birth_date == '') {
      alert(strings.ChooseBirthDate)
      return false
    } else if (this.state.address_line1 == '') {
      alert(strings.EnterAptmt)
      return false
    } else if (this.state.address_line2 == '') {
      alert(strings.EnterStreet)
      return false
    } else if (this.state.country == '') {
      alert(strings.EnterCountry)
      return false
    } else if (this.state.state == '') {
      alert(strings.EnterState)
      return false
    } else if (this.state.city == '') {
      alert(strings.EnterCity)
      return false
    } else if (this.state.pincode == '') {
      alert(strings.EnterPincode)
      return false
    } else {
      this.editProfileAPICall()
    }
  }

  validate = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (reg.test(text) === false) {
      return false
    }
    return true
  }

  editProfileAPICall () {
    this.setState({showloading: true})

    var data = new FormData()

    data.append('user_id', this.state.user_id)
    data.append('first_name', this.state.firstname)
    data.append('last_name', this.state.lastname)
    data.append('email', this.state.email)
    data.append('mobile_number', this.state.mobile)
    data.append('country', this.state.countryid)
    data.append('state', this.state.stateid)
    data.append('city', this.state.cityid)
    data.append('pincode', this.state.pincode)
    data.append('address_line_1', this.state.address_line1)
    data.append('address_line_2', this.state.address_line2)
    data.append('date_of_birth', this.state.birth_date)

    if (
      this.state.profile_pic == '' ||
      this.state.profile_pic == null ||
      this.state.profile_pic == undefined
    ) {
      data.append('profile_pic', '')
    } else {
      data.append('profile_pic', {
        name: 'event.jpg',
        type: 'image/jpg',
        uri:
          Platform.OS === 'android'
            ? this.state.profile_pic
            : this.state.profile_pic.replace('file://', ''),
      })
    }

    //alert(JSON.stringify(data))
    //return

    fetch(API_ROOT + 'edit-profile', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.status == true) {
          this.setState({showloading: false})
          //alert(JSON.stringify(responseData))

          AsyncStorage.setItem('first_name', String(this.state.firstname))
          AsyncStorage.setItem('last_name', String(this.state.lastname))
          AsyncStorage.setItem('email', String(this.state.email))
          AsyncStorage.setItem('mobile_number', String(this.state.mobile))

          this.props.navigation.goBack()
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

  getCountriesAPICall () {
    this.setState({showloading: true})

    fetch(API_ROOT + 'countrylist', {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        //alert(JSON.stringify(responseData))
        if (responseData.status == true) {
          var arrcopycountries = responseData.data
          var sourtedcountries = arrcopycountries.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
          )
          this.setState({showloading: false, arrcountries: sourtedcountries})
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

  getStatesAPICall (country_id) {
    this.setState({showloading: true, countryid: country_id})

    var data = new FormData()
    data.append('country_id', country_id)
    fetch(API_ROOT + 'statelist', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        //alert(JSON.stringify(responseData))
        if (responseData.status == true) {
          var arrcopystates = responseData.data
          var sourtedstates = arrcopystates.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
          )
          this.setState({showloading: false, arrstates: sourtedstates})
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

  getCitiesAPICall (state_id) {
    this.setState({showloading: true})
    var data = new FormData()
    data.append('state_id', state_id)
    data.append('country_id', this.state.countryid)

    fetch(API_ROOT + 'citylist', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        //alert(JSON.stringify(responseData))
        console.log('responseData : ',responseData);
        if (responseData.status == true) {
          var arrcopycities = responseData.data
          var sourtedcities = arrcopycities.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
          )
          this.setState({showloading: false, arrcities: sourtedcities})
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
          {strings.EditProfile}
        </Text>
        {/* <TouchableOpacity style={styles.cartbutton} onPress={() => this.onCartPressed()}>
                        <Image source = {iccart} resizeMode= 'contain'/>
                    </TouchableOpacity> */}
      </View>
    )
  }

  renderCountryPicker () {
    return (
      <Modal
        visible={this.state.showcountry}
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
          onPress={() =>
            this.setState({showcountry: false})
          }></TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: Width(100),
            height: Height(30),
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#fff',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}>
          <FlatList
            style={{marginTop: 10, width: Width(95), marginBottom: 10}}
            data={this.state.arrcountries}
            extraData={this.state}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    width: Width(95),
                    height: Height(5),
                    backgroundColor: 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 5,
                    marginTop: 5,
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#fff',
                      height: Height(5),
                      width: Width(95),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    activeOpacity={0.9}
                    onPress={() => this.onPressCountry(item)}>
                    <Text
                      style={{
                        marginLeft: 10,
                        color: '#000',
                        fontSize: 13,
                        width: Width(50),
                        fontWeight: '400',
                      }}>
                      {item.name}
                    </Text>
                    {/* {
                                            item.name == this.state.relationship ?
                                            <Image source = {iccheckmark} style = {{height:20, width:20,position:'absolute',right:2}} resizeMode='contain'/>
                                            :
                                            null
                                        } */}
                  </TouchableOpacity>
                </View>
              )
            }}
          />
        </View>
      </Modal>
    )
  }

  renderStatePicker () {
    return (
      <Modal
        visible={this.state.showstate}
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
          onPress={() => this.setState({showstate: false})}></TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: Width(100),
            height: Height(30),
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#fff',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}>
          <FlatList
            style={{marginTop: 10, width: Width(95), marginBottom: 10}}
            data={this.state.arrstates}
            extraData={this.state}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    width: Width(95),
                    height: Height(5),
                    backgroundColor: 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 5,
                    marginTop: 5,
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#fff',
                      height: Height(5),
                      width: Width(95),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    activeOpacity={0.9}
                    onPress={() => this.onPressState(item)}>
                    <Text
                      style={{
                        marginLeft: 10,
                        color: '#000',
                        fontSize: 13,
                        width: Width(50),
                        fontWeight: '400',
                      }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            }}
          />
        </View>
      </Modal>
    )
  }

  renderCityPicker () {
    return (
      <Modal
        visible={this.state.showcity}
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
          onPress={() => this.setState({showcity: false})}></TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: Width(100),
            height: Height(30),
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#fff',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}>
          <FlatList
            style={{marginTop: 10, width: Width(95), marginBottom: 10}}
            data={this.state.arrcities}
            extraData={this.state}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    width: Width(95),
                    height: Height(5),
                    backgroundColor: 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 5,
                    marginTop: 5,
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#fff',
                      height: Height(5),
                      width: Width(95),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    activeOpacity={0.9}
                    onPress={() => this.onPressCity(item)}>
                    <Text
                      style={{
                        marginLeft: 10,
                        color: '#000',
                        fontSize: 13,
                        width: Width(50),
                        fontWeight: '400',
                      }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            }}
          />
        </View>
      </Modal>
    )
  }

  renderBirthDatePicker () {
    return (
      <Modal
        visible={this.state.showstartdate}
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
          onPress={() =>
            this.setState({showstartdate: false})
          }></TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: Width(100),
            height: Height(30),
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#fff',
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}>
          <View
            style={{
              width: Width(100),
              height: 40,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <TouchableOpacity
              style={{marginLeft: 10, width: 50}}
              onPress={() => this.setState({showstartdate: false})}>
              <Text
                style={{
                  color: '#c80025',
                  fontSize: 15,
                  fontWeight: '500',
                  width: 50,
                }}>
                {strings.Cancel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{width: 50}}
              onPress={() => this.setState({showstartdate: false})}>
              <Text
                style={{
                  color: '#c80025',
                  fontSize: 15,
                  fontWeight: '500',
                  width: 50,
                }}>
                {strings.Done}
              </Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            style={{width: Width(100)}}
            testID='dateTimePicker'
            value={this.state.objbirthdate}
            maximumDate={new Date()}
            mode='date'
            is24Hour={true}
            display='spinner'
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || date
              let strdate = Moment(currentDate).format('yyyy-MM-DD')
              this.setState({birth_date: strdate, objbirthdate: currentDate})
            }}
          />
        </View>
      </Modal>
    )
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center'}}>
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center'}}
          getTextInputRefs={() => {
            return [
              this.txtfname,
              this.txtlname,
              this.txtemail,
              this.txtpassword,
              this.txtmobile,
              this.txtaddress1,
              this.txtaddress2,
              this.txtpincode,
            ]
          }}>
          {/* <Text style = {{fontSize:20,fontWeight:'300',color:'#000', marginTop:15, textAlign:'center'}}>Sign Up</Text> */}

          <TouchableOpacity
            style={{
              width: 100,
              height: 100,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#c80025',
              marginTop: 30,
              backgroundColor: 'transparent',
              borderRadius: 50,
            }}
            onPress={() => this.onPressedProfilePic()}>
            {this.state.profile_pic == null || this.state.profile_pic == '' ? (
              <Image
                source={userpic}
                style={{width: 100, height: 100, borderRadius: 50}}
                resizeMode='cover'></Image>
            ) : (
              <Image
                source={{uri: this.state.profile_pic}}
                style={{width: 100, height: 100, borderRadius: 50}}
                resizeMode='cover'></Image>
            )}
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: 'transparent',
              height: 50,
              marginTop: 30,
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
              {/* <Image source = {icpassword} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image> */}
              <TextInput
                style={{
                  marginTop: 5,
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  fontSize: 15,
                }}
                placeholder={strings.FirstName}
                onChangeText={fname =>
                  this.setState({firstname: fname, show: false})
                }
                secureTextEntry={false}
                ref={r => {
                  this.txtfname = r
                }}
                returnKeyType={'next'}>
                {this.state.firstname}
              </TextInput>
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
              {/* <Image source = {icpassword} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image> */}
              <TextInput
                style={{
                  marginTop: 5,
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  fontSize: 15,
                }}
                placeholder={strings.LastName}
                onChangeText={lname =>
                  this.setState({lastname: lname, show: false})
                }
                secureTextEntry={false}
                ref={r => {
                  this.txtlname = r
                }}
                returnKeyType={'next'}>
                {this.state.lastname}
              </TextInput>
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
              {/* <Image source = {icpassword} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image> */}
              {/* <TextInput style = {{marginTop:5,height:40,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = "Email Address"  onChangeText = {(email) => this.setState({email:email,show:false})} secureTextEntry = {false} ref={(r) => { this.txtemail = r; }} returnKeyType={'next'}></TextInput> */}
              <Text
                style={{
                  marginTop: 5,
                  height: 40,
                  width: Width(90),
                  fontSize: 15,
                }}>
                {this.state.userdetails.email}
              </Text>
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
              {/* <Image source = {icpassword} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image> */}
              <TextInput
                style={{
                  marginTop: 5,
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  fontSize: 15,
                }}
                placeholder={strings.MobileNumber}
                keyboardType='number-pad'
                onChangeText={number =>
                  this.setState({mobile: number, show: false})
                }
                ref={r => {
                  this.txtmobile = r
                }}
                returnKeyType={'next'}>
                {this.state.mobile}
              </TextInput>
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
              backgroundColor: '#fff',
              height: 50,
              marginTop: 20,
              width: Width(90),
              zIndex: 10,
              alignItems: 'center',
              borderRadius: 10,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'transparent',
                height: 50,
                width: Width(90),
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: 2,
              }}
              onPress={() => this.onPressedBirthDate()}></TouchableOpacity>
            <TextInput
              style={{
                height: 40,
                backgroundColor: 'transparent',
                width: Width(90),
                fontSize: 15,
                color: '#000',
              }}
              placeholder={strings.BirthDate}
              secureTextEntry={false}
              editable={false}
              returnKeyType={'next'}>
              {this.state.birth_date}
            </TextInput>
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
              {/* <Image source = {icpassword} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image> */}
              <TextInput
                style={{
                  marginTop: 5,
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  fontSize: 15,
                }}
                placeholder={strings.ApartmentBuilding}
                onChangeText={address1 =>
                  this.setState({address_line1: address1, show: false})
                }
                ref={r => {
                  this.txtaddress1 = r
                }}
                returnKeyType={'next'}>
                {this.state.address_line1}
              </TextInput>
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
              {/* <Image source = {icpassword} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image> */}
              <TextInput
                style={{
                  marginTop: 5,
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  fontSize: 15,
                }}
                placeholder={strings.Street}
                onChangeText={address2 =>
                  this.setState({address_line2: address2, show: false})
                }
                ref={r => {
                  this.txtaddress2 = r
                }}
                returnKeyType={'next'}>
                {this.state.address_line2}
              </TextInput>
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
              width: Width(95),
              zIndex: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'transparent',
                height: 50,
                width: Width(90),
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => this.onPressedCountryDD()}>
              <TextInput
                style={{
                  marginTop: 5,
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(85),
                  fontSize: 15,
                  color: '#000',
                }}
                placeholder={strings.Country}
                secureTextEntry={false}
                editable={false}
                returnKeyType={'next'}>
                {this.state.country}
              </TextInput>
              <Image
                source={icdownarroow}
                resizeMode='contain'
                style={{width: 15, height: 15, marginRight: 10}}></Image>
            </TouchableOpacity>
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
              width: Width(95),
              zIndex: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'transparent',
                height: 50,
                width: Width(90),
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => this.onPressedStateDD()}>
              <TextInput
                style={{
                  marginTop: 5,
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(85),
                  fontSize: 15,
                  color: '#000',
                }}
                placeholder={strings.State}
                secureTextEntry={false}
                editable={false}
                returnKeyType={'next'}>
                {this.state.state}
              </TextInput>
              <Image
                source={icdownarroow}
                resizeMode='contain'
                style={{width: 15, height: 15, marginRight: 10}}></Image>
            </TouchableOpacity>
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
              width: Width(95),
              zIndex: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'transparent',
                height: 50,
                width: Width(90),
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => this.onPressedCityDD()}>
              <TextInput
                style={{
                  marginTop: 5,
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(85),
                  fontSize: 15,
                  color: '#000',
                }}
                placeholder={strings.City}
                secureTextEntry={false}
                editable={false}
                returnKeyType={'next'}>
                {this.state.city}
              </TextInput>
              <Image
                source={icdownarroow}
                resizeMode='contain'
                style={{width: 15, height: 15, marginRight: 10}}></Image>
            </TouchableOpacity>
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
              {/* <Image source = {icpassword} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image> */}
              <TextInput
                style={{
                  marginTop: 5,
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  fontSize: 15,
                }}
                placeholder={strings.Pincode}
                onChangeText={pincode =>
                  this.setState({pincode: pincode, show: false})
                }
                ref={r => {
                  this.txtpincode = r
                }}
                returnKeyType={'next'}>
                {this.state.pincode}
              </TextInput>
            </View>
            <View
              style={{
                height: 1,
                width: Width(90),
                backgroundColor: '#C0C0C3',
              }}></View>
          </View>
          {/* <View style={{backgroundColor:'transparent',marginTop:20, width:Width(90)}}>
                    <View style={{backgroundColor:'transparent',width:Width(90),flexDirection:'row',alignItems:'center'}}>
                        <TextInput style = {{marginTop:5,height:40,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.AboutMe} multiline = {true} onChangeText = {(about) => this.setState({about_me:about,show:false})} ref={(r) => { this.txtabout = r; }} returnKeyType={'next'}>{this.state.about_me}</TextInput>
                    </View>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
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
            onPress={() => this.onNextPressed()}>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
              {strings.Save}
            </Text>
          </TouchableOpacity>
          {this.renderCountryPicker()}
          {this.renderStatePicker()}
          {this.renderCityPicker()}
          {Platform.OS == 'ios'
            ? this.renderBirthDatePicker()
            : this.state.showstartdate && (
                <View>
                  <DateTimePicker
                    style={{width: Width(100)}}
                    testID='dateTimePicker'
                    value={this.state.objbirthdate}
                    maximumDate={new Date()}
                    mode='date'
                    is24Hour={true}
                    display='spinner'
                    onChange={(event, selectedDate) => {
                      const currentDate = selectedDate || date
                      let strdate = Moment(currentDate).format('yyyy-MM-DD')
                      this.setState({
                        birth_date: strdate,
                        objbirthdate: currentDate,
                        showstartdate: false,
                      })
                    }}
                  />
                </View>
              )}
        </KeyboardAwareScrollView>
      </View>
    )
  }
}
export default EditProfile
