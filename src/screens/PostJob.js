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
  FlatList,
  PermissionsAndroid,
  Platform,
} from 'react-native'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import DateTimePicker from '@react-native-community/datetimepicker'
import Moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import strings from '../config/LanguageStrings'

const icback = require('../../assets/images/ic_back.png')
const icdownarroow = require('../../assets/images/ic_down_arrow.png')

let deviceWidth = Dimensions.get('window').width
import {Height, Width} from '../config/dimensions'
import {API_ROOT} from '../config/constant'
import ActionSheet from 'react-native-actionsheet'
import DocumentPicker from 'react-native-document-picker'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'

const options = {
    mediaType: 'photo',
    maxWidth: 512,
    maxHeight: 512,
    quality: 1,
    includeBase64: false,
    saveToPhotos: true,
  }

class PostJob extends Component {
  constructor (props) {
    super(props)
    ;(this.state = {
      device_token: '',
      imageUrl:'',
      user_id: '',
      title: '',
      category: '',
      start_date: '',
      end_date: '',
      min_price: '',
      max_price: '',
      address: '',
      country: '',
      state: '',
      city: '',
      singleDocFile:'',
      pincode: '',
      desc: '',
      arrcategories: [],
      showloading: false,
      showcategory: false,
      showcountry: false,
      showstate: false,
      showcity: false,
      showstartdate: false,
      showenddate: false,
      arrcountries: [],
      arrstates: [],
      arrcities: [],
      countryid: '',
      objstartdate: new Date(),
      objenddate: new Date(),
      categoryname: '',
      ImageNameSave:'Attachment'
    }),
      (this._didFocusSubscription = props.navigation.addListener(
        'didFocus',
        payload => {
          this.loadData()
        },
      ))
  }

