import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, ActivityIndicator, Dimensions} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Height, Width } from "../config/dimensions";
import { API_ROOT, IMG_PREFIX_URL, MAIN_ROOT} from "../config/constant";
import { WebView } from 'react-native-webview';
import strings from '../config/LanguageStrings'

const icback = require("../../assets/images/ic_back.png");

let deviceWidth = Dimensions.get('window').width


class Payment extends Component
{
    constructor (props)
    {
        super(props);
        this.paymentpgurl = '';
        this.state = {
            user_id:props.navigation.state.params.user_id,
            applicant_id:props.navigation.state.params.applicant_id,
            job_id:props.navigation.state.params.job_id,
        }
    }

    componentDidMount(){  
        //this.paymentpgurl = 'http://joblamp.mobilesmartdev.in/api-job-checkout/'+this.state.user_id+'/'+this.state.job_id+'/'+this.state.applicant_id
        //alert(this.paymentpgurl)
    }

    onMenuPressed()
    {
        this.props.navigation.goBack()
    }

    navigateToHome()
    {
        this.props.navigation.navigate('Home')
    }

    handleWebViewNavigationStateChange = newNavState => {
    
        const { url } = newNavState;
        if (!url) return;
        // handle certain doctypes
        //if (url.includes('/faq')) {
        
        console.log('URL:---'+url)

        if ((url == MAIN_ROOT+'api-capture-job-payment') || url.includes(MAIN_ROOT+'api-job-paypal-payment-success')) {
          //alert('After payment URL: '+url)
          
            this.navigateToHome()
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

                {/* <WebView source={{uri:MAIN_ROOT+'api-job-checkout/'+this.state.user_id+'/'+this.state.job_id+'/'+this.state.applicant_id}}  */}
                <WebView source={{uri:'http://hcuboidtech.com/joblamp/public/api-job-checkout/37/3/9'}} 
                    originWhitelist={["*"]}
                    style = {{width:'100%',height:'85%', marginTop:0,backgroundColor:'#fff'}}
                    onNavigationStateChange={this.handleWebViewNavigationStateChange}
                />

            </View>
        )
    }
}
export default Payment;