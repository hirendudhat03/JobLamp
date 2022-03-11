import React, { Component } from "react";
import { TextInput,TouchableOpacity, Text,View, ActivityIndicator,Image,Modal, FlatList} from "react-native";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import { Height, Width } from "../config/dimensions";
import { API_ROOT} from "../config/constant";
import strings from '../config/LanguageStrings'

const icuncheck = require("../../assets/images/ic_uncheck.png");
const iccheck = require("../../assets/images/ic_red_check.png");

const icdownarroow = require("../../assets/images/ic_down_arrow.png");
const loginlogo = require("../../assets/images/splash_logo.png");

class SignUpStep1 extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
                email:'',
                password:'',
                firstname:'',
                lastname:'',
                mobile:'',
                city:'',
                country:'',
                state:'',
                user_type:'customer',
                showloading:false,
                show:false,
                arrcountries:[],
                arrstates:[],
                arrcities:[],
                countryid:'',
                stateid:'',
                cityid:'',
                showcountry:false,
                showstate:false,
                showcity:false,
                is_checked:false,
                objbirthdate: new Date(),
                birth_date:'',
                showstartdate:false
        }
    }

    componentDidMount()
    {
        this.getCountriesAPICall()
    }

    onPressForgotPass()
    {
        this.props.navigation.navigate('ForgotPassword')
    }

    onBackPressed(){
        this.props.navigation.goBack()
    }

    onNextPressed() 
    {
        this.validateFields()
    }

    onLoginPressed()
    {
        this.props.navigation.goBack()
    }

    onPressedBirthDate()
    {
        this.setState({showstartdate:true})
    }

    onPressedCountryDD()
    {
        if(this.state.arrcountries != undefined && this.state.arrcountries != null && this.state.arrcountries.length > 0)
        {
            this.setState({showcountry:true,showstate:false,showcity:false})
        }
        
    }

    onPressedStateDD()
    {
        if(this.state.arrstates != undefined && this.state.arrstates != null && this.state.arrstates.length > 0)
        {
            this.setState({showcountry:false,showstate:true,showcity:false})
        }
        
    }

    onPressedCityDD()
    {
        if(this.state.arrcities != undefined && this.state.arrcities != null && this.state.arrcities.length > 0)
        {
            this.setState({showcountry:false,showstate:false,showcity:true})
        }
        
    }

    onPressedTaskWorker()
    {
        this.setState({user_type:'service_provider'})
    }

    onPressedTaskGiver()
    {
        this.setState({user_type:'customer'})
    }

    onPressCountry(item)
    {
        this.setState({country:item.name,countryid:item.id,showcountry:false}, () => this.getStatesAPICall(item.id))
        //this.getStatesAPICall(item.id)
    }

    onPressState(item)
    {
        this.setState({state:item.name,stateid:item.id,showstate:false}, () => this.getCitiesAPICall(item.id))
    }

    onPressCity(item)
    {
        this.setState({city:item.name,cityid:item.id,showcity:false})
    }

    validateFields()
    {
        
        if (this.state.firstname == '')
        {
            alert(strings.EnterFirstName)
        }
        else if (this.state.lastname == '')
        {
            alert(strings.EnterLastName)
        }
        else if (this.validate(this.state.email) == false)
        {
            alert(strings.EnterValiEmail)
            return false
        }
        else if (this.state.password == '')
        {
            alert(strings.EnterPass)
        }
        else if (this.state.birth_date == '')
        {
            alert(strings.ChooseBirthDate)
        }
        else if (this.state.countryid == '')
        {
            alert(strings.EnterCountry)
        }
        else if (this.state.stateid == '')
        {
            alert(strings.EnterState)
        }
        else if (this.state.cityid == '')
        {
            alert(strings.EnterCity)
        }
        else if (this.state.is_checked == false)
        {
            alert(strings.AcceptTermsPrivacy)
        }
        else
        {
            this.signUpAPICall()
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

    signUpAPICall()
    {
        this.setState({showloading:true})

        var data = new FormData()
            data.append('first_name', this.state.firstname)
            data.append('last_name', this.state.lastname)
            data.append('email', this.state.email)
            data.append('password', this.state.password)
            data.append('mobile_number', this.state.mobile)
            data.append('country', this.state.countryid)
            data.append('state', this.state.stateid)
            data.append('city', this.state.cityid)
            data.append('user_type', this.state.user_type)
            data.append('date_of_birth', this.state.birth_date)
            data.append('device_token', global.device_token)

            // alert(JSON.stringify(data))
            // return

            fetch(API_ROOT + 'register', {
                method: 'post',
                body: data
            })
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.status == true) {
                        
                        console.log('signUpAPICall : ',responseData);

                        this.setState({showloading:false})
                        //alert(JSON.stringify(responseData))
                        
                        AsyncStorage.setItem('user_id', String(responseData.data.id))
                        AsyncStorage.setItem('first_name', String(responseData.data.first_name))
                        AsyncStorage.setItem('last_name', String(responseData.data.last_name))
                        AsyncStorage.setItem('email', String(responseData.data.email))
                        AsyncStorage.setItem('user_type', String(responseData.data.user_type))
                        AsyncStorage.setItem('mobile_number', String(responseData.data.mobile_number))
                        
                        if(responseData.data.profile_pic == null || responseData.data.profile_pic == undefined || responseData.data.profile_pic == '')
                        {
                            AsyncStorage.setItem('profilepic','')
                        }
                        else
                        {
                            AsyncStorage.setItem('profilepic', String(responseData.data.profile_pic))
                        }

                        AsyncStorage.setItem('loggedin', 'true')
                        //this.props.navigation.navigate('App')
                        this.props.navigation.navigate('Subscriptions',{is_from_settings:false})

                    } else {
                        this.setState({showloading:false})
                        alert('Failed to register')

                    }
                })
                .catch((error) => {
                    this.setState({showloading:false})
                    //alert(error)
                })
    }


    getCountriesAPICall()
    {
        this.setState({showloading:true})
    
            fetch(API_ROOT + 'countrylist', {
                method: 'get',
            })
                .then((response) => response.json())
                .then((responseData) => {

                    console.log('getCountriesAPICall : ',responseData);
                    //alert(JSON.stringify(responseData))
                    if (responseData.status == true) {

                        var arrcopycountries = responseData.data
                        var sourtedcountries = arrcopycountries.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                        this.setState({showloading:false,arrcountries:sourtedcountries})
                        //this.setState({showloading:false,arrcountries:responseData.data})

    
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

    getStatesAPICall(country_id)
    {
        this.setState({showloading:true,countryid:country_id})

        var data = new FormData()
        data.append('country_id', country_id)
            fetch(API_ROOT + 'statelist', {
                method: 'post',
                body: data
            })
                .then((response) => response.json())
                .then((responseData) => {
                    //alert(JSON.stringify(responseData))
                    if (responseData.status == true) {
                        var arrcopystates = responseData.data
                        var sourtedstates = arrcopystates.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                        this.setState({showloading:false,arrstates:sourtedstates})
    
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

    getCitiesAPICall(state_id)
    {
        this.setState({showloading:true})
        var data = new FormData()
        data.append('state_id', state_id)
        data.append('country_id', this.state.countryid)

            fetch(API_ROOT + 'citylist', {
                method: 'post',
                body: data
            })
                .then((response) => response.json())
                .then((responseData) => {
                    //alert(JSON.stringify(responseData))
                    if (responseData.status == true) {
                        var arrcopycities = responseData.data
                        var sourtedcities = arrcopycities.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                        this.setState({showloading:false,arrcities:sourtedcities})
    
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

    renderCountryPicker()
    {
        return (
            <Modal visible = {this.state.showcountry} style = {{margin:0, backgroundColor:'transparent'}} animationType="slide" transparent={true}>
                <TouchableOpacity style = {{width:'100%',height:'100%',backgroundColor:'#000',position:'absolute',opacity:0.4}} onPress = { () => this.setState({showcountry:false})}></TouchableOpacity>
                <View style = {{alignItems:'center',justifyContent:'center',width:Width(100), height:Height(30), position:'absolute',bottom:0, backgroundColor:'#fff',borderTopRightRadius:10,borderTopLeftRadius:10}}>
                <FlatList
                style = {{marginTop:10,width:Width(95), marginBottom:10}}
                data={this.state.arrcountries}
                extraData={this.state}
                renderItem={({item}) => {
                    return (
                                <View style={{width:Width(95), height:Height(5), backgroundColor:'transparent', alignItems:'center', justifyContent:'center', marginBottom:5,marginTop:5}}>
                                <TouchableOpacity style = {{backgroundColor:'#fff', height:Height(5), width:Width(95),flexDirection:'row', alignItems:'center'}} activeOpacity= {0.9} onPress = { () => this.onPressCountry(item)}>
                                        <Text style = {{marginLeft:10, color:'#000',fontSize:13,width:Width(50), fontWeight:'400'}}>{item.name}</Text>
                                        {/* {
                                            item.name == this.state.relationship ?
                                            <Image source = {iccheckmark} style = {{height:20, width:20,position:'absolute',right:2}} resizeMode='contain'/>
                                            :
                                            null
                                        } */}
                                        
                                </TouchableOpacity>
                                </View>
                            );        
                        }}
            />
                </View>
            </Modal>
        )
    }

    renderStatePicker()
    {
        return (
            <Modal visible = {this.state.showstate} style = {{margin:0, backgroundColor:'transparent'}} animationType="slide" transparent={true}>
                <TouchableOpacity style = {{width:'100%',height:'100%',backgroundColor:'#000',position:'absolute',opacity:0.4}} onPress = { () => this.setState({showstate:false})}></TouchableOpacity>
                <View style = {{alignItems:'center',justifyContent:'center',width:Width(100), height:Height(30), position:'absolute',bottom:0, backgroundColor:'#fff',borderTopRightRadius:10,borderTopLeftRadius:10}}>
                <FlatList
                style = {{marginTop:10,width:Width(95), marginBottom:10}}
                data={this.state.arrstates}
                extraData={this.state}
                renderItem={({item}) => {
                    return (
                                <View style={{width:Width(95), height:Height(5), backgroundColor:'transparent', alignItems:'center', justifyContent:'center', marginBottom:5,marginTop:5}}>
                                <TouchableOpacity style = {{backgroundColor:'#fff', height:Height(5), width:Width(95),flexDirection:'row', alignItems:'center'}} activeOpacity= {0.9} onPress = { () => this.onPressState(item)}>
                                        <Text style = {{marginLeft:10, color:'#000',fontSize:13,width:Width(50), fontWeight:'400'}}>{item.name}</Text>
                                </TouchableOpacity>
                                </View>
                            );        
                        }}
            />
                </View>
            </Modal>
        )
    }

    renderCityPicker()
    {
        return (
            <Modal visible = {this.state.showcity} style = {{margin:0, backgroundColor:'transparent'}} animationType="slide" transparent={true}>
                <TouchableOpacity style = {{width:'100%',height:'100%',backgroundColor:'#000',position:'absolute',opacity:0.4}} onPress = { () => this.setState({showcity:false})}></TouchableOpacity>
                <View style = {{alignItems:'center',justifyContent:'center',width:Width(100), height:Height(30), position:'absolute',bottom:0, backgroundColor:'#fff',borderTopRightRadius:10,borderTopLeftRadius:10}}>
                <FlatList
                style = {{marginTop:10,width:Width(95), marginBottom:10}}
                data={this.state.arrcities}
                extraData={this.state}
                renderItem={({item}) => {
                    return (
                                <View style={{width:Width(95), height:Height(5), backgroundColor:'transparent', alignItems:'center', justifyContent:'center', marginBottom:5,marginTop:5}}>
                                <TouchableOpacity style = {{backgroundColor:'#fff', height:Height(5), width:Width(95),flexDirection:'row', alignItems:'center'}} activeOpacity= {0.9} onPress = { () => this.onPressCity(item)}>
                                        <Text style = {{marginLeft:10, color:'#000',fontSize:13,width:Width(50), fontWeight:'400'}}>{item.name}</Text>
                                </TouchableOpacity>
                                </View>
                            );        
                        }}
            />
                </View>
            </Modal>
        )
    }

    renderBirthDatePicker()
    {
        return (
            <Modal visible = {this.state.showstartdate} style = {{margin:0, backgroundColor:'transparent'}} animationType="slide" transparent={true}>
                <TouchableOpacity style = {{width:'100%',height:'100%',backgroundColor:'#000',position:'absolute',opacity:0.4}} onPress = { () => this.setState({showstartdate:false})}></TouchableOpacity>
                <View style = {{alignItems:'center',justifyContent:'center',width:Width(100), height:Height(30), position:'absolute',bottom:0, backgroundColor:'#fff',borderTopRightRadius:10,borderTopLeftRadius:10}}>
                <View style = {{width:Width(100),height:40, flexDirection:'row',justifyContent:'space-between', marginTop:10}}>
                    <TouchableOpacity style = {{marginLeft:10,width:50}} onPress = { () => this.setState({showstartdate:false})}>
                        <Text style = {{color:'#c80025',fontSize:15,fontWeight:'500',width:50}}>{strings.Cancel}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {{width:50}} onPress = { () => this.setState({showstartdate:false})}>
                        <Text style = {{color:'#c80025',fontSize:15,fontWeight:'500',width:50}}>{strings.Done}</Text>
                    </TouchableOpacity>
                </View>
                <DateTimePicker
                    style = {{width:Width(100)}}
                    testID="dateTimePicker"
                    value={this.state.objbirthdate}
                    maximumDate = {new Date()}
                    mode='date'
                    is24Hour={true}
                    display='spinner'
                    onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || date;
                        let strdate = Moment(currentDate).format('yyyy-MM-DD')
                        this.setState({birth_date:strdate,objbirthdate:currentDate})
                    }}
                    />
                </View>
            </Modal>
        )
    }

    render()
    {
        return (
            <View style = {{flex:1,backgroundColor:'#fff',alignItems:'center'}}>

                {
                    this.state.showloading == true ?
                    <View style = {{alignItems:'center',justifyContent:'center',backgroundColor:'transparent', zIndex:2, width:Width(100), height:Height(100) , position:'absolute'}}>
                        <ActivityIndicator size="large" color="#3B5998"/>
                    </View>
                    : null
                }

                <KeyboardAwareScrollView keyboardDismissMode="interactive"  
                                 keyboardShouldPersistTaps="always"
                                 showsVerticalScrollIndicator = {false}
                                    contentContainerStyle={{alignItems: 'center'}}
                                 getTextInputRefs={() => {
                                   return [this.txtfname,this.txtlname,this.txtemail,this.txtpassword,this.txtmobile];
                                 }} >
                {/* <Text style = {{fontSize:20,fontWeight:'300',color:'#000', marginTop:15, textAlign:'center'}}>Sign Up</Text> */}
                
                <View style = {{zIndex:-1,marginTop:80, alignItems:'center',justifyContent:'center'}}>
                    <Image source = {loginlogo} resizeMode = 'contain' style = {{width:120,height:120,borderRadius:15}}></Image>
                    <Text style = {{fontSize:35,fontWeight:'700',color:'#000',marginTop:20}}>JobLamp</Text>
                </View>

                <View style={{backgroundColor:'transparent',height:50,marginTop:50, width:Width(90)}}>
                    <View style={{backgroundColor:'transparent',height:50,width:Width(90),flexDirection:'row',alignItems:'center'}}>
                        {/* <Image source = {icpassword} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image> */}
                        <TextInput style = {{marginTop:5,height:50,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.FirstName}  onChangeText = {(fname) => this.setState({firstname:fname,show:false})} secureTextEntry = {false} ref={(r) => { this.txtfname = r; }} returnKeyType={'next'}></TextInput>
                    </View>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View>
                <View style={{backgroundColor:'transparent',height:50,marginTop:20, width:Width(90)}}>
                    <View style={{backgroundColor:'transparent',height:50,width:Width(90),flexDirection:'row',alignItems:'center'}}>
                        {/* <Image source = {icpassword} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image> */}
                        <TextInput style = {{marginTop:5,height:50,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.LastName}  onChangeText = {(lname) => this.setState({lastname:lname,show:false})} secureTextEntry = {false} ref={(r) => { this.txtlname = r; }} returnKeyType={'next'}></TextInput>
                    </View>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View>
                <View style={{backgroundColor:'transparent',height:50,marginTop:20, width:Width(90)}}>
                    <View style={{backgroundColor:'transparent',height:50,width:Width(90),flexDirection:'row',alignItems:'center'}}>
                        {/* <Image source = {icpassword} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image> */}
                        <TextInput style = {{marginTop:5,height:50,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.EmailAddress}  onChangeText = {(email) => this.setState({email:email,show:false})} secureTextEntry = {false} ref={(r) => { this.txtemail = r; }} returnKeyType={'next'}></TextInput>
                    </View>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View>
                <View style={{backgroundColor:'transparent',height:50,marginTop:20, width:Width(90)}}>
                    <View style={{backgroundColor:'transparent',height:50,width:Width(90),flexDirection:'row',alignItems:'center'}}>
                        {/* <Image source = {icpassword} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image> */}
                        <TextInput style = {{marginTop:5,height:50,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.Password}  onChangeText = {(pass) => this.setState({password:pass,show:false})} secureTextEntry = {true} ref={(r) => { this.txtpassword = r; }} returnKeyType={'next'}></TextInput>
                    </View>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View>
                <View style={{backgroundColor:'transparent',height:50,marginTop:20, width:Width(90)}}>
                    <View style={{backgroundColor:'transparent',height:50,width:Width(90),flexDirection:'row',alignItems:'center'}}>
                        {/* <Image source = {icpassword} resizeMode = 'contain' style = {{width:20,height:20, marginLeft:10}}></Image> */}
                        <TextInput style = {{marginTop:5,height:50,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.MobileNumber} keyboardType = 'number-pad' onChangeText = {(number) => this.setState({mobile:number,show:false})} ref={(r) => { this.txtmobile = r; }} returnKeyType={'next'}></TextInput>
                    </View>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View>
                <View style={{backgroundColor:'#fff',height:50,marginTop:20, width:Width(95), zIndex:10, alignItems:'center', borderRadius:10, justifyContent:'center'}}>
                        <TouchableOpacity style={{backgroundColor:'transparent',height:50,width:Width(90),alignItems:'center', position:'absolute',top:0,left:0,bottom:0,right:0, zIndex:2}} onPress = { () => this.onPressedBirthDate()}>
                        </TouchableOpacity>
                        <TextInput style = {{height:50,backgroundColor:'transparent',width:Width(90),fontSize:15,color:'#000'}} placeholder = {strings.BirthDate} secureTextEntry = {false} editable = {false} returnKeyType={'next'}>{this.state.birth_date}</TextInput>
                        <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View>
                <View style={{backgroundColor:'transparent',height:50,marginTop:20, width:Width(95), zIndex:10, alignItems:'center'}}>
                    <TouchableOpacity style={{backgroundColor:'transparent',height:50,width:Width(90),flexDirection:'row',alignItems:'center'}} onPress = { () => this.onPressedCountryDD()}>
                        <TextInput style = {{marginTop:5,height:50,backgroundColor:'transparent',width:Width(85),fontSize:15,color:'#000'}} placeholder = {strings.Country} secureTextEntry = {false} editable = {false} returnKeyType={'next'}>{this.state.country}</TextInput>
                        <Image source = {icdownarroow} resizeMode = 'contain' style = {{width:15,height:15, marginRight:10}}></Image>
                    </TouchableOpacity>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View>
                <View style={{backgroundColor:'transparent',height:50,marginTop:20, width:Width(95), zIndex:10, alignItems:'center'}}>
                    <TouchableOpacity style={{backgroundColor:'transparent',height:50,width:Width(90),flexDirection:'row',alignItems:'center'}} onPress = { () => this.onPressedStateDD()}>
                        <TextInput style = {{marginTop:5,height:50,backgroundColor:'transparent',width:Width(85),fontSize:15,color:'#000'}} placeholder = {strings.State} secureTextEntry = {false} editable = {false} returnKeyType={'next'}>{this.state.state}</TextInput>
                        <Image source = {icdownarroow} resizeMode = 'contain' style = {{width:15,height:15, marginRight:10}}></Image>
                    </TouchableOpacity>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View>
                <View style={{backgroundColor:'transparent',height:50,marginTop:20, width:Width(95), zIndex:10, alignItems:'center'}}>
                    <TouchableOpacity style={{backgroundColor:'transparent',height:50,width:Width(90),flexDirection:'row',alignItems:'center'}} onPress = { () => this.onPressedCityDD()}>
                        <TextInput style = {{marginTop:5,height:50,backgroundColor:'transparent',width:Width(85),fontSize:15,color:'#000'}} placeholder = {strings.City} secureTextEntry = {false} editable = {false} returnKeyType={'next'}>{this.state.city}</TextInput>
                        <Image source = {icdownarroow} resizeMode = 'contain' style = {{width:15,height:15, marginRight:10}}></Image>
                    </TouchableOpacity>
                    <View style = {{height:1,width:Width(90),backgroundColor:'#C0C0C3'}}></View>
                </View>
                <View style={{backgroundColor:'transparent',height:60,marginTop:20, width:Width(90)}}>
                    <Text style = {{fontSize:15,fontWeight:'500'}}>{strings.RegisterAs}</Text>
                    <View style = {{flexDirection:'row',justifyContent:'space-around', alignItems:'center', marginTop:15}}>
                        <TouchableOpacity style = {{backgroundColor:this.state.user_type == 'customer' ? '#c80025' : '#fff',width:Width(40),height:35,borderWidth:2,borderColor:'#c80025',borderRadius:5, alignItems:'center',justifyContent:'center'}} onPress = { () => this.onPressedTaskGiver()}>
                            <Text style = {{fontSize:15,fontWeight:'500',color:this.state.user_type == 'customer' ?'#fff':'#c80025'}}>{strings.TaskGiver}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {{backgroundColor:this.state.user_type == 'customer' ? '#fff' : '#c80025',width:Width(40),height:35,borderWidth:2,borderColor:'#c80025',borderRadius:5, alignItems:'center',justifyContent:'center'}} onPress = { () => this.onPressedTaskWorker()}>
                            <Text style = {{fontSize:15,fontWeight:'500',color:this.state.user_type == 'customer' ?'#c80025':'#fff'}}>{strings.TaskWorker}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View style = {{width:Width(95), height:50, alignItems:'flex-start', flexDirection:'row',justifyContent:'flex-start',alignItems:'center', marginBottom:10, marginTop:30}}>
                    <TouchableOpacity style = {{width:25,height:25, alignItems:'center', justifyContent:'center', borderRadius:3,borderColor:'#c80025',borderWidth:1}} onPress = {() => this.setState({is_checked:!this.state.is_checked})}>
                    {
                        this.state.is_checked ?
                        <Image style = {{width:25,height:25}} source = {iccheck} resizeMode = 'cover'></Image>
                        :
                        null
                    }
                    </TouchableOpacity>
                    <Text style = {{color:'#938F8F',fontSize:14,textAlign:'left',marginLeft:10}}>{strings.TermsPrivacy}
                    <Text style = {{color:'#000',fontSize:14,textAlign:'left'}} 
                    onPress = { () => this.props.navigation.navigate('TermsConditions')}> {strings.TermsConditions}{'     '}
                    </Text>
                    <Text style = {{color:'#938F8F',fontSize:14,textAlign:'left'}}> and</Text>
                    <Text style = {{color:'#000',fontSize:14,textAlign:'left'}} 
                    onPress = { () => this.props.navigation.navigate('PrivacyPolicy')}> {strings.PrivacyPolicy}
                    </Text></Text>
                </View>

                <TouchableOpacity style = {{width:Width(90), height:50, backgroundColor:'#c80025', alignItems:'center',justifyContent:'center', marginTop:10, borderRadius:25}} onPress = {() => this.onNextPressed()}>
                    <Text style = {{color:'#fff',fontSize:20,fontWeight:'600'}}>{strings.SignUp}</Text>
                </TouchableOpacity>

                <TouchableOpacity style = {{width:Width(80), flexDirection:'row', height:30,backgroundColor:'transparent', alignItems:'center',justifyContent:'center', marginTop:20, marginBottom:30}} onPress = { () => this.onLoginPressed()}>
                    <Text style = {{fontSize:16,fontWeight:'300',color:'#938F8F'}}>{strings.AlreadyHaveAcc}</Text>
                    <Text style = {{fontSize:16,fontWeight:'400',color:'#c80025'}}> {strings.LOGIN}</Text>
                </TouchableOpacity>
                
                {this.renderCountryPicker()}
                {this.renderStatePicker()}
                {this.renderCityPicker()}
                {
                        Platform.OS == 'ios' ?
                            this.renderBirthDatePicker()
                        :
                       this.state.showstartdate && <View>
                            <DateTimePicker
                                style = {{width:Width(100)}}
                                testID="dateTimePicker"
                                value={this.state.objbirthdate}
                                maximumDate = {new Date()}
                                mode='date'
                                is24Hour={true}
                                display='spinner'
                                onChange={(event, selectedDate) => {
                                    const currentDate = selectedDate || date;
                                    let strdate = Moment(currentDate).format('yyyy-MM-DD')
                                    this.setState({birth_date:strdate,objbirthdate:currentDate,showstartdate:false})
                                }}
                            />
                        </View>
                    }
                </KeyboardAwareScrollView>

            </View>
        );
    }

}
export default SignUpStep1;