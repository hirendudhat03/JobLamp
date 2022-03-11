import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, ActivityIndicator, Dimensions, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Height, Width } from "../config/dimensions";
import { API_ROOT, IMG_PREFIX_URL} from "../config/constant";
import strings from '../config/LanguageStrings'

const icback = require("../../assets/images/ic_back.png");
const icdownarroow = require("../../assets/images/ic_down_arrow.png");
const defaultuser = require("../../assets/images/ic_default_user_black.png");
const starfill = require("../../assets/images/ic_fill_star.png");

let deviceWidth = Dimensions.get('window').width


class JobApplications extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            arrjobapplications:[],
            device_token: '',
            user_id:'',
            job_id:props.navigation.state.params.job_id
        }
    }

    async componentDidMount(){
    
        await AsyncStorage.getItem('user_id').then((value)=>{
            this.setState({user_id:value})
          });

          await AsyncStorage.getItem('device_token').then(value => {
            this.setState({device_token: value})
          })
          
          this.getJobApplicationsAPICall()
    }

    onMenuPressed()
    {
        this.props.navigation.goBack()
    }

    onPressedJobApplication(item)
    {
        //alert(JSON.stringify(item))
        this.props.navigation.navigate('ApplicationDetails',{offer_details:item,job_id:this.state.job_id})
    }

    getJobApplicationsAPICall()
    {
    
        this.setState({showloading:true})

        var data = new FormData()

        data.append('user_id', this.state.user_id)
        data.append('job_id', this.state.job_id)

        fetch(API_ROOT + 'job-applications', {
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
                    this.setState({showloading:false, arrjobapplications:responseData.data})
                    
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
                    <TouchableOpacity style={{position:'absolute',left:15,marginTop:45,height:25,width:25,justifyContent:'center'}} onPress={() => this.onMenuPressed()}>
                        <Image source = {icback} resizeMode= 'contain'/>
                    </TouchableOpacity>
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.JobApplications}</Text>
                    {/* <TouchableOpacity style={styles.cartbutton} onPress={() => this.onCartPressed()}>
                        <Image source = {iccart} resizeMode= 'contain'/>
                    </TouchableOpacity> */}
            </View>
        );
    }

    render()
    {
        return(
            <View style = {{flex:1, backgroundColor:'#f0f0f0'}}>
                {this.renderTopBar()}
                {
                    this.state.showloading == true ?
                    <View style = {{alignItems:'center',justifyContent:'center',backgroundColor:'transparent', zIndex:2, width:Width(100), height:Height(100) , position:'absolute'}}>
                        <ActivityIndicator size="large" color="#3B5998"/>
                    </View>
                    : null
                }

                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.state.arrjobapplications}
                        ref={(ref) => { this.scroll = ref; }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ borderRadius: 5,padding: 10,backgroundColor: 'transparent'}}>
                                    <TouchableOpacity style = {{backgroundColor:'#fff', width:deviceWidth - 30,alignItems:'center',borderRadius:10, paddingVertical:10, flexDirection:'row'}} onPress = {() => this.onPressedJobApplication(item)}>
                                        {item.profile_pic != undefined && item.profile_pic != null ? <Image source = {{uri:IMG_PREFIX_URL+item.profile_pic}} style = {{height:70, width:70, marginTop:5,borderRadius:35}} resizeMode='stretch'/> 
                                        :<Image source = {defaultuser} style = {{height:70, width:70, marginLeft:10,borderRadius:35}} resizeMode='cover'/> }
                                        <View style = {{justifyContent:'center',width:'75%', marginLeft:10}}>
                                            <View style = {{flexDirection:'row'}}>
                                                <Text style={{fontSize: 10,color: '#515C6F',fontWeight: '500',textAlign:'left',marginBottom:7,marginTop:5,fontSize:15,width:'80%'}} numberOfLines = {1}>{item.first_name} {item.last_name}</Text>
                                                <View style = {{flexDirection:'row',position:'absolute',right:5, alignItems:'center',justifyContent:'center'}}>
                                                    <Text style = {{fontSize:12,fontWeight:'400',color:'#a9a9a9'}}>{item.rating}</Text>
                                                    <Image source = {starfill} style = {{height:15, width:15, marginLeft:5}} resizeMode='cover'/>
                                                </View>
                                            </View>
                                            <Text style = {{fontSize:12,fontWeight:'300',color:'#6e6e6e'}} numberOfLines = {1}>{item.cover_letter}</Text>
                                            <Text style = {{fontSize:12,fontWeight:'300',color:'#6e6e6e', marginTop:7}} numberOfLines = {1}>Bid Amount: {item.bid_amount != null && item.bid_amount != '' ? item.bid_amount+' USD':''}</Text>
                                            {/* <Text style = {{fontSize:12,fontWeight:'300',color:'#6e6e6e',textAlign:'right'}} numberOfLines = {1}>10 Feb 2020</Text> */}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                    );        
                                }}
                        keyExtractor={(item, index) => index}
                    />

            </View>
        )
    }
}
export default JobApplications;