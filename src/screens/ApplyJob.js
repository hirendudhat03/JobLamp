import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, ActivityIndicator, Dimensions, TextInput, TouchableHighlight } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import strings from '../config/LanguageStrings'

const icback = require("../../assets/images/ic_back.png");

let deviceWidth = Dimensions.get('window').width
import { Height, Width } from "../config/dimensions";
import { API_ROOT} from "../config/constant";

class ApplyJob extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            login_id:'',
            device_token: '',
            job_id:props.navigation.state.params.job_id,
            showloading:false,
            bid_amount:'',
            covertext:'',
            is_payment_required:props.navigation.state.params.is_payment_required,
        }
    }

    async componentDidMount(){
    
        await AsyncStorage.getItem('user_id').then((value)=>{
            this.setState({login_id:value})
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
        if (this.state.bid_amount == '')
        {
            alert(strings.EnterBiddAmount)
        }
        else if (this.state.covertext == '')
        {
            alert(strings.EnterCoverText)
        }
        else
        {
            //this.applyJobAPICall()

            if(this.state.is_payment_required == false)
            {
                this.applyJobAPICall()
            }
            else
            {
                this.props.navigation.navigate('TaskworkerPayment',{job_id:this.state.job_id,cover_text:this.state.covertext,bid_amount:this.state.bid_amount,user_id:this.state.login_id})
            }

            
        }
    }

    applyJobAPICall()
    {
    
        this.setState({showloading:true})

        var data = new FormData()

        data.append('applicant_id', this.state.login_id)
        data.append('job_id', this.state.job_id)
        data.append('cover_letter', this.state.covertext)
        data.append('bid_amount', this.state.bid_amount)
        data.append('single_payment', false)

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
                    //alert(JSON.stringify(responseData))
                    this.setState({showloading:false})
                    this.props.navigation.navigate('Jobs')
                    
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
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.ApplyJob}</Text>
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
 
                <View style={{backgroundColor:'#fff',height:50,marginTop:30, width:Width(90), alignItems:'center',justifyContent:'center', borderRadius:10}}>
                    <View style={{backgroundColor:'transparent',height:50,width:Width(87),flexDirection:'row',alignItems:'center'}}>
                        <TextInput style = {{height:40,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.BiddAmountUSD} keyboardType = 'number-pad' onChangeText = {(amt) => this.setState({bid_amount:amt})} secureTextEntry = {false} returnKeyType={'next'}></TextInput>
                    </View>
                </View>
                
                <View style={{backgroundColor:'#fff',height:150,marginTop:10, width:Width(90), alignItems:'center',justifyContent:'center', borderRadius:10}}>
                    <View style={{backgroundColor:'transparent',height:150,width:Width(87),flexDirection:'row',alignItems:'center'}}>
                        <TextInput style = {{height:140,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.CoverLetter} multiline = {true} onChangeText = {(covertext) => this.setState({covertext:covertext})} secureTextEntry = {false} returnKeyType={'next'}></TextInput>
                    </View>
                </View>
                
                <TouchableOpacity style = {{width:Width(90), height:50, backgroundColor:'#c80025', alignItems:'center',justifyContent:'center', marginTop:70, borderRadius:25}} onPress = { () => this.validateFields()}>
                    <Text style = {{color:'#fff',fontSize:20,fontWeight:'500'}}>{strings.Apply}</Text>
                </TouchableOpacity>
                </KeyboardAwareScrollView>

            </View>
        );
    }
}
export default ApplyJob;