import React, { Component } from "react";
import { TextInput,TouchableOpacity, Text,View, ActivityIndicator,Image, ImageBackground } from "react-native";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import strings from '../config/LanguageStrings'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Height, Width } from "../config/dimensions";
import { API_ROOT} from "../config/constant";

const ic_camera = require("../../assets/images/ic_camera.png");
const icback = require("../../assets/images/ic_back.png");
const toplogo = require("../../assets/images/trans_logo.png");
const bottompattern = require("../../assets/images/bottom_pattern.png");
const iclocationarroow = require("../../assets/images/ic_location_arrow.png");

class ResetPassword extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            device_token: '',
                code:'',
                newpass:'',
                confnewpass:'',
                showloading:false,
                email:props.navigation.state.params.email,
                user_id:props.navigation.state.params.user_id,
        }
    }

    async componentDidMount()
    {
        await AsyncStorage.getItem('device_token').then(value => {
            this.setState({device_token: value})
          })
    }

    onBackPressed(){
        this.props.navigation.goBack()
    }

    onLoginPressed() 
    {
        this.validateFields()
    }

    validateFields()
    {
        
        if (this.state.code == '')
        {
            alert(strings.EnterCodeReceived)
            return false
        }
        else if (this.state.newpass != this.state.confnewpass)
        {
            alert(strings.PassConfPassNotMatch)
            return false
        }
        else
        {
            this.verifyCodeAPICall()
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

    verifyCodeAPICall(){

        this.setState({showloading:true})

        var data = new FormData()
            data.append('email', this.state.email)
            data.append('reset_code', this.state.code)
            //alert(JSON.stringify(data))
            //return
            fetch(API_ROOT + 'check-reset-code', {
                method: 'post',
                body: data,
                headers: {
                    Authorization: 'Bearer ' + this.state.device_token,
                  },
            })
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.status == true) {
                        this.setState({showloading:false})
                        this.changePasswordAPICall()
    
                    } else {
                        this.setState({showloading:false})
                        alert('Code verification failed!')
    
                    }
                })
                .catch((error) => {
                    this.setState({showloading:false})
                    alert(error)
                })
    
    }

    changePasswordAPICall(){

        this.setState({showloading:true})

        var data = new FormData()
            data.append('user_id', this.state.user_id)
            data.append('password', this.state.newpass)
            //alert(JSON.stringify(data))
            //return
            fetch(API_ROOT + 'change-password', {
                method: 'post',
                body: data,
                headers: {
                    Authorization: 'Bearer ' + this.state.device_token,
                  },
            })
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.status == true) {
                        this.setState({showloading:false})
                        this.props.navigation.navigate('Auth')
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
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.ResetPass}</Text>
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

                <Text style = {{fontSize:20,fontWeight:'300',color:'#000', marginTop:15, textAlign:'center'}}>{strings.CreateNewPass}</Text>
                <Text style = {{fontSize:18,fontWeight:'500',color:'#000', marginTop:15, textAlign:'center', width:Width(80)}} numberOfLines = {2}>{strings.PleaseEnterCode}</Text>
                
                <View style={{backgroundColor:'transparent',height:50,marginTop:50, width:Width(90)}}>
                    <View style={{backgroundColor:'transparent',height:50,width:Width(90),flexDirection:'column'}}>
                        {/* <Text style = {{fontSize:15,fontWeight:'500',color:'#767373', marginTop:15, textAlign:'left'}}>Email Address</Text> */}
                        <TextInput style = {{marginTop:5,height:40,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.Code} onChangeText = {(code) => this.setState({code:code})}  returnKeyType={'next'}></TextInput>
                    </View>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View>
                <View style={{backgroundColor:'transparent',height:50,marginTop:10, width:Width(90)}}>
                    <View style={{backgroundColor:'transparent',height:50,width:Width(90),flexDirection:'column'}}>
                        {/* <Text style = {{fontSize:15,fontWeight:'500',color:'#767373', marginTop:15, textAlign:'left'}}>Email Address</Text> */}
                        <TextInput style = {{marginTop:5,height:40,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.NewPass} onChangeText = {(newpass) => this.setState({newpass:newpass})} secureTextEntry = {true} returnKeyType={'next'}></TextInput>
                    </View>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View>
                <View style={{backgroundColor:'transparent',height:50,marginTop:10, width:Width(90)}}>
                    <View style={{backgroundColor:'transparent',height:50,width:Width(90),flexDirection:'column'}}>
                        {/* <Text style = {{fontSize:15,fontWeight:'500',color:'#767373', marginTop:15, textAlign:'left'}}>Email Address</Text> */}
                        <TextInput style = {{marginTop:5,height:40,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.RetypeNewPass} onChangeText = {(pass) => this.setState({confnewpass:pass})} secureTextEntry = {true} returnKeyType={'next'}></TextInput>
                    </View>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View>
                
                <TouchableOpacity style = {{width:Width(90), height:50, backgroundColor:'#c80025', alignItems:'center',justifyContent:'center', marginTop:70, borderRadius:25}} onPress = { () => this.onLoginPressed()}>
                    <Text style = {{color:'#fff',fontSize:20,fontWeight:'500'}}>{strings.ResetPass}</Text>
                </TouchableOpacity>
                </KeyboardAwareScrollView>

            </View>
        );
    }

}
export default ResetPassword;