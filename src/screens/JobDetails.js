import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  Dimensions,
  TextInput,
  Modal,
  Linking,
  Platform,
} from 'react-native'
import {InAppBrowser} from 'react-native-inappbrowser-reborn'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Stars from 'react-native-stars'
import strings from '../config/LanguageStrings'

import {Height, Width} from '../config/dimensions'
import {API_ROOT, IMG_PREFIX_URL, AWS_S3_URL} from '../config/constant'
import FileViewer from 'react-native-file-viewer'

let deviceWidth = Dimensions.get('window').width

const icback = require('../../assets/images/ic_back.png')
const icdownarroow = require('../../assets/images/ic_down_arrow.png')
const starfill = require('../../assets/images/ic_fill_star.png')
const starempty = require('../../assets/images/ic_empty_star.png')

class JobDetails extends Component {
  constructor (props) {
    super(props)
    this.customer_rating = 0
    ;(this.state = {
      userrole: '',
      device_token: '',
      login_id: '',
      job_id: props.navigation.state.params.job_id,
      job_details: '',
      showloading: false,
      creator_details: '',
      country_details: '',
      state_details: '',
      status: '',
      city_details: '',
      has_applied: false,
      taskworker_details: '',
      userdetails: '',
      customer_feedback: null,
      provider_feedback: null,
      customer_rating: 0,
      showModal: false,
      provider_rating: 0,
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
      this.setState({login_id: value})
    })

    await AsyncStorage.getItem('user_type').then(value => {
      this.setState({userrole: value})
    })

    await AsyncStorage.getItem('device_token').then(value => {
      this.setState({device_token: value})
    })

    this.getUserDetailsAPICall()
  }

