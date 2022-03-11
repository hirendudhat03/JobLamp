import React, { Component } from "react";
import { View, TouchableOpacity, Image, Text, ActivityIndicator, Dimensions, TextInput, FlatList,Modal } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImageView from "react-native-image-viewing";
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import VideoPlayer from 'react-native-video-controls';

import strings from '../config/LanguageStrings'

const icback = require("../../assets/images/ic_back.png");
const icattachment = require("../../assets/images/place_holder.png");
const close = require("../../assets/images/ic_delete.png");
const fullscreen = require("../../assets/images/ic_fullscreen.png");


let deviceWidth = Dimensions.get('window').width
import { Height, Width } from "../config/dimensions";
import { API_ROOT,MAIN_ROOT} from "../config/constant";

class AddPortfolio extends Component
{
    constructor (props)
    {
        super(props);
        this.state = {
            login_id:'',
            device_token: '',
            showloading:false,
            attachment_name:'',
            covertext:'',
            attachment_url:'',
            attachment_type:'',
            showstate:false,
            arrmediaoptions:[strings.ChoosePhoto,strings.ChooseVideo, strings.AddLink],
            title:'',
            port_type:''
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

    onPressAttachment()
    {
        this.setState({showstate:true})
    }

    onChooseOption(index)
    {
        this.setState({showstate:false,port_type:index == 0 ? 'Photo' : index == 1 ? 'Video' : 'Link',attachment_name:index == 2 ? 'link' :''})
        // if(index != 2)
        // {
        //     setTimeout(() => {this.openMediaPicker(index)}, 1000)
        // }
        
    }

    onPressedPhotoVideo()
    {
        //this.setState({showstate:false})

        var index = 0 
        if(this.state.port_type == 'Photo')
        {
            index = 0
        }
        else if(this.state.port_type == 'Video')
        {
            index = 1
        }
        
        setTimeout(() => {this.openMediaPicker(index)}, 1000)
    }

    onPressedDelete()
    {
        this.setState({attachment_type:'',attachment_url:'',attachment_name:'',port_type:''})
    }

    onPressedFullScreen()
    {
        //alert('hiiii')
        this.props.navigation.navigate('FullScreenPlayer',{videourl:this.state.attachment_url})

    }

    openMediaPicker(index)
    {
        if(index == 0)
        {
            ImagePicker.openPicker({
                width: Width(100),
                cropping: true,
                mediaType:'photo'
            }).then(image => {
                //console.log(image);
                //alert(image.size)
                

                if(image.size != undefined && image.size != null && image.size > 0)
                {
                    let vsize = image.size * 0.000001
                    if(vsize < 5.0)
                    {
                        this.setState({ attachment_url: image.path,attachment_name:'image',attachment_type:'image/jpg'})
                    }
                    else
                    {
                        alert(strings.MaxPhotoFileSize)
                    }
                }
            });
        }
        else
        {
            
            ImagePicker.openPicker({
                mediaType: "video",
              }).then((video) => {
                  
                if(video.size != undefined && video.size != null && video.size > 0)
                {
                    let vsize = video.size * 0.000001
                    if(vsize < 30.0)
                    {
                        this.setState({ attachment_url: video.path ,attachment_name:'video',attachment_type:'video/mp4'})
                    }
                    else
                    {
                        alert(strings.MaxVideoFileSize)
                    }
                }

                
              });
        }
    }

    validateFields()
    {
        if (this.state.covertext == '')
        {
            alert(strings.EnterDeliveryDetails)
        }
        else
        {
            this.addPortfolioAPICall()
        }
    }

    addPortfolioAPICall()
    {
        this.setState({showloading:true})
        var data = new FormData()
        data.append('user_id', this.state.login_id)
        data.append('type', this.state.attachment_name)
        data.append('description', this.state.covertext)
        data.append('title', this.state.title)

        if(this.state.attachment_url != null && this.state.attachment_url != '')
        {
            data.append('portfolio_file', {
                name: 'sample',
                type: this.state.attachment_type,
                uri:
                  Platform.OS === "android" ? this.state.attachment_url : this.state.attachment_url.replace("file://", "")
              });
        }
        
        fetch(API_ROOT + 'add-portfolio', {
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
                    <Text style = {{marginTop:45, width:'70%', height:35,textAlign:'center', color:'#fff', fontSize:20, fontWeight:'600'}}>{strings.PortFolio}</Text>
                    {/* <TouchableOpacity style={styles.cartbutton} onPress={() => this.onCartPressed()}>
                        <Image source = {iccart} resizeMode= 'contain'/>
                    </TouchableOpacity> */}
            </View>
        );
    }

    renderMediaOptionPicker()
    {
        return (
            <Modal visible = {this.state.showstate} style = {{margin:0, backgroundColor:'transparent'}} animationType="slide" transparent={true}>
                <TouchableOpacity style = {{width:'100%',height:'100%',backgroundColor:'#000',position:'absolute',opacity:0.4}} onPress = { () => this.setState({showstate:false})}></TouchableOpacity>
                <View style = {{alignItems:'center',justifyContent:'center',width:Width(100), height:Height(18), position:'absolute',bottom:0, backgroundColor:'#fff',borderTopRightRadius:10,borderTopLeftRadius:10}}>
                <FlatList
                style = {{marginTop:10,width:Width(95), marginBottom:5}}
                data={this.state.arrmediaoptions}
                extraData={this.state}
                renderItem={({item,index}) => {
                    return (
                                <View style={{width:Width(95), height:30, backgroundColor:'transparent', alignItems:'center', justifyContent:'center', marginBottom:5,marginTop:5}}>
                                <TouchableOpacity style = {{backgroundColor:'#fff', height:30, width:Width(95),flexDirection:'row', alignItems:'center'}} activeOpacity= {0.9} onPress = { () => this.onChooseOption(index)}>
                                        <Text style = {{marginLeft:10, color:'#000',fontSize:13,width:Width(50), fontWeight:'400'}}>{item}</Text>
                                </TouchableOpacity>
                                </View>
                            );        
                        }}
            />
                </View>
            </Modal>
        )
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
 
                <View style={{backgroundColor:'#fff',height:50,marginTop:10, width:Width(90), alignItems:'center',justifyContent:'center', borderRadius:10}}>
                    <View style={{backgroundColor:'transparent',height:50,width:Width(87),flexDirection:'row',alignItems:'center'}}>
                        <TextInput style = {{height:40,backgroundColor:'transparent',width:Width(90),fontSize:15}} placeholder = {strings.Title}  onChangeText = {(title) => this.setState({title:title,show:false})} secureTextEntry = {false} returnKeyType={'next'}></TextInput>
                    </View>
                </View>
                <View style={{backgroundColor:'#fff',height:150,marginTop:10, width:Width(90), alignItems:'center',justifyContent:'center', borderRadius:10}}>
                    <View style={{backgroundColor:'transparent',height:150,width:Width(87),flexDirection:'row',alignItems:'center'}}>
                        <TextInput style = {{height:140,backgroundColor:'transparent',width:Width(90),fontSize:15,textAlignVertical:'top'}} placeholder = {strings.Description} multiline = {true} editable = {true} onChangeText = {(covertext) => this.setState({covertext:covertext})} secureTextEntry = {false} returnKeyType={'next'}></TextInput>
                    </View>
                </View>

                <View style={{backgroundColor:'#fff',height:50,marginTop:20, width:Width(90), zIndex:10, alignItems:'center', borderRadius:10, justifyContent:'center'}}>
                        <TouchableOpacity style={{backgroundColor:'transparent',height:50,width:Width(87),alignItems:'center', position:'absolute',top:0,left:0,bottom:0,right:0, zIndex:2}} onPress = { () => this.onPressAttachment()}>
                        </TouchableOpacity>
                        <TextInput style = {{height:40,backgroundColor:'transparent',width:Width(87),fontSize:15,color:'#000'}} placeholder = {strings.ChooseType} editable = {false}>{this.state.port_type}</TextInput>
                </View>

                {
                    this.state.attachment_url != undefined && this.state.attachment_url != null && this.state.attachment_url != '' ?

                        this.state.attachment_name == 'image' ?
                            <View style = {{alignItems:'center',backgroundColor:'transparent'}}>
                                <TouchableOpacity style={{width:Width(96), backgroundColor:'#fff', alignItems:'center', justifyContent:'center',marginBottom:10}} activeOpacity = {0.95}>
                                    <Image style = {{width:Width(96),height:200}} source = {{uri:this.state.attachment_url}} resizeMode = 'cover'></Image>
                                    <TouchableOpacity style = {{width:25,height:25,right:10,top:5, alignItems:'center',justifyContent:'center',position:'absolute',zIndex:2,backgroundColor:'transparent'}} onPress = { () => this.onPressedDelete()}>
                                        <Image style = {{width:25,height:25}} source = {close} resizeMode = 'cover'></Image>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </View>
                        :
                        this.state.attachment_name == 'link' || this.state.attachment_name == '' ?
                            null
                        :
                        <View style = {{alignItems:'center',backgroundColor:'transparent', marginTop:10}}>
                            <TouchableOpacity style = {{width:Width(96),backgroundColor:'transparent',marginBottom:10,height:200}} activeOpacity = {0.95}>
                            {
                                Platform.OS == 'ios' ?
                                <Video source={{uri:this.state.attachment_url}} 
                                //style={{position: 'absolute',top:0,left:0,bottom:0,right:0}} 
                                style={{width:Width(96),height:200,marginBottom:5}} 
                                paused = {false} 
                                resizeMode = 'cover' 
                                controls = {Platform.OS == 'ios' ? true : false}
                                ref={ref => this._video = ref}
                                onLoad={() => {
                                    this._video.seek(1);
                                }}
                                />
                                :
                                <VideoPlayer
                                    source={{uri: convertToProxyURL(this.state.attachment_url)}}
                                    disableBack = {true}
                                    disableFullscreen = {true}
                                    disableVolume = {true}
                                    paused = {false}
                                    // ref={ref => this._video = ref}
                                    // onLoad={() => {
                                    //     this._video.seekTo(1)
                                    //   }}
                                />
                            }
                                
                            {
                                Platform.OS == 'android' ?
                                <TouchableOpacity style = {{height:30, width:30,position:'absolute',top:15,left:15,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0, 0.3)',borderRadius:7}} onPress = {() =>  this.onPressedFullScreen()}>
                                    <Image source = {fullscreen} style = {{height:25, width:25}} resizeMode='contain'/>
                                </TouchableOpacity>
                                :
                                null
                            }
                            <TouchableOpacity style = {{width:25,height:25,right:10,top:10, alignItems:'center',justifyContent:'center',position:'absolute',zIndex:2}} onPress = { () => this.onPressedDelete()}>
                                <Image style = {{width:25,height:25}} source = {close} resizeMode = 'cover'></Image>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>

                    :
                    this.state.port_type == 'Photo' || this.state.port_type == 'Video' ?
                    <View style={{backgroundColor:'#fff',height:200,marginTop:30, width:Width(90), alignItems:'center',justifyContent:'center', borderRadius:10}}>
                        <TouchableOpacity style={{backgroundColor:'transparent',height:200,width:Width(87),flexDirection:'row',alignItems:'center',justifyContent:'center'}} onPress = { () => this.onPressedPhotoVideo()}>
                            <Image style = {{width:Width(87),height:200}} source = {icattachment} resizeMode = 'contain'></Image>
                            {/* <Text style = {{height:20,backgroundColor:'transparent',width:Width(75),fontSize:15, marginLeft:15}}>{this.state.attachment_name == null || this.state.attachment_name == '' ? strings.Attachment :this.state.attachment_name.replace('job-delivery-file/','')}</Text> */}
                        </TouchableOpacity>
                    </View>
                    :
                    null
                }
                <Text style = {{marginVertical:7,marginLeft:10,width:Width(94),fontSize:15, textAlign:'left', alignSelf:'flex-start', marginVertical:10}}>{strings.MaxFileSize}</Text>
                <TouchableOpacity style = {{width:Width(90), height:50, backgroundColor:'#c80025', alignItems:'center',justifyContent:'center', marginTop:70, borderRadius:25}} onPress = { () => this.validateFields()}>
                    <Text style = {{color:'#fff',fontSize:20,fontWeight:'500'}}>{strings.Submit}</Text>
                </TouchableOpacity>
                
                </KeyboardAwareScrollView>
                {this.renderMediaOptionPicker()}
            </View>
        );
    }
}
export default AddPortfolio;