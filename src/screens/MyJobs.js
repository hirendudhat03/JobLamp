import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  Dimensions,
  TouchableHighlight,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Moment from 'moment'
import strings from '../config/LanguageStrings'
import {Height, Width} from '../config/dimensions'
import {API_ROOT, IMG_PREFIX_URL} from '../config/constant'

const icback = require('../../assets/images/side_menu.png')
const defaultuser = require('../../assets/images/ic_default_user_black.png')

let deviceWidth = Dimensions.get('window').width

class MyJobs extends Component {
  constructor (props) {
    super(props)
    ;(this.state = {
      device_token: '',
      arrjobs: [],
      selectedindex: 0,
      userrole: '',
      status: 'opened',
      user_id: '',
      has_applied: false,
    }),
      (this._didFocusSubscription = props.navigation.addListener(
        'didFocus',
        payload => {
          this.loadData()

          //this.setUpTimer()
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

    await AsyncStorage.getItem('user_type').then(value => {
      if (value == 'service_provider') {
        this.setState({userrole: value, status: 'applied'})
      } else {
        this.setState({userrole: value})
      }
    })

    this.getUserDetailsAPICall()
  }

  getUserDetailsAPICall () {
    console.log('getUserDetailsAPICall : ')

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

        if (responseData.status == true) {
          this.setState({showloading: false, status: responseData.data.status})

          console.log('getUserDetailsAPICall responseData: ', responseData)

          if (responseData.data.email_verified_at !== null) {
          } else {
            alert(
              'Your account is not verified by email yet. Please contact customer support for the same',
            )
            this.setState({has_applied: true})
          }
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

  loadData () {
    if (this.state.userrole == 'customer') {
      this.getCustomerJobListAPICall()
    } else {
      this.getTWJobListAPICall()
    }
  }

  onMenuPressed () {
    this.props.navigation.toggleDrawer()
  }

  onPressedTab (index) {
    if (this.state.userrole == 'customer') {
      if (index == 0) {
        this.setState({selectedindex: index, status: 'opened'}, () =>
          this.getCustomerJobListAPICall(),
        )
      } else if (index == 1) {
        this.setState({selectedindex: index, status: 'hired'}, () =>
          this.getCustomerJobListAPICall(),
        )
      } else if (index == 2) {
        this.setState({selectedindex: index, status: 'delivered'}, () =>
          this.getCustomerJobListAPICall(),
        )
      } else {
        this.setState({selectedindex: index, status: 'completed'}, () =>
          this.getCustomerJobListAPICall(),
        )
      }
    } else {
      if (index == 0) {
        this.setState({selectedindex: index, status: 'applied'}, () =>
          this.getTWJobListAPICall(),
        )
      } else if (index == 1) {
        this.setState({selectedindex: index, status: 'hired'}, () =>
          this.getTWJobListAPICall(),
        )
      } else if (index == 2) {
        this.setState({selectedindex: index, status: 'delivered'}, () =>
          this.getCustomerJobListAPICall(),
        )
      } else {
        this.setState({selectedindex: index, status: 'completed'}, () =>
          this.getTWJobListAPICall(),
        )
      }
    }
  }

  onNewTaskPressed () {
    this.props.navigation.navigate('PostJob')
  }

  onPressedJob (item) {
    this.props.navigation.navigate('JobDetails', {job_id: item.id})
  }

  getCustomerJobListAPICall () {
    this.setState({showloading: true})

    var data = new FormData()

    data.append('user_id', this.state.user_id)
    data.append('status', this.state.status)

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
          this.setState({showloading: false, arrjobs: responseData.data})
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

  getTWJobListAPICall () {
    this.setState({showloading: true})

    var data = new FormData()

    data.append('user_id', this.state.user_id)
    data.append('status', this.state.status)

    fetch(API_ROOT + 'worker-joblist', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.status == true) {
          this.setState({showloading: false, arrjobs: responseData.data})
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
          onPress={() => this.onMenuPressed()}>
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
          {strings.MyJobs}
        </Text>
        {/* <TouchableOpacity style={styles.cartbutton} onPress={() => this.onCartPressed()}>
                        <Image source = {iccart} resizeMode= 'contain'/>
                    </TouchableOpacity> */}
      </View>
    )
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
        {this.renderTopBar()}
        <View
          style={{
            width: '100%',
            height: 50,
            backgroundColor: '#fff',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              width: '25%',
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}
            onPress={() => this.onPressedTab(0)}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                color: this.state.selectedindex == 0 ? '#c80025' : '#000',
              }}>
              {this.state.userrole == 'customer' ? 'Posted' : 'Applied'}
            </Text>
            {this.state.selectedindex == 0 ? (
              <View
                style={{
                  width: '100%',
                  height: 2,
                  backgroundColor: '#c80025',
                  position: 'absolute',
                  bottom: 0,
                }}></View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '25%',
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}
            onPress={() => this.onPressedTab(1)}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                color: this.state.selectedindex == 1 ? '#c80025' : '#000',
              }}>
              {this.state.userrole == 'customer'
                ? strings.Active
                : strings.Active}
            </Text>
            {this.state.selectedindex == 1 ? (
              <View
                style={{
                  width: '100%',
                  height: 2,
                  backgroundColor: '#c80025',
                  position: 'absolute',
                  bottom: 0,
                }}></View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '25%',
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}
            onPress={() => this.onPressedTab(2)}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                color: this.state.selectedindex == 2 ? '#c80025' : '#000',
              }}>
              {this.state.userrole == 'customer'
                ? strings.Delivered
                : strings.Delivered}
            </Text>
            {this.state.selectedindex == 2 ? (
              <View
                style={{
                  width: '100%',
                  height: 2,
                  backgroundColor: '#c80025',
                  position: 'absolute',
                  bottom: 0,
                }}></View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '25%',
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}
            onPress={() => this.onPressedTab(3)}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '500',
                color: this.state.selectedindex == 3 ? '#c80025' : '#000',
              }}>
              {this.state.userrole == 'customer'
                ? strings.Past
                : strings.Completed}
            </Text>
            {this.state.selectedindex == 3 ? (
              <View
                style={{
                  width: '100%',
                  height: 2,
                  backgroundColor: '#c80025',
                  position: 'absolute',
                  bottom: 0,
                }}></View>
            ) : null}
          </TouchableOpacity>
        </View>
        <View style={{width: '100%', flex: 1, justifyContent: 'center'}}>
          {this.state.arrjobs != undefined &&
          this.state.arrjobs != null &&
          this.state.arrjobs.length > 0 ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={this.state.arrjobs}
              ref={ref => {
                this.scroll = ref
              }}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={{
                      borderRadius: 5,
                      padding: 5,
                      backgroundColor: 'transparent',
                      alignItems: 'center',
                    }}
                    activeOpacity={0.9}
                    onPress={() => this.onPressedJob(item)}>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        width: deviceWidth - 30,
                        borderRadius: 10,
                        paddingVertical: 10,
                        flexDirection: 'row',
                      }}>
                      {/* {rowData.category_image != null ? <Image source = {{uri:IMG_PREFIX_URL+'uploads/categories/'+rowData.category_image}} style = {{height:70, width:70, marginTop:5,borderRadius:35}} resizeMode='stretch'/> 
                                        :<Image source = {defaultuser} style = {{height:70, width:70, marginLeft:10,borderRadius:35}} resizeMode='cover'/> } */}
                      <View style={{width: '95%', marginLeft: 10}}>
                        <Text
                          style={{
                            fontSize: 10,
                            color: '#6e6e6e',
                            fontWeight: '500',
                            textAlign: 'left',
                            marginBottom: 7,
                            marginTop: 5,
                            fontSize: 15,
                          }}
                          numberOfLines={1}>
                          {item.title}
                        </Text>
                        {global.language == 'en' ? (
                          <Text
                            style={{
                              fontSize: 10,
                              color: '#6e6e6e',
                              fontWeight: '400',
                              textAlign: 'left',
                              marginBottom: 7,
                              fontSize: 13,
                            }}
                            numberOfLines={1}>
                            {item.category_info != undefined &&
                            item.category_info != null
                              ? item.category_info.name_en
                              : ''}
                          </Text>
                        ) : global.language == 'es' ? (
                          <Text
                            style={{
                              fontSize: 10,
                              color: '#6e6e6e',
                              fontWeight: '400',
                              textAlign: 'left',
                              marginBottom: 7,
                              fontSize: 13,
                            }}
                            numberOfLines={1}>
                            {item.category_info != undefined &&
                            item.category_info != null
                              ? item.category_info.name_es
                              : ''}
                          </Text>
                        ) : global.language == 'fr' ? (
                          <Text
                            style={{
                              fontSize: 10,
                              color: '#6e6e6e',
                              fontWeight: '400',
                              textAlign: 'left',
                              marginBottom: 7,
                              fontSize: 13,
                            }}
                            numberOfLines={1}>
                            {item.category_info != undefined &&
                            item.category_info != null
                              ? item.category_info.name_fr
                              : ''}
                          </Text>
                        ) : global.language == 'de' ? (
                          <Text
                            style={{
                              fontSize: 10,
                              color: '#6e6e6e',
                              fontWeight: '400',
                              textAlign: 'left',
                              marginBottom: 7,
                              fontSize: 13,
                            }}
                            numberOfLines={1}>
                            {item.category_info != undefined &&
                            item.category_info != null
                              ? item.category_info.name_de
                              : ''}
                          </Text>
                        ) : global.language == 'pt' ? (
                          <Text
                            style={{
                              fontSize: 10,
                              color: '#6e6e6e',
                              fontWeight: '400',
                              textAlign: 'left',
                              marginBottom: 7,
                              fontSize: 13,
                            }}
                            numberOfLines={1}>
                            {item.category_info != undefined &&
                            item.category_info != null
                              ? item.category_info.name_pt
                              : ''}
                          </Text>
                        ) : global.language == 'ru' ? (
                          <Text
                            style={{
                              fontSize: 10,
                              color: '#6e6e6e',
                              fontWeight: '400',
                              textAlign: 'left',
                              marginBottom: 7,
                              fontSize: 13,
                            }}
                            numberOfLines={1}>
                            {item.category_info != undefined &&
                            item.category_info != null
                              ? item.category_info.name_ru
                              : ''}
                          </Text>
                        ) : null}

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
                            position: 'absolute',
                            right: 8,
                          }}
                          numberOfLines={1}>
                          {item.created_at != '' && item.created_at != null
                            ? Moment(item.created_at).format('ll')
                            : ''}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }}
              keyExtractor={(item, index) => index}
            />
          ) : (
            <Text
              style={{fontSize: 23, alignSelf: 'center', fontWeight: '500'}}>
              {strings.NoJobFound}
            </Text>
          )}
        </View>
        {this.state.userrole == 'customer' ? (
          !this.state.has_applied ? (
            <TouchableOpacity
              style={{
                width: Width(70),
                height: 50,
                backgroundColor: '#c80025',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
                marginBottom: 25,
                borderRadius: 25,
                alignSelf: 'center',
              }}
              onPress={() => this.onNewTaskPressed()}>
              <Text style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
                {strings.PostNewJob}
              </Text>
            </TouchableOpacity>
          ) : null
        ) : null}
      </View>
    )
  }
}
export default MyJobs
