import React, { Component } from "react";
import { TextInput,TouchableOpacity, Text,View, ActivityIndicator,Image, ImageBackground } from "react-native";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import strings from '../config/LanguageStrings'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Height, Width } from "../config/dimensions";
import { API_ROOT} from "../config/constant";


const icback = require("../../assets/images/ic_back.png");
const toplogo = require("../../assets/images/trans_logo.png");
const bottompattern = require("../../assets/images/bottom_pattern.png");
const icusername = require("../../assets/images/ic_username.png");

class ForgotPass extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
                emailaddress:'',
                device_token: '',
                showloading:false,
        }
    }

    async componentDidMount()
    {
        await AsyncStorage.getItem('device_token').then(value => {
            this.setState({device_token: value})
          })
    }

    onPressForgotPass()
    {
        this.props.navigation.navigate('ForgotPassword')
    }

    onBackPressed(){
        this.props.navigation.goBack()
    }

    onContinuePressed() 
    {
        this.validateFields()
    }

    validateFields()
    {
        if (this.validate(this.state.emailaddress) == false)
        {
            alert(strings.EnterValiEmail)
            return false
        }
        else
        {
            this.forgotPassAPICall()
        }
    }

    validate = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(reg.test(text) === false)
        {
            return false;
        }
        return true
    }

    forgotPassAPICall(){

        this.setState({showloading:true})

        var data = new FormData()
            data.append('email', this.state.emailaddress)
    
            fetch(API_ROOT + 'forgot-password', {
                method: 'post',
                body: data,
                headers: {
                    Authorization: 'Bearer ' + this.state.device_token,
                  },
            })
                .then((response) => response.json())
                .then((responseData) => {

                    //alert(JSON.stringify(responseData))

                    if (responseData.status == true) {
                        
                        this.setState({showloading:false})
                        //this.props.navigation.goBack()
                        this.props.navigation.navigate('ResetPassword',{email:this.state.emailaddress,user_id:responseData.data.user_id})
                        //alert(responseData.user.id)
                        
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


    renderTopBar()
    {
        return (
            <View style = {{backgroundColor:'#c80025', height:80, width:'100%', flexDirection:'row', justifyContent:'center'}}>
                    <TouchableOpacity style={{position:'absolute',left:15,marginTop:45,height:25,width:25,justifyContent:'center'}} onPress={() => this.onBackPressed()}>
                        <Image source = {icback} resizeMode= 'contain'/>
                    </TouchableOpacity>
                    {/* <Image source = {toplogo} resizeMode= 'contain' style = {{marginTop:45, width:'70%', height:25}}/> */}
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'500'}}>{strings.ForgotPassText}</Text>
                    {/* <TouchableOpacity style={styles.cartbutton} onPress={() => this.onCartPressed()}>
                        <Image source = {iccart} resizeMode= 'contain'/>
                    </TouchableOpacity> */}
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
                        <ActivityIndicator size="large" color="#3B5998"/>
                    </View>
                    : null
                }

                <KeyboardAwareScrollView keyboardDismissMode="interactive"  
                                 keyboardShouldPersistTaps="always"
                                    contentContainerStyle={{alignItems: 'center', flex:1}}>

                <Text style = {{fontSize:20,fontWeight:'300',color:'#000', marginTop:15, textAlign:'center'}}>{strings.ForgotPass}</Text>
                <Text style = {{fontSize:18,fontWeight:'500',color:'#000', marginTop:15, textAlign:'center', width:Width(80)}} numberOfLines = {2}>{strings.EnterRegisterEmail}</Text>
                
                {/* <View style={{backgroundColor:'transparent',height:75,marginTop:50, width:Width(90)}}>
                    <View style={{backgroundColor:'transparent',height:75,width:Width(90),flexDirection:'column'}}>
                        <Text style = {{fontSize:15,fontWeight:'500',color:'#767373', marginTop:15, textAlign:'left'}}>Email Address</Text>
                        <TextInput style = {{marginTop:5,height:40,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = "Email Address" onChangeText = {(email) => this.setState({emailaddress:email})} returnKeyType={'next'}></TextInput>
                    </View>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View> */}
                <View style={{backgroundColor:'transparent',height:50,marginTop:50, width:Width(90)}}>
                    <View style={{backgroundColor:'transparent',height:50,width:Width(90),flexDirection:'row',alignItems:'center'}}>
                        <Image source = {icusername} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image>
                        <TextInput style = {{marginTop:5,height:40,backgroundColor:'transparent',width:Width(90), marginLeft:15, fontSize:15}} placeholder = {strings.EmailAddress} onChangeText = {(email) => this.setState({emailaddress:email})} returnKeyType={'next'}></TextInput>
                    </View>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View>
                <TouchableOpacity style = {{width:Width(90), height:50, backgroundColor:'#c80025', alignItems:'center',justifyContent:'center', marginTop:70, borderRadius:25}} onPress = { () => this.onContinuePressed()}>
                    <Text style = {{color:'#fff',fontSize:20,fontWeight:'600'}}>{strings.Submit}</Text>
                </TouchableOpacity>
                </KeyboardAwareScrollView>
                {/* <ImageBackground source = {bottompattern} style = {{width:200,height:166,position:'absolute',right:0,bottom:0,zIndex:-2}} resizeMode = 'contain'></ImageBackground> */}
            </View>
        );
    }

}
export default ForgotPass;