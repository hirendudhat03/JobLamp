import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  Dimensions,
  Modal,
  TextInput,
  TouchableHighlight,
} from 'react-native'
import Moment from 'moment'
import DropDownPicker from 'react-native-dropdown-picker'
import strings from '../config/LanguageStrings'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Height, Width} from '../config/dimensions'
import {API_ROOT} from '../config/constant'

const icback = require('../../assets/images/ic_back.png')
const ic_filter = require('../../assets/images/ic_filter.png')

let deviceWidth = Dimensions.get('window').width

class Jobs extends Component {
  constructor (props) {
    super(props)
    ;(this.state = {
      device_token: '',
      arrjobs: [],
      showfilter: false,
      arrcategories: [],
      category: '',

      min_price: '',

      max_price: '',
      location: '',
    }),
      (this._didFocusSubscription = props.navigation.addListener(
        'didFocus',
        payload => {
          this.loadData()
        },
      ))
  }

  async componentDidMount () {
    await AsyncStorage.getItem('user_type').then(value => {
      this.setState({userrole: value})
    })
  }

  loadData () {
    this.getJobsAPICall()
    this.getCategoriesAPICall()
  }

  onMenuPressed () {
    this.props.navigation.goBack()
  }

  onPressedJob (item) {
    this.props.navigation.navigate('JobDetails', {job_id: item.id})
  }

  onFilterPressed () {
    this.setState({showfilter: !this.state.showfilter})
  }

  validateFields () {
    if (
      this.state.category == '' &&
      this.state.min_price == '' &&
      this.state.max_price == '' &&
      this.state.location == ''
    ) {
      alert(strings.SelectOneParam)
    } else {
      this.filterJobsAPICall()
    }
  }

