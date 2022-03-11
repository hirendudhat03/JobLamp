import React, { Component } from "react";
import { TextInput,TouchableOpacity, Text,View, ActivityIndicator,Image, ImageBackground } from "react-native";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import strings from '../config/LanguageStrings'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Height, Width } from "../config/dimensions";
import { API_ROOT} from "../config/constant";


const icback = require("../../assets/images/ic_back.png");
const icwithdrawal = require("../../assets/images/ic_withdrawal.png");

class WithdrawalRequest extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
                withdraw_amount:'',
                device_token: '',
                user_id:'',
                showloading:false,
        }
    }

    async componentDidMount()
    {
        await AsyncStorage.getItem('user_id').then((value)=>{
            this.setState({user_id:value})
          });

          await AsyncStorage.getItem('device_token').then(value => {
            this.setState({device_token: value})
          })
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
        if (this.state.withdraw_amount != '' && this.state.withdraw_amount != null && parseFloat(this.state.withdraw_amount) > 0)
        {
            this.withdrawalRequestAPICall()
        }
        else
        {
            alert(strings.WithdrawalAmount)
            return false
        }
    }

    withdrawalRequestAPICall(){

        this.setState({showloading:true})

        var data = new FormData()
            data.append('user_id', this.state.user_id)
            data.append('amount', this.state.withdraw_amount)
    
            fetch(API_ROOT + 'withdrawal-request', {
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
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'500'}}>{strings.WithdrawalRequest}</Text>
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
                        <ActivityIndicator size="large" color="#c80025"/>
                    </View>
                    : null
                }

                <KeyboardAwareScrollView keyboardDismissMode="interactive"  
                                 keyboardShouldPersistTaps="always"
                                    contentContainerStyle={{alignItems: 'center', flex:1}}>

                <Text style = {{fontSize:18,fontWeight:'500',color:'#000', marginTop:15, textAlign:'center', width:Width(80)}} numberOfLines = {2}>{strings.WithdrawalAmount}</Text>
                
                {/* <View style={{backgroundColor:'transparent',height:75,marginTop:50, width:Width(90)}}>
                    <View style={{backgroundColor:'transparent',height:75,width:Width(90),flexDirection:'column'}}>
                        <Text style = {{fontSize:15,fontWeight:'500',color:'#767373', marginTop:15, textAlign:'left'}}>Email Address</Text>
                        <TextInput style = {{marginTop:5,height:40,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = "Email Address" onChangeText = {(email) => this.setState({emailaddress:email})} returnKeyType={'next'}></TextInput>
                    </View>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View> */}
                <View style={{backgroundColor:'transparent',height:50,marginTop:50, width:Width(90)}}>
                    <View style={{backgroundColor:'transparent',height:50,width:Width(90),flexDirection:'row',alignItems:'center'}}>
                        <Image source = {icwithdrawal} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image>
                        <TextInput style = {{marginTop:5,height:40,backgroundColor:'transparent',width:Width(90), marginLeft:15, fontSize:15}} placeholder = {strings.Amount} onChangeText = {(amount) => this.setState({withdraw_amount:amount})} keyboardType = 'number-pad' returnKeyType={'next'}></TextInput>
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
export default WithdrawalRequest;