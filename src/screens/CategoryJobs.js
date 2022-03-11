import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Modal,
  TextInput,
  TouchableHighlight,
} from 'react-native'
import Moment from 'moment'
import strings from '../config/LanguageStrings'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {Height, Width} from '../config/dimensions'
import {API_ROOT} from '../config/constant'

const icback = require('../../assets/images/ic_back.png')
const ic_filter = require('../../assets/images/ic_filter.png')

let deviceWidth = Dimensions.get('window').width

class CategoryJobs extends Component {
  constructor (props) {
    super(props)
    this.state = {
      arrjobs: [],
      device_token: '',
      showloading: false,
      user_id: '',
      userrole: '',
      
      showfilter: false,
      category_id: props.navigation.state.params.category_id,
    }
  }

  async componentDidMount () {
    await AsyncStorage.getItem('device_token').then(value => {
      this.setState({device_token: value})
    })
  
      await AsyncStorage.getItem('user_id').then(value => {
          this.setState({user_id: value})
        })

    this.getJobsAPICall()
    
  }

  

  onMenuPressed () {
    this.props.navigation.goBack()
  }

  onPressedJob (item) {
    this.props.navigation.navigate('JobDetails', {job_id: item.id})
  }

  getJobsAPICall () {
    this.setState({showloading: true})

    var data = new FormData()

    data.append('status', 'opened')
    data.append('category_id', this.state.category_id)

    fetch(API_ROOT + 'get-category-jobs', {
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
          this.setState({showloading: false, arrjobs: responseData.data})
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
        alert(JSON.stringify(responseData))
        if (responseData.status == true) {
          var arrcats = responseData.data
          var arrTemp = []
          if (arrcats != null && arrcats.length > 0) {
            arrcats.map(objcat => {
              if (objcat.category_id != '') {
                arrTemp.push({label: objcat.name, value: objcat.category_id})
              }
            })
          }
          this.setState({arrcategories: arrTemp, showloading: false})
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
          {strings.Jobs}
        </Text>
      </View>
    )
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
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
        {this.renderTopBar()}
        <View style={{width: '100%', flex: 1}}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={this.state.arrjobs}
            ref={ref => {
              this.scroll = ref
            }}
            renderItem={({item, index}) => {
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
                          width: '70%',
                        }}
                        numberOfLines={2}>
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
        </View>
      </View>
    )
  }
}
export default CategoryJobs
