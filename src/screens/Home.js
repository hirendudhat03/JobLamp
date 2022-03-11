import React, {Component} from 'react'
import {
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
  StatusBar,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {FlatGrid} from 'react-native-super-grid'
import Moment from 'moment'
import {Height, Width, FontSize} from '../config/dimensions'
import {API_ROOT, IMG_PREFIX_URL} from '../config/constant'
import firebase from 'firebase'
import strings from '../config/LanguageStrings'

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

const icmenu = require('../../assets/images/side_menu.png')
const icsearch = require('../../assets/images/ic_search.png')
const subscription = require('../../assets/images/subscription.png')
const lotto = require('../../assets/images/latto.png')
const spaceship = require('../../assets/images/spaceship.png')
const banner1 = require('../../assets/images/banner1.png')
const banner2 = require('../../assets/images/banner2.png')
const banner3 = require('../../assets/images/banner3.png')
const banner4 = require('../../assets/images/banner4.png')
const defaultuser = require('../../assets/images/ic_default_user_black.png')

const images = ['', '', '', '']

var cityname = ''

class Home extends Component {
  _didFocusSubscription

  constructor (props) {
    super(props)
    ;(this.scroll = null),
      (this.player = null),
      (this.state = {
        arrtaskworkers: [],
        device_token: '',
        authtoken: '',
        arrcategories: [],
        cart_count: 0,
        bannertype: '',
        showloading: false,
        arrbanners: [],
        refreshlist: false,
        isEnabled: false,
        userrole: 'taskworker',
        recentjobs: [],
        login_id: '',
        currentjobs: 0,
        appliedjobs: 0,
        completedjobs: 0,
        tw_earning: 0,
        fadeAnimation: new Animated.Value(1),
      })
    ;(this.bannerIndex = 0),
      (this.timer = null),
      (this._didFocusSubscription = props.navigation.addListener(
        'didFocus',
        payload => {
          this.loadData()

          //this.setUpTimer()
        },
      ))
  }

  async componentDidMount () {
    //this.fadeIn()
  }

  fadeIn () {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 1,
      duration: 3000,
    }).start()
    setTimeout(() => {
      this.fadeOut()
    }, 3000)
  }

  fadeOut () {
    Animated.timing(this.state.fadeAnimation, {
      toValue: 0.2,
      duration: 3000,
    }).start()
    setTimeout(() => {
      this.fadeIn()
    }, 3000)
  }

  setUpTimer1 () {
    if (this.state.arrbanners.length > this.bannerIndex) {
      this.timer = setInterval(() => this.setBannerImageVideo(), parseInt(4000))
    }
  }

  async loadData () {
    console.log('loadData')
    this.initializeFirebase()

    await AsyncStorage.getItem('user_id').then(value => {
      this.setState({login_id: value})
    })

    await AsyncStorage.getItem('user_type').then(value => {
      this.setState({userrole: value})
    })

    await AsyncStorage.getItem('device_token').then(value => {
      this.setState({device_token: value})
    })

    this.getBannerListAPICall()

    if (this.state.userrole == 'customer') {
      this.getTopRatedTWListAPICall()
      this.getRecentlyPostedJobAPICAll()
    } else {
      this.getCategoriesAPICall()
      this.getTotalEarningAPICall()
      this.getJobsAPICall()
      this.getJobsCountAPICall()
    }
  }

  initializeFirebase () {
    // const firebaseConfig = {
    //     apiKey: "AIzaSyDnxzLj9Iy59RLJTaOW9NbBgIHzwXQM04I",
    //     authDomain: "joblamp-964ac.firebaseapp.com",
    //     projectId: "joblamp-964ac",
    //     storageBucket: "joblamp-964ac.appspot.com",
    //     messagingSenderId: "719149380094",
    //     appId: "1:719149380094:web:67081c0bb8250ef2e6d0af",
    //     measurementId: "G-HF0CPTR6MZ",
    //     databaseURL: "https://joblamp-964ac-default-rtdb.firebaseio.com",
    //   };

    //   if (!firebase.apps.length) {
    //     firebase.initializeApp(firebaseConfig);
    // }

    var firebaseConfig = {
      apiKey: 'AIzaSyDwfgsJDvAvY3QeobIzbbtpMQVMcMQRc8g',
      authDomain: 'joblamp-8acf8.firebaseapp.com',
      projectId: 'joblamp-8acf8',
      storageBucket: 'joblamp-8acf8.appspot.com',
      messagingSenderId: '817898368844',
      appId: '1:817898368844:web:b1684a4b9aae55e36e69e9',
      measurementId: 'G-ZB8EZJC432',
      databaseURL: 'https://joblamp-8acf8-default-rtdb.firebaseio.com',
    } // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }
  }

  setBannerImageVideo () {
    if (this.scroll != null) {
      if (this.bannerIndex == this.state.arrbanners.length - 1) {
        this.bannerIndex = 0
      } else {
        this.bannerIndex = this.bannerIndex + 1
      }
      this.scroll.scrollToOffset({
        offset: this.bannerIndex * (deviceWidth - 40),
        animated: true,
      })
      clearInterval(this.timer)
      //this.setUpTimer1()
    }
  }

  onMenuPressed () {
    this.props.navigation.toggleDrawer()
  }

  onSearchPressed () {
    this.props.navigation.navigate('Search')
    //this.props.navigation.navigate('Subscriptions')
  }

  onPressedJob (item) {
    this.props.navigation.navigate('JobDetails', {job_id: item.id})
  }

  onPressCategory (item) {
    //alert('hii')
    this.props.navigation.navigate('CategoryJobs', {
      category_id: item.category_id,
    })
  }

  onPressContact (item) {
    //alert(JSON.stringify(item))
    this.createChatAPICall(item)
  }

  onPressedUser (item) {
    this.props.navigation.navigate('OtherUserProfile', {
      user_id: item.id,
      userrole: 'service_provider',
    })
  }

  viewAllJobs () {
    this.props.navigation.navigate('Jobs')
  }

  getBannerListAPICall () {
    this.setState({showloading: true})

    fetch(API_ROOT + 'banner-list', {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.data != undefined && responseData.data != null) {
          //alert(JSON.stringify(responseData))
          this.setState({arrbanners: responseData.data, showloading: false})
        } else {
          this.setState({showloading: false})
          //alert(responseData.message)
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        //alert(error)
      })
  }

  getCategoriesAPICall () {
    this.setState({showloading: true})

    fetch(API_ROOT + 'categorylist', {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        //alert(JSON.stringify(responseData))
        if (responseData.status == true) {
          this.setState({arrcategories: responseData.data, showloading: false})
        } else {
          this.setState({showloading: false})
          //alert(responseData.message)
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        //alert(error)
      })
  }

  getTotalEarningAPICall () {
    this.setState({showloading: true})

    var data = new FormData()

    data.append('user_id', this.state.login_id)
    //data.append('status', 'opened')

    fetch(API_ROOT + 'tw-total-income', {
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
          this.setState({showloading: false, tw_earning: responseData.data})
        } else {
          this.setState({showloading: false, tw_earning: 0})
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        alert(error)
      })
  }

  getTopRatedTWListAPICall () {
    this.setState({showloading: true})

    fetch(API_ROOT + 'top-rated-workers', {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.data != undefined && responseData.data != null) {
          this.setState({arrtaskworkers: responseData.data, showloading: false})
        } else {
          this.setState({showloading: false})
          //alert(responseData.message)
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        //alert(error)
      })
  }

  getJobsAPICall () {
    this.setState({showloading: true})

    var data = new FormData()

    data.append('status', 'opened')

    fetch(API_ROOT + 'all-jobs', {
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
          this.setState({showloading: false, recentjobs: responseData.data})
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

  getRecentlyPostedJobAPICAll () {
    this.setState({showloading: true})

    var data = new FormData()

    data.append('user_id', this.state.login_id)
    data.append('status', 'opened')

    fetch(API_ROOT + 'customer-joblist', {
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
          this.setState({showloading: false, recentjobs: responseData.data})
        } else {
          this.setState({showloading: false, arrjobs: []})
          alert(responseData.message)
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        alert(error)
      })
  }

  getJobsCountAPICall () {
    this.setState({showloading: true})

    var data = new FormData()

    data.append('user_id', this.state.login_id)

    fetch(API_ROOT + 'job-count', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        //alert(JSON.stringify(responseData))

        if (responseData.data != undefined && responseData.data != null) {
          //this.setState({showloading:false,recentjobs:responseData.data})
          if (this.state.userrole == 'service_provider') {
            this.setState({
              currentjobs: responseData.data.current,
              appliedjobs: responseData.data.applied,
              completedjobs: responseData.data.completed,
            })
          } else {
            this.setState({
              currentjobs: responseData.data.current,
              appliedjobs: responseData.data.posted,
              completedjobs: responseData.data.completed,
            })
          }
        } else {
          this.setState({showloading: false})
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        alert(error)
      })
  }

  createChatAPICall (item) {
    var data = new FormData()

    data.append('sender_id', this.state.login_id)
    data.append('receiver_id', item.id)

    fetch(API_ROOT + 'generate-chat', {
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
          if (responseData.result != undefined && responseData.result != null) {
            if (
              responseData.result.receiver != undefined &&
              responseData.result.receiver != null
            ) {
              //alert(JSON.stringify(item))

              let url = responseData.result.receiver.url
              let first_name = item.first_name
              let last_name = item.last_name
              let profile = item.profile_pic
              this.props.navigation.navigate('Chat', {
                receiver_id: item.id,
                chat_url: url,
                receiver_name: first_name + ' ' + last_name,
                receiver_photo: profile,
              })
            } else if (
              responseData.result.sender != undefined &&
              responseData.result.sender != null
            ) {
              let url = responseData.result.sender.url
              let first_name = item.first_name
              let last_name = item.last_name
              let profile = item.profile_pic
              this.props.navigation.navigate('Chat', {
                receiver_id: item.id,
                chat_url: url,
                receiver_name: first_name + ' ' + last_name,
                receiver_photo: profile,
              })
            } else {
              let first_name = item.first_name
              let last_name = item.last_name
              let profile = item.profile_pic
              let url = 'user_' + this.state.login_id + '_' + item.id
              this.props.navigation.navigate('Chat', {
                receiver_id: item.id,
                chat_url: url,
                receiver_name: first_name + ' ' + last_name,
                receiver_photo: profile,
              })
            }
          } else {
            let first_name = item.first_name
            let last_name = item.last_name
            let profile = item.profile_pic
            let url = 'user_' + this.state.login_id + '_' + item.id
            this.props.navigation.navigate('Chat', {
              receiver_id: item.id,
              chat_url: url,
              receiver_name: first_name + ' ' + last_name,
              receiver_photo: profile,
            })
          }
        } else {
        }
      })
      .catch(error => {})
  }

  renderBanner () {
    let item = this.state.arrbanners[this.bannerIndex]
    return item != null && item != undefined ? (
      <TouchableOpacity
        style={{
          width: deviceWidth - 40,
          height: 200,
          backgroundColor: 'transparent',
          alignItems: 'center',
          borderRadius: 10,
        }}
        activeOpacity={0.9}>
        <TouchableOpacity
          style={{
            backgroundColor: 'transparent',
            height: 200,
            width: deviceWidth - 40,
            borderRadius: 0,
            justifyContent: 'center',
            borderRadius: 10,
          }}>
          {/* <Image source = {{uri:item.file_url}} style = {{height:200, width:deviceWidth - 40, alignSelf:'center'}} resizeMode='stretch'/> */}
          <Image
            source={item.url}
            style={{height: 200, width: deviceWidth - 40, alignSelf: 'center'}}
            resizeMode='stretch'
          />
        </TouchableOpacity>
      </TouchableOpacity>
    ) : null
  }

  onMomentScrollBegin () {
    //this.fadeIn()
  }

  render () {
    return (
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: '#c80025',
            height: 75,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <StatusBar barStyle='light-content' backgroundColor='#c80025' />
          <TouchableOpacity
            style={styles.menubutton}
            onPress={() => this.onMenuPressed()}>
            <Image source={icmenu} resizeMode='contain' />
          </TouchableOpacity>
          {/* <TextInput style = {{marginTop:35, width:'70%', height:35, borderRadius:17, backgroundColor:'#266726', textAlign:'center', color:'#fff'}} placeholder='Search Store By City' placeholderTextColor = "#80b181" onChangeText = {(text) => this.onCityChange(text)}></TextInput> */}
          <Text
            style={{
              marginTop: 35,
              width: '70%',
              height: 35,
              textAlign: 'center',
              color: '#fff',
              fontSize: 27,
            }}>
            JobLamp
          </Text>
          <View
            style={[
              styles.cartbutton,
              {flexDirection: 'row'},
            ]}>
            <View style={{flex: 1,}}>
              <TouchableOpacity onPress={() => this.onSearchPressed()}>
                <Image
                  style={{height: 25, width: 25}}
                  source={icsearch}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </View>
            <View style={{flex: 1,}}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('Subscriptions', {
                    is_from_settings: true,
                  })
                }>
                <Image
                  style={{height: 25, width: 25}}
                  source={subscription}
                  resizeMode='contain'
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={{width:80}}>
          <TouchableOpacity
            style={[styles.cartbutton,{marginRight:20}]}
            onPress={() => this.onSearchPressed()}>
            <Image style={{height:25,width:25}} source={icsearch} resizeMode='contain' />
          </TouchableOpacity>
          </View> */}
          {/* <TouchableOpacity
            style={styles.cartbutton}
            onPress={() => this.props.navigation.navigate('Subscriptions',{is_from_settings:true})}>
            <Image style={{height:25,width:25}} source={subscription} resizeMode='contain' />
          </TouchableOpacity> */}
        </View>
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
            <ActivityIndicator size='large' color='#c80025' />
          </View>
        ) : null}

        <View style={styles.newestcontainer}>
          {/* {
                        this.state.isEnabled == true ?
                            this.renderBanner()
                        : */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            //pointerEvents = 'none'
            pagingEnabled={true}
            data={this.state.arrbanners}
            ref={ref => {
              this.scroll = ref
            }}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={{
                    width: deviceWidth - 40,
                    height: 200,
                    backgroundColor: 'transparent',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}
                  activeOpacity={0.9}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'transparent',
                      height: 200,
                      width: deviceWidth - 40,
                      borderRadius: 0,
                      justifyContent: 'center',
                      borderRadius: 10,
                    }}>
                    {/* <Image source = {{uri:rowData.file_url}} style = {{height:200, width:deviceWidth - 40, alignSelf:'center'}} resizeMode='stretch'/> */}
                    <Image
                      source={{uri: item.image}}
                      style={{
                        height: 200,
                        width: deviceWidth - 40,
                        alignSelf: 'center',
                      }}
                      resizeMode='cover'
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )
            }}
            keyExtractor={(item, index) => index}
          />
        </View>
        <View style={{justifyContent: 'center', flex: 1}}>
          <ScrollView
            style={{marginBottom: 30, marginTop: 10}}
            onMomentumScrollBegin={() => this.onMomentScrollBegin()}>
            {this.state.userrole == 'service_provider' ? (
              <View
                style={{
                  width: '100%',
                  height: 160,
                  backgroundColor: 'transparent',
                  marginTop: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      width: '50%',
                      height: 80,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 3,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        color: '#6e6e6e',
                      }}>
                      {strings.CurrentJobs}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: '#6e6e6e',
                        marginTop: 10,
                      }}>
                      {this.state.currentjobs}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '50%',
                      height: 80,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        color: '#6e6e6e',
                      }}>
                      {strings.AppliedJobs}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: '#6e6e6e',
                        marginTop: 10,
                      }}>
                      {this.state.appliedjobs}
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row', marginTop: 3}}>
                  <View
                    style={{
                      width: '50%',
                      height: 80,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 3,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        color: '#6e6e6e',
                      }}>
                      {strings.CompletedJobd}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: '#6e6e6e',
                        marginTop: 10,
                      }}>
                      {this.state.completedjobs}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '50%',
                      height: 80,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        color: '#6e6e6e',
                      }}>
                      {strings.TotalEarnings}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: '#6e6e6e',
                        marginTop: 10,
                      }}>
                      {this.state.tw_earning}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  height: 80,
                  backgroundColor: 'transparent',
                  marginTop: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      width: '33%',
                      height: 80,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 3,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        color: '#6e6e6e',
                      }}>
                      {strings.CurrentJobs}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: '#6e6e6e',
                        marginTop: 10,
                      }}>
                      {this.state.currentjobs}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '33%',
                      height: 80,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 3,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        color: '#6e6e6e',
                      }}>
                      {strings.PostedJobs}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: '#6e6e6e',
                        marginTop: 10,
                      }}>
                      {this.state.appliedjobs}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '33%',
                      height: 80,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        color: '#6e6e6e',
                      }}>
                      {strings.PastJobs}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        color: '#6e6e6e',
                        marginTop: 10,
                      }}>
                      {this.state.completedjobs}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            {
              <View
                style={{
                  width: Width(95),
                  borderRadius: 7,
                  paddingBottom: 10,
                  backgroundColor: '#fff',
                  alignSelf: 'center',
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                <Animated.View
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#fbeaec',
                    opacity: this.state.fadeAnimation,
                  }}>
                  <Image
                    style={{width: Width(95), height: 200}}
                    resizeMode='contain'
                    source={spaceship}></Image>
                </Animated.View>

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '400',
                    color: '#6e6e6e',
                    marginTop: 10,
                    marginHorizontal: 7,
                    textAlign: 'left',
                  }}>
                  {strings.AboutJobLamp}
                </Text>
              </View>
            }
            {
              <View
                style={{
                  width: Width(95),
                  borderRadius: 7,
                  paddingBottom: 10,
                  backgroundColor: '#fff',
                  alignSelf: 'center',
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                <View style={{alignItems: 'center', backgroundColor: '#fff'}}>
                  <Image
                    style={{width: Width(95), height: 200}}
                    resizeMode='contain'
                    source={lotto}></Image>
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '400',
                    color: '#6e6e6e',
                    marginTop: 10,
                    marginHorizontal: 7,
                    textAlign: 'left',
                  }}>
                  {strings.AboutLotto}
                </Text>
              </View>
            }
            {this.state.userrole == 'service_provider' ? (
              <TouchableOpacity
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  backgroundColor: 'transparent',
                  marginTop: 10,
                }}
                onPress={() =>
                  this.props.navigation.navigate('CategoryList', {
                    arrcategories: this.state.arrcategories,
                  })
                }>
                <Text
                  style={{
                    marginLeft: 15,
                    fontSize: 15,
                    fontWeight: '500',
                    color: '#000',
                    marginVertical: 5,
                  }}>
                  {strings.ViewByCategory}
                </Text>
                <Text
                  style={{
                    position: 'absolute',
                    right: 15,
                    fontSize: 12,
                    fontWeight: '300',
                    color: '#c80025',
                    marginVertical: 5,
                  }}>
                  {strings.ViewAll}
                </Text>
              </TouchableOpacity>
            ) : null}
            {this.state.userrole == 'service_provider' ? (
              <FlatGrid
                itemDimension={120}
                data={this.state.arrcategories}
                style={styles.gridView}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 5,
                      padding: 10,
                      height: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity
                      style={{alignItems: 'center', justifyContent: 'center'}}
                      onPress={() => this.onPressCategory(item)}>
                      {/* <Image source = {{uri:IMG_PREFIX_URL+'store_images/'+item.logo}} style = {{height:100, width:100, marginTop:5, borderRadius:10}} resizeMode='contain'/> */}
                      {global.language == 'en' ? (
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '400',
                            textAlign: 'center',
                          }}>
                          {item.name_en}
                        </Text>
                      ) : global.language == 'es' ? (
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '400',
                            textAlign: 'center',
                          }}>
                          {item.name_es}
                        </Text>
                      ) : global.language == 'fr' ? (
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '400',
                            textAlign: 'center',
                          }}>
                          {item.name_fr}
                        </Text>
                      ) : global.language == 'de' ? (
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '400',
                            textAlign: 'center',
                          }}>
                          {item.name_de}
                        </Text>
                      ) : global.language == 'pt' ? (
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '400',
                            textAlign: 'center',
                          }}>
                          {item.name_pt}
                        </Text>
                      ) : global.language == 'ru' ? (
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '400',
                            textAlign: 'center',
                          }}>
                          {item.name_ru}
                        </Text>
                      ) : null}
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '300',
                          color: '#c80025',
                          marginTop: 7,
                        }}>
                        ({item.total_job})
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            ) : null}

            {this.state.userrole == 'customer' ? (
              <View
                style={{
                  width: '100%',
                  height: 200,
                  backgroundColor: 'transparent',
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    backgroundColor: 'transparent',
                    marginTop: 0,
                  }}>
                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 15,
                      fontWeight: '500',
                      color: '#000',
                      marginVertical: 5,
                    }}>
                    {strings.TopRatedTW}
                  </Text>
                </View>
                <FlatList
                  horizontal
                  data={this.state.arrtaskworkers}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        style={[
                          styles.itemContainer,
                          {backgroundColor: 'transparent', height: 200},
                        ]}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#fff',
                            width: 110,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                            paddingVertical: 10,
                          }}
                          onPress={() => this.onPressedUser(item)}>
                          {item.proflie_pic != null ? (
                            <Image
                              source={{uri: IMG_PREFIX_URL + item.proflie_pic}}
                              style={{
                                height: 70,
                                width: 70,
                                marginTop: 5,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                              }}
                              resizeMode='cover'
                            />
                          ) : (
                            <Image
                              source={defaultuser}
                              style={{
                                height: 70,
                                width: 70,
                                marginTop: 5,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                              }}
                              resizeMode='cover'
                            />
                          )}
                          <Text
                            style={[styles.itemName, {marginBottom: 7}]}
                            numberOfLines={2}>
                            {item.first_name} {item.last_name}
                          </Text>
                          <TouchableOpacity
                            style={{
                              borderRadius: 5,
                              backgroundColor: '#c80025',
                              height: 30,
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 80,
                            }}
                            onPress={() => this.onPressContact(item)}>
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: '500',
                                color: '#fff',
                              }}
                              numberOfLines={1}>
                              {strings.Contact}
                            </Text>
                          </TouchableOpacity>
                        </TouchableOpacity>
                      </View>
                    )
                  }}
                  keyExtractor={(item, index) => index}
                />
              </View>
            ) : null}

            {this.state.userrole == 'customer' ? (
              this.state.recentjobs != undefined &&
              this.state.recentjobs.length > 0 ? (
                <View
                  style={{
                    width: '100%',
                    height: 250,
                    backgroundColor: 'transparent',
                    marginTop: 20,
                  }}>
                  {/* <View style = {{width:'100%',flexDirection:'row',backgroundColor:'transparent', marginTop:0}}>
                                <Text style = {{marginLeft:15, fontSize:20,fontWeight:'500',color:'#000', marginVertical:5}}>Recent Jobs</Text>
                            </View> */}
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      backgroundColor: 'transparent',
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        marginLeft: 15,
                        fontSize: 15,
                        fontWeight: '500',
                        color: '#000',
                        marginVertical: 5,
                      }}>
                      {strings.RecentJobs}
                    </Text>
                    <Text
                      style={{
                        position: 'absolute',
                        right: 15,
                        fontSize: 12,
                        fontWeight: '300',
                        color: '#c80025',
                        marginVertical: 5,
                      }}
                      onPress={() => this.viewAllJobs()}>
                      {strings.ViewAll}
                    </Text>
                  </View>
                  <FlatList
                    horizontal
                    data={this.state.recentjobs}
                    renderItem={({item, index}) => {
                      return (
                        <View
                          style={[
                            styles.itemContainer,
                            {backgroundColor: 'transparent', height: 300},
                          ]}>
                          <TouchableOpacity
                            style={{
                              backgroundColor: '#fff',
                              width: deviceWidth - 30,
                              borderRadius: 10,
                              paddingVertical: 10,
                            }}
                            onPress={() => this.onPressedJob(item)}>
                            <View
                              style={{
                                width: '95%',
                                marginLeft: 10,
                                marginBottom: 3,
                              }}>
                              <Text
                                style={{
                                  color: '#515C6F',
                                  marginBottom: 5,
                                  fontSize: 15,
                                  fontWeight: '400',
                                }}
                                numberOfLines={1}>
                                {item.title}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: '300',
                                  color: '#6e6e6e',
                                }}
                                numberOfLines={1}>
                                {item.description}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: '300',
                                  color: '#6e6e6e',
                                  textAlign: 'right',
                                  marginTop: 5,
                                  width: '98%',
                                }}
                                numberOfLines={1}>
                                {item.created_at != '' &&
                                item.created_at != null
                                  ? Moment(item.created_at).format('ll')
                                  : ''}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )
                    }}
                    keyExtractor={(item, index) => index}
                  />
                </View>
              ) : (
                <View
                  style={{
                    width: Width(90),
                    height: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    borderRadius: 7,
                    alignSelf: 'center',
                  }}>
                  <Text style={{color: '#000', fontSize: 15, marginTop: 10}}>
                    {strings.AnyTaskToPost}
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: Width(70),
                      height: 50,
                      backgroundColor: '#c80025',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 10,
                      marginBottom: 25,
                      borderRadius: 25,
                      alignSelf: 'center',
                    }}
                    onPress={() => this.props.navigation.navigate('PostJob')}>
                    <Text
                      style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
                      {strings.PostNewJob}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            ) : this.state.recentjobs != undefined &&
              this.state.recentjobs.length > 0 ? (
              <View
                style={{
                  width: '100%',
                  height: 250,
                  backgroundColor: 'transparent',
                  marginTop: 20,
                }}>
                {/* <View style = {{width:'100%',flexDirection:'row',backgroundColor:'transparent', marginTop:0}}>
                            <Text style = {{marginLeft:15, fontSize:20,fontWeight:'500',color:'#000', marginVertical:5}}>Recent Jobs</Text>
                        </View> */}
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    backgroundColor: 'transparent',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      marginLeft: 15,
                      fontSize: 15,
                      fontWeight: '500',
                      color: '#000',
                      marginVertical: 5,
                    }}>
                    {strings.RecentJobs}
                  </Text>
                  <Text
                    style={{
                      position: 'absolute',
                      right: 15,
                      fontSize: 12,
                      fontWeight: '300',
                      color: '#c80025',
                      marginVertical: 5,
                    }}
                    onPress={() => this.viewAllJobs()}>
                    {strings.ViewAll}
                  </Text>
                </View>
                <FlatList
                  horizontal
                  data={this.state.recentjobs}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        style={[
                          styles.itemContainer,
                          {backgroundColor: 'transparent', height: 250},
                        ]}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#fff',
                            width: deviceWidth - 30,
                            alignItems: 'center',
                            borderRadius: 10,
                            paddingVertical: 10,
                            flexDirection: 'row',
                          }}
                          onPress={() => this.onPressedJob(item)}>
                          {item.creator_details != undefined &&
                          item.creator_details.proflie_pic != null &&
                          item.creator_details.proflie_pic != '' ? (
                            <Image
                              source={{
                                uri:
                                  IMG_PREFIX_URL +
                                  item.creator_details.proflie_pic,
                              }}
                              style={{
                                height: 70,
                                width: 70,
                                marginTop: 5,
                                borderRadius: 35,
                              }}
                              resizeMode='stretch'
                            />
                          ) : (
                            <Image
                              source={defaultuser}
                              style={{
                                height: 70,
                                width: 70,
                                marginLeft: 10,
                                borderRadius: 35,
                              }}
                              resizeMode='cover'
                            />
                          )}
                          <View style={{width: '70%', marginLeft: 10}}>
                            <Text
                              style={{
                                color: '#000',
                                marginBottom: 5,
                                fontSize: 15,
                                fontWeight: '500',
                              }}
                              numberOfLines={1}>
                              {item.creator_details.first_name}{' '}
                              {item.creator_details.last_name}
                            </Text>
                            <Text
                              style={{
                                color: '#515C6F',
                                marginBottom: 5,
                                fontSize: 15,
                                fontWeight: '400',
                              }}
                              numberOfLines={1}>
                              {item.title}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: '300',
                                color: '#6e6e6e',
                              }}
                              numberOfLines={1}>
                              {item.description}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )
                  }}
                  keyExtractor={(item, index) => index}
                />
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    )
  }
}

export default Home

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'column',
    flex: 1,
  },
  menubutton: {
    position: 'absolute',
    left: 15,
    marginTop: 40,
    height: 25,
    width: 25,
    justifyContent: 'center',
  },
  cartbutton: {
    position: 'absolute',
    right: 1,
    marginTop: 45,
    height: 30,
    width: 80,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 10,
    color: '#515C6F',
    fontWeight: '400',
    textAlign: 'left',
    marginBottom: 5,
    marginTop: 5,
  },
  itemCode: {
    fontWeight: '500',
    fontSize: 10,
    color: '#515C6F',
  },
  gridView: {
    marginTop: 5,
    flex: 1,
    marginBottom: 3,
  },
  newestcontainer: {
    width: deviceWidth - 40,
    height: 200,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    flexDirection: 'column',
    borderRadius: 10,
    marginTop: 10,
  },
  itemContainer: {
    //justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 100,
  },
})
