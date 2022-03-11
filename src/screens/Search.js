
import React, { Component } from "react";
import { View, TouchableOpacity,Image, Text, FlatList, Dimensions, TextInput,ActivityIndicator, TouchableHighlight } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Height, Width } from "../config/dimensions";
import { API_ROOT, IMG_PREFIX_URL} from "../config/constant";
import Moment from 'moment'
import strings from '../config/LanguageStrings'

const icback = require("../../assets/images/ic_back.png");
const defaultuser = require("../../assets/images/ic_default_user_black.png");
const searchuser = require("../../assets/images/ic_search_grey.png");
const starfill = require("../../assets/images/ic_fill_star.png");

let deviceWidth = Dimensions.get('window').width

class Search extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            device_token: '',
            arrresults:[],
            userrole:'customer',
            showloading:false
        }
    }

    async componentDidMount()
    {
        await AsyncStorage.getItem('user_type').then((value)=>{
            this.setState({userrole:value})
            });

            await AsyncStorage.getItem('device_token').then(value => {
                this.setState({device_token: value})
              })
    }
    
    onMenuPressed()
    {
        this.props.navigation.goBack()
    }

    onPressedTab(index)
    {
        this.setState({selectedindex:index})
    }

    onPressedUser(item)
    {
        this.props.navigation.navigate('OtherUserProfile',{user_id:item.id,userrole:'service_provider'})
    }

    onTextChanged(text)
    {
        if(this.state.userrole == 'service_provider')
        {
            this.searchTaskWorkers(text)
        }
        else
        {
            this.searchJobs(text)
        }
    }

    searchTaskWorkers(text)
    {
        
        this.setState({showloading:true})

        var data = new FormData()

        data.append('search_text', text)
        data.append('search_by', 'serviceprovider')

        fetch(API_ROOT + 'search', {
            method: 'post',
            body: data,
            headers: {
                Authorization: 'Bearer ' + this.state.device_token,
              },
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.data != undefined && responseData.data != null) {
                    //alert(JSON.stringify(responseData))
                    this.setState({showloading:false, arrresults:responseData.data})
                } else {
                    this.setState({showloading:false})
                }
            })
            .catch((error) => {
                this.setState({showloading:false})
                alert(error)
            })
            
    }

    searchJobs(text)
    {
        
        this.setState({showloading:true})

        var data = new FormData()

        data.append('search_text', text)
        data.append('search_by', 'job')

        fetch(API_ROOT + 'search', {
            method: 'post',
            body: data,
            headers: {
                Authorization: 'Bearer ' + this.state.device_token,
              },
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.data != undefined && responseData.data != null) {
                    //alert(JSON.stringify(responseData))
                    this.setState({showloading:false, arrresults:responseData.data})
                    
                } else {
                    this.setState({showloading:false})
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
                    <TouchableOpacity style={{position:'absolute',left:15,marginTop:45,height:25,width:25,justifyContent:'center'}} onPress={() => this.onMenuPressed()}>
                        <Image source = {icback} resizeMode= 'contain'/>
                    </TouchableOpacity>
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.Search}</Text>
                    {/* <TouchableOpacity style={styles.cartbutton} onPress={() => this.onCartPressed()}>
                        <Image source = {iccart} resizeMode= 'contain'/>
                    </TouchableOpacity> */}
            </View>
        );
    }


    render(){
        return(
            <View style = {{flex:1,backgroundColor:'#f0f0f0'}}>
                {this.renderTopBar()}
                {
                    this.state.showloading == true ?
                    <View style = {{alignItems:'center',justifyContent:'center',backgroundColor:'transparent', zIndex:2, width:Width(100), height:Height(100) , position:'absolute'}}>
                        <ActivityIndicator size="large" color="#3B5998"/>
                    </View>
                    : null
                }
                <View style = {{width:Width(100),height:50,backgroundColor:'transparent',alignItems:'center',justifyContent:'center', marginTop:10}}>
                    <View style = {{width:Width(82),height:40,borderRadius:10,backgroundColor:'#fff',flexDirection:'row', alignItems:'center'}}>
                        <Image source = {searchuser} style = {{width:25,height:25, marginLeft:10}} resizeMode = 'cover'></Image>
                        <TextInput style = {{width:Width(75),height:40, marginLeft:10}} placeholder = {strings.Search} onChangeText = {(text) => this.onTextChanged(text)}></TextInput>
                    </View>
                </View>
                <View style = {{width:'100%',flex:1}}>
                    {
                        this.state.userrole == 'service_provider' ?

                        <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.state.arrresults}
                        ref={(ref) => { this.scroll = ref; }}
                        renderItem={({ item}) => {
                            return (
                                <View style={{ borderRadius: 5,padding: 5,backgroundColor: 'transparent', alignItems:'center'}}>
                                    <TouchableOpacity style = {{backgroundColor:'#fff', width:deviceWidth - 30,alignItems:'center',borderRadius:10, paddingVertical:10, flexDirection:'row'}}>
                                        {item.profile_pic != null ? <Image source = {{uri:IMG_PREFIX_URL+item.profile_pic}} style = {{height:50, width:50, marginTop:5,borderRadius:25}} resizeMode='cover'/> 
                                        :<Image source = {defaultuser} style = {{height:50, width:50, marginLeft:10,borderRadius:25}} resizeMode='cover'/> }
                                        {/* <View style = {{justifyContent:'center',width:'70%', marginLeft:10}}>
                                            <Text style={{fontSize: 10,color: '#515C6F',fontWeight: '500',textAlign:'left',marginTop:5,fontSize:15}} numberOfLines = {1}>{item.first_name} {item.last_name}</Text>
                                            <Text style={{fontSize: 10,color: '#6e6e6e',fontWeight: '400',textAlign:'left',marginBottom:7,marginTop:5,fontSize:15}} numberOfLines = {1}>{item.rating}</Text>
                                        </View> */}
                                        <View style = {{width:'70%', marginLeft:7}}>
                                                <Text style={{fontSize: 10,color: '#515C6F',fontWeight: '500',textAlign:'left',marginTop:5,fontSize:15,width:'80%'}} numberOfLines = {1}>{item.first_name} {item.last_name}</Text>
                                                <View style = {{flexDirection:'row',alignItems:'center',marginTop:7}}>
                                                    <Text style = {{fontSize:12,fontWeight:'400',color:'#a9a9a9'}}>{item.rating}</Text>
                                                    <Image source = {starfill} style = {{height:15, width:15, marginLeft:5}} resizeMode='cover'/>
                                                </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                    );        
                                }}
                        keyExtractor={(item, index) => index}
                        />
                        :
                        <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.state.arrresults}
                        ref={(ref) => { this.scroll = ref; }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ borderRadius: 5,padding: 5,backgroundColor: 'transparent', alignItems:'center'}}>
                                    <TouchableOpacity style = {{backgroundColor:'#fff', width:deviceWidth - 30,alignItems:'center',borderRadius:10, paddingVertical:10, flexDirection:'row'}} activeOpacity = {0.9} onPress = { () => this.props.navigation.navigate('JobDetails',{job_id:item.id})}>
                                        <View style = {{justifyContent:'center',width:'95%', marginLeft:10,backgroundColor:'#fff'}}>
                                            <Text style={{fontSize: 10,color: '#515C6F',fontWeight: '500',textAlign:'left',marginTop:5,fontSize:15}} numberOfLines = {1}>{item.title}</Text>
                                            <Text style={{fontSize: 10,color: '#6e6e6e',fontWeight: '400',textAlign:'left',marginBottom:7,marginTop:5,fontSize:15}} numberOfLines = {1}>{item.description}</Text>
                                            {
                                                item.creator_details != null && item.creator_details.first_name != null ?
                                                <Text style = {{fontSize:12,fontWeight:'300',color:'#6e6e6e'}} numberOfLines = {1}>By {item.creator_details.first_name} {item.creator_details.last_name}</Text>
                                                :
                                                null
                                            }
                                            
                                            <Text style = {{fontSize:12,fontWeight:'300',color:'#6e6e6e',textAlign:'right'}} numberOfLines = {1}>{item.created_at != '' && item.created_at != null ? Moment(item.created_at).format('ll') : ''}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                    );        
                                }}
                        keyExtractor={(item, index) => index}
                    />
                    }
                    
                </View>
            </View>
        )
    }

}
export default Search;