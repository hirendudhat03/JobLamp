import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, ActivityIndicator, Dimensions, TextInput, Linking } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DropDownPicker from 'react-native-dropdown-picker';
import strings from '../config/LanguageStrings'

const icback = require("../../assets/images/ic_back.png");

let deviceWidth = Dimensions.get('window').width
import { Height, Width } from "../config/dimensions";
import { API_ROOT,MAIN_ROOT} from "../config/constant";


class ContactUs extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            login_id:'',
            device_token: '',
            showloading:false,
            querytext:'',
            querytype:'',
            email:'',
            first_name:'',
            last_name:'',
            arr_query_optioins:[{'label':strings.GeneralQuery,'value':strings.GeneralQuery},{'label':strings.PaymentIssue,'value':strings.PaymentIssue},{'label':strings.Dispute,'value':strings.Dispute},{'label':strings.Other,'value':strings.Other}]
        }
    }

    async componentDidMount(){
    
        await AsyncStorage.getItem('email').then((value)=>{
            this.setState({email:value})
          });
          await AsyncStorage.getItem('first_name').then((value)=>{
            this.setState({first_name:value})
          });
          await AsyncStorage.getItem('last_name').then((value)=>{
            this.setState({last_name:value})
          });

          await AsyncStorage.getItem('device_token').then(value => {
            this.setState({device_token: value})
          })
    }

    onBackPressed()
    {
        this.props.navigation.goBack()
    }

    validateFields()
    {
        if (this.state.querytype == '')
        {
            alert(strings.SelectQueryType)
        }
        else if (this.state.querytext == '')
        {
            alert(strings.QueryText)
        }       
        else
        {
            this.supportAPICall()
        }
    }

    supportAPICall()
    {
    
        this.setState({showloading:true})

        var data = new FormData()
        data.append('name', this.state.first_name+' '+this.state.last_name)
        data.append('email', this.state.email)
        data.append('type', this.state.querytype)
        data.append('description', this.state.querytext)

        fetch(API_ROOT + 'support-contact', {
            method: 'post',
            body: data,
            headers: {
                Authorization: 'Bearer ' + this.state.device_token,
              },
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.status == true) {
                    //alert(JSON.stringify(responseData))
                    this.setState({showloading:false})
                    alert(strings.QuerySubmitted)
                    this.props.navigation.goBack()
                    
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
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.ContactUs}</Text>
                    {/* <TouchableOpacity style={styles.cartbutton} onPress={() => this.onCartPressed()}>
                        <Image source = {iccart} resizeMode= 'contain'/>
                    </TouchableOpacity> */}
            </View>
        );
    }
    render()
    {
        return (
            <View style = {{flex:1,backgroundColor:'#f0f0f0',alignItems:'center'}}>
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

                    <DropDownPicker
                        items={this.state.arr_query_optioins}
                        defaultValue={this.state.querytype}
                        containerStyle={{height: 40,width:Width(90),marginTop:10}}
                        style={{backgroundColor: '#fff'}}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{backgroundColor: '#fff'}}
                        onChangeItem={item => this.setState({
                            querytype: item.value
                        })}
                    />
 
                <View style={{backgroundColor:'#fff',height:150,marginTop:10, width:Width(90), alignItems:'center',justifyContent:'center', borderRadius:10}}>
                    <View style={{backgroundColor:'transparent',height:150,width:Width(87),flexDirection:'row',alignItems:'center'}}>
                        <TextInput style = {{height:140,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.EnterQuery} multiline = {true} onChangeText = {(querytext) => this.setState({querytext:querytext})} secureTextEntry = {false} returnKeyType={'next'}></TextInput>
                    </View>
                </View>

                <TouchableOpacity style = {{width:Width(90), height:50, backgroundColor:'#c80025', alignItems:'center',justifyContent:'center', marginTop:70, borderRadius:25}} onPress = { () => this.validateFields()}>
                    <Text style = {{color:'#fff',fontSize:20,fontWeight:'500'}}>{strings.Submit}</Text>
                </TouchableOpacity>
                
                </KeyboardAwareScrollView>

            </View>
        );
    }
}
export default ContactUs;