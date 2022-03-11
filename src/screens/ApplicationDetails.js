import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, ActivityIndicator, Dimensions, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Height, Width } from "../config/dimensions";
import { API_ROOT} from "../config/constant";

import strings from '../config/LanguageStrings'

const icback = require("../../assets/images/ic_back.png");

let deviceWidth = Dimensions.get('window').width

class ApplicationDetails extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            login_id:'',
            offer_details:props.navigation.state.params.offer_details,
            job_id:props.navigation.state.params.job_id,
            showloading:false,
        }
    }

    async componentDidMount(){
        //alert(JSON.stringify(this.state.offer_details))
        await AsyncStorage.getItem('user_id').then((value)=>{
            this.setState({login_id:value})
          });
    }

    onBackPressed()
    {
        this.props.navigation.goBack()
    }

    onPressedHire()
    {
        this.props.navigation.navigate('Payment',{user_id:this.state.login_id,applicant_id:this.state.offer_details.id,job_id:this.state.job_id})
    }

    renderTopBar()
    {
        return (
            <View style = {{backgroundColor:'#c80025', height:80, width:'100%', flexDirection:'row', justifyContent:'center'}}>
                    <TouchableOpacity style={{position:'absolute',left:15,marginTop:45,height:25,width:25,justifyContent:'center'}} onPress={() => this.onBackPressed()}>
                        <Image source = {icback} resizeMode= 'contain'/>
                    </TouchableOpacity>
                    {/* <Image source = {toplogo} resizeMode= 'contain' style = {{marginTop:45, width:'70%', height:25}}/> */}
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.ApplicationDetails}</Text>
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
                    <View style={{backgroundColor:'transparent',height:50,width:Width(87),alignItems:'center',justifyContent:'center'}}>
                        <Text style = {{width:Width(90),fontSize:15, marginLeft:10}}>{strings.BidAmount} {this.state.offer_details.bid_amount} USD</Text>
                    </View>
                </View>
                
                <View style={{backgroundColor:'#fff',height:150,marginTop:10, width:Width(90), alignItems:'center',justifyContent:'center', borderRadius:10}}>
                    <View style={{backgroundColor:'transparent',height:150,width:Width(87),flexDirection:'row',alignItems:'center'}}>
                        <Text style = {{height:140,width:Width(90),fontSize:15}}>{this.state.offer_details.cover_letter}</Text>
                    </View>
                </View>
                
                <TouchableOpacity style = {{width:Width(90), height:50, backgroundColor:'#c80025', alignItems:'center',justifyContent:'center', marginTop:70, borderRadius:25}} onPress = { () => this.onPressedHire()}>
                    <Text style = {{color:'#fff',fontSize:20,fontWeight:'500'}}>{strings.Hire}</Text>
                </TouchableOpacity>
                </KeyboardAwareScrollView>

            </View>
        );
    }
}
export default ApplicationDetails;