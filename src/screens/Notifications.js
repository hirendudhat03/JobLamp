
import React, { Component } from "react";
import { View, TouchableOpacity,Image, Text, FlatList, Dimensions, Modal, TextInput, TouchableHighlight, RefreshControlComponent } from "react-native";
import Moment from 'moment'
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'
import strings from '../config/LanguageStrings'

import { Height, Width } from "../config/dimensions";
import { API_ROOT} from "../config/constant";

const icback = require("../../assets/images/side_menu.png");
const ic_filter = require("../../assets/images/ic_filter.png");


let deviceWidth = Dimensions.get('window').width

class Notifications extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            device_token: '',
            arrnotifications:[],
            user_id:'',
        }
    }

    async componentDidMount()
    {

        await AsyncStorage.getItem('user_id').then((value)=>{
            this.setState({user_id:value})
            this.getNotificationsAPICall()
          });

          await AsyncStorage.getItem('device_token').then(value => {
            this.setState({device_token: value})
          })

    }
    
    onMenuPressed()
    {
        this.props.navigation.goBack()
    }

    getNotificationsAPICall()
    {

        this.setState({showloading:true})

        var data = new FormData()

        data.append('user_id', 10)
        
        fetch(API_ROOT + 'notification-list', {
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
                    this.setState({showloading:false,arrnotifications:responseData.data})
                    
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
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.Notifications}</Text>
            </View>
        );
    }

    render(){
        return(
            <View style = {{flex:1,backgroundColor:'#f0f0f0'}}>
                {this.renderTopBar()}
                <View style = {{width:'100%',flex:1}}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.state.arrnotifications}
                        ref={(ref) => { this.scroll = ref; }}
                        renderItem={({ item,index }) => {
                            return (
                                    <TouchableOpacity style={{ borderRadius: 5,padding: 5,backgroundColor: 'transparent', alignItems:'center'}} activeOpacity = {0.9} onPress = { () => this.onPressedJob(item)}>
                                        <View style = {{backgroundColor:'#fff', width:deviceWidth - 30,borderRadius:10, paddingVertical:10, flexDirection:'row'}}>
                                            {/* {rowData.category_image != null ? <Image source = {{uri:IMG_PREFIX_URL+'uploads/categories/'+rowData.category_image}} style = {{height:70, width:70, marginTop:5,borderRadius:35}} resizeMode='stretch'/> 
                                            :<Image source = {defaultuser} style = {{height:70, width:70, marginLeft:10,borderRadius:35}} resizeMode='cover'/> } */}
                                            <View style = {{width:'95%', marginLeft:10}}>
                                                <Text style = {{fontSize:12,fontWeight:'300',color:'#6e6e6e'}} numberOfLines = {1}>{item.description}</Text>
                                                <Text style = {{fontSize:12,fontWeight:'300',color:'#6e6e6e',textAlign:'right', position:'absolute',right:8}} numberOfLines = {1}>{item.created_at != '' && item.created_at != null ? Moment(item.created_at).format('ll') : ''}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    );        
                                }}
                        keyExtractor={(item, index) => index}
                    />
                </View>
            </View>
        )
    }

}
export default Notifications;