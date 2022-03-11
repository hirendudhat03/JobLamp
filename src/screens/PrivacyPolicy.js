import React, { Component } from "react";
import { TouchableOpacity, Text,View, Image,ActivityIndicator} from "react-native";
import WebView from 'react-native-webview'
import { API_ROOT} from "../config/constant";
import { Height, Width } from "../config/dimensions";
import strings from '../config/LanguageStrings'
import AsyncStorage from '@react-native-async-storage/async-storage'
const icback = require("../../assets/images/ic_back.png");
const woman = require("../../assets/images/ic_default_user_black.png");

class PrivacyPolicy extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            privacy_policy:'',
            device_token: '',
        }
    //     this._didFocusSubscription = props.navigation.addListener('didFocus', payload => {
    //         this.loadData()
    //    })
    }

    async componentDidMount()
    {

        await AsyncStorage.getItem('device_token').then(value => {
            this.setState({device_token: value})
          })
        this.getPrivacyPolicyAPICall()
    }

    onBackPressed()
    {
        this.props.navigation.goBack()
    }

    loadData()
    {
        //this.getNotificationsList()
    }
    
    getPrivacyPolicyAPICall()
    {
        this.setState({showloading:true})

        fetch(API_ROOT + 'privacy-policy', {
            method: 'get',
            headers: {
                Authorization: 'Bearer ' + this.state.device_token,
              },
        })
            .then((response) => response.json())
            .then((responseData) => {
                //alert(JSON.stringify(responseData))
                if (responseData.status == true) {
                    //this.setState({showloading:false,privacy_policy:responseData.data.content_en})
                    if(global.language == 'en')
                    {
                        this.setState({showloading:false,privacy_policy:responseData.data.content_en})
                    }
                    else if(global.language == 'es')
                    {
                        this.setState({showloading:false,privacy_policy:responseData.data.content_es})
                    }
                    else if(global.language == 'fr')
                    {
                        this.setState({showloading:false,privacy_policy:responseData.data.content_fr})
                    }
                    else if(global.language == 'de')
                    {
                        this.setState({showloading:false,privacy_policy:responseData.data.content_de})
                    }
                    else if(global.language == 'pt')
                    {
                        this.setState({showloading:false,privacy_policy:responseData.data.content_pt})
                    }
                    else if(global.language == 'ru')
                    {
                        this.setState({showloading:false,privacy_policy:responseData.data.content_ru})
                    }
                } else {
                    this.setState({showloading:false})
                    //alert(responseData.message)
                }
            })
            .catch((error) => {
                this.setState({showloading:false})
                //alert(error)
            })
    }

    renderTopBar()
    {
        return (
            <View style = {{backgroundColor:'#c80025', height:80, width:'100%', flexDirection:'row', justifyContent:'center'}}>
                    <TouchableOpacity style={{position:'absolute',left:15,marginTop:45,height:25,width:25,justifyContent:'center'}} onPress={() => this.onBackPressed()}>
                        <Image source = {icback} resizeMode= 'contain'/>
                    </TouchableOpacity>
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'400'}}>{strings.PrivacyPolicy}</Text>
            </View>
        );
    }

    render()
    {
        return (
            <View style = {{flex:1,backgroundColor:'#fff',alignItems:'center'}}>
                {this.renderTopBar()}
                {
                    this.state.showloading == true ?
                    <View style = {{alignItems:'center',justifyContent:'center',backgroundColor:'transparent', zIndex:2, width:Width(100), height:Height(100) , position:'absolute'}}>
                        <ActivityIndicator size="large" color="#c80025"/>
                    </View>
                    : null
                }
                <View style = {{width:'100%',height:'90%',backgroundColor:'red'}}>
                    {/* <WebView source={{ uri:'http://mobillize.mobilesmartdev.in/privacy-policy'}} /> */}
                    <WebView source={{ html:this.state.privacy_policy}} />
                </View>
                
            </View>
        );
    }
}
export default PrivacyPolicy;