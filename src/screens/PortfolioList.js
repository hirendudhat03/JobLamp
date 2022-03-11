import React, { Component, useState } from "react";
import {TouchableOpacity, Text,View, ActivityIndicator,Image,Modal, Platform,FlatList,Linking} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_ROOT, IMG_PREFIX_URL,AWS_S3_URL} from "../config/constant";
import { Height, Width } from "../config/dimensions";
import ImageView from "react-native-image-viewing";
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import VideoPlayer from 'react-native-video-controls';
import strings from '../config/LanguageStrings'


const icback = require("../../assets/images/ic_back.png");
const add = require("../../assets/images/ic_plus_white.png");
const close = require("../../assets/images/ic_delete.png");
const fullscreen = require("../../assets/images/ic_fullscreen.png");

class PortfolioList extends Component
{
    constructor (props)
    {
        super(props);
        this.currentIndex = -1;
        this.currentVideo = '';
        this.playindex = -1;
        this.state = {
            device_token: '',
            user_id:'',
            arrfeeds:[],
            showmenu:false,
            selectedimages:[],
            imageviewer:false,
            //page_id:props.navigation.state.params.page_id,
            arrPhotos:[],
            currentVideoindex:-1,
            other_user_id:props.navigation.state.params.other_user_id,
            showloading:false,
            plan_id:props.navigation.state.params.plan_id
        },
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.loadData()
      });

        this._didBlurSubscription = props.navigation.addListener('didBlur', payload => {
            this.setState({currentVideoindex:-1})
            this.playindex = -1
        });
    }

    async loadData()
    {

        await AsyncStorage.getItem('user_id').then((value)=>{
            this.setState({user_id:value})
          });


        this.getPortfolioList()
    }

    onBackPressed()
    {
        this.props.navigation.goBack()
    }

    onAddPressed()
    {
        if(this.state.plan_id == 3)
        {
            if( this.state.arrfeeds != undefined && this.state.arrfeeds.length < 10)
            {
                this.props.navigation.navigate('AddPortfolio')
            }
            else
            {
                alert(strings.VIPAccountHolderPortFolio)
            }
        }
        else if(this.state.plan_id == 2)
        {
            if( this.state.arrfeeds != undefined && this.state.arrfeeds.length < 3)
            {
                this.props.navigation.navigate('AddPortfolio')
            }
            else
            {
                alert(strings.BasicAccountHolderPortFolio)
            }
        }

    }

    async componentDidMount()
    {
        await AsyncStorage.getItem('device_token').then(value => {
            this.setState({device_token: value})
          })
    }

    getPortfolioList()
    {
        this.setState({showloading:true})
        //alert(this.state.page_id)
        var data = new FormData()
        data.append('user_id', this.state.other_user_id)
        
        fetch(API_ROOT + 'user-portfolio', {
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
                    this.setState({showloading:false, arrfeeds:responseData.data})

                } else {
                    this.setState({showloading:false})
                    //alert('No photos found!')

                }
        })
        .catch((error) => {
            this.setState({showloading:false})
            alert(error)
        })
    }

    deletePortFolioAPICall(item)
    {
        
        this.setState({showloading:true})
        //alert(this.state.page_id)
        var data = new FormData()
        data.append('portfolio_id', item.id)
        data.append('user_id', this.state.other_user_id)
        
        //alert(JSON.stringify(data))
        //return

        fetch(API_ROOT + 'delete-portfolio', {
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
                    this.getPortfolioList()
                    //this.setState({showloading:false, arrfeeds:responseData.data})

                } else {
                    this.setState({showloading:false})
                    //alert('No photos found!')

                }
        })
        .catch((error) => {
            this.setState({showloading:false})
            alert(error)
        })
        
    }

    onPressedImage(index)
    {

        let item = this.state.arrfeeds[index]
        //alert(index)
        //return
        // for(img of item.post_images)
        // {
        //     if(img.post_image != '' && img.post_image != null)
        //     {
        //         let objimg = {'uri':IMG_PREFIX_URL+img.post_image}
        //         imgs.push(objimg)
        //     }
        // }
        if(item.file != undefined && item.file != null && item.file != '')
        {
            this.setState({selectedimages:item.file,imageviewer:true})
        }
    }

    onPressedLink(item)
    {
        if(item.description != '' && item.description != null)
        {
            Linking.openURL(item.description)
        }
    }

    onPressedDelete(item)
    {
        this.deletePortFolioAPICall(item)
    }

    onPressedFullScreen(index)
    {
        //alert('hiiii')
        this.currentIndex = index
        let item = this.state.arrfeeds[index]
        this.currentVideo = IMG_PREFIX_URL+item.video
        this.props.navigation.navigate('FullScreenPlayer',{videourl:this.currentVideo})

    }

    renderFullScreenImageViewer()
    {
        return (
            // <Modal visible = {this.state.imageviewer} style = {{margin:0}}>
                <ImageView
                    images={this.state.selectedimages}
                    imageIndex={0}
                    visible={this.state.imageviewer}
                    onRequestClose={() => this.setState({imageviewer:false})}
                />
            // </Modal>
        )
    }


    renderTopBar()
    {
        return (
            <View style = {{backgroundColor:'#c80025', height:80, width:'100%', flexDirection:'row', justifyContent:'center'}}>
                    <TouchableOpacity style={{position:'absolute',left:15,marginTop:45,height:25,width:25,justifyContent:'center'}} onPress={() => this.onBackPressed()}>
                        <Image source = {icback} resizeMode= 'contain'/>
                    </TouchableOpacity>
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.PortFolio}</Text>
                    {
                        (this.state.user_id == this.state.other_user_id) && (this.state.plan_id == 2 || this.state.plan_id == 3) ?
                        <TouchableOpacity style={{position:'absolute',right:15,marginTop:45,height:25,width:25,justifyContent:'center'}} onPress={() => this.onAddPressed()}>
                            <Image source = {add} resizeMode= 'contain'/>
                        </TouchableOpacity>
                        :
                        null
                    }
                    
            </View>
        );
    }

    render()
    {
        return (
            <View style = {{flex:1,backgroundColor:'rgb(220,220,220,0.5)',alignItems:'center'}}>
                {this.renderTopBar()}

                {
                    this.state.showloading == true ?
                    <View style = {{alignItems:'center',justifyContent:'center',backgroundColor:'transparent', zIndex:2, width:Width(100), height:Height(100) , position:'absolute'}}>
                        <ActivityIndicator size="large" color="#c80025"/>
                    </View>
                    : null
                }
                
                <View style = {{position:'absolute',top:80,bottom:0, justifyContent:'center'}}>
                    {
                        this.state.plan_id == 3 ?
                        <Text style = {{fontSize:13,color:'#3A4759', width:Width(90),textAlign:'center', marginVertical:10}}>{strings.VIPAccountHolderPortFolio}</Text>
                        :
                        this.state.plan_id == 2 ?
                        <Text style = {{fontSize:13,color:'#3A4759', width:Width(90),textAlign:'center', marginVertical:10}}>{strings.BasicAccountHolderPortFolio}</Text>
                        :
                        <Text style = {{fontSize:13,color:'#3A4759', width:Width(90),textAlign:'center', marginVertical:10}}>{strings.FreeAccountHolderPortFolio}</Text>
                    }
                    
                    {
                        this.state.arrfeeds != undefined && this.state.arrfeeds != null && this.state.arrfeeds.length > 0 ?

                        <FlatList
                            style = {{marginTop:0,width:Width(96)}}
                            data={this.state.arrfeeds}
                            showsVerticalScrollIndicator = {false}
                            extraData={this.state}
                            renderItem={({item,index}) => {

                        return (
                            
                            item.type == 'image' ?
                            <View style = {{alignItems:'center',backgroundColor:'transparent'}}>
                                <TouchableOpacity style={{width:Width(96), backgroundColor:'#fff', alignItems:'center', justifyContent:'center',marginBottom:10}} onPress = { () => this.onPressedImage(item)} activeOpacity = {0.95}>
                                    <Text style = {{marginVertical:7,marginLeft:10,width:Width(94),fontSize:15, textAlign:'left', alignSelf:'flex-start'}}>{item.title}</Text>
                                    <Text style = {{marginVertical:7,marginLeft:10,fontSize:13,color:'#3A4759', width:Width(94),textAlign:'left'}}>{item.description}</Text>
                                    <Image style = {{width:Width(96),height:200}} source = {{uri:IMG_PREFIX_URL+item.file}} resizeMode = 'cover'></Image>
                                    <TouchableOpacity style = {{width:25,height:25,right:10,top:5, alignItems:'center',justifyContent:'center',position:'absolute',zIndex:2,backgroundColor:'transparent'}} onPress = { () => this.onPressedDelete(item)}>
                                        <Image style = {{width:25,height:25}} source = {close} resizeMode = 'cover'></Image>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </View>
                            :
                            item.type == 'video' ?
                            <View style = {{alignItems:'center',backgroundColor:'transparent'}}>
                                <TouchableOpacity style = {{width:Width(96),backgroundColor:'transparent',marginBottom:10}} onPress = {() => this.onPressedVideo(index)} activeOpacity = {0.95}>
                                    <Text style = {{marginVertical:7,marginLeft:10,width:Width(94),fontSize:15, textAlign:'left', alignSelf:'flex-start'}}>{item.title}</Text>
                                    <Text style = {{marginVertical:7,marginLeft:10,fontSize:13,color:'#3A4759', width:Width(94),textAlign:'left'}}>{item.description}</Text>
                                {
                                    Platform.OS == 'ios' ?
                                    <Video source={{uri:IMG_PREFIX_URL+item.file}} 
                                    //style={{position: 'absolute',top:0,left:0,bottom:0,right:0}} 
                                    style={{width:Width(96),height:200,marginBottom:5}} 
                                    paused = {this.state.currentVideoindex == index && this.playindex == index? false : true} 
                                    resizeMode = 'cover' 
                                    controls = {Platform.OS == 'ios' ? true : false}
                                    ref={ref => this._video = ref}
                                    onLoad={() => {
                                        this._video.seek(1);
                                    }}
                                    />
                                    :
                                    <VideoPlayer
                                        source={{uri: convertToProxyURL(IMG_PREFIX_URL+item.file)}}
                                        disableBack = {true}
                                        disableFullscreen = {true}
                                        disableVolume = {true}
                                        paused = {true}
                                        // ref={ref => this._video = ref}
                                        // onLoad={() => {
                                        //     this._video.seekTo(1)
                                        //   }}
                                    />
                                }
                                    
                                {
                                    Platform.OS == 'android' ?
                                    <TouchableOpacity style = {{height:30, width:30,position:'absolute',top:15,left:15,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0, 0.3)',borderRadius:7}} onPress = {() =>  this.onPressedFullScreen(index)}>
                                        <Image source = {fullscreen} style = {{height:25, width:25}} resizeMode='contain'/>
                                    </TouchableOpacity>
                                    :
                                    null
                                }
                                <TouchableOpacity style = {{width:25,height:25,right:10,top:10, alignItems:'center',justifyContent:'center',position:'absolute',zIndex:2}} onPress = { () => this.onPressedDelete(item)}>
                                    <Image style = {{width:25,height:25}} source = {close} resizeMode = 'cover'></Image>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                            :
                            <View style = {{alignItems:'center',backgroundColor:'transparent'}}>
                                <TouchableOpacity style={{width:Width(96), backgroundColor:'#fff', alignItems:'center', justifyContent:'center',marginBottom:10}} onPress = { () => this.onPressedLink(item)} activeOpacity = {0.95}>
                                    <Text style = {{marginVertical:7,marginLeft:10,width:Width(94),fontSize:15, textAlign:'left', alignSelf:'flex-start'}}>{item.title}</Text>
                                    <Text style = {{marginVertical:7,marginLeft:10,fontSize:13,color:'#3A4759', width:Width(94),textAlign:'left'}}>{item.description}</Text>
                                    <TouchableOpacity style = {{width:25,height:25,right:10,top:5, alignItems:'center',justifyContent:'center',position:'absolute',zIndex:2,backgroundColor:'transparent'}} onPress = { () => this.onPressedDelete(item)}>
                                        <Image style = {{width:25,height:25}} source = {close} resizeMode = 'cover'></Image>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </View>
                            );        
                        }}
                    />
                        :
                        <View style = {{width:Width(90),alignItems:'center',justifyContent:'center'}}>
                            <Text style = {{fontSize:20,alignSelf:'center',fontWeight:'500'}}>{strings.NoPortFolio}</Text>
                            <Text style = {{fontSize:20,alignSelf:'center',fontWeight:'500', marginTop:10}}>{strings.ClickButton}</Text>
                            <TouchableOpacity style = {{width:Width(50), height:50, backgroundColor:'#c80025', alignItems:'center',justifyContent:'center', marginTop:25,marginBottom:10,borderRadius:25}} onPress = { () => this.props.navigation.navigate('AddPortfolio')}>
                                <Text style = {{color:'#fff',fontSize:20,fontWeight:'600'}}>{strings.UploadPortfolio}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                     
                </View>
                {this.renderFullScreenImageViewer()}
            </View>
        );
    }
}
export default PortfolioList;