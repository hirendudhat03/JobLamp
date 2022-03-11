
import React, { Component } from "react";
import { View, TouchableOpacity,Image, Text, FlatList, Dimensions,ActivityIndicator } from "react-native";
import Moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { API_ROOT, IMG_PREFIX_URL} from "../config/constant";
import { Height, Width } from "../config/dimensions";
import { isRequired } from "react-native/Libraries/DeprecatedPropTypes/DeprecatedColorPropType";
import strings from '../config/LanguageStrings'

const icback = require("../../assets/images/side_menu.png");
const defaultuser = require("../../assets/images/ic_default_user_black.png");


let deviceWidth = Dimensions.get('window').width

class ChatList extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            arrchats:[],
            device_token: '',
            user_id:'',
            showloading:false
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

        this.getChatListAPICall()
    }
    
    onMenuPressed()
    {
        this.props.navigation.toggleDrawer()
    }

    onPressedChat(item)
    {
        //alert(JSON.stringify(item))
        //return

        let url = item.url
        let first_name = item.receiver.first_name
        let last_name = item.receiver.last_name
        let profile = item.receiver.profile_pic

        this.props.navigation.navigate('Chat',{receiver_id:item.receiver.id,chat_url:item.url,receiver_name:first_name+' '+last_name,receiver_photo:profile})
    }

    getChatListAPICall()
    {

        this.setState({showloading:true})

        var data = new FormData()

        data.append('user_id', this.state.user_id)
        
        fetch(API_ROOT + 'chat-list', {
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
                    this.setState({showloading:false,arrchats:responseData.data})
                    
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
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.Chats}</Text>
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
                        <ActivityIndicator size="large" color="#c80025"/>
                    </View>
                    : null
                }
                <View style = {{width:'100%',flex:1}}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={this.state.arrchats}
                        ref={(ref) => { this.scroll = ref; }}
                        renderItem={({ item,index }) => {
                            return (
                                    <TouchableOpacity style={{ borderRadius: 5,padding: 5,backgroundColor: 'transparent', alignItems:'center'}} activeOpacity = {0.9} onPress = { () => this.onPressedChat(item)}>
                                        <View style = {{backgroundColor:'#fff', width:deviceWidth - 30,borderRadius:10, paddingVertical:10, flexDirection:'row'}}>
                                            {item.receiver != null && item.receiver.profile_pic != null ? <Image source = {{uri:IMG_PREFIX_URL+item.receiver.profile_pic}} style = {{height:40, width:40,marginLeft:10,marginTop:5,borderRadius:20}} resizeMode='cover'/> 
                                            :<Image source = {defaultuser} style = {{height:40, width:40, marginLeft:10,borderRadius:20}} resizeMode='cover'/> }
                                            <View style = {{width:'80%', marginLeft:10, justifyContent:'center'}}>
                                                <Text style={{fontSize: 10,color: '#6e6e6e',fontWeight: '500',textAlign:'left',marginBottom:7,marginTop:7,fontSize:15}} numberOfLines = {1}>{item.receiver.first_name} {item.receiver.last_name}</Text>
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
export default ChatList;