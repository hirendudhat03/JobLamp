import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Linking,
  Platform,
  Alert,
} from 'react-native'
import Moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'

import {API_ROOT, IMG_PREFIX_URL} from '../config/constant'
import {Height, Width} from '../config/dimensions'
import {isRequired} from 'react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType'
import strings from '../config/LanguageStrings'
import * as RNIap from 'react-native-iap'

const icback = require('../../assets/images/ic_back.png')
const defaultuser = require('../../assets/images/ic_default_user_black.png')

let deviceWidth = Dimensions.get('window').width

const itemSubs = Platform.select({
  ios: [
    'com.job.lamp.basic.plan.month',
    'com.job.lamp.basic.plan.year',
    'com.job.lamp.vip.plan.month',
    'com.job.lamp.vip.plan.year',
  ],

  android: [
    'com.joblamp.basic.planacc',
    'com.joblamp.basic.plan.yearly',
    'com.joblamp.vip.planacc',
    'com.joblamp.vip.plan.yearly',
  ],
})

let purchaseUpdateSubscription = null

let purchaseErrorSubscription = null

class Subscriptions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      arrsubscriptions: [],
      user_id: '',
      showloading: false,
      checkPlanId: null,
      device_token: '',
      is_from_settings: props.navigation.state.params.is_from_settings,
    }
  }

  async componentDidMount () {
    await AsyncStorage.getItem('user_id').then(value => {
      this.setState({user_id: value})
    })

    await AsyncStorage.getItem('device_token').then(value => {
      this.setState({device_token: value})
    })

    this.getSubListAPICall()

    this.initilizeIAPConnection()

    

    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async purchase => {
        console.log('purchase', purchase)

        const receipt = purchase.transactionReceipt
        const productId = purchase.productId

        if (receipt) {
          try {
            if (Platform.OS === 'ios') {
              RNIap.finishTransactionIOS(purchase.transactionId)
            } else if (Platform.OS === 'android') {
              await RNIap.consumeAllItemsAndroid(purchase.purchaseToken)

              await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken)
            }

            await RNIap.finishTransaction(purchase, true)
          } catch (ackErr) {
            console.log('ackErr INAPP>>>>', ackErr)
          }
        }
      },
    )

    purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
      console.log('purchaseErrorListener INAPP>>>>', error)
    })

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove()

        purchaseUpdateSubscription = null
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove()

        purchaseErrorSubscription = null
      }
    }

    //https://www.mindbowser.com/implementing-in-app-purchase-in-react-native/
  }

  getSubscriptionsData = (data1) => {
    
    console.log('getUserDetailsAPICall : ',data)
    var temp = data1

    this.setState({showloading: true})
    var data = new FormData()
    data.append('user_id', this.state.user_id)
    //alert(this.state.user_id)
    fetch(API_ROOT + 'check-user-subscription', {
      method: 'post',
      body: data,
      headers: {
        Authorization: 'Bearer ' + this.state.device_token,
      },
    })
      .then(response => response.json())
      .then(responseData => {
        //alert(JSON.stringify(responseData))

        console.log('getSubscriptionsData responseData: ', responseData)

        if (responseData.status == true) {

          this.setState({checkPlanId: responseData.data.plan_id})
          
          

          console.log('responseData.data.plan_type : ',responseData.data.plan_type)
          
          if(responseData.data.plan_type == 'yearly'){
            
            temp.map((item, index) => {
              console.log('item.id : ',item.id)
              if (item.id == responseData.data.plan_id) {
                temp[index].select = 'yearly'
              } else {
                temp[index].select = ''
              }
            })
          }else if(responseData.data.plan_type == 'monthly') {
            temp.map((item, index) => {
              if (item.id == responseData.data.plan_id) {
                temp[index].select = 'monthly'
              } else {
                temp[index].select = ''
              }
            })
          }

          

          // console.log('monthlysubscription : ', temp)

          this.setState({showloading: false,arrsubscriptions: [...temp]})


          // this.setState({showloading: false})
          
        } else {
          this.setState({showloading: false})
          alert(strings.message)
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        alert(error)
      })
  }

  initilizeIAPConnection = async () => {
    await RNIap.initConnection()

      .then(async connection => {
        console.log('IAP result', connection)

        this.getItems()
      })

      .catch(err => {
        console.warn(`IAP ERROR ${err.code}`, err.message)
      })

    await RNIap.flushFailedPurchasesCachedAsPendingAndroid()

      .then(async consumed => {
        console.log('consumed all items?', consumed)
      })
      .catch(err => {
        console.warn(
          `flushFailedPurchasesCachedAsPendingAndroid ERROR ${err.code}`,
          err.message,
        )
      })
  }

  getItems = async () => {
    try {
      console.log('itemSubs ', itemSubs)

      const Products = await RNIap.getSubscriptions(itemSubs)

      console.log('IAP Su', Products)

      if (Products.length !== 0) {
        if (Platform.OS === 'android') {
          //Your logic here to save the products in states etc
        } else if (Platform.OS === 'ios') {
          // your logic here to save the products in states etc
          // Make sure to check the response differently for android and ios as it is different for both
        }
      }
    } catch (err) {
      console.warn('IAP error', err.code, err.message, err)

      setError(err.message)
    }
  }

  requestSubscription = async item => {
    if (item.title_en == 'Free Account') {
      if (item.select == 'monthly') {
        this.setState({showloading: true})

        var data = new FormData()

        data.append('user_id', this.state.user_id)
        data.append('planId', item.features[0].plan_id)
        data.append('billingType', item.select)
        data.append('txn_id', '')
        data.append('tra_response', '')
        data.append('amount', 0)
        data.append('device_type', Platform.OS == 'ios' ? 1 : 0)

        console.log('data : ', data)
        console.log('headers : ', {
          Authorization: 'Bearer ' + this.state.device_token,
        })

        fetch(API_ROOT + 'subscription-payment-success', {
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
              alert(responseData.message)
              this.setState({showloading: false})
            } else {
              alert(responseData.message)
              this.setState({showloading: false})
            }
          })
          .catch(error => {
            this.setState({showloading: false})
            alert(error)
          })
      } else if (item.select == 'yearly') {
      } else if (item.select == undefined) {
        alert(strings.SelectMonthlyYearly)
      }
    } else {
      this.setState({showloading: true})

      console.log('item.features[0].plan_id : ', item.features[0].plan_id)
      console.log('item.select : ', item.select)
      console.log('item.title_en : ', item.title_en)

      var sku = ''

      if (item.select == 'monthly') {
        if (item.title_en == 'Free Account') {
        } else if (item.title_en == 'Basic Account') {
          sku = Platform.select({
            ios: ['com.job.lamp.basic.plan.month'],

            android: ['com.joblamp.basic.planacc'],
          })
        } else if (item.title_en == 'VIP Account') {
          sku = Platform.select({
            ios: ['com.job.lamp.vip.plan.month'],

            android: ['com.joblamp.vip.planacc'],
          })
        }
      } else if (item.select == 'yearly') {
        if (item.title_en == 'Free Account') {
        } else if (item.title_en == 'Basic Account') {
          sku = Platform.select({
            ios: ['com.job.lamp.basic.plan.year'],

            android: ['com.joblamp.basic.plan.yearly'],
          })
        } else if (item.title_en == 'VIP Account') {
          sku = Platform.select({
            ios: ['com.job.lamp.vip.plan.year'],

            android: ['com.joblamp.vip.plan.yearly'],
          })
        }
      } else if (item.select == undefined) {
        alert(strings.SelectMonthlyYearly)
      }

      console.log('sku : ', sku[0])

      try {
        await RNIap.requestSubscription(sku[0])

          .then(async result => {
            console.log('IAP req sub', result)
            const receipt = result.transactionReceipt
            const productId = result.productId
            const transactionId = result.transactionId

            if (Platform.OS === 'android') {
              this.AfterSubscriptionAPICall(
                receipt,
                productId,
                transactionId,
                item.features[0].plan_id,
                item.select,
                item.default_price,
                item.yearly_discount,
              )

              // can do your API call here to save the purchase details of particular user
            } else if (Platform.OS === 'ios') {
              console.log(result.transactionReceipt)

              this.AfterSubscriptionAPICall(
                receipt,
                productId,
                transactionId,
                item.features[0].plan_id,
                item.select,
                item.default_price,
                item.yearly_discount,
              )
              // can do your API call here to save the purchase details of particular user
            }
          })

          .catch(err => {
            this.setState({showloading: false})

            console.log(
              `IAP req ERROR %%%%% ${err.code}`,
              err.message,
              //isModalVisible,
            )

            //setError(err.message)
          })
      } catch (error) {
        this.setState({showloading: false})

        console.log(`err ${error.code}`, error.message)

        //setError(err.message)
      }
    }
  }

  AfterSubscriptionAPICall (
    receipt,
    productId,
    transactionId,
    plan_id,
    select,
    default_price,
    yearly_discount,
  ) {
    console.log('AfterSubscriptionAPICall')

    var amount = 0

    if (Platform.OS == 'ios') {
      if (productId == 'com.job.lamp.basic.plan.month') {
        amount = default_price
      } else if (productId == 'com.job.lamp.basic.plan.year') {
        amount = default_price * 10 - yearly_discount
      } else if (productId == 'com.job.lamp.vip.plan.month') {
        amount = default_price
      } else if (productId == 'com.job.lamp.vip.plan.year') {
        amount = default_price * 10 - yearly_discount
      }
    } else {
      if (productId == 'com.joblamp.basic.planacc') {
        amount = default_price
      } else if (productId == 'com.joblamp.basic.plan.yearly') {
        amount = default_price * 10 - yearly_discount
      } else if (productId == 'com.joblamp.vip.planacc') {
        amount = default_price
      } else if (productId == 'com.joblamp.vip.plan.yearly') {
        amount = default_price * 10 - yearly_discount
      }
    }

    this.setState({showloading: true})

    var data = new FormData()

    data.append('user_id', this.state.user_id)
    data.append('planId', plan_id)
    data.append('billingType', select)
    data.append('txn_id', transactionId)
    data.append('tra_response', receipt)
    data.append('amount', amount)
    data.append('device_type', Platform.OS == 'ios' ? 1 : 0)

    console.log('data : ', data)
    console.log('headers : ', {
      Authorization: 'Bearer ' + this.state.device_token,
    })

    fetch(API_ROOT + 'subscription-payment-success', {
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
          alert(responseData.message)
          this.setState({showloading: false})
        } else {
          alert(responseData.message)
          this.setState({showloading: false})
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        alert(error)
      })
  }

  getSubListAPICall () {
    this.setState({showloading: true})

    var data = new FormData()

    data.append('user_id', this.state.user_id)
    console.log('data : ', data)
    console.log('headers : ', {
      Authorization: 'Bearer ' + this.state.device_token,
    })

    fetch(API_ROOT + 'subscription-plan-list', {
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

          this.getSubscriptionsData(responseData.data)

          // this.setState({
          //   showloading: false,
          //   arrsubscriptions: responseData.data,
          // })
        } else {
          this.setState({showloading: false, arrsubscriptions: []})
          alert(responseData.message)
        }
      })
      .catch(error => {
        this.setState({showloading: false})
        alert(error)
      })
  }

  onMenuPressed () {
    this.props.navigation.navigate('App')
  }

  onBackPressed () {
    this.props.navigation.goBack()
  }

  onPressedVisitWeb () {
    Linking.openURL('https://www.thejoblamp.com')
  }
  onPressedSubscribe () {
    alert('on Pressed Subscribe')
  }

  monthlysubscription (ind) {
    var temp = this.state.arrsubscriptions

    temp.map((item, index) => {
      if (index == ind) {
        temp[index].select = 'monthly'
      } else {
        temp[index].select = ''
      }
    })

    // console.log('monthlysubscription : ', temp)

    this.setState({arrsubscriptions: [...temp]})
  }

  yearlysubscription (ind) {
    var temp = this.state.arrsubscriptions

    temp.map((item, index) => {
      if (index == ind) {
        temp[index].select = 'yearly'
      } else {
        temp[index].select = ''
      }
    })

    // console.log('yearlysubscription : ', temp)

    this.setState({arrsubscriptions: [...temp]})
  }

  getPurchases = async () => {
    try {
      const purchases = await RNIap.getAvailablePurchases()
      const newState = {premium: false, ads: true}
      let restoredTitles = []

      purchases.forEach(purchase => {
        // switch (purchase.productId) {
        // case 'com.example.premium':
        newState.premium = true
        restoredTitles.push('\n' + purchase.productId)
        //   break

        // case 'com.example.no_ads':
        //   newState.ads = false
        //   restoredTitles.push('No Ads');
        //   break

        // case 'com.example.coins100':
        //   RNIap.consumePurchaseAndroid(purchase.purchaseToken);
        //   CoinStore.addCoins(100);
        // }
      })

      Alert.alert(
        'Restore Successful',
        'You successfully restored the following purchases: ' +
          restoredTitles.join(', '),
      )
    } catch (err) {
      console.warn(err) // standardized err.code and err.message available
      Alert.alert(err.message)
    }
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
        {this.state.is_from_settings == true ? (
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
        ) : (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 15,
              marginTop: 45,
              height: 25,
              width: 25,
              justifyContent: 'center',
              width: 100,
              alignItems: 'flex-end',
            }}
            onPress={() => this.onMenuPressed()}>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: '600'}}>
              {strings.Skip}
            </Text>
          </TouchableOpacity>
        )}

        <Text
          style={{
            marginTop: 45,
            width: '40%',
            height: 35,
            textAlign: 'center',
            color: '#fff',
            fontSize: 20,
            fontWeight: '600',
          }}>
          {strings.Subscriptions}
        </Text>
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
            <ActivityIndicator size='large' color='#c80025' />
          </View>
        ) : null}

        <View style={{width: '100%', flex: 1}}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={this.state.arrsubscriptions}
            ref={ref => {
              this.scroll = ref
            }}
            ListFooterComponent={() => {
              return (
                <View
                  style={{
                    padding: 5,
                    backgroundColor: 'transparent',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      height: 40,
                      width: Width(60),
                      borderRadius: 7,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: '#c80025',
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      marginTop: 5,
                      marginBottom: 10,
                      justifyContent: 'center',
                    }}
                    onPress={() => this.getPurchases()}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '400',
                        color: '#c80025',
                      }}>
                      {'Restore Purchase'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            }}
            ListHeaderComponent={() => {
              return (
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '400',
                    marginTop: 10,
                    marginHorizontal: 20,
                    textAlign: 'center',
                    marginVertical: 10,
                  }}>
                  {strings.SubscribeLine}
                </Text>
              )
            }}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    borderRadius: 5,
                    padding: 5,
                    backgroundColor: 'transparent',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.9}>
                  <View
                    style={{
                      backgroundColor: '#fff',
                      width: deviceWidth - 30,
                      borderRadius: 10,
                      paddingVertical: 10,
                      alignItems: 'center',
                    }}>
                    <View style={{width: '90%', justifyContent: 'center'}}>
                      <View style={{height: 30, flexDirection: 'row'}}>
                        <View style={{flex: 3}}>
                          <Text style={{fontSize: 18, fontWeight: '500'}}>
                            {global.language == 'en'
                              ? item.title_en
                              : global.language == 'es'
                              ? item.title_es
                              : global.language == 'fr'
                              ? item.title_fr
                              : global.language == 'de'
                              ? item.title_de
                              : global.language == 'pt'
                              ? item.title_pt
                              : global.language == 'ru'
                              ? item.title_ro
                              : null}
                          </Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                          {this.state.checkPlanId == item.id ? (
                            <Image
                              style={{height: 30, width: 30}}
                              source={require('../../assets/images/green_tick.png')}
                            />
                          ) : null}
                        </View>
                      </View>

                      <View
                        style={{
                          height: 40,
                          width: '100%',
                          borderRadius: 7,
                          alignItems: 'center',
                          justifyContent: 'space-around',
                          flexDirection: 'row',
                          alignSelf: 'center',
                          marginTop: 10,
                        }}>
                        <TouchableOpacity
                          onPress={() => this.monthlysubscription(index)}
                          style={[
                            {
                              height: 40,
                              width: Width(40),
                              borderRadius: 7,
                              alignItems: 'center',
                            },
                            item.select != 'monthly'
                              ? {backgroundColor: '#fcf3f3'}
                              : {backgroundColor: '#c80025'},
                          ]}>
                          <Text
                            style={[
                              {
                                fontSize: 17,
                                fontWeight: '600',
                                marginTop: 10,
                                color: '#c80025',
                              },
                              item.select != 'monthly'
                                ? {color: '#c80025'}
                                : {color: '#ffffff'},
                            ]}>
                            ${item.default_price}/{strings.month}
                          </Text>
                        </TouchableOpacity>
                        {item.title_en == 'Free Account' ? (
                          <View
                            style={[
                              {
                                height: 40,
                                width: Width(40),
                                borderRadius: 7,

                                alignItems: 'center',
                              },
                            ]}></View>
                        ) : (
                          <TouchableOpacity
                            onPress={() => this.yearlysubscription(index)}
                            style={[
                              {
                                height: 40,
                                width: Width(40),
                                borderRadius: 7,

                                alignItems: 'center',
                              },
                              item.select != 'yearly'
                                ? {backgroundColor: '#fcf3f3'}
                                : {backgroundColor: '#c80025'},
                            ]}>
                            <Text
                              style={[
                                {
                                  fontSize: 17,
                                  fontWeight: '600',
                                  marginTop: 10,
                                  color: '#c80025',
                                },
                                item.select != 'yearly'
                                  ? {color: '#c80025'}
                                  : {color: '#ffffff'},
                              ]}>
                              ${item.default_price * 10 - item.yearly_discount}/
                              {strings.year}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '400',
                          marginTop: 10,
                        }}>
                        {strings.FeaturesOf}{' '}
                        {global.language == 'en'
                          ? item.title_en
                          : global.language == 'es'
                          ? item.title_es
                          : global.language == 'fr'
                          ? item.title_fr
                          : global.language == 'de'
                          ? item.title_de
                          : global.language == 'pt'
                          ? item.title_pt
                          : global.language == 'ru'
                          ? item.title_ro
                          : null}
                      </Text>
                      {item.features.map(item => {
                        // console.log('item : ',item.content_en)
                        return (
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: '300',
                              color: '3e3e3e',
                              marginTop: 10,
                            }}>
                            {global.language == 'en'
                              ? item.content_en
                              : global.language == 'es'
                              ? item.content_es
                              : global.language == 'fr'
                              ? item.content_fr
                              : global.language == 'de'
                              ? item.content_de
                              : global.language == 'pt'
                              ? item.content_pt
                              : global.language == 'ru'
                              ? item.content_ro
                              : null}
                          </Text>
                        )
                      })}

                      <TouchableOpacity
                        style={{
                          height: 40,
                          width: Width(80),
                          borderRadius: 7,
                          backgroundColor: '#c80025',
                          alignItems: 'center',
                          marginTop: 20,
                          justifyContent: 'center',
                        }}
                        onPress={() => this.requestSubscription(item)}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: '400',
                            color: '#fff',
                          }}>
                          {strings.Subscribe}
                        </Text>
                      </TouchableOpacity>
                      {/* <Text style={{fontSize: 10,color: '#6e6e6e',fontWeight: '500',textAlign:'left',marginBottom:7,marginTop:7,fontSize:15}} numberOfLines = {1}>{item.receiver.first_name} {item.receiver.last_name}</Text> */}
                    </View>
                  </View>
                </View>
              )
            }}
            keyExtractor={(item, index) => index}
          />
        </View>
      </View>
    )
  }
}
export default Subscriptions
