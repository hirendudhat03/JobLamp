import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, ActivityIndicator, Dimensions, TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Stars from 'react-native-stars';
import strings from '../config/LanguageStrings'

const icback = require("../../assets/images/ic_back.png");
const starfill = require("../../assets/images/ic_fill_star.png");
const starempty = require("../../assets/images/ic_empty_star.png");


let deviceWidth = Dimensions.get('window').width
import { Height, Width } from "../config/dimensions";
import { API_ROOT} from "../config/constant";

class RateUser extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            device_token: '',
            login_id:'',
            job_id:props.navigation.state.params.job_id,
            other_user_id:props.navigation.state.params.other_user_id,
            showloading:false,
            feedbacktext:'',
            rating:0
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
        if (this.state.feedbacktext == '')
        {
            alert(strings.EnterFeedback)
        }
        else
        {
            this.rateUserAPICall()
        }
    }

    rateUserAPICall()
    {
    
        this.setState({showloading:true})

        var data = new FormData()

        data.append('user_id', this.state.login_id)
        data.append('applicant_id', this.state.other_user_id)
        data.append('job_id', this.state.job_id)
        data.append('rating', this.state.rating)
        data.append('notes', this.state.feedbacktext)

        fetch(API_ROOT + 'rate-user', {
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
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.Feedback}</Text>
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
                    <Stars
                        display={this.state.rating}
                        spacing={8}
                        count={5}
                        starSize={25}
                        fullStar= {starfill}
                        disabled = {false}
                        half = {false}
                        update = { (val) => this.setState({rating: val})}
                        emptyStar= {starempty}/>
                    </View>
                </View>
                
                <View style={{backgroundColor:'#fff',height:150,marginTop:10, width:Width(90), alignItems:'center',justifyContent:'center', borderRadius:10}}>
                    <View style={{backgroundColor:'transparent',height:150,width:Width(87),flexDirection:'row',alignItems:'center'}}>
                        <TextInput style = {{height:140,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.WriteFeedback} multiline = {true} onChangeText = {(text) => this.setState({feedbacktext:text})} secureTextEntry = {false} returnKeyType={'next'}></TextInput>
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
export default RateUser;