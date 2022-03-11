import React, { Component } from "react";
import { TextInput,TouchableOpacity, Text,View, ActivityIndicator,Image,} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import strings from '../config/LanguageStrings'

import { Height, Width } from "../config/dimensions";
import { API_ROOT} from "../config/constant";

const icmenu = require("../../assets/images/side_menu.png");
const icback = require("../../assets/images/ic_back.png");
const rightarrow = require("../../assets/images/ic_right_arrow.png");

class Setting extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            user_id:'',
            //is_from_profile : props.navigation.state.params.is_from_profile
            is_from_profile : false,
            user_role:''
        }
    }

    async componentDidMount()
    {
        await AsyncStorage.getItem('user_id').then((value)=>{
            this.setState({user_id:value})
          });

        await AsyncStorage.getItem('user_type').then((value)=>{
        this.setState({user_role:value})
        });
    }

    onPressedChangeLanguage()
    {
        this.props.navigation.navigate('LanguageSetting')
    }

    onMenuPressed(){
        if(this.state.is_from_profile)
        {
            this.props.navigation.goBack()
        }
        else
        {
            this.props.navigation.toggleDrawer()
        }
        
    }


    onPressedSubscriptions()
    {
        this.props.navigation.navigate('Subscriptions',{is_from_settings:true})
    }

    onPressedWithdrawal()
    {
        this.props.navigation.navigate('WithdrawalRequest')
    }

    onTermsPressed()
    {
        this.props.navigation.navigate('TermsConditions')
    }

    onPrivacyPressed()
    {
        this.props.navigation.navigate('PrivacyPolicy')
    }

    onAboutUsPressed()
    {
        this.props.navigation.navigate('AboutUs')
    }

    onPressedContactUs()
    {
        this.props.navigation.navigate('ContactUs')
    }

    renderTopBar()
    {
        return (
            <View style = {{backgroundColor:'#c80025', height:80, width:'100%', flexDirection:'row', justifyContent:'center'}}>
                    <TouchableOpacity style={{position:'absolute',left:15,marginTop:45,height:25,width:25,justifyContent:'center'}} onPress={() => this.onMenuPressed()}>
                        <Image source = {this.state.is_from_profile == true ? icback : icmenu} resizeMode= 'contain'/>
                    </TouchableOpacity>
                    {/* <Image source = {toplogo} resizeMode= 'contain' style = {{marginTop:50, width:'70%', height:20}}/> */}
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.Settings}</Text>
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
                                    contentContainerStyle={{alignItems: 'center', flex:1}}
                                    style = {{backgroundColor:'#e7e7eb'}}
                >
                <View style = {{width:Width(100)}}>
                    {/* <TouchableOpacity style = {{width:Width(100),height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}} activeOpacity = {0.9}>
                        <Text style = {{color:'#000',fontSize:17,fontWeight:'400',marginLeft:10}}>Account</Text>
                        <Image style = {{width:20,height:20, position:'absolute',right:10}} source = {rightarrow} resizeMode = 'contain'></Image>
                    </TouchableOpacity>
                    <View style = {{height:0.5,backgroundColor:'#3A4759',width:Width(100)}}></View> */}
                    <TouchableOpacity style = {{width:Width(100),height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}} activeOpacity = {0.9} onPress = { () => this.onPressedChangeLanguage()}>
                        <Text style = {{color:'#000',fontSize:17,fontWeight:'400',marginLeft:10}}>{strings.ChangeAppLang}</Text>
                        <Image style = {{width:20,height:20, position:'absolute',right:10}} source = {rightarrow} resizeMode = 'contain'></Image>
                    </TouchableOpacity>
                    {
                        this.state.user_role == "service_provider" ?
                        <View>
                        <View style = {{height:0.5,backgroundColor:'#3A4759',width:Width(100)}}></View>
                        <TouchableOpacity style = {{width:Width(100),height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}} activeOpacity = {0.9} onPress = { () => this.onPressedSubscriptions()}>
                            <Text style = {{color:'#000',fontSize:17,fontWeight:'400',marginLeft:10}}>{strings.Subscriptions}</Text>
                            <Image style = {{width:20,height:20, position:'absolute',right:10}} source = {rightarrow} resizeMode = 'contain'></Image>
                        </TouchableOpacity>
                        </View>
                        : null
                    }
                    {
                        this.state.user_role == "service_provider" ?
                        <View>
                        <View style = {{height:0.5,backgroundColor:'#3A4759',width:Width(100)}}></View>
                        <TouchableOpacity style = {{width:Width(100),height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}} activeOpacity = {0.9} onPress = { () => this.onPressedWithdrawal()}>
                            <Text style = {{color:'#000',fontSize:17,fontWeight:'400',marginLeft:10}}>{strings.WithdrawalRequest}</Text>
                            <Image style = {{width:20,height:20, position:'absolute',right:10}} source = {rightarrow} resizeMode = 'contain'></Image>
                        </TouchableOpacity>
                        </View>
                        : null
                    }
                    <View style = {{height:0.5,backgroundColor:'#3A4759',width:Width(100)}}></View>
                    <TouchableOpacity style = {{width:Width(100),height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}} activeOpacity = {0.9} onPress = { () => this.onTermsPressed()}>
                        <Text style = {{color:'#000',fontSize:17,fontWeight:'400',marginLeft:10}}>{strings.TermsConditions}</Text>
                        <Image style = {{width:20,height:20, position:'absolute',right:10}} source = {rightarrow} resizeMode = 'contain'></Image>
                    </TouchableOpacity>
                    <View style = {{height:0.5,backgroundColor:'#3A4759',width:Width(100)}}></View>
                    <TouchableOpacity style = {{width:Width(100),height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}} activeOpacity = {0.9} onPress = { () => this.onPrivacyPressed()}>
                        <Text style = {{color:'#000',fontSize:17,fontWeight:'400',marginLeft:10}}>{strings.PrivacyPolicy}</Text>
                        <Image style = {{width:20,height:20, position:'absolute',right:10}} source = {rightarrow} resizeMode = 'contain'></Image>
                    </TouchableOpacity>
                    <View style = {{height:0.5,backgroundColor:'#3A4759',width:Width(100)}}></View>
                    <TouchableOpacity style = {{width:Width(100),height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}} activeOpacity = {0.9} onPress = { () => this.onAboutUsPressed()}>
                        <Text style = {{color:'#000',fontSize:17,fontWeight:'400',marginLeft:10}}>{strings.AboutUs}</Text>
                        <Image style = {{width:20,height:20, position:'absolute',right:10}} source = {rightarrow} resizeMode = 'contain'></Image>
                    </TouchableOpacity>
                    <View style = {{height:0.5,backgroundColor:'#3A4759',width:Width(100)}}></View>
                    <TouchableOpacity style = {{width:Width(100),height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}} activeOpacity = {0.9} onPress = { () => this.onPressedContactUs()}>
                        <Text style = {{color:'#000',fontSize:17,fontWeight:'400',marginLeft:10}}>{strings.ContactUs}</Text>
                        <Image style = {{width:20,height:20, position:'absolute',right:10}} source = {rightarrow} resizeMode = 'contain'></Image>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style = {{width:Width(100),height:50,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}} activeOpacity = {0.9}>
                        <Text style = {{color:'#000',fontSize:17,fontWeight:'400',marginLeft:10}}>Share App</Text>
                        <Image style = {{width:20,height:20, position:'absolute',right:10}} source = {rightarrow} resizeMode = 'contain'></Image>
                    </TouchableOpacity>
                    <View style = {{height:0.5,backgroundColor:'#3A4759',width:Width(100)}}></View> */}

                </View>
                
                </KeyboardAwareScrollView>

            </View>
        );
    }

}
export default Setting;