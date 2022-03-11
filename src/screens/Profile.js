import React, {Component} from 'react'
import {
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Image,
  FlatList,
  Modal,
  Platform,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Moment from 'moment'
import {Height, Width} from '../config/dimensions'
import {API_ROOT, IMG_PREFIX_URL, AWS_S3_URL} from '../config/constant'
import DocumentPicker from 'react-native-document-picker'
import strings from '../config/LanguageStrings'

const icback = require('../../assets/images/ic_menu.png')
const ic_settings = require('../../assets/images/ic_settings.png')
const defaultuser = require('../../assets/images/ic_default_user.png')
const icdob = require('../../assets/images/ic_dob.png')
const currentloc = require('../../assets/images/ic_current_location.png')

class Profile extends Component {
  constructor (props) {
    super(props)

    this.currentIndex = -1
    this.playindex = -1
    this.currentVideo = ''
    this.state = {
      device_token: '',
      emailaddress: '',
      showloading: false,
      arrskills: [],
      user_id: '',
      userdetails: '',
      currentjobs: '',
      appliedjobs: '',
      completedjobs: '',
      selectedindex: 0,
      showmenu: false,
      userrole: '',
      document1: null,
      document2: null,
      document3: null,
      document1name: null,
      document2name: null,
      document3name: null,
      document1type: null,
      document2type: null,
      document3type: null,
    }
    this._didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload => {
        this.loadData()
      },
    )
  }

  async componentDidMount () {
    await AsyncStorage.getItem('user_id').then(value => {
      this.setState({user_id: value})
    })

    await AsyncStorage.getItem('user_type').then(value => {
      this.setState({userrole: value})
    })

    await AsyncStorage.getItem('device_token').then(value => {
      this.setState({device_token: value})
    })
  }

  loadData () {
    this.getUserDetailsAPICall()

    if (this.state.userrole == 'service_provider') {
      this.getJobsCountAPICall()
    }
  }

  onPressedSettings () {
    this.props.navigation.navigate('Setting', {is_from_profile: true})
  }

  onBackPressed () {
    this.props.navigation.toggleDrawer()
  }

  onEditProfilePressed () {
    //alert('Hi')
    this.props.navigation.navigate('EditProfile', {
      userdetails: this.state.userdetails,
    })
  }

  onReviewsPressed () {
    this.props.navigation.navigate('UserRatings', {user_id: this.state.user_id})
  }

  onCompletedPressed () {}

  onCurrentPressed () {}

  onUpcomingPressed () {}

  onPressedDocument (index) {
    if (index == 1) {
    } else if (index == 2) {
    } else {
    }
  }

  async onPressUploadDocument (index) {
    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
      })
      // console.log(
      //   res.uri,
      //   res.type, // mime type
      //   res.name,
      //   res.size
      // );

      if (res.uri != null && res.uri != '') {
        if (index == 1) {
          this.setState({
            document1: res.uri,
            document1name: res.name,
            document1type: res.type,
          })
        } else if (index == 2) {
          this.setState({
            document2: res.uri,
            document2name: res.name,
            document2type: res.type,
          })
        } else if (index == 3) {
          this.setState({
            document3: res.uri,
            document3name: res.name,
            document3type: res.type,
          })
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err
      }
    }
  }

  getUserDetailsAPICall () {
    this.setState({showloading: true})
    var data = new FormData()
    data.append('user_id', this.state.user_id)
    //alert(this.state.user_id)
    fetch(API_ROOT + 'profile', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        //alert(JSON.stringify(responseData))

        console.log('responseData.data : ',responseData.data)

        if (responseData.status == true) {
          this.setState({showloading: false, userdetails: responseData.data})

          if (responseData.data.doc1 != undefined) {
            this.setState({document1name: responseData.data.doc1})
          }
          if (responseData.data.doc2 != undefined) {
            this.setState({document2name: responseData.data.doc2})
          }

          if (responseData.data.doc3 != undefined) {
            this.setState({document3name: responseData.data.doc3})
          }

          //alert(responseData.user.id)
        } else {
          this.setState({showloading: false})
          alert(strings.FailedToRetriveProfile)
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        alert(error)
      })
  }

  uploadDocumentAPICall () {
    if (
      this.state.document1type == null &&
      this.state.document2type == null &&
      this.state.document3type == null
    ) {
      return
    }

    this.setState({showloading: true})
    var data = new FormData()
    data.append('user_id', this.state.user_id)

    if (this.state.document1type != null && this.state.document1type != '') {
      if (this.state.document1type == 'application/pdf') {
        data.append('doc_1', {
          name: 'sample.pdf',
          type: 'application/pdf',
          uri:
            Platform.OS === 'android'
              ? this.state.document1
              : this.state.document1.replace('file://', ''),
        })
      }
      // else if(this.state.document1type.includes('.document'))
      // {
      //     data.append("doc_1", {
      //         name: 'sample.pdf',
      //         type: type,
      //         uri:
      //             Platform.OS === "android" ? this.state.document1 : this.state.document1.replace("file://", "")
      //         });
      // }
    }

    if (this.state.document2type != null && this.state.document2type != '') {
      if (this.state.document2type == 'application/pdf') {
        data.append('doc_2', {
          name: 'sample.pdf',
          type: 'application/pdf',
          uri:
            Platform.OS === 'android'
              ? this.state.document2
              : this.state.document2.replace('file://', ''),
        })
      }
      // else if(this.state.document2type.includes('.document'))
      // {
      //     data.append("doc_2", {
      //         name: 'sample.pdf',
      //         type: type,
      //         uri:
      //             Platform.OS === "android" ? this.state.document2 : this.state.document2.replace("file://", "")
      //         });
      // }
    }

    if (this.state.document3type != null && this.state.document3type != '') {
      if (this.state.document3type == 'application/pdf') {
        data.append('doc_3', {
          name: 'sample.pdf',
          type: 'application/pdf',
          uri:
            Platform.OS === 'android'
              ? this.state.document3
              : this.state.document3.replace('file://', ''),
        })
      }
      // else if(this.state.document3type.includes('.document'))
      // {
      //     data.append("doc_3", {
      //         name: 'sample.pdf',
      //         type: type,
      //         uri:
      //             Platform.OS === "android" ? this.state.document3 : this.state.document3.replace("file://", "")
      //         });
      // }
    }

    fetch(API_ROOT + 'update-docs', {
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
          this.getUserDetailsAPICall()
          alert(strings.DocsUploaded)
        } else {
          this.setState({showloading: false})
          alert(strings.DocsUploadedFailed)
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

    data.append('user_id', this.state.user_id)

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
          {strings.Profile}
        </Text>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 30,
            marginTop: 45,
            height: 25,
            width: 25,
            justifyContent: 'center',
          }}
          onPress={() => this.onPressedSettings()}>
          <Image source={ic_settings} resizeMode='contain' />
        </TouchableOpacity>
      </View>
    )
  }

  renderActionSheet () {
    return (
      <Modal
        visible={this.state.showmenu}
        style={{margin: 0, backgroundColor: 'transparent'}}
        animationType='slide'
        transparent={true}>
        <TouchableOpacity
          style={{
            width: Width(100),
            height: Height(100),
            position: 'absolute',
            margin: 0,
            backgroundColor: '#000',
            opacity: 0.4,
          }}
          onPress={() => this.setState({showmenu: false})}></TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: Width(100),
            height: Height(18),
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#fff',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              height: Height(5.8),
              width: Width(95),
            }}
            onPress={() => this.onPressedEditFeed()}>
            <Text style={{color: '#000', fontSize: 20, fontWeight: '500'}}>
              {strings.Edit}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: Width(100),
              height: 0.5,
              backgroundColor: 'grey',
            }}></View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              height: Height(5.8),
              width: Width(95),
            }}
            onPress={() => this.onPressedDeleteFeed()}>
            <Text style={{color: '#000', fontSize: 20, fontWeight: '500'}}>
              {strings.Delete}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: Width(100),
              height: 0.5,
              backgroundColor: 'grey',
            }}></View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              height: Height(5.8),
              width: Width(95),
            }}
            onPress={() => this.setState({showmenu: false})}>
            <Text style={{color: 'red', fontSize: 20, fontWeight: '500'}}>
              {strings.Cancel}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  render () {
    var address = ''

    if (
      this.state.userdetails.city != null &&
      this.state.userdetails.city != ''
    ) {
      address = this.state.userdetails.city
    }

    if (
      this.state.userdetails.state != null &&
      this.state.userdetails.state != ''
    ) {
      if (address != '') {
        address = address + ', ' + this.state.userdetails.state
      } else {
        address = this.state.userdetails.state
      }
    }

    if (
      this.state.userdetails.country != null &&
      this.state.userdetails.country != ''
    ) {
      if (address != '') {
        address = address + ', ' + this.state.userdetails.country
      } else {
        address = this.state.userdetails.country
      }
    }

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
          contentContainerStyle={{alignItems: 'center'}}>
          <View style={{width: Width(100), alignItems: 'center'}}>
            <View
              style={{
                width: Width(100),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#c80025',
              }}>
              {this.state.userdetails.profile_pic != '' &&
              this.state.userdetails.profile_pic != null ? (
                <Image
                  source={{
                    uri: IMG_PREFIX_URL + this.state.userdetails.profile_pic,
                  }}
                  resizeMode='cover'
                  style={{
                    width: 100,
                    height: 100,
                    borderColor: '#fff',
                    borderWidth: 3,
                    borderRadius: 50,
                    marginTop: 15,
                  }}
                />
              ) : (
                <Image
                  source={defaultuser}
                  resizeMode='cover'
                  style={{
                    width: 100,
                    height: 100,
                    borderColor: '#fff',
                    borderWidth: 3,
                    borderRadius: 50,
                    marginTop: 15,
                  }}
                />
              )}
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: '500',
                  marginTop: 20,
                }}>
                {this.state.userdetails.first_name}{' '}
                {this.state.userdetails.last_name}
              </Text>
              <View
                style={{
                  width: Width(90),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    width: Width(45),
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: Height(4),
                      borderRadius: Height(2.5),
                      borderWidth: 2,
                      borderColor: '#fff',
                      width: Width(43),
                      marginTop: 20,
                    }}
                    onPress={() => this.onEditProfilePressed()}>
                    <Text
                      style={{color: '#fff', fontSize: 13, fontWeight: '400'}}>
                      {strings.EditProfile}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: Width(45),
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: Height(4),
                      borderRadius: Height(2.5),
                      borderWidth: 2,
                      borderColor: '#fff',
                      width: Width(43),
                      marginTop: 20,
                    }}
                    onPress={() => this.onReviewsPressed()}>
                    {this.state.userdetails.total_reviews != undefined &&
                    this.state.userdetails.total_reviews != null &&
                    this.state.userdetails.total_reviews > 0 ? (
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: '400',
                        }}>
                        {strings.Reviews} (
                        {this.state.userdetails.total_reviews})
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: '400',
                        }}>
                        {strings.Reviews} (0)
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              {this.state.userrole == 'service_provider' ? (
                <View
                  style={{
                    justifyContent: 'space-between',
                    width: Width(83),
                    flexDirection: 'row',
                    marginTop: 15,
                    marginBottom: 20,
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'transparent',
                      width: Width(27),
                      height: Height(6),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => this.onCompletedPressed()}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                      {strings.Completed}
                    </Text>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 17,
                        fontWeight: '400',
                        marginTop: 5,
                        textAlign: 'center',
                      }}>
                      {this.state.completedjobs == '' ||
                      this.state.completedjobs == null
                        ? '0'
                        : this.state.completedjobs}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      height: Height(4),
                      width: 1,
                      backgroundColor: '#fff',
                    }}></View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'transparent',
                      height: Height(6),
                      width: Width(27),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => this.onCurrentPressed()}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                      {strings.Active}
                    </Text>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 17,
                        fontWeight: '400',
                        marginTop: 5,
                        textAlign: 'center',
                      }}>
                      {this.state.currentjobs == '' ||
                      this.state.currentjobs == null
                        ? '0'
                        : this.state.currentjobs}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      height: Height(4),
                      width: 1,
                      backgroundColor: '#fff',
                    }}></View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'transparent',
                      height: Height(6),
                      width: Width(27),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => this.onUpcomingPressed()}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                      {strings.Applied}
                    </Text>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 17,
                        fontWeight: '400',
                        marginTop: 5,
                        textAlign: 'center',
                      }}>
                      {this.state.appliedjobs == '' ||
                      this.state.appliedjobs == null
                        ? '0'
                        : this.state.appliedjobs}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            {this.state.userrole == 'service_provider' ? (
              <View
                style={{
                  width: Width(100),
                  height: 45,
                  backgroundColor: '#fcf3f3',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    height: 45,
                    borderRadius: 22.5,
                    backgroundColor: 'transparent',
                    width: Width(85),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('PortfolioList', {
                      other_user_id: this.state.user_id,
                      plan_id: this.state.userdetails.subscription_plan,
                    })
                  }>
                  <Text
                    style={{fontSize: 20, fontWeight: '500', color: '#c80025'}}>
                    {strings.ViewPortFolio}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* <View style = {{width:Width(100), backgroundColor:'#F2F4F7', alignItems:'center'}}> */}
            <View
              style={{
                width: Width(100),
                backgroundColor: '#fff',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: Width(90),
                  flexDirection: 'row',
                  marginTop: 15,
                  marginBottom: 15,
                }}>
                <Image
                  source={currentloc}
                  style={{width: 17, height: 17}}
                  resizeMode='contain'></Image>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 15,
                    fontWeight: '400',
                    color: '#3A4759',
                  }}>
                  {strings.CurrentlyIn} : {address}
                </Text>
              </View>
              <View
                style={{
                  width: Width(90),
                  flexDirection: 'row',
                  marginBottom: 15,
                }}>
                <Image
                  source={icdob}
                  style={{width: 17, height: 17}}
                  resizeMode='contain'></Image>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 15,
                    fontWeight: '400',
                    color: '#3A4759',
                  }}>
                  {strings.BirthDate} :{' '}
                  {this.state.userdetails.date_of_birth != undefined &&
                  this.state.userdetails.date_of_birth != null &&
                  this.state.userdetails.date_of_birth != ''
                    ? Moment(this.state.userdetails.date_of_birth).format('ll')
                    : ''}
                </Text>
              </View>
            </View>

            <View style={{width: Width(100), alignItems: 'center'}}>
              {/* <Text style = {{fontSize:22,fontWeight:'600',color:'#363169', marginTop:15,width:Width(93)}}>{strings.AboutMe}</Text>
                            <Text style = {{fontSize:15,fontWeight:'400',color:'#767373', marginTop:10,width:Width(93)}}>{this.state.userdetails.about_me}</Text> */}

              {this.state.userrole == 'service_provider' ? (
                <View
                  style={{
                    width: Width(93),
                    flexDirection: 'row',
                    height: 45,
                    justifyContent: 'center',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      width: '100%',
                      color: '#363169',
                      fontSize: 22,
                      fontWeight: '600',
                    }}>
                    {strings.Skills}
                  </Text>
                </View>
              ) : null}

              {this.state.userrole == 'service_provider' ? (
                this.state.userdetails.skills != undefined &&
                this.state.userdetails.skills != null ? (
                  <View style={{width: Width(93)}}>
                    {/* <View style={{ height: Height(1) }} /> */}
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        backgroundColor: '#fff',
                        alignItems: 'center',
                      }}>
                      {this.state.userdetails.skills.map(item => {
                        return (
                          <Text
                            style={{
                              fontSize: 14,
                              marginLeft: '1.1%',
                              marginTop: '1.1%',
                              paddingLeft: '4%',
                              paddingRight: '4%',
                              paddingTop: '1.8%',
                              paddingBottom: '1.8%',
                              textAlign: 'center',
                              color: '#676868',
                              borderRadius: 5,
                              borderColor: '#676868',
                              borderWidth: 1,
                            }}>
                            {global.language == 'en'
                              ? item.name_en
                              : global.language == 'es'
                              ? item.name_es
                              : global.language == 'fr'
                              ? item.name_fr
                              : global.language == 'de'
                              ? item.name_de
                              : global.language == 'pt'
                              ? item.name_pt
                              : global.language == 'ru'
                              ? item.name_ru
                              : null}
                          </Text>
                        )
                      })}
                    </View>
                  </View>
                ) : null
              ) : null}
              {this.state.userrole == 'service_provider' ? (
                <TouchableOpacity
                  style={{
                    height: 45,
                    borderRadius: 22.5,
                    backgroundColor: '#c80025',
                    width: Width(85),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 30,
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('UserSkills', {
                      user_skills: this.state.userdetails.skills,
                      plan_id: this.state.userdetails.subscription_plan,
                    })
                  }>
                  <Text
                    style={{fontSize: 20, fontWeight: '500', color: '#fff'}}>
                    {strings.UpdateSkills}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {this.state.userrole == 'service_provider' ? (
                <View
                  style={{
                    width: Width(93),
                    flexDirection: 'row',
                    height: 45,
                    justifyContent: 'center',
                    marginTop: 10,
                  }}>
                  <Text
                    style={{
                      width: '100%',
                      color: '#363169',
                      fontSize: 22,
                      fontWeight: '600',
                    }}>
                    {strings.Categories}
                  </Text>
                </View>
              ) : null}

              {this.state.userrole == 'service_provider' ? (
                this.state.userdetails.categories != undefined &&
                this.state.userdetails.categories != null ? (
                  <View style={{width: Width(93)}}>
                    {/* <View style={{ height: Height(1) }} /> */}
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        backgroundColor: '#fff',
                        alignItems: 'center',
                      }}>
                      {this.state.userdetails.categories.map(item => {
                        return (
                          <Text
                            style={{
                              fontSize: 14,
                              marginLeft: '1.1%',
                              marginTop: '1.1%',
                              paddingLeft: '4%',
                              paddingRight: '4%',
                              paddingTop: '1.8%',
                              paddingBottom: '1.8%',
                              textAlign: 'center',
                              color: '#676868',
                              borderRadius: 5,
                              borderColor: '#676868',
                              borderWidth: 1,
                            }}>
                            {global.language == 'en'
                              ? item.name_en
                              : global.language == 'es'
                              ? item.name_es
                              : global.language == 'fr'
                              ? item.name_fr
                              : global.language == 'de'
                              ? item.name_de
                              : global.language == 'pt'
                              ? item.name_pt
                              : global.language == 'ru'
                              ? item.name_ru
                              : null}
                          </Text>
                        )
                      })}
                    </View>
                  </View>
                ) : null
              ) : null}
              {this.state.userrole == 'service_provider' ? (
                <TouchableOpacity
                  style={{
                    height: 45,
                    borderRadius: 22.5,
                    backgroundColor: '#c80025',
                    width: Width(85),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 30,
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('UserCategories', {
                      user_categories: this.state.userdetails.categories,
                      plan_id: this.state.userdetails.subscription_plan,
                    })
                  }>
                  <Text
                    style={{fontSize: 20, fontWeight: '500', color: '#fff'}}>
                    {strings.UpdateCategories}
                  </Text>
                </TouchableOpacity>
              ) : null}

              {this.state.userrole == 'service_provider' ? (
                <View
                  style={{
                    width: Width(93),
                    marginTop: 15,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '600',
                      marginLeft: 0,
                      color: '#363169',
                      alignSelf: 'flex-start',
                    }}>
                    {strings.SubmittedDocs}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: Width(90),
                      marginTop: 15,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        marginLeft: 15,
                        color: '#6e6e6e',
                        width: Width(50),
                        height: 25,
                      }}
                      onPress={() => this.onPressedDocument(1)}>
                      1.{' '}
                      {this.state.document1name != null
                        ? this.state.document1name.replace('documents/', '')
                        : strings.Document1}
                    </Text>

                    <View
                      style={{
                        width: Width(30),
                        height: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: 'red',
                      }}>
                      <Text
                        style={{fontSize: 15, fontWeight: '400', color: 'red'}}
                        onPress={() => this.onPressUploadDocument(1)}>
                        {strings.Choose}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: Width(90),
                      marginTop: 15,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        marginLeft: 15,
                        color: '#6e6e6e',
                        width: Width(50),
                        height: 25,
                      }}
                      onPress={() => this.onPressedDocument(2)}>
                      2.{' '}
                      {this.state.document2name != null
                        ? this.state.document2name.replace('documents/', '')
                        : strings.Document2}
                    </Text>

                    <View
                      style={{
                        width: Width(30),
                        height: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: 'red',
                      }}>
                      <Text
                        style={{fontSize: 15, fontWeight: '400', color: 'red'}}
                        onPress={() => this.onPressUploadDocument(2)}>
                        {strings.Choose}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: Width(90),
                      marginTop: 15,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '400',
                        marginLeft: 15,
                        color: '#6e6e6e',
                        width: Width(50),
                        height: 25,
                      }}
                      onPress={() => this.onPressedDocument(3)}>
                      3.{' '}
                      {this.state.document3name != null
                        ? this.state.document3name.replace('documents/', '')
                        : strings.Document3}
                    </Text>
                    <View
                      style={{
                        width: Width(30),
                        height: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: 'red',
                      }}>
                      <Text
                        style={{fontSize: 15, fontWeight: '400', color: 'red'}}
                        onPress={() => this.onPressUploadDocument(3)}>
                        {strings.Choose}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '400',
                      color: '#6e6e6e',
                      marginTop: 15,
                      marginBottom: 15,
                    }}>
                    {strings.SupportedDocPDF}
                  </Text>
                  {this.state.document1name != null ||
                  this.state.document2name != null ||
                  this.state.document3name != null ? (
                    <TouchableOpacity
                      style={{
                        height: 45,
                        borderRadius: 22.5,
                        backgroundColor: '#c80025',
                        width: Width(85),
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 30,
                      }}
                      onPress={() => this.uploadDocumentAPICall()}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: '500',
                          color: '#fff',
                        }}>
                        {strings.UpdateYourDocs}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : null}
            </View>
          </View>
          {this.renderActionSheet()}
        </KeyboardAwareScrollView>
        <View
          style={{
            backgroundColor: '#fff',
            height: 30,
            width: Width(100),
          }}></View>
      </View>
    )
  }
}
export default Profile