  getUserDetailsAPICall () {
    console.log('getUserDetailsAPICall : ')

    this.setState({showloading: true})
    var data = new FormData()
    data.append('user_id', this.state.login_id)
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

          if (responseData.data.status == 'active') {
          } else {
            alert(
              'Your account is not approved by admin yet. Please contact customer support for the same',
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

  async viewAttachment () {
    console.log(IMG_PREFIX_URL + this.state.imageNameData)

    try {
      const url = IMG_PREFIX_URL + this.state.imageNameData
      // const url = 'http://www.africau.edu/images/default/sample.pdf'

      if (Platform.OS == 'ios') {
        if (await InAppBrowser.isAvailable()) {
          const result = await InAppBrowser.open(url, {
            // iOS Properties
            dismissButtonStyle: 'cancel',
            preferredBarTintColor: '#c80025',
            preferredControlTintColor: 'white',
            readerMode: false,
            animated: true,
            modalPresentationStyle: 'fullScreen',
            modalTransitionStyle: 'coverVertical',
            modalEnabled: true,
            enableBarCollapsing: false,
            // Android Properties
            showTitle: true,
            toolbarColor: '#c80025',
            secondaryToolbarColor: 'black',
            navigationBarColor: 'black',
            navigationBarDividerColor: 'white',
            enableUrlBarHiding: true,
            enableDefaultShare: true,
            forceCloseOnRedirection: false,
            // Specify full animation resource identifier(package:anim/name)
            // or only resource name(in case of animation bundled with app).
            animations: {
              startEnter: 'slide_in_right',
              startExit: 'slide_out_left',
              endEnter: 'slide_in_left',
              endExit: 'slide_out_right',
            },
            headers: {
              'my-custom-header': 'my custom header value',
            },
          })
          Alert.alert(JSON.stringify(result))
        } else Linking.openURL(url)
      } else {
        // if (await InAppBrowser.isAvailable()) {
        //   const result = await InAppBrowser.open(url, {
        //     // iOS Properties
        //     dismissButtonStyle: 'cancel',
        //     preferredBarTintColor: '#c80025',
        //     preferredControlTintColor: 'white',
        //     readerMode: false,
        //     animated: true,
        //     modalPresentationStyle: 'fullScreen',
        //     modalTransitionStyle: 'coverVertical',
        //     modalEnabled: true,
        //     enableBarCollapsing: false,
        //     // Android Properties
        //     showTitle: true,
        //     toolbarColor: '#c80025',
        //     secondaryToolbarColor: 'black',
        //     navigationBarColor: 'black',
        //     navigationBarDividerColor: 'white',
        //     enableUrlBarHiding: true,
        //     enableDefaultShare: true,
        //     forceCloseOnRedirection: false,
        //     // Specify full animation resource identifier(package:anim/name)
        //     // or only resource name(in case of animation bundled with app).
        //     animations: {
        //       startEnter: 'slide_in_right',
        //       startExit: 'slide_out_left',
        //       endEnter: 'slide_in_left',
        //       endExit: 'slide_out_right'
        //     },
        //     headers: {
        //       'my-custom-header': 'my custom header value'
        //     }
        //   })
        //   Alert.alert(JSON.stringify(result))
        // }
        // else
        Linking.openURL(url)
      }
    } catch (error) {
      Alert.alert(error.message)
    }

    // FileViewer.open(
    //   'http://18.158.172.34/job-attachment/p3Q8u07jhSjR7IszHRKiRQ6EXgQe4SsWSNyUaCvF.pdf', { showOpenWithDialog: true }
    // )
    //   .then((res) => {
    //     console.log(res)
    //     // success
    //   })
    //   .catch(error => {
    //     // error
    //   })

    // this.setState({showModal: true})
  }

  loadData () {
    this.getUserProfile()
    this.getJobDetailsAPICall()
  }

  onMenuPressed () {
    this.props.navigation.goBack()
  }

  onNextPressed () {
    if (this.state.userrole == 'customer') {
      this.props.navigation.navigate('JobApplications', {
        job_id: this.state.job_id,
      })
    } else {
      if (
        this.state.userdetails != undefined &&
        this.state.userdetails != null &&
        parseInt(this.state.userdetails.remaining_jobs) > 0
      ) {
        this.props.navigation.navigate('ApplyJob', {
          job_id: this.state.job_id,
          is_payment_required: false,
        })
      } else {
        this.props.navigation.navigate('ApplyJob', {
          job_id: this.state.job_id,
          is_payment_required: true,
        })
      }
    }
  }

  onPressedViewDelivery () {
    this.props.navigation.navigate('ViewAllDeliveries', {
      job_id: this.state.job_id,
      view_delivery: true,
    })
  }

  onPressedMessage () {
    if (this.state.userrole == 'customer') {
      if (this.state.taskworker_details != null) {
        let receiverid =
          this.state.taskworker_details.id != null
            ? this.state.taskworker_details.id
            : null
        let first_name =
          this.state.taskworker_details.first_name != null
            ? this.state.taskworker_details.first_name
            : ''
        let last_name =
          this.state.taskworker_details.last_name != null
            ? this.state.taskworker_details.last_name
            : ''
        let profile =
          this.state.taskworker_details.profile_pic != null
            ? this.state.taskworker_details.profile_pic
            : ''
        let chat_url = 'job_chat_' + this.state.job_id

        if (receiverid != undefined && receiverid != null && receiverid != '') {
          this.props.navigation.navigate('JobChat', {
            receiver_id: receiverid,
            chat_url: chat_url,
            receiver_name: first_name + ' ' + last_name,
            receiver_photo: profile,
          })
        }
      }
    } else {
      if (this.state.creator_details != null) {
        let receiverid =
          this.state.creator_details.id != null
            ? this.state.creator_details.id
            : null
        let first_name =
          this.state.creator_details.first_name != null
            ? this.state.creator_details.first_name
            : ''
        let last_name =
          this.state.creator_details.last_name != null
            ? this.state.creator_details.last_name
            : ''
        let profile =
          this.state.creator_details.profile_pic != null
            ? this.state.creator_details.profile_pic
            : ''
        let chat_url = 'job_chat_' + this.state.job_id

        if (receiverid != undefined && receiverid != null && receiverid != '') {
          this.props.navigation.navigate('JobChat', {
            receiver_id: receiverid,
            chat_url: chat_url,
            receiver_name: first_name + ' ' + last_name,
            receiver_photo: profile,
          })
        }
      }
    }
  }

  onPressedDeliver () {
    this.props.navigation.navigate('DeliverJob', {
      job_id: this.state.job_id,
      view_delivery: false,
    })
  }

  onPressedFeedback () {
    if (this.state.userrole == 'customer') {
      this.props.navigation.navigate('RateUser', {
        job_id: this.state.job_id,
        other_user_id: this.state.worker_details.id,
      })
    } else {
      this.props.navigation.navigate('RateUser', {
        job_id: this.state.job_id,
        other_user_id: this.state.creator_details.id,
      })
    }
  }

  getJobDetailsAPICall () {
    this.setState({showloading: true})

    var data = new FormData()

    data.append('user_id', this.state.login_id)
    data.append('job_id', this.state.job_id)

    //alert(JSON.stringify(data))

    fetch(API_ROOT + 'job-details', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        //alert(JSON.stringify(responseData))

        console.log(
          'getJobDetailsAPICall responseData : ',
          responseData.data.attachment,
        )

        this.setState({imageNameData: responseData.data.attachment})

        if (responseData.status == true) {
          this.setState({
            showloading: false,
            job_details: responseData.data,
            creator_details: responseData.data.creator_details,
            city_details: responseData.data.job_city,
            state_details: responseData.data.job_state,
            country_details: responseData.data.job_country,
            has_applied: responseData.has_applied,
            taskworker_details:
              responseData.data.user_job != undefined &&
              responseData.data.user_job != null
                ? responseData.data.user_job.worker_details
                : null,
          })
          if (
            responseData.data.ratings_job != undefined &&
            responseData.data.ratings_job != null
          ) {
            if (responseData.data.ratings_job.length > 0) {
              if (responseData.data.ratings_job.length > 1) {
                let arrratings = responseData.data.ratings_job
                let userrating1 = arrratings[0]
                let userrating2 = arrratings[1]

                if (this.state.login_id == userrating1.user_id) {
                  if (this.state.userrole == 'customer') {
                    this.setState({
                      provider_feedback: userrating1,
                      provider_rating: parseInt(userrating1.rating),
                      customer_feedback: userrating2,
                      customer_rating: parseInt(userrating2.rating),
                    })
                  } else {
                    this.setState({
                      customer_feedback: userrating1,
                      customer_rating: parseInt(userrating1.rating),
                      provider_feedback: userrating2,
                      provider_rating: parseInt(userrating2.rating),
                    })
                  }
                } else {
                  if (this.state.userrole == 'customer') {
                    this.setState({
                      provider_feedback: userrating2,
                      provider_rating: userrating2.rating,
                      customer_feedback: userrating1,
                      customer_rating: userrating1.rating,
                    })
                  } else {
                    this.setState({
                      provider_feedback: userrating1,
                      provider_rating: userrating1.rating,
                      customer_feedback: userrating2,
                      customer_rating: userrating2.rating,
                    })
                  }
                }
              } else {
                let arrratings = responseData.data.ratings_job
                let userrating1 = arrratings[0]

                if (this.state.login_id == userrating1.user_id) {
                  if (this.state.userrole == 'customer') {
                    this.setState({
                      provider_feedback: userrating1,
                      provider_rating: userrating1.rating,
                    })
                  } else {
                    this.setState({
                      customer_feedback: userrating1,
                      customer_rating: userrating1.rating,
                    })
                  }
                } else {
                  if (this.state.userrole == 'customer') {
                    this.setState({
                      customer_feedback: userrating1,
                      customer_rating: userrating1.rating,
                    })
                  } else {
                    this.setState({
                      provider_feedback: userrating1,
                      provider_rating: userrating1.rating,
                    })
                  }
                }
              }

              //console.log('Customer Feedback: '+JSON.stringify(this.state.customer_feedback)+' TW Feedback: '+JSON.stringify(this.state.provider_feedback))
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

  getUserProfile () {
    this.setState({showloading: true})
    var data = new FormData()
    data.append('user_id', this.state.login_id)

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
          this.setState({showloading: false, userdetails: responseData.data})

          //alert(responseData.user.id)
        } else {
          this.setState({showloading: false})
          //alert('Failed to retrieve profile details')
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
          {strings.JobDetails}
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
          contentContainerStyle={{
            alignItems: 'center',
            backgroundColor: 'transparent',
          }}
          getTextInputRefs={() => {
            return [
              this.txttitle,
              this.txtstartdate,
              this.txtenddate,
              this.txtminprice,
              this.txtmaxprice,
              this.txtAddress,
              this.txtpincode,
              this.txtdesc,
            ]
          }}>
          <View style={{width: Width(100), alignItems: 'center'}}>
            <Text
              style={{
                width: Width(90),
                fontSize: 20,
                color: '#000',
                fontWeight: '500',
                marginTop: 15,
                textAlign: 'left',
              }}>
              {strings.JobInformation}
            </Text>
            <View
              style={{
                backgroundColor: '#fff',
                marginTop: 10,
                width: Width(90),
                borderRadius: 10,
              }}>
              <Text
                style={{
                  marginBottom: 5,
                  marginTop: 10,
                  marginLeft: 10,
                  width: Width(90),
                  color: '#686868',
                  fontWeight: '600',
                  fontSize: 15,
                }}>
                {this.state.job_details.title}
              </Text>
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  height: 60,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    width: '100%',
                    marginRight: 2,
                    backgroundColor: '#fff',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginLeft: 10,
                      color: '#787878',
                      marginTop: 7,
                    }}>
                    {strings.JobFrom}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginLeft: 10,
                      color: '#A9A9A9',
                      marginTop: 7,
                    }}>
                    {this.state.job_details.creator_details != null
                      ? this.state.job_details.creator_details.first_name +
                        ' ' +
                        this.state.job_details.creator_details.last_name
                      : ''}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  height: 60,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    width: '49.5%',
                    marginRight: 2,
                    backgroundColor: '#fff',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginLeft: 10,
                      color: '#787878',
                      marginTop: 7,
                    }}>
                    {strings.StartDate}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginLeft: 10,
                      color: '#A9A9A9',
                      marginTop: 7,
                    }}>
                    {this.state.job_details.start_date}
                  </Text>
                </View>
                <View
                  style={{
                    width: '49.5%',
                    marginRight: 2,
                    backgroundColor: '#fff',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginLeft: 10,
                      color: '#787878',
                      marginTop: 7,
                    }}>
                    {strings.EndDate}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginLeft: 10,
                      color: '#A9A9A9',
                      marginTop: 7,
                    }}>
                    {this.state.job_details.end_date}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#fff',
                  height: 60,
                  marginBottom: 10,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    width: '49.5%',
                    marginRight: 2,
                    backgroundColor: '#fff',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginLeft: 10,
                      color: '#787878',
                      marginTop: 7,
                    }}>
                    {strings.MinPrice}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginLeft: 10,
                      color: '#A9A9A9',
                      marginTop: 7,
                    }}>
                    {this.state.job_details.fee_range_min != null
                      ? this.state.job_details.fee_range_min + 'USD'
                      : ''}
                  </Text>
                </View>
                <View
                  style={{
                    width: '49.5%',
                    marginRight: 2,
                    backgroundColor: '#fff',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginLeft: 10,
                      color: '#787878',
                      marginTop: 7,
                    }}>
                    {strings.MaxPrice}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      marginLeft: 10,
                      color: '#A9A9A9',
                      marginTop: 7,
                    }}>
                    {this.state.job_details.fee_range_max != null
                      ? this.state.job_details.fee_range_max + 'USD'
                      : ''}
                  </Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                width: Width(90),
                fontSize: 20,
                color: '#000',
                fontWeight: '500',
                marginTop: 15,
                textAlign: 'left',
              }}>
              {strings.Description}
            </Text>
            <View
              style={{
                backgroundColor: '#fff',
                marginTop: 10,
                width: Width(90),
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '400',
                  marginLeft: 10,
                  marginRight: 10,
                  color: '#A9A9A9',
                  marginTop: 7,
                  marginBottom: 10,
                }}>
                {this.state.job_details.description}
              </Text>
            </View>
            <View
              style={{
                width: Width(90),
                marginRight: 2,
                backgroundColor: '#fff',
                marginTop: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  marginLeft: 10,
                  color: '#787878',
                  marginTop: 10,
                }}>
                {strings.Category}
              </Text>
              {this.state.job_details.category_info != undefined &&
              this.state.job_details.category_info != null ? (
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '400',
                    marginLeft: 10,
                    color: '#A9A9A9',
                    marginTop: 7,
                    marginBottom: 10,
                  }}>
                  {this.state.job_details.category_info.name_en}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                width: Width(90),
                marginRight: 2,
                backgroundColor: '#fff',
                marginTop: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  marginLeft: 10,
                  color: '#787878',
                  marginTop: 10,
                }}>
                {strings.Location}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '400',
                  marginLeft: 10,
                  color: '#A9A9A9',
                  marginTop: 7,
                  marginBottom: 5,
                }}>
                {this.state.job_details.address}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '400',
                  marginLeft: 10,
                  color: '#A9A9A9',
                  marginBottom: 10,
                }}>
                {this.state.city_details != undefined &&
                this.state.city_details != null
                  ? this.state.city_details.name + ', '
                  : ''}
                {this.state.state_details != undefined &&
                this.state.state_details != null
                  ? this.state.state_details.name + ', '
                  : ''}
                {this.state.country_details != undefined &&
                this.state.country_details != null
                  ? this.state.country_details.name
                  : ''}
              </Text>
            </View>
            {this.state.customer_feedback != undefined &&
            this.state.customer_feedback != null ? (
              <View style={{width: Width(90), marginTop: 15}}>
                <Text
                  style={{
                    width: Width(90),
                    fontSize: 20,
                    color: '#000',
                    fontWeight: '500',
                    marginTop: 15,
                    textAlign: 'left',
                  }}>
                  {strings.FeedBackTW}
                </Text>
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
                  <View
                    style={{
                      backgroundColor: 'transparent',
                      height: 50,
                      width: Width(87),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Stars
                      default={this.state.customer_rating}
                      spacing={8}
                      count={5}
                      starSize={25}
                      fullStar={starfill}
                      disabled={true}
                      half={false}
                      emptyStar={starempty}
                    />
                  </View>
                </View>
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
                        color: '#A9A9A9',
                      }}
                      multiline={true}
                      editable={false}>
                      {this.state.customer_feedback.feedback}
                    </TextInput>
                  </View>
                </View>
              </View>
            ) : null}
            {this.state.provider_feedback != undefined &&
            this.state.provider_feedback != null ? (
              <View style={{width: Width(90), marginTop: 15, marginBottom: 30}}>
                <Text
                  style={{
                    width: Width(90),
                    fontSize: 20,
                    color: '#000',
                    fontWeight: '500',
                    marginTop: 15,
                    textAlign: 'left',
                  }}>
                  {strings.FeedbackTG}
                </Text>
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
                  <View
                    style={{
                      backgroundColor: 'transparent',
                      height: 50,
                      width: Width(87),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Stars
                      default={this.state.provider_rating}
                      spacing={8}
                      count={5}
                      starSize={25}
                      fullStar={starfill}
                      disabled={true}
                      half={false}
                      emptyStar={starempty}
                    />
                  </View>
                </View>
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
                        color: '#A9A9A9',
                      }}
                      multiline={true}
                      editable={false}>
                      {this.state.provider_feedback.feedback}
                    </TextInput>
                  </View>
                </View>
              </View>
            ) : null}
            <TouchableOpacity
              style={{
                width: Width(70),
                height: 50,
                backgroundColor: '#c80025',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 35,
                // marginBottom: 25,
                borderRadius: 25,
              }}
              onPress={() => this.viewAttachment()}>
              <Text style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
                View Attachment
              </Text>
            </TouchableOpacity>
            {this.state.userrole == 'customer' &&
            this.state.login_id == this.state.creator_details.id ? (
              this.state.job_details.status == 'hired' ? (
                <TouchableOpacity
                  style={{
                    width: Width(70),
                    height: 50,
                    backgroundColor: '#c80025',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 35,
                    marginBottom: 25,
                    borderRadius: 25,
                  }}
                  onPress={() => this.onPressedMessage()}>
                  <Text
                    style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
                    {strings.Message}
                  </Text>
                </TouchableOpacity>
              ) : this.state.job_details.status == 'delivered' ? (
                <TouchableOpacity
                  style={{
                    width: Width(70),
                    height: 50,
                    backgroundColor: '#c80025',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 35,
                    marginBottom: 25,
                    borderRadius: 25,
                  }}
                  onPress={() => this.onPressedViewDelivery()}>
                  <Text
                    style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
                    {strings.ViewDelivery}
                  </Text>
                </TouchableOpacity>
              ) : this.state.job_details.status != 'completed' ? (
                <TouchableOpacity
                  style={{
                    width: Width(70),
                    height: 50,
                    backgroundColor: '#c80025',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 35,
                    marginBottom: 25,
                    borderRadius: 25,
                  }}
                  onPress={() => this.onNextPressed()}>
                  <Text
                    style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
                    {strings.ViewJobApplications}
                  </Text>
                </TouchableOpacity>
              ) : null
            ) : this.state.has_applied == false ? (
              <TouchableOpacity
                style={{
                  width: Width(70),
                  height: 50,
                  backgroundColor: '#c80025',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 35,
                  marginBottom: 25,
                  borderRadius: 25,
                }}
                onPress={() => this.onNextPressed()}>
                <Text style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
                  {strings.ApplyforJob}
                </Text>
              </TouchableOpacity>
            ) : this.state.taskworker_details != undefined &&
              this.state.taskworker_details != null &&
              this.state.login_id == this.state.taskworker_details.id ? (
              <View
                style={{
                  width: Width(90),
                  height: 50,
                  justifyContent: 'space-around',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{
                    width: Width(40),
                    height: 50,
                    backgroundColor: '#c80025',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 35,
                    marginBottom: 25,
                    borderRadius: 25,
                  }}
                  onPress={() => this.onPressedMessage()}>
                  <Text
                    style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
                    {strings.Message}
                  </Text>
                </TouchableOpacity>
                {this.state.job_details.status == 'completed' &&
                (this.state.customer_feedback == null ||
                  this.state.provider_feedback == null) ? (
                  <TouchableOpacity
                    style={{
                      width: Width(40),
                      height: 50,
                      backgroundColor: '#c80025',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 35,
                      marginBottom: 25,
                      borderRadius: 25,
                    }}
                    onPress={() => this.onPressedFeedback()}>
                    <Text
                      style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
                      {strings.ProvideFeedback}
                    </Text>
                  </TouchableOpacity>
                ) : this.state.job_details.status != 'delivered' ? (
                  <TouchableOpacity
                    style={{
                      width: Width(40),
                      height: 50,
                      backgroundColor: '#c80025',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 35,
                      marginBottom: 25,
                      borderRadius: 25,
                    }}
                    onPress={() => this.onPressedDeliver()}>
                    <Text
                      style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
                      {strings.Deliver}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
          </View>
        </KeyboardAwareScrollView>

        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.showModal}
          style={{flex: 1, justifyContent: 'flex-end'}}
          onRequestClose={() => {
            console.log('Modal has been closed.')
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              style={{flex: 1}}
              activeOpacity={0}
              onPress={() =>
                this.setState({showModal: false})
              }></TouchableOpacity>
            <View
              style={{
                flex: 3,
                backgroundColor: 'gray',
                // borderTopLeftRadius: 15,
                // borderTopRightRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={{
                  uri: IMG_PREFIX_URL + this.state.imageNameData,
                }}
                style={{height: 500, width: 400}}></Image>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}
export default JobDetails