  clearFilters () {
    this.setState(
      {
        category: '',
        min_price: '',
        max_price: '',
        location: '',
        showfilter: false,
      },
      () => this.getJobsAPICall(),
    )
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

  filterJobsAPICall () {
    this.setState({showloading: true, showfilter: false})

    var data = new FormData()

    data.append('category_id', this.state.category)
    data.append('min_price', this.state.min_price)
    data.append('max_price', this.state.max_price)
    data.append('location', this.state.location)

    fetch(API_ROOT + 'filter-job', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.data != null) {
          //alert(JSON.stringify(responseData))
          this.setState({showloading: false, arrjobs: responseData.data})
        } else {
          alert(strings.NoJobFound)
          this.setState({showloading: false, arrjobs: []})
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
        //alert(JSON.stringify(responseData))
        if (responseData.status == true) {
          var arrcats = responseData.data
          var arrTemp = []
          if (arrcats != null && arrcats.length > 0) {
            arrcats.map(objcat => {
              if (objcat.category_id != '') {
                if (global.language == 'en') {
                  arrTemp.push({
                    label: objcat.name_en,
                    value: objcat.category_id,
                  })
                } else if (global.language == 'es') {
                  arrTemp.push({
                    label: objcat.name_es,
                    value: objcat.category_id,
                  })
                } else if (global.language == 'fr') {
                  arrTemp.push({
                    label: objcat.name_fr,
                    value: objcat.category_id,
                  })
                } else if (global.language == 'de') {
                  arrTemp.push({
                    label: objcat.name_de,
                    value: objcat.category_id,
                  })
                } else if (global.language == 'pt') {
                  arrTemp.push({
                    label: objcat.name_pt,
                    value: objcat.category_id,
                  })
                } else if (global.language == 'ru') {
                  arrTemp.push({
                    label: objcat.name_ru,
                    value: objcat.category_id,
                  })
                }
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

  renderFilterModal () {
    return (
      <Modal
        visible={this.state.showfilter}
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
          onPress={() => this.setState({showfilter: false})}></TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            width: Width(100),
            height: Height(45),
            position: 'absolute',
            top: 80,
            backgroundColor: '#fff',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <Text
            style={{
              width: Width(90),
              color: '#000',
              fontSize: 15,
              fontWeight: '600',
              marginTop: 20,
            }}>
            {strings.Category}
          </Text>
          <DropDownPicker
            items={this.state.arrcategories}
            defaultValue={this.state.category}
            containerStyle={{height: 40, width: Width(90), marginTop: 10}}
            style={{backgroundColor: '#f0f0f0'}}
            itemStyle={{
              justifyContent: 'flex-start',
            }}
            dropDownStyle={{backgroundColor: '#f0f0f0'}}
            onChangeItem={item =>
              this.setState({
                category: item.value,
              })
            }
          />
          <Text
            style={{
              width: Width(90),
              color: '#000',
              fontSize: 15,
              fontWeight: '600',
              marginTop: 20,
            }}>
            {strings.Price}
          </Text>
          <View
            style={{
              width: Width(90),
              height: 50,
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <View
              style={{
                width: Width(40),
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
                borderRadius: 5,
              }}>
              <TextInput
                style={{
                  height: 45,
                  backgroundColor: 'transparent',
                  width: Width(39),
                  fontSize: 15,
                  marginLeft: 7,
                }}
                placeholder={strings.MinPriceUsd}
                keyboardType='number-pad'
                multiline={false}
                onChangeText={min => this.setState({min_price: min})}
                secureTextEntry={false}
                returnKeyType={'next'}>
                {this.state.min_price}
              </TextInput>
            </View>
            <View
              style={{
                width: Width(40),
                height: 45,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
                borderRadius: 5,
              }}>
              <TextInput
                style={{
                  height: 45,
                  backgroundColor: 'transparent',
                  width: Width(39),
                  fontSize: 15,
                  marginLeft: 7,
                }}
                placeholder={strings.MaxPriceUsd}
                keyboardType='number-pad'
                multiline={false}
                onChangeText={max => this.setState({max_price: max})}
                secureTextEntry={false}
                returnKeyType={'next'}>
                {this.state.max_price}
              </TextInput>
            </View>
          </View>
          <Text
            style={{
              width: Width(90),
              color: '#000',
              fontSize: 15,
              fontWeight: '600',
              marginTop: 20,
            }}>
            {strings.Location}
          </Text>
          <View
            style={{
              width: Width(90),
              height: 45,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              borderRadius: 5,
              marginTop: 10,
            }}>
            <TextInput
              style={{
                height: 45,
                backgroundColor: 'transparent',
                width: Width(89),
                fontSize: 15,
                marginLeft: 7,
              }}
              placeholder='Location'
              multiline={false}
              onChangeText={loc => this.setState({location: loc})}
              secureTextEntry={false}
              returnKeyType={'next'}></TextInput>
          </View>
          <TouchableOpacity
            style={{
              width: Width(70),
              height: 50,
              backgroundColor: '#c80025',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 30,
              borderRadius: 25,
            }}
            onPress={() => this.validateFields()}>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: '500'}}>
              {strings.Apply}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: Width(40),
              height: 25,
              backgroundColor: 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}
            onPress={() => this.clearFilters()}>
            <Text style={{color: 'blue', fontSize: 15, fontWeight: '400'}}>
              {strings.ClearAll}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
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
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 15,
            marginTop: 45,
            height: 25,
            width: 25,
            justifyContent: 'center',
          }}
          onPress={() => this.onFilterPressed()}>
          <Image
            source={ic_filter}
            style={{width: 20, height: 20}}
            resizeMode='contain'
          />
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
        {this.renderTopBar()}
        {this.renderFilterModal()}
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
                            width: Width(70),
                          }}
                          numberOfLines={2}>
                          {item.title}
                        </Text>
                        {/* <Text style={{fontSize: 10,color: '#6e6e6e',fontWeight: '400',textAlign:'left',marginBottom:7,fontSize:13}} numberOfLines = {1}>{item.category}</Text> */}
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
      </View>
    )
  }
}
export default Jobs
