import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, ActivityIndicator, Dimensions} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Height, Width } from "../config/dimensions";
import { API_ROOT, IMG_PREFIX_URL, MAIN_ROOT} from "../config/constant";
import { WebView } from 'react-native-webview';
import strings from '../config/LanguageStrings'

const icback = require("../../assets/images/ic_back.png");

let deviceWidth = Dimensions.get('window').width


class TaskworkerPayment extends Component
{
    constructor (props)
    {
        super(props);
        this.paymentpgurl = '';
        this.state = {
            device_token: '',
            user_id:props.navigation.state.params.user_id,
            job_id:props.navigation.state.params.job_id,
            cover_text:props.navigation.state.params.cover_text,
            bid_amount:props.navigation.state.params.bid_amount,
            is_applied_once:false
        }
    }

    async componentDidMount(){  
        //this.paymentpgurl = 'http://joblamp.mobilesmartdev.in/api-job-checkout/'+this.state.user_id+'/'+this.state.job_id+'/'+this.state.applicant_id
        //alert(this.paymentpgurl)

        await AsyncStorage.getItem('device_token').then(value => {
            this.setState({device_token: value})
          })
    }

    onMenuPressed()
    {
        this.props.navigation.goBack()
    }

    applyJobAPICall()
    {
    
        this.setState({showloading:true})

        var data = new FormData()

        data.append('applicant_id', this.state.user_id)
        data.append('job_id', this.state.job_id)
        data.append('cover_letter', this.state.cover_text)
        data.append('bid_amount', this.state.bid_amount)
        data.append('single_payment', true)

        fetch(API_ROOT + 'apply-job', {
            method: 'post',
            body: data,
            headers: {
                Authorization: 'Bearer ' + this.state.device_token,
              },
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status == true) {
                    alert(strings.AppliedForJob)
                    this.setState({showloading:false,is_applied_once:true})
                    this.navigateToJobs()
                    
                } else {
                    this.setState({showloading:false})
                    alert(responseData.message)

                }
            })
            .catch((error) => {
                this.setState({showloading:false})
                alert(error)
            })
        
    }

    navigateToJobs()
    {
        this.props.navigation.navigate('Jobs')
    }

    handleWebViewNavigationStateChange = newNavState => {
    
        const { url } = newNavState;
        if (!url) return;
        // handle certain doctypes
        //if (url.includes('/faq')) {
        
        console.log('URL:---'+url)

        if (url == MAIN_ROOT+'api-capture-stripe-job-apply-payment' || (url.includes(MAIN_ROOT+'api-paypal-job-application-payment-success'))) {
          //alert('After payment URL: '+url)
          if(this.state.is_applied_once == false)
          {
            this.applyJobAPICall()  
          }
            
        }
        
      };

    renderTopBar()
    {
        return (
            <View style = {{backgroundColor:'#c80025', height:80, width:'100%', flexDirection:'row', justifyContent:'center'}}>
                    <TouchableOpacity style={{position:'absolute',left:15,marginTop:45,height:25,width:25,justifyContent:'center'}} onPress={() => this.onMenuPressed()}>
                        <Image source = {icback} resizeMode= 'contain'/>
                    </TouchableOpacity>
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.Payment}</Text>
                    {/* <TouchableOpacity style={styles.cartbutton} onPress={() => this.onCartPressed()}>
                        <Image source = {iccart} resizeMode= 'contain'/>
                    </TouchableOpacity> */}
            </View>
        );
    }

    render()
    {
        return(
            <View style = {{flex:1, backgroundColor:'#f0f0f0'}}>
                {this.renderTopBar()}
                {
                    this.state.showloading == true ?
                    <View style = {{alignItems:'center',justifyContent:'center',backgroundColor:'transparent', zIndex:2, width:Width(100), height:Height(100) , position:'absolute'}}>
                        <ActivityIndicator size="large" color="#3B5998"/>
                    </View>
                    : null
                }

                {/* <WebView source={{uri:'http://joblamp.mobilesmartdev.in/api-job-application-checkout/'+this.state.user_id+'/'+this.state.job_id}} 
                    originWhitelist={["*"]}
                    style = {{width:'100%',height:'85%', marginTop:0,backgroundColor:'#fff'}}
                    onNavigationStateChange={this.handleWebViewNavigationStateChange}
                /> */}

                <WebView source={{uri:MAIN_ROOT+'api-job-application-checkout/'+this.state.user_id+'/'+this.state.job_id}} 
                    originWhitelist={["*"]}
                    style = {{width:'100%',height:'85%', marginTop:0,backgroundColor:'#fff'}}
                    onNavigationStateChange={this.handleWebViewNavigationStateChange}
                />

            </View>
        )
    }
}
export default TaskworkerPayment;