  async documentPickerOpen () {
    
        //Opening Document Picker for selection of one file
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
            //There can me more options as well
            // DocumentPicker.types.allFiles
            // DocumentPicker.types.images
            // DocumentPicker.types.plainText
            // DocumentPicker.types.audio
            // DocumentPicker.types.pdf
          });
          //Printing the log realted to the file
          console.log('res : ' + JSON.stringify(res));
          console.log('URI : ' + res.uri);
          console.log('Type : ' + res.type);
          console.log('File Name : ' + res.name);
          console.log('File Size : ' + res.size);
          //Setting the state to show single file attributes
          this.setState({imageUrl : res.uri})
          this.setState({ImageNameSave : res.name})
        } catch (err) {
          //Handling any exception (If any)
          if (DocumentPicker.isCancel(err)) {
            //If user canceled the document selection
            alert('Canceled from single doc picker');
          } else {
            //For Unknown Error
            alert('Unknown Error: ' + JSON.stringify(err));
            throw err;
          }
        }
    
  }

  imagePickerOpen () {
    if (Platform.OS === 'android') {
        PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]).then(result => {
          if (
            result['android.permission.READ_EXTERNAL_STORAGE'] &&
            result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
          ) {
            launchImageLibrary(options, response => {
              console.log('response => ', response)
  
              if (response.didCancel) {
                console.log('User cancelled image picker')
              } else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
              } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton)
  
                alert(response.customButton)
              } else {
                
                // setImage(response.assets[0].uri)
                this.setState({imageUrl : response.assets[0].uri})
  
                var path = response.assets[0].uri
                let imageName = ''
  
                var getFilename = path.split('/')
                imageName = getFilename[getFilename.length - 1]
                var extension = imageName.split('.')[1]
                //imageName = imageName.split('.').slice(0, -1).join('.')
  
                imageName = new Date().getTime() + '.' + extension
  
                this.setState({ImageNameSave : imageName})
                // setImageName(imageName)
  
                // // var item = {
                // //   Default_Value: path,
                // //   FileName: imageName,
                // //   Extension: '.' + extension,
                // // }
  
                // RNFS.readFile(path, 'base64')
                //   .then(res => {
                //     //res = 'data:' + this.state.imgObj.type + ';' + 'base64,' + res
                //     console.log('res : ', res)
  
                //     var item = {
                //       Default_Value: res,
                //       FileName: imageName,
                //       Extension: '.' + extension,
                //     }
  
                //     props.onSelectData(item)
                //   })
                //   .catch(err => {
                //     console.log('err : ', err)
                //   })
              }
  
              
            })
          } else if (
            result['android.permission.READ_EXTERNAL_STORAGE'] ||
            result['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              'never_ask_again'
          ) {
            alert(
              'Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue',
            )
          }
        })
      } else {
        this.handlephotoPermission()
      }
  }

  async handlephotoPermission () {
    const res = await check(PERMISSIONS.IOS.PHOTO_LIBRARY)
    console.log('res => ', res)

    if (res === RESULTS.GRANTED) {
      launchImageLibrary(options, response => {
        console.log(response)
        setImage(response.uri)
      })
    } else if (res === RESULTS.DENIED) {
      const res2 = await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
      if (res2 === RESULTS.GRANTED) {
        launchImageLibrary(options, response => {
          console.log(response)
          setImage(response.uri)
        })
      }
    } else if (res === RESULTS.LIMITED) {
      launchImageLibrary(options, response => {
        console.log(response)
        setImage(response.uri)
      })
    }
  }

  async componentDidMount () {
    await AsyncStorage.getItem('user_id').then(value => {
      this.setState({user_id: value})
    })

    await AsyncStorage.getItem('device_token').then(value => {
      this.setState({device_token: value})
    })
  }

  loadData () {
    this.getCategoriesAPICall()
    this.getCountriesAPICall()
  }

  onPressedCategory () {
    this.setState({showcategory: true})
  }

  onPressCategory (item) {
    if (global.language == 'en') {
      this.setState({
        category: item.category_id,
        categoryname: item.name_en,
        showcategory: false,
      })
    } else if (global.language == 'es') {
      this.setState({
        category: item.category_id,
        categoryname: item.name_es,
        showcategory: false,
      })
    } else if (global.language == 'fr') {
      this.setState({
        category: item.category_id,
        categoryname: item.name_fr,
        showcategory: false,
      })
    } else if (global.language == 'de') {
      this.setState({
        category: item.category_id,
        categoryname: item.name_de,
        showcategory: false,
      })
    } else if (global.language == 'pt') {
      this.setState({
        category: item.category_id,
        categoryname: item.name_pt,
        showcategory: false,
      })
    } else if (global.language == 'ru') {
      this.setState({
        category: item.category_id,
        categoryname: item.name_ru,
        showcategory: false,
      })
    }
  }

  onPressedStartDate () {
    this.setState({showstartdate: true})
  }

  showActionSheet = () => {
    this.ActionSheet.show()
  }

  onPressedEndDate () {
    this.setState({showenddate: true})
  }

  onPressCountry (item) {
    this.setState({country: item.name, showcountry: false}, () =>
      this.getStatesAPICall(item.id),
    )
  }

  onPressState (item) {
    this.setState({state: item.name, showstate: false}, () =>
      this.getCitiesAPICall(item.id),
    )
  }

  onPressCity (item) {
    this.setState({city: item.name, showcity: false})
  }

  onPressedCountry () {
    if (
      this.state.arrcountries != undefined &&
      this.state.arrcountries != null &&
      this.state.arrcountries.length > 0
    ) {
      this.setState({showcountry: true})
    }
  }

  onPressedState () {
    if (
      this.state.arrstates != undefined &&
      this.state.arrstates != null &&
      this.state.arrstates.length > 0
    ) {
      this.setState({showstate: true})
    }
  }

  onPressedCity () {
    if (
      this.state.arrcities != undefined &&
      this.state.arrcities != null &&
      this.state.arrcities.length > 0
    ) {
      this.setState({showcity: true})
    }
  }

  onMenuPressed () {
    this.props.navigation.goBack()
  }

  validateFields () {
    if (this.state.title == '') {
      alert(strings.EnterTitle)
    } else if (this.state.category == '') {
      alert(strings.EnterCategory)
    } else if (this.state.start_date == '') {
      alert(strings.EnterStartDate)
    } else if (this.state.min_price == '') {
      alert(strings.EnterMinBudget)
    } else if (this.state.min_price < '20') {
      alert('Please Enter Min 20$.')
    } else if (this.state.desc == '') {
      alert(strings.EnterDesc)
    } else {
      this.postJobAPICall()
    }
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

  postJobAPICall () {
    this.setState({showloading: true})

    var data = new FormData()

    data.append('user_id', this.state.user_id)
    data.append('title', this.state.title)
    data.append('description', this.state.desc)
    data.append('start_date', this.state.start_date)
    data.append('end_date', this.state.end_date)
    data.append('category', this.state.category)
    data.append('fee_range_min', this.state.min_price)
    data.append('fee_range_max', this.state.max_price)
    data.append('service_provider_rating', 0)
    data.append('address', this.state.address)
    data.append('country', this.state.country)
    data.append('state', this.state.state)
    data.append('city', this.state.city)
    data.append('pincode', this.state.pincode)
    
    data.append('attachment', {
        name: 'event.jpg',
        type: 'image/jpg',
        uri:
          Platform.OS === 'android'
            ? this.state.imageUrl
            : this.state.imageUrl.replace('file://', ''),
      })

    //alert(JSON.stringify(data))
    //return

    fetch(API_ROOT + 'post-job', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('responseData : ', responseData)
        if (responseData.status == true) {
          this.setState({showloading: false})
          this.props.navigation.goBack()
        } else {
          this.setState({showloading: false})
          alert(responseData.message)
        }
      })
      .catch(error => {
        console.log('error : ', error)
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
          {strings.PostJob}
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

  renderCategoryModal () {
    return (
      <Modal
        visible={this.state.showcategory}
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
            this.setState({showcategory: false})
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
          {/* <DateTimePicker
                    style = {{width:Width(100)}}
                    testID="dateTimePicker"
                    value={new Date()}
                    mode='datetime'
                    is24Hour={true}
                    display='spinner'
                    onChange={() => this.onDateChange()}
                    /> */}
          <FlatList
            style={{marginTop: 10, width: Width(95), marginBottom: 10}}
            data={this.state.arrcategories}
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
                    onPress={() => this.onPressCategory(item)}>
                    {global.language == 'en' ? (
                      <Text
                        style={{
                          marginLeft: 10,
                          color: '#000',
                          fontSize: 13,
                          width: Width(50),
                          fontWeight: '400',
                        }}>
                        {item.name_en}
                      </Text>
                    ) : global.language == 'es' ? (
                      <Text
                        style={{
                          marginLeft: 10,
                          color: '#000',
                          fontSize: 13,
                          width: Width(50),
                          fontWeight: '400',
                        }}>
                        {item.name_es}
                      </Text>
                    ) : global.language == 'fr' ? (
                      <Text
                        style={{
                          marginLeft: 10,
                          color: '#000',
                          fontSize: 13,
                          width: Width(50),
                          fontWeight: '400',
                        }}>
                        {item.name_fr}
                      </Text>
                    ) : global.language == 'de' ? (
                      <Text
                        style={{
                          marginLeft: 10,
                          color: '#000',
                          fontSize: 13,
                          width: Width(50),
                          fontWeight: '400',
                        }}>
                        {item.name_de}
                      </Text>
                    ) : global.language == 'pt' ? (
                      <Text
                        style={{
                          marginLeft: 10,
                          color: '#000',
                          fontSize: 13,
                          width: Width(50),
                          fontWeight: '400',
                        }}>
                        {item.name_pt}
                      </Text>
                    ) : global.language == 'ru' ? (
                      <Text
                        style={{
                          marginLeft: 10,
                          color: '#000',
                          fontSize: 13,
                          width: Width(50),
                          fontWeight: '400',
                        }}>
                        {item.name_ru}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                </View>
              )
            }}
          />
        </View>
      </Modal>
    )
  }

  renderStartDatePicker () {
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
            value={this.state.objstartdate}
            mode='date'
            is24Hour={true}
            display='spinner'
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || date
              let strdate = Moment(currentDate).format('yyyy-MM-DD')
              this.setState({start_date: strdate, objstartdate: currentDate})
            }}
          />
        </View>
      </Modal>
    )
  }

  renderEndtDatePicker () {
    return (
      <Modal
        visible={this.state.showenddate}
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
            this.setState({showenddate: false})
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
              onPress={() => this.setState({showenddate: false})}>
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
              onPress={() => this.setState({showenddate: false})}>
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
            value={this.state.objenddate}
            minimumDate={this.state.objstartdate}
            mode='date'
            is24Hour={true}
            display='spinner'
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || date
              let strdate = Moment(currentDate).format('yyyy-MM-DD')
              this.setState({end_date: strdate, objenddate: currentDate})
            }}
          />
        </View>
      </Modal>
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
          <View
            style={{
              backgroundColor: '#fff',
              height: 50,
              marginTop: 10,
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
              {/* <Image source = {icpassword} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image> */}
              <TextInput
                style={{
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  fontSize: 15,
                }}
                placeholder={strings.JobTitle}
                onChangeText={title =>
                  this.setState({title: title, show: false})
                }
                secureTextEntry={false}
                returnKeyType={'next'}></TextInput>
            </View>
            {/* <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View> */}
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              height: 50,
              marginTop: 15,
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
                width: Width(87),
                flexDirection: 'row',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 2,
              }}
              onPress={() => this.onPressedCategory()}></TouchableOpacity>
            <TextInput
              style={{
                height: 40,
                backgroundColor: 'transparent',
                width: Width(87),
                fontSize: 15,
                color: '#000',
              }}
              placeholder={strings.Category}
              secureTextEntry={false}
              editable={false}
              returnKeyType={'next'}>
              {this.state.categoryname}
            </TextInput>
            <Image
              source={icdownarroow}
              resizeMode='contain'
              style={{
                width: 15,
                height: 15,
                position: 'absolute',
                right: 12,
                top: 17,
              }}></Image>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              height: 50,
              marginTop: 15,
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
                width: Width(87),
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: 2,
              }}
              onPress={() => this.onPressedStartDate()}></TouchableOpacity>
            <TextInput
              style={{
                height: 40,
                backgroundColor: 'transparent',
                width: Width(87),
                fontSize: 15,
                color: '#000',
              }}
              placeholder={strings.StartDate}
              secureTextEntry={false}
              editable={false}
              returnKeyType={'next'}>
              {this.state.start_date}
            </TextInput>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              height: 50,
              marginTop: 15,
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
                width: Width(87),
                flexDirection: 'row',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: 2,
              }}
              onPress={() => this.onPressedEndDate()}></TouchableOpacity>
            <TextInput
              style={{
                marginTop: 5,
                height: 40,
                backgroundColor: 'transparent',
                width: Width(87),
                fontSize: 15,
                color: '#000',
              }}
              placeholder={strings.EndDate}
              secureTextEntry={false}
              editable={false}
              returnKeyType={'next'}>
              {this.state.end_date}
            </TextInput>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              height: 50,
              marginTop: 10,
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
              <TextInput
                style={{
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  fontSize: 15,
                }}
                placeholder={strings.MinPriceUsd}
                keyboardType='number-pad'
                onChangeText={minprice =>
                  this.setState({min_price: minprice, show: false})
                }
                secureTextEntry={false}
                returnKeyType={'next'}></TextInput>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              height: 50,
              marginTop: 10,
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
              <TextInput
                style={{
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  fontSize: 15,
                }}
                placeholder={strings.MaxPriceUsd}
                keyboardType='number-pad'
                onChangeText={maxprice =>
                  this.setState({max_price: maxprice, show: false})
                }
                secureTextEntry={false}
                returnKeyType={'next'}></TextInput>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              height: 50,
              marginTop: 10,
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
              <TextInput
                style={{
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  fontSize: 15,
                }}
                placeholder={strings.Address}
                onChangeText={address =>
                  this.setState({address: address, show: false})
                }
                secureTextEntry={false}
                returnKeyType={'next'}></TextInput>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              height: 50,
              marginTop: 15,
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
                width: Width(87),
                flexDirection: 'row',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                zIndex: 2,
              }}
              onPress={() => this.onPressedCountry()}></TouchableOpacity>
            <Image
              source={icdownarroow}
              resizeMode='contain'
              style={{
                width: 15,
                height: 15,
                position: 'absolute',
                right: 12,
                top: 17,
              }}></Image>
            <TextInput
              style={{
                height: 40,
                backgroundColor: 'transparent',
                width: Width(87),
                fontSize: 15,
                color: '#000',
              }}
              placeholder={strings.Country}
              secureTextEntry={false}
              editable={false}
              returnKeyType={'next'}>
              {this.state.country}
            </TextInput>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              height: 50,
              marginTop: 15,
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
                width: Width(87),
                flexDirection: 'row',
                alignItems: 'center',
                position: 'absolute',
                right: 0,
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 2,
              }}
              onPress={() => this.onPressedState()}></TouchableOpacity>
            <TextInput
              style={{
                height: 40,
                backgroundColor: 'transparent',
                width: Width(87),
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
              style={{
                width: 15,
                height: 15,
                position: 'absolute',
                right: 12,
                top: 17,
              }}></Image>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              height: 50,
              marginTop: 15,
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
                width: Width(87),
                flexDirection: 'row',
                alignItems: 'center',
                position: 'absolute',
                right: 0,
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 2,
              }}
              onPress={() => this.onPressedCity()}></TouchableOpacity>
            <TextInput
              style={{
                height: 40,
                backgroundColor: 'transparent',
                width: Width(87),
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
              style={{
                width: 15,
                height: 15,
                position: 'absolute',
                right: 12,
                top: 17,
              }}></Image>
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              height: 50,
              marginTop: 10,
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
              <TextInput
                style={{
                  height: 40,
                  backgroundColor: 'transparent',
                  width: Width(90),
                  fontSize: 15,
                }}
                placeholder={strings.Pincode}
                onChangeText={pincode =>
                  this.setState({pincode: pincode, show: false})
                }
                secureTextEntry={false}
                returnKeyType={'next'}></TextInput>
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
                }}
                placeholder={strings.Description}
                multiline={true}
                onChangeText={desc => this.setState({desc: desc, show: false})}
                secureTextEntry={false}
                returnKeyType={'next'}></TextInput>
            </View>
          </View>
          <TouchableOpacity
            onPress={this.showActionSheet}
            style={{
              backgroundColor: '#fff',
              height: 50,
              marginTop: 10,
              width: Width(90),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <Text
              style={{
                //   height: 50,
                color: 'gray',
                width: Width(90),
                fontSize: 15,
                marginLeft: 20,
              }}>
              {this.state.ImageNameSave}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: Width(90),
              height: 50,
              backgroundColor: '#c80025',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 35,
              marginBottom: 25,
              borderRadius: 25,
            }}
            onPress={() => this.validateFields()}>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
              {strings.PostJob}
            </Text>
          </TouchableOpacity>
          {this.renderCategoryModal()}
          {this.renderCountryPicker()}
          {this.renderStatePicker()}
          {this.renderCityPicker()}
          {Platform.OS == 'ios'
            ? this.renderStartDatePicker()
            : this.state.showstartdate && (
                <View>
                  <DateTimePicker
                    style={{width: Width(100)}}
                    testID='dateTimePicker'
                    value={this.state.objstartdate}
                    mode='date'
                    is24Hour={true}
                    display='spinner'
                    onChange={(event, selectedDate) => {
                      const currentDate = selectedDate || date
                      let strdate = Moment(currentDate).format('yyyy-MM-DD')
                      this.setState({
                        start_date: strdate,
                        objstartdate: currentDate,
                        showstartdate: false,
                        showenddate: false,
                      })
                    }}
                  />
                </View>
              )}
          {Platform.OS == 'ios'
            ? this.renderEndtDatePicker()
            : this.state.showenddate && (
                <View>
                  <DateTimePicker
                    style={{width: Width(100)}}
                    testID='dateTimePicker'
                    value={this.state.objenddate}
                    minimumDate={this.state.objstartdate}
                    mode='date'
                    is24Hour={true}
                    display='spinner'
                    onChange={(event, selectedDate) => {
                      const currentDate = selectedDate || date
                      let strdate = Moment(currentDate).format('yyyy-MM-DD')
                      this.setState({
                        end_date: strdate,
                        objenddate: currentDate,
                        showstartdate: false,
                        showenddate: false,
                      })
                    }}
                  />
                </View>
              )}
        </KeyboardAwareScrollView>
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={'Which one do you like ?'}
          options={['Choose document', 'Choose Photo', 'cancel']}
          cancelButtonIndex={2}
          //   destructiveButtonIndex={1}
          onPress={index => {
            if (index == 0) {
              this.documentPickerOpen()
            } else if (index == 1) {
              this.imagePickerOpen()
            }
            /* do something */
          }}
        />
      </View>
    )
  }
}
export default PostJob